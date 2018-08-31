//This is where all the api related config resides on
// i.e: Cookies management, axios global config
import axios from 'axios'
import cookies from '../utils/cookies-manager.js'
import TypeChecker from '../utils/type-checker.js'
import router from '../router'
// import store from '../store'
import StoreManager from '../utils/store-manager.js'
import CookiesManager from '../utils/cookies-manager.js'
// import Noty from '@/utils/noty-operation.js'
// import CommonGenerators from '@/utils/common-generators.js'
import Router from 'vue-router'

// let CancelToken = axios.CancelToken
// let serviceVariantConfigs = {};
// let UUIDGenerator = CommonGenerators.UUIDGenerator;
let routerInstance = new Router();

let axiosHelper = {
  createAxios: function(obj) {
    if (obj.baseURL) {
      let instance = axios.create({
        baseURL: obj.baseURL,
        timeout: obj.timeout ? obj.timeout : 30000
      });
      instance.interceptors.response.use(function(res) {
        return res;
      }, function(err) {
        if(err.response.status == 401) {
          routerInstance.replace('/login');
        } else {
          return Promise.reject(err);
        }
      });
      return instance;
    }
  }
}


export { axios, cookies, axiosHelper }
