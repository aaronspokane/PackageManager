import axios, { AxiosInstance } from 'axios';
import AxiosApi from './Axios';
import IApi from './IApi';

let Api: IApi;

export const Instantiate = (url: string, port: number) => {
  Api = new AxiosApi(url, port);
}

export const Get = (url: string) : Promise<any> => {    
    return Api.Get(url);  
}

export const Post = (url: string, body: object) : Promise<any> => {
    return Api.Post(url, body);  
}

export const GetAPI = (port: number = 3000) : AxiosInstance => {
  return axios.create({
    baseURL: `http://localhost:${port}`
  });
}