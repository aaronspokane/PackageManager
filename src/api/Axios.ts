import axios, { AxiosInstance } from 'axios';
import IApi from './IApi';

export default class AxiosApi implements IApi {

    private _axios: AxiosInstance;

    constructor(url: string, port: number) {
        this._axios = axios.create({
            baseURL: `${url}:${port}`
          });
    }

    public Get(url: string) : Promise<any> {
        return this._axios.get(url);       
    }

    public Post(url: string, body: object) : Promise<any> {
        return this._axios.post(url, body);    
    }
}
