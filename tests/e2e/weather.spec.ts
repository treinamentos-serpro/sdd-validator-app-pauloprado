import { expect, type Page, test } from '@playwright/test';

const city = {
  id: 3448439,
  name: 'São Paulo',
  latitude: -23.55,
  longitude: -46.63,
  country: 'Brasil',
  country_code: 'BR',
  admin1: 'São Paulo',
  timezone: 'America/Sao_Paulo',
};

const completeForecast = {
  timezone: 'America/Sao_Paulo',
  current: {
    time: '2026-10-28T09:00',
    temperature_2m: 0,
    apparent_temperature: -2,
    relative_humidity_2m: 68,
    precipitation: 0,
    surface_pressure: 1013.2,
    wind_speed_10m: 12.3,
    weather_code: 0,
    is_day: 1,
  },
  daily: {
    time: ['2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01'],
    temperature_2m_min: [-2, 0, 1, 2, 3],
    temperature_2m_max: [5, 6, 7, 8, 9],
    precipitation_probability_max: [0, 10, 20, 30, 40],
    precipitation_sum: [0, 0, 1, 2, 3],
    wind_speed_10m_max: [10, 12, 14, 16, 18],
    weather_code: [0, 1, 2, 3, 61],
  },
};

interface WeatherRouteFixtures {
  geocodingResponse?: (name: string | null) => Record<string, unknown>;
  forecastResponse?: Record<string, unknown>;
}

async function mockWeatherRoutes(page: Page, fixtures: WeatherRouteFixtures = {}): Promise<void> {
  await page.route('https://geocoding-api.open-meteo.com/**', async (route) => {
    const name = new URL(route.request().url()).searchParams.get('name');
    await route.fulfill({
      json: fixtures.geocodingResponse
        ? fixtures.geocodingResponse(name)
        : { results: [{ ...city, name: name ?? city.name }] },
    });
  });

  await page.route('https://api.open-meteo.com/**', async (route) => {
    await route.fulfill({ json: fixtures.forecastResponse ?? completeForecast });
  });
}

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-28T12:00:00Z') });
});

test('busca uma cidade, mostra a previsão e converte a temperatura para Fahrenheit', async ({
  page,
}) => {
  await mockWeatherRoutes(page);
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Buscar cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'São Paulo', exact: true })).toBeVisible();
  const currentWeather = page.getByRole('region', { name: 'São Paulo', exact: true });
  await expect(currentWeather.getByText('0 °C', { exact: true })).toBeVisible();

  const forecast = page.getByRole('region', { name: 'Previsão de 5 dias' });
  await expect(forecast).toBeVisible();
  await expect(forecast.getByRole('article')).toHaveCount(5);

  await page.getByRole('button', { name: 'Fahrenheit', exact: true }).click();

  await expect(currentWeather.getByText('32 °F', { exact: true })).toBeVisible();
  await expect(currentWeather.getByText('0 °C', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Fahrenheit', pressed: true })).toBeVisible();
});

test('busca vazia ou só com espaços mostra validação sem chamar geocoding', async ({ page }) => {
  let geocodingRequests = 0;
  page.on('request', (request) => {
    if (new URL(request.url()).hostname === 'geocoding-api.open-meteo.com') {
      geocodingRequests += 1;
    }
  });
  await mockWeatherRoutes(page);
  await page.goto('/');

  const searchbox = page.getByRole('searchbox', { name: 'Buscar cidade' });
  const submit = page.getByRole('button', { name: 'Buscar', exact: true });

  await searchbox.fill('');
  await submit.click();
  await expect(page.getByRole('alert')).toHaveText('Informe uma cidade para buscar.');
  expect(geocodingRequests).toBe(0);

  await searchbox.fill('   ');
  await submit.click();
  await expect(page.getByRole('alert')).toHaveText('Informe uma cidade para buscar.');
  expect(geocodingRequests).toBe(0);
});

test('preserva acentos e apóstrofo no nome enviado e exibido', async ({ page }) => {
  const searchedNames: Array<string | null> = [];
  page.on('request', (request) => {
    if (new URL(request.url()).hostname === 'geocoding-api.open-meteo.com') {
      searchedNames.push(new URL(request.url()).searchParams.get('name'));
    }
  });
  await mockWeatherRoutes(page);
  await page.goto('/');

  const name = "São João d'Aliança";
  await page.getByRole('searchbox', { name: 'Buscar cidade' }).fill(`  ${name}  `);
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();

  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  expect(searchedNames).toEqual([name]);
  await expect(page.getByRole('region', { name, exact: true })).toBeVisible();
});

test('mostra estado vazio quando o geocoding retorna um objeto sem results', async ({ page }) => {
  let forecastRequests = 0;
  page.on('request', (request) => {
    if (new URL(request.url()).hostname === 'api.open-meteo.com') {
      forecastRequests += 1;
    }
  });
  await mockWeatherRoutes(page, { geocodingResponse: () => ({}) });
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Buscar cidade' }).fill('Cidade inexistente');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Nenhuma cidade encontrada');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Previsão de 5 dias' })).toHaveCount(0);
  await expect(page.getByRole('searchbox', { name: 'Buscar cidade' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Buscar', exact: true })).toBeEnabled();
  expect(forecastRequests).toBe(0);
});

test('sinaliza forecast curto sem inventar os dias que faltam', async ({ page }) => {
  const partialForecast = {
    ...completeForecast,
    daily: {
      time: ['2026-10-28', '2026-10-29'],
      temperature_2m_min: [-2, 0],
      temperature_2m_max: [5, 6],
      precipitation_probability_max: [0, 10],
      precipitation_sum: [0, 0],
      wind_speed_10m_max: [10, 12],
      weather_code: [0, 1],
    },
  };
  await mockWeatherRoutes(page, { forecastResponse: partialForecast });
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Buscar cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();

  const forecast = page.getByRole('region', { name: 'Previsão de 5 dias' });
  await expect(forecast.getByRole('status')).toHaveText('Previsão incompleta');
  await expect(forecast.getByRole('article')).toHaveCount(2);
  await expect(forecast.getByRole('article', { name: /30 de out\./ })).toHaveCount(0);
});

test('renderiza o clima após a busca em viewport mobile de 375x812', async ({ page }) => {
  await mockWeatherRoutes(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Buscar cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'São Paulo', exact: true })).toBeVisible();
  const currentWeather = page.getByRole('region', { name: 'São Paulo', exact: true });
  await expect(currentWeather.getByText('0 °C', { exact: true })).toBeVisible();
  const forecast = page.getByRole('region', { name: 'Previsão de 5 dias' });
  await expect(forecast).toBeVisible();
  await expect(forecast.getByRole('article')).toHaveCount(5);

  await page.getByRole('button', { name: 'Fahrenheit', exact: true }).click();

  await expect(currentWeather.getByText('32 °F', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
