export interface WeatherData {
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  city: string;
  icon: string;
}

// Map weather codes to descriptions
const weatherDescriptions: { [key: number]: string } = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

const getWeatherIcon = (weatherCode: number): string => {
  if (weatherCode === 0 || weatherCode === 1) return '01d';
  if (weatherCode === 2) return '02d';
  if (weatherCode === 3) return '03d';
  if (weatherCode === 45 || weatherCode === 48) return '50d';
  if (weatherCode >= 51 && weatherCode <= 55) return '09d';
  if (weatherCode >= 61 && weatherCode <= 65) return '10d';
  if (weatherCode >= 71 && weatherCode <= 77) return '13d';
  if (weatherCode >= 80 && weatherCode <= 82) return '09d';
  if (weatherCode >= 85 && weatherCode <= 86) return '13d';
  if (weatherCode >= 95) return '11d';
  return '01d'; // default sunny
};

export const getWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  // Using Open-Meteo API - completely free, no API key needed, no rate limits
  console.log(`Fetching weather for lat: ${lat}, lon: ${lon}`);

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,precipitation_probability,wind_speed_10m,wind_direction_10m,weather_code,cloud_cover,uv_index&daily=sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=1`
  );

  if (!response.ok) {
    console.error('Open-Meteo API error:', response.status, response.statusText);
    throw new Error('Failed to fetch weather data');
  }

  const data: any = await response.json();
  console.log('Weather data received:', data);

  const weatherCode = data.current.weather_code;
  const description = weatherDescriptions[weatherCode] || 'Unknown';
  const icon = getWeatherIcon(weatherCode);

  // Use geocoding API to get city name
  const geocodeResponse = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    {
      headers: {
        'User-Agent': 'CS601-final/1.0',
      },
    }
  );
  const geocodeData: any = await geocodeResponse.json();
  console.log('Geocode data received:', geocodeData);

  const city =
    geocodeData.address?.city ||
    geocodeData.address?.town ||
    geocodeData.address?.village ||
    geocodeData.address?.county ||
    'Unknown location';

  return {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    description: description,
    humidity: data.current.relative_humidity_2m,
    precipitation: data.current.precipitation || 0,
    precipitationProbability: data.current.precipitation_probability || 0,
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDirection: data.current.wind_direction_10m,
    cloudCover: data.current.cloud_cover,
    uvIndex: data.current.uv_index,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
    city: city,
    icon: icon,
  };
};
