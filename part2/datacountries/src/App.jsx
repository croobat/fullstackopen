import { useState, useEffect } from 'react';
import countriesService from './services/countries';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);

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

  const renderCountry = (country) => {
    console.log(country.languages);
    // Object { spa: "Spanish" }
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
