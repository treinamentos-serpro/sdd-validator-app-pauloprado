import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-28T12:00:00Z') });

  await page.route('https://geocoding-api.open-meteo.com/**', async (route) => {
    await route.fulfill({
      json: {
        results: [
          {
            id: 3448439,
            name: 'São Paulo',
            latitude: -23.55,
            longitude: -46.63,
            country: 'Brasil',
            country_code: 'BR',
            admin1: 'São Paulo',
            timezone: 'America/Sao_Paulo',
          },
        ],
      },
    });
  });

  await page.route('https://api.open-meteo.com/**', async (route) => {
    await route.fulfill({
      json: {
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
      },
    });
  });
});

test('busca uma cidade, mostra a previsão e converte a temperatura para Fahrenheit', async ({
  page,
}) => {
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

test('mostra estado vazio quando o geocoding retorna um objeto sem results', async ({ page }) => {
  let forecastRequests = 0;
  page.on('request', (request) => {
    if (new URL(request.url()).hostname === 'api.open-meteo.com') {
      forecastRequests += 1;
    }
  });
  await page.route('https://geocoding-api.open-meteo.com/**', async (route) => {
    await route.fulfill({ json: {} });
  });

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

test('renderiza o clima após a busca em viewport mobile de 375x812', async ({ page }) => {
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
