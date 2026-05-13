import axios from 'axios';

export const landUseClient = axios.create({
  baseURL: 'https://api.vworld.kr/req/data',
  timeout: 10000,
});

export const solarStatsClient = axios.create({
  baseURL: 'https://openapi.kpx.or.kr/openapi',
  timeout: 10000,
});
