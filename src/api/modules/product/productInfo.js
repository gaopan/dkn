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
    // return Promise.resolve({data:{"272640":11,"2046935":25,"272636":27,"2046934":20,"328449":17,"2046933":15}})
  },

  getUserReview(ean, lang, country) {

    let lang_ = lang == "ZH" ? "zh" : "en";
    let url = `voice/ean/${ean}/lang/${lang_}/country/${country}`;

    // return Promise.resolve({data:{"8315702":[{"language":"zh","country":"CN","id":6564703,"created_at":"2018-08-29T00:52:24+0200","body":"\u4f7f\u7528\u65f6\u4e00\u5b9a\u8981\u5e26\u597d\uff0c\u8981\u53cd\u590d\u8bd5\u7528\uff0c\u6709\u65f6\u6709\u8fdb\u6c34\u60c5\u51b5\u3002","recommended":true,"count_up_vote":0,"count_vote":0,"is_regional_prestation":false,"recruitment_type":"pushed","firstname":"\u73b2","offer":"8304664","review_personal_data_id":"D45A5167-EA21-5885-98C6-3DAF4F4BB08C","title":"\u6ce8\u610f\u5b89\u5168","positive":"","negative":"","note":5,"purchase_store":{"name":"DECATHLON \u897f\u7ea2\u95e8\u5e97","id":969,"code":"992","code_tiers":7,"code_ss_tiers":992,"country":{"iso":"CN"}},"tester_review":false,"published_at":"2018-08-29T05:47:37+0200","author":{"id":6973463,"firstname":"\u73b2","updated_at":"2018-08-29T02:00:24+02:00"},"reasons":[],"country_label":{"CN":"\u4e2d\u56fd"},"url_vote":"\/\/reviews.decathlon.com.cn\/zh_CN\/utility\/view\/cubeinstore\/6564703\/1?","fit":{"label":null,"id":null,"message":null},"width":{"label":null,"id":null,"message":null},"review_flag":{"label":"api.label.reviewFlag.checkedPurchase.title","description":"api.label.reviewFlag.checkedPurchase.description"}},{"language":"zh","country":"CN","id":6515888,"created_at":"2018-08-22T16:59:16+0200","body":"\u6691\u671f\u53bb\u5df4\u5398\u5c9b\u5ea6\u5047\uff0c\u8ba1\u5212\u4e2d\u5c31\u5217\u597d\u4e86\u6d6e\u6f5c\u9879\u76ee\uff0c\u4ee5\u524d\u4f20\u7edf\u6d6e\u6f5c\u5668\u5177\u8981\u7528\u5634\u547c\u5438\u4e0d\u662f\u7279\u522b\u4e60\u60ef\uff0c\u5728\u8fea\u5361\u4fac\u770b\u5230\u4e86\u8fd9\u6b3e\u4ea7\u54c1\uff0c\u5168\u9762\u7f69\u8bbe\u8ba1\uff0c\u5728\u6c34\u4e2d\u4e5f\u80fd\u50cf\u5e73\u65f6\u4e00\u6837\u547c\u5438\u3002\u5728\u5df4\u5398\u5c9b\u7ecf\u8fc7\u5b9e\u8df5\u68c0\u9a8c\uff0c\u975e\u5e38\u597d\uff01","recommended":true,"count_up_vote":1,"count_vote":1,"is_regional_prestation":false,"recruitment_type":"pushed","firstname":"\u5dcd","offer":"8304664","review_personal_data_id":"88DCC985-D390-1460-039E-709CC4AE14B6","title":"\u547c\u5438\u81ea\u5982\u7684\u6d6e\u6f5c\u795e\u5668","positive":"","negative":"","note":5,"purchase_store":{"name":"DECATHLON \u4e16\u535a\u6e90\u5e97","id":924,"code":"918","code_tiers":7,"code_ss_tiers":918,"country":{"iso":"CN"}},"tester_review":false,"published_at":"2018-08-23T04:50:49+0200","author":{"id":5907325,"firstname":"\u5dcd","updated_at":"2017-08-21T13:00:22+02:00"},"reasons":[],"country_label":{"CN":"\u4e2d\u56fd"},"url_vote":"\/\/reviews.decathlon.com.cn\/zh_CN\/utility\/view\/cubeinstore\/6515888\/1?","fit":{"label":null,"id":null,"message":null},"width":{"label":null,"id":null,"message":null},"review_flag":{"label":"api.label.reviewFlag.checkedPurchase.title","description":"api.label.reviewFlag.checkedPurchase.description"}},{"language":"zh","country":"CN","id":6504989,"created_at":"2018-08-21T07:13:47+0200","body":"\u5bf9\u8138\u90e8\u5927\u5c0f\u8981\u6c42\u6bd4\u8f83\u9ad8\uff0c\u5c0f\u5b69\u7528\u7684\u86ee\u597d\u3002","recommended":true,"count_up_vote":0,"count_vote":0,"is_regional_prestation":false,"recruitment_type":"pushed","firstname":"\u6656","offer":"8304664","review_personal_data_id":"E3BCD023-569F-0E4B-4F1B-B44B444187AE","title":"\u5bf9\u8138\u90e8\u5927\u5c0f\u8981\u6c42\u6bd4\u8f83\u9ad8","positive":"","negative":"","note":4,"purchase_store":{"name":"DECATHLON \u6d2a\u5174\u5e97","id":852,"code":"669","code_tiers":7,"code_ss_tiers":669,"country":{"iso":"CN"}},"tester_review":false,"published_at":"2018-08-21T11:27:24+0200","author":{"id":6175282,"firstname":"\u6656","updated_at":"2017-11-28T12:00:24+01:00"},"reasons":[],"country_label":{"CN":"\u4e2d\u56fd"},"url_vote":"\/\/reviews.decathlon.com.cn\/zh_CN\/utility\/view\/cubeinstore\/6504989\/1?","fit":{"label":null,"id":null,"message":null},"width":{"label":null,"id":null,"message":null},"review_flag":{"label":"api.label.reviewFlag.checkedPurchase.title","description":"api.label.reviewFlag.checkedPurchase.description"}},{"language":"zh","country":"CN","id":6500691,"created_at":"2018-08-20T17:58:13+0200","body":"\u5f88\u597d\uff0c\u5bc6\u5c01\u6027\u5f88\u597d\uff0c\u5f88\u6e05\u6670","recommended":true,"count_up_vote":0,"count_vote":0,"is_regional_prestation":false,"recruitment_type":"pushed","firstname":"\u4f1f","offer":"8304664","review_personal_data_id":"F165CE11-6BBA-4B5C-29B8-C15291D9115B","title":"\u5f88\u597d\uff0c\u5168\u5bc6\u5c01","positive":"","negative":"","note":5,"purchase_store":{"name":"DECATHLON \u69d0\u5b89\u4e1c\u5e97","id":911,"code":"903","code_tiers":7,"code_ss_tiers":903,"country":{"iso":"CN"}},"tester_review":false,"published_at":"2018-08-21T11:15:02+0200","author":{"id":4456542,"firstname":"\u4f1f","updated_at":"2017-02-03T03:42:15+01:00"},"reasons":[],"country_label":{"CN":"\u4e2d\u56fd"},"url_vote":"\/\/reviews.decathlon.com.cn\/zh_CN\/utility\/view\/cubeinstore\/6500691\/1?","fit":{"label":null,"id":null,"message":null},"width":{"label":null,"id":null,"message":null},"review_flag":{"label":"api.label.reviewFlag.checkedPurchase.title","description":"api.label.reviewFlag.checkedPurchase.description"}},{"language":"zh","country":"CN","id":6499278,"created_at":"2018-08-20T13:28:06+0200","body":"\u4e0d\u8d34\u5408\u9762\u90e8\uff0c\u4f1a\u6f0f\u6c34","recommended":false,"count_up_vote":0,"count_vote":0,"is_regional_prestation":false,"recruitment_type":"pushed","answer":{"firstname":"Yingnan","fedeId":"YTANG10","body":"\u60a8\u597d\uff0c\u5f88\u62b1\u6b49\u6211\u4eec\u7684\u4ea7\u54c1\u7ed9\u60a8\u5e26\u6765\u4e86\u4e0d\u597d\u7684\u4f53\u9a8c\u3002\u5173\u4e8e\u8fdb\u6c34\u73b0\u8c61\uff0c\u60a8\u53ef\u4ee5\u68c0\u67e5\u4f69\u5e26\u662f\u5426\u6b63\u786e\uff0c\u5c3a\u7801\u662f\u5426\u5408\u9002\uff0c\u5982\u679c\u662f\u8d28\u91cf\u95ee\u9898\uff0c\u60a8\u53ef\u4ee5\u90ae\u4ef6\u6211\u4eec\u66f4\u5177\u4f53\u7684\u60c5\u51b5\u63cf\u8ff0\uff0c\u6216\u662f\u5230\u60a8\u9644\u8fd1\u7684\u5b9e\u4f53\u5e97\u627e\u6211\u4eec\u9500\u552e\u52a9\u7406\u5e2e\u60a8\u89e3\u51b3\u95ee\u9898\u3002Yingnan","created_at":"2018-08-27T07:25:47+02:00"},"firstname":"\u5251\u6cc9","offer":"8304664","review_personal_data_id":"42146641-8A1C-63DB-A858-D2E7D201BB19","title":"\u4e0d\u8d34\u5408\u9762\u90e8","positive":"","negative":"","note":1,"purchase_store":{"name":"DECATHLON \u5d07\u5ddd\u5e97","id":1685,"code":"1630","code_tiers":7,"code_ss_tiers":1630,"country":{"iso":"CN"}},"tester_review":false,"published_at":"2018-08-21T11:10:56+0200","author":{"id":6947879,"firstname":"\u5251\u6cc9","updated_at":"2018-08-20T14:00:22+02:00"},"reasons":[],"country_label":{"CN":"\u4e2d\u56fd"},"url_vote":"\/\/reviews.decathlon.com.cn\/zh_CN\/utility\/view\/cubeinstore\/6499278\/1?","fit":{"label":null,"id":null,"message":null},"width":{"label":null,"id":null,"message":null},"review_flag":{"label":"api.label.reviewFlag.checkedPurchase.title","description":"api.label.reviewFlag.checkedPurchase.description"}}]}})
    return instance.get(url)
  },

  getPrice(ean, storeId, lang, country) {
    let lang_ = lang == "ZH" ? "zh" : "en";
    let url = `price/ean/${ean}/store_id/${storeId}/lang/${lang_}/country/${country}`;

    return instance.get(url)
    // return Promise.resolve({data:{"currency":"TWD","items":{"272636":{"sale_price":"859.00","strikeout_price":"999.00"},"2046934":{"sale_price":"859.00","strikeout_price":"999.00"},"328449":{"sale_price":"859.00","strikeout_price":"999.00"},"2046933":{"sale_price":"859.00","strikeout_price":"999.00"},"272640":{"sale_price":"859.00","strikeout_price":"999.00"},"2046935":{"sale_price":"859.00","strikeout_price":"999.00"}},"models":{"8304664":{"price":"859.00"},"8315702":{"price":"859.00"},"8304667":{"price":"859.00"}}}})
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
