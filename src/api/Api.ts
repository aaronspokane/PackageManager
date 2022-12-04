import axios, { AxiosInstance } from 'axios';
import exp from 'constants';

export const GetAPI = (port: number = 3000) : AxiosInstance => {
  return axios.create({
    baseURL: `http://localhost:${port}`
  });
}