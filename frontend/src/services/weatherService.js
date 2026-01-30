import api from './authService';
import axios from 'axios';

export async function getWeather(city) {
  const key = process.env.REACT_APP_WEATHER_API_KEY;
  if (key && city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`;
    const { data } = await axios.get(url);
    const tempC = data?.main?.temp;
    const rainfallMm = data?.rain?.['1h'] || data?.rain?.['3h'] || 0;
    const condition = data?.weather?.[0]?.description || 'Unknown';
    const humidity = data?.main?.humidity;
    const windKph = data?.wind?.speed != null ? Math.round(data.wind.speed * 3.6) : undefined; // m/s -> km/h
    const icon = data?.weather?.[0]?.icon;
    const resolvedCity = data?.name;
    const country = data?.sys?.country;
    const updatedAt = new Date(data?.dt * 1000).toISOString();
    return { tempC, rainfallMm, condition, humidity, windKph, icon, city: resolvedCity, country, updatedAt };
  }
  // fallback to backend placeholder
  const { data } = await api.get('/weather');
  return data;
}

export async function getWeatherByCoords(lat, lon) {
  const key = process.env.REACT_APP_WEATHER_API_KEY;
  if (!key || lat == null || lon == null) return null;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
  const { data } = await axios.get(url);
  const tempC = data?.main?.temp;
  const rainfallMm = data?.rain?.['1h'] || data?.rain?.['3h'] || 0;
  const condition = data?.weather?.[0]?.description || 'Unknown';
  const humidity = data?.main?.humidity;
  const windKph = data?.wind?.speed != null ? Math.round(data.wind.speed * 3.6) : undefined;
  const icon = data?.weather?.[0]?.icon;
  const city = data?.name;
  const country = data?.sys?.country;
  const updatedAt = new Date(data?.dt * 1000).toISOString();
  return { tempC, rainfallMm, condition, humidity, windKph, icon, city, country, updatedAt };
}

export async function geocodeCity(city) {
  const key = process.env.REACT_APP_WEATHER_API_KEY;
  if (!key || !city) return null;
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${key}`;
  const { data } = await axios.get(url);
  if (Array.isArray(data) && data.length > 0) {
    return { lat: data[0].lat, lon: data[0].lon, city: data[0].name, country: data[0].country };
  }
  return null;
}

export async function getForecastByCoords(coords) {
  const key = process.env.REACT_APP_WEATHER_API_KEY;
  if (!key || !coords?.lat || !coords?.lon) return null;
  // Try One Call 2.5 first
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${key}&units=metric&exclude=minutely`;
  try {
    const { data } = await axios.get(url);
    return { ...data, lat: coords.lat, lon: coords.lon };
  } catch (e) {
    // Fallback: build a forecast-like structure using 5-day/3-hour forecast
    if (e?.response?.status === 401) {
      const fUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${key}&units=metric`;
      const { data } = await axios.get(fUrl);
      const hourly = (data?.list || []).map((x) => ({ dt: Math.floor(new Date(x.dt_txt).getTime() / 1000), temp: x.main?.temp, pop: x.pop || 0 }));
      // Aggregate next 7 days POP by max
      const byDay = {};
      hourly.forEach((h) => {
        const d = new Date(h.dt * 1000);
        const keyDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        const entry = byDay[keyDay] || { dt: Math.floor(keyDay / 1000), pop: 0 };
        entry.pop = Math.max(entry.pop, h.pop || 0);
        byDay[keyDay] = entry;
      });
      const daily = Object.values(byDay).slice(0, 7);
      return { hourly, daily, alerts: [], lat: coords.lat, lon: coords.lon };
    }
    throw e;
  }
}


