import { useState, useEffect } from 'react';
import countriesService from './services/countries';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    countriesService.getAll().then((data) => {
      const countriesData = data.map((country) => {
        return {
          name: country.name.common,
          flag: country.flag,
          flagImg: country.flags.png,
          capital: country.capital,
          area: country.area,
          population: country.population,
          languages: country.languages,
          latitude: country.latlng[0],
          longitude: country.latlng[1],
        };
      });

      setCountries(countriesData);
    });
  }, []);

  useEffect(() => {
    const filtered = countries.filter((country) => {
      return country.name.toLowerCase().includes(search.toLowerCase());
    });

    setFilteredCountries(filtered);
  }, [search, countries]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (filteredCountries.length === 1) {
        const country = filteredCountries[0];
        const data = await countriesService.getWeather(country.latitude, country.longitude);
        setWeatherData({
          temperature: data.main.temp,
          windSpeed: data.wind.speed,
          icon: data.weather[0].icon,
        });
      }
    };

    fetchWeather();
  }, [filteredCountries]);

  const renderCountry = (country) => {
    return (
      <>
        <h1>{country.name}</h1>
        <div>capital {country.capital}</div>
        <div>area {country.area}</div>
        <div>population {country.population}</div>
        <h2>languages</h2>
        {Object.entries(country.languages).map(([code, language]) => (
          <div key={code}>{language}</div>
        ))}
        <img src={country.flagImg} alt={country.name} width="200" style={{ marginTop: 50 }} />
        <h2>Weather in {country.capital}</h2>
        <div>temperature</div>
        <div>{weatherData.temperature} Celsius</div>
        <img src={`http://openweathermap.org/img/w/${weatherData.icon}.png`} alt="weather icon" />
        <div>wind</div>
        <div>{weatherData.windSpeed} m/s</div>
      </>
    );
  };

  return (
    <>
      <div>find countries</div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />

      {/* if one country, show details
          if 2-10 countries, show list
          if > 10 countries, show message */}
      {filteredCountries.length === 1 ? (
        <div>{renderCountry(filteredCountries[0])}</div>
      ) : filteredCountries.length > 1 && filteredCountries.length <= 10 ? (
        filteredCountries.map((country) => (
          <div key={country.name}>
            {country.flag} {country.name}
            <button onClick={() => setSearch(country.name)}>show</button>
          </div>
        ))
      ) : filteredCountries.length > 10 && search.length > 0 ? (
        <div>Too many matches, specify another filter</div>
      ) : filteredCountries.length > 10 && search.length === 0 ? (
        <div>Enter a country name</div>
      ) : (
        filteredCountries.length === 0 && <div>No countries found</div>
      )}
    </>
  );
}

export default App;
