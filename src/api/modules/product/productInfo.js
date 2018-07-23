import {axiosHelper} from '@/api/api-config.js'
import MockData from './mockData.js'

let instance = axiosHelper.createAxios({
  baseURL: 'https://38fd8d07-b7b8-40ac-83e4-c12b9236cd06.mock.pstmn.io/api/',
  timeout: 10000
})
export default{
	getProductInfo( id = 1277 ){
		let url  = 'mock/rfid/345348986394/store_id/' + id;
		return instance.get(url)
		// return Promise.resolve(MockData.getProductInfo);
	}
	
}