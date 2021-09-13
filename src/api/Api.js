import queryString from 'query-string';
import nodeFetch from 'node-fetch';
import config from './website.config.json';

const serverSide = (typeof window === 'undefined');

const fetch = serverSide ? nodeFetch : window.fetch;

async function performRequest(method,url,payload=undefined,token=undefined){

  const haveBody = !['GET','HEAD'].includes(method);

  const query = (haveBody || !payload) ? '' : '?'+queryString.stringify(payload);

  const response = await fetch(`${url}${query}`,{
    method,
    headers:{
      ...(haveBody ? {
        'Content-Type': 'application/json',
      }:{}),
    },
    body: haveBody ? JSON.stringify(payload||{}) : undefined,
    mode: 'same-origin',
    credentials: 'same-origin',
    cache: 'no-cache',
    redirect: 'error',
    keepalive: false,
  });

  if(!response.ok)
    return response;

  const contentType = response.headers.get("content-type");
  response.isJson = (contentType && contentType.indexOf("application/json") !== -1);

  return response;
}

const serverRoot = process.env.NODE_ENV === 'development' ? config.devUrls.website : config.deploy.url;
const apiRoot = '/api/v1';

const baseUrl = `${serverSide?serverRoot:''}${apiRoot}`;

export class UnauthorizedError extends Error{
  unauthorized = true;
  status = 401;
  statusText = 'Unauthorized';
}
export class ForbiddenError extends Error{
  forbidden = true;
  status = 403;
  statusText = 'Forbidden';
}

export default class Api{

  static #accessToken;
  static #email;
  static #sessionActive = false;
  static #elevated = false;
  static #onLogout = ()=>{};

  static setOnLogoutListener(listener){
    this.#onLogout = listener;
  }
  static isSessionActive(){
    return this.#sessionActive;
  }
  static currentUser(){
    return serverSide ? null : window.localStorage.getItem('currentUser');
  }
  static elevated(){
    return this.#elevated;
  }
  static skipAuthentication(skip=true){
    this.#accessToken = skip ? 'not_a_token' : null;
  }

  static async login(email,password){
    const response = await performRequest('POST',`${baseUrl}/user/login`,{
      email,
      password,
    });

    if(response.status === 401)
      throw new Error('Incorrect email and/or password');
    else if(!response.ok)
      throw new Error(response.statusText);

    const body = await response.json();

    this.#email = email;
    this.#accessToken = body.accessToken;
    this.#sessionActive = true;
    this.#elevated = true;

    window.localStorage.setItem('currentUser',this.#email);

    return body.userData;
  }
  static async logout(){
    await this.post(`/user/logout`);
    this.#accessToken = null;
    this.#sessionActive = false;
    window.localStorage.removeItem('currentUser');
    this.#onLogout();
  }
  
  static #refreshTokenInProgress = null;
  static async refreshToken(){
    if(this.#refreshTokenInProgress)
      return await this.#refreshTokenInProgress;
    
    this.#refreshTokenInProgress = this.#doRefreshToken();
    try{
      return await this.#refreshTokenInProgress;
    }finally{
      this.#refreshTokenInProgress = null;
    }
  } 
  static async #doRefreshToken(){
    if(!this.#email)
      this.#email = this.currentUser();
    if(!this.#email)
      throw new UnauthorizedError('Session expired');

    const response = await performRequest('POST',`${baseUrl}/user/refreshLogin`,{
      email: this.#email
    });

    if(response.status === 401){
      this.#sessionActive = false;
      this.#email = null;
      this.#accessToken = null;
      this.#elevated = false;
      window.localStorage.removeItem('currentUser');

      throw new UnauthorizedError('Session expired');
    } else if(response.status !== 200)
      throw new Error(response.statusText);

    const body = await response.json();

    this.#accessToken = body.accessToken;
    this.#sessionActive = true;
    this.#elevated = false;

    return {
      email: this.#email,
      userData: body.userData
    };
  }
  static async request(method,endpoint,payload,abortIfUnauthorized=false){
    
    const response = 
      await performRequest(method,`${baseUrl}${endpoint}`,payload,null);

    if(!response.ok){
      console.log({baseUrl,method,endpoint,payload});
      throw new Error(response.statusText);
    }

    return response.isJson ? await response.json() : await response.text();
  }

  static async get(endpoint,payload){
    return await this.request('GET',endpoint,payload);
  }
  static async post(endpoint,payload){
    return await this.request('POST',endpoint,payload);
  }
  static async put(endpoint,payload){
    return await this.request('PUT',endpoint,payload);
  }
  static async delete(endpoint,payload){
    return await this.request('DELETE',endpoint,payload);
  }

}
