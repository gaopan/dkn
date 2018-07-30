import {axiosHelper} from '@/api/api-config.js'
import MockData from './mockData.js'

let instance = axiosHelper.createAxios({
  baseURL: 'https://2e8d7c00-2c94-436f-b2e1-2b6abe358b51.mock.pstmn.io/api/',
  // baseURL: 'https://38fd8d07-b7b8-40ac-83e4-c12b9236cd06.mock.pstmn.io/api/',
  timeout: 10000
})
export default{
	getProductInfo(rfid = 345348986394,id = 1277 ){
		let url  = `mock/rfid/${rfid}/store_id/${id}`;
		// return instance.get(url)
		return Promise.resolve(MockData.getProductInfo);
	},
	getStock(storeId = 666,itemCode = 2182810){
		let url = `stock/store_id/${storeId}/item_code/${itemCode}`
		// return instance.get(url)
	},
	getUserReview(itemCode = 8304664){
		let url = `voice/item_code/${itemCode}`;
		// return instance.get(url)
	},
	getQrcode(itemCode = 111){
		let url = `qrcode/item_code/${itemCode}`;
		// return instance.get(url)
	}	
}

// //获取库存（by store & item code）
// stock api: /stock/store_id/666/item_code/2182810

// //获取产品信息（by store & item code）
// productInfo api: /mock/rfid/345348986394/store_id/1277

// //获取用户评论（by item code）
// voice api: /voice/item_code/8304664

// //获取二维码（by item code）
// qrcode api: /qrcode/item_code/111