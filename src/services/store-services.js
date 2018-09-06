
import TypeChecker from '@/utils/type-checker.js'
import shared from '@/shared.js'

const storageKey = 'store-id';
const mapping = {
  1292: 'ZH',
  1639: 'ZH',
  666: 'ZH',
  2002: 'EN',
  1600: 'EN',
  1999: 'EN',
  2000: 'EN'
};

let _storeId = null;

export default {
  setStoreId(storeId, cb) {
    _storeId = storeId;
    localStorage.setItem(storageKey, storeId);
    if (TypeChecker.isFunction(cb)) {
      cb.call(this);
    }
  },
  clearStoreId() {
    localStorage.removeItem(storageKey);
  },
  getStoreId(){
    if(_storeId) return _storeId;
    let storeId = localStorage.getItem(storageKey);
    if(TypeChecker.isString(storeId)) {
      _storeId = storeId;
      return storeId;
    }
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
