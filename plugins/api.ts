import axios from "axios";
import Cookie from 'js-cookie'
import { defineEventHandler, H3Event, parseCookies, setCookie } from 'h3'

//import {useConfigStore} from '../store/config'

//const configStore = useConfigStore()

 defineEventHandler((event: H3Event) => {
  const cookies = parseCookies(event)
  const token = cookies?.token
  console.log(cookies);
})

export default defineNuxtPlugin( (nuxtApp) => {
  const defaultUrl = "http://127.0.0.1:8000/";

  // Request interceptor. Runs before your request reaches the server
  const onRequest = (config) => {
    // If http method is `post | put | delete` and XSRF-TOKEN cookie is 
    // not present, call '/sanctum/csrf-cookie' to set CSRF token, then 
    // proceed with the initial response
    if ((
      config.method == 'post' ||
      config.method == 'put' ||
      config.method == 'delete' ||
      
      config.method == 'patch'
          /* other methods you want to add here */
      ) &&
      !Cookie.get('XSRF-TOKEN')) {
      return setCSRFToken()
        .then(response => config);
    }

    
    return config;
  }

  
  // A function that calls '/api/csrf-cookie' to set the CSRF cookies. The 
  // default is 'sanctum/csrf-cookie' but you can configure it to be anything.
  const setCSRFToken = () => {
    return api.get('sanctum/csrf-cookie'); // resolves to '/api/csrf-cookie'.
  }

   function checkToken(){
    return localStorage.getItem('token')
  }


  let api = axios.create({
    baseURL: defaultUrl,
    headers: {
      common: {},
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json, *',
      'withCredentials': true,
      "mode": "cors",
      "credentials": "include",
      'Access-Control-Expose-Headers': ['XSRF-TOKEN', 'Set-Cookie', 'Cookie'],
      'Content-Type': 'application/json'
    },
    withCredentials: true,

  });

  
    // api.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`   
    // api.defaults.headers.common.Branch = localStorage.getItem('active_branch');
    
    // if(configStore.auth_token){
    // api.defaults.headers.common.Authorization = `Bearer ${configStore.auth_token}`
    // }

  // attach your interceptor
  api.interceptors.request.use(onRequest, null);


  return {
    provide: {
      api: api,
    },
  };
});
