import { axios, axiosHelper } from '@/api/api-config.js'
import MockData from './mockData.js'

let instance = axiosHelper.createAxios({
  baseURL: 'http://13.229.158.94/api/',
  timeout: 300000
}) 
let storeIdKey = 'store-id'

export default {
  getProductInfo(rfid, storeId = localStorage.getItem(storeIdKey), lang) {

    let url = `productInfo/ean/${rfid}/store_id/${storeId}/lang/${lang}`;
    return instance.get(url)
    // if(lang == "ZH"){
    //   return Promise.resolve(MockData.getProductInfo.ZH);
    // }else{
    //   return Promise.resolve(MockData.getProductInfo.EN);
    // }
  },

  getStock(storeId = localStorage.getItem(storeIdKey), itemCode) {
    let url = `stock/store_id/${storeId}/item_code/${itemCode}`
    return instance.get(url)
  },

  getUserReview(modelCode, lang) {
    let LANG = null;
    if (lang == "EN") {
      LANG = "en_GB"
    } else if (lang == "ZH") {
      LANG = "zh_CN"
    }

    let url = `voice/model_code/${modelCode}/lang/${LANG}`;

    // return Promise.resolve(MockData.getUserReview);
    return instance.get(url)
  },

  getQrcode(modelCode,country) {
    // qrcode/model_code/8304664/country/my|tw
    let url = `qrcode/model_code/${modelCode}/country/${country}`;
    return instance.get(url)
  },

  // item_code\item_name\area\field\event\stay_time
  postTracking(data){
    let url = `http://13.229.158.94/api/tracking/save`;
    let form = [];

    for(let key in data) {
      if(data.hasOwnProperty(key)) {
        form.push(`${key}=${data[key]}`);
      }
    }

    return axios({
      method: 'post',
      url: url,
      data: form.join('&'),
      config: {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    });
    // return instance.post(url,data)
    // return Promise.resolve()
  }
}
