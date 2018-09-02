
import TypeChecker from '@/utils/type-checker.js'
import shared from '@/shared.js'
import axios from 'axios'

const storageKey = 'product-scanner-token-storage-id';
const mapping = {
  1639: 'ZH',
  666: 'ZH',
  2002: 'EN',
  1600: 'EN',
  1999: 'EN',
  2000: 'EN'
};

let _token = null;

export default {
  setToken(token, cb) {
    _token = token;
    localStorage.setItem(storageKey, JSON.stringify(token));
    if (TypeChecker.isFunction(cb)) {
      cb.call(this);
    }
  },
  clearToken() {
    localStorage.removeItem(storageKey);
  },
  getToken(){

    if(_token) return _token;
    let token = localStorage.getItem(storageKey);
    if(TypeChecker.isString(token)) {
      _token = JSON.parse(token);

      // axios.common.headers['Authorization'] = 'Basic ' + _token.token;
      axios.defaults.headers.common['Authorization'] = 'Basic ' + _token.token;
      
      //To fix that unable to get the storeId
      return _token;
      // return token;
    }
    return null;
  },
  getStoreId(){
    let token = this.getToken();
    if(token && token.storeId) return token.storeId;

    return null;
  },
  getLang(){
    let storeId = this.getStoreId();

    if(storeId) {
      return mapping[storeId];
    } 

    return 'EN';
  }
}
