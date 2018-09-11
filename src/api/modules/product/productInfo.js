import { axios, axiosHelper } from '@/api/api-config.js'
import MockData from './mockData.js'

let instance = axiosHelper.createAxios({
  baseURL: 'https://product-scanner.decathlon.com/api/',
  timeout: 300000
})
let storeIdKey = 'store-id'

// productInfo/ean/3608459729250/lang/en/country/tw 、/lang/zh/country/tw、/lang/en/country/my
// stock/ean/3608459729250/store_id/666/lang/en/country/tw、/lang/zh/country/tw、/lang/en/country/my
// voice/ean/3608459729250/lang/en/country/my、/lang/zh/country/tw、/lang/en/country/tw
// price/ean/3608459729250/store_id/666/lang/en/country/my、/lang/en/country/tw、/666/lang/zh/country/tw
// item_code\item_name\area\field\event\stay_time
export default {
  getProductInfo(ean, lang, country) {
    let lang_ = lang == "ZH" ? "zh" : "en";
    let url = `productInfo/ean/${ean}/lang/${lang_}/country/${country}`;

    return instance.get(url)  
  },

  getStock(ean, storeId, lang, country) {
    let lang_ = lang == "ZH" ? "zh" : "en";
    let url = `stock/ean/${ean}/store_id/${storeId}/lang/${lang_}/country/${country}`
    return instance.get(url)
  },

  getUserReview(ean, lang, country) {

    let lang_ = lang == "ZH" ? "zh" : "en";
    let url = `voice/ean/${ean}/lang/${lang_}/country/${country}`;
    
    return instance.get(url)
  },

  getPrice(ean, storeId, lang, country) {
    let lang_ = lang == "ZH" ? "zh" : "en";
    let url = `price/ean/${ean}/store_id/${storeId}/lang/${lang_}/country/${country}`;

    return instance.get(url)
  },

  getQrcode(modelCode, country) {
    let url = `qrcode/model_code/${modelCode}/country/${country}`;

    return instance.get(url)
  },

  postTracking(data) {
    if (!data.item_code || !data.field) return Promise.resolve();
    let url = `https://product-scanner.decathlon.com/api/tracking/save`;
    let form = [];

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        form.push(`${key}=${data[key]}`);
      }
    }

    return axios({
      method: 'post',
      url: url,
      data: form.join('&'),
      config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    });
  }

}
