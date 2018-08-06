
import TypeChecker from '@/utils/type-checker.js'
import shared from '@/shared.js'

const storageKey = 'storeId';

let _storeId = null;

export default {
  setStoreId(storeId, cb) {
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
  }
}
