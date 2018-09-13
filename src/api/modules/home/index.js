import { axios, axiosHelper } from '@/api/api-config.js'

let instance = axiosHelper.createAxios({
  baseURL: 'https://product-scanner.decathlon.com/api/',
  timeout: 300000
})

export default {
  login(name, password) {
    let url = 'https://product-scanner.decathlon.com/api/login';
    let form = `name=${name}&password=${password}`;
    return axios({
      method: 'post',
      url: url,
      data: form,
      withCredentials: true,
      config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    });
  }
}
