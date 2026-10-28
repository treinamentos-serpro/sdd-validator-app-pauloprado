export interface WeatherCodePresentation {
  icon: string;
  label: string;
}

const weatherCodes: Readonly<Record<number, WeatherCodePresentation>> = {
  0: { icon: '☀️', label: 'Céu limpo' },
  1: { icon: '🌤️', label: 'Predominantemente limpo' },
  2: { icon: '⛅', label: 'Parcialmente nublado' },
  3: { icon: '☁️', label: 'Nublado' },
  45: { icon: '🌫️', label: 'Neblina' },
  48: { icon: '🌫️', label: 'Neblina com geada' },
  51: { icon: '🌦️', label: 'Garoa fraca' },
  53: { icon: '🌦️', label: 'Garoa moderada' },
  55: { icon: '🌧️', label: 'Garoa intensa' },
  56: { icon: '🌧️', label: 'Garoa congelante fraca' },
  57: { icon: '🌧️', label: 'Garoa congelante intensa' },
  61: { icon: '🌧️', label: 'Chuva fraca' },
  63: { icon: '🌧️', label: 'Chuva moderada' },
  65: { icon: '🌧️', label: 'Chuva intensa' },
  66: { icon: '🌧️', label: 'Chuva congelante fraca' },
  67: { icon: '🌧️', label: 'Chuva congelante intensa' },
  71: { icon: '🌨️', label: 'Neve fraca' },
  73: { icon: '🌨️', label: 'Neve moderada' },
  75: { icon: '❄️', label: 'Neve intensa' },
  77: { icon: '❄️', label: 'Grãos de neve' },
  80: { icon: '🌦️', label: 'Pancadas de chuva fracas' },
  81: { icon: '🌧️', label: 'Pancadas de chuva moderadas' },
  82: { icon: '🌧️', label: 'Pancadas de chuva fortes' },
  85: { icon: '🌨️', label: 'Pancadas de neve fracas' },
  86: { icon: '❄️', label: 'Pancadas de neve fortes' },
  95: { icon: '⛈️', label: 'Trovoada' },
  96: { icon: '⛈️', label: 'Trovoada com granizo fraco' },
  99: { icon: '⛈️', label: 'Trovoada com granizo forte' },
};

export function getWeatherCodePresentation(code: number | null): WeatherCodePresentation {
  if (code === null || !Number.isInteger(code)) {
    return { icon: '🌡️', label: 'Condição indisponível' };
  }

  return weatherCodes[code] ?? { icon: '🌡️', label: 'Condição desconhecida' };
}
