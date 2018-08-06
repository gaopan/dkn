import {axiosHelper} from '@/api/api-config.js'
import MockData from './mockData.js'

let instance = axiosHelper.createAxios({ 
  baseURL: 'http://13.229.158.94/api/',
  timeout: 300000
})
let storeIdKey = 'store-id'
export default{
	getProductInfo(itemCode = 3608459729250/*108305*/,storeId = localStorage.getItem(storeIdKey),lang){
		let LANG = null;
		if(lang == "EN"){
			LANG = "EN"
		}else if(lang == "ZH"){
			LANG = "ZH"
		}

		let url  = `productInfo/ean/${itemCode}/store_id/${storeId}/lang/${LANG}`;
		return instance.get(url)
		// return Promise.resolve(MockData.getProductInfo);
	},
	getStock(storeId = localStorage.getItem(storeIdKey),modelCode){
		let url = `stock/store_id/${storeId}/model_code/${modelCode}`
		return instance.get(url)
	},
	getUserReview(itemCode,lang){
		let LANG = null;
		if(lang == "EN"){
			LANG = "en_GB"
		}else if(lang == "ZH"){
			LANG = "zh_CN"
		}

		let url = `voice/item_code/${itemCode}/lang/${LANG}`;
		
		return instance.get(url)
	},
	getQrcode(country){
		///qrcode/country/Malaysia|tw
		let url = `qrcode/country/${country}`;
		return instance.get(url)
	}	
}

/*

//获取库存（by store & item code）
//@如何获取 store_id
stock/store_id/666/model_code/2182810

//@如何获取 store_id
//获取产品信息（by store & item code）
/productInfo/ean/3608459729250|108305/store_id/666/lang/EN|ZH


//获取用户评论（by item code）
 voice/item_code/8189216/lang/en_GB|zh_CN
*/