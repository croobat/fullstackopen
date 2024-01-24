import axios from 'axios';

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const getAll = async () => {
  const url = `${baseUrl}/all`;
  const { data } = await axios.get(url);
  return data;
};

const getWeather = async (lat, lon) => {
  const url = `${weatherUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const { data } = await axios.get(url);
  return data;
};

export default { getAll, getWeather };
