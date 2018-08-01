import {axiosHelper} from '@/api/api-config.js'
import MockData from './mockData.js'

let instance = axiosHelper.createAxios({
  baseURL: 'https://2e8d7c00-2c94-436f-b2e1-2b6abe358b51.mock.pstmn.io/api/',
  // baseURL: 'https://38fd8d07-b7b8-40ac-83e4-c12b9236cd06.mock.pstmn.io/api/',
  timeout: 10000
})
export default{
	getProductInfo(itemCode = 345348986394,storeId = 666,lang){
		// let url  = `mock/rfid/${itemCode}/store_id/${storeId}`;
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
	getStock(storeId = 666,itemCode){
		let url = `stock/store_id/${storeId}/item_code/${itemCode}`
		return instance.get(url)
	},
	getUserReview(itemCode,lang){
		let LANG = null;
		if(lang == "EN"){
			LANG = "en_GB"
		}else if(lang == "ZH"){
			LANG = "zh_CN"
		}

		// let url = `voice/item_code/${itemCode}`;
		let url = `voice/item_code/${itemCode}/lang/${LANG}`;
		
		return instance.get(url)
	},
	getQrcode(itemCode){
		let url = `qrcode/item_code/${itemCode}`;
		return instance.get(url)
	}	
}

/*

//获取库存（by store & item code）
//@如何获取store_id
stock/store_id/666/item_code/2182810


//@如何获取store_id
//获取产品信息（by store & item code）
英文： productInfo/ean/108305/store_id/666/lang/EN
中文： productInfo/ean/108305/store_id/666/lang/ZH


//获取用户评论（by item code）
英文： voice/item_code/8189216/lang/en_GB
中文： voice/item_code/8189216/lang/zh_CN

*/