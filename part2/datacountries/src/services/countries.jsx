import axios from 'axios';

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api';

const getAll = async () => {
  const url = `${baseUrl}/all`;
  const { data } = await axios.get(url);
  return data;
};

export default { getAll };
