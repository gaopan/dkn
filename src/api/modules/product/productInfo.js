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
    // return Promise.resolve({data:{"328449":17,"2046933":19,"272636":25,"2046934":20,"272640":18,"2046935":25}})
    return instance.get(url)
  },

  getUserReview(ean, lang, country) {

    let lang_ = lang == "ZH" ? "zh" : "en";
    let url = `voice/ean/${ean}/lang/${lang_}/country/${country}`;

    // return Promise.resolve({data:{"8315702":[{"language":"zh","country":"CN","id":6565580,"created_at":"2018-08-29T07:54:55+0200","body":"\u6d77\u4e2d\u6d6e\u6f5c\u7528\uff0c\u5f88\u65b9\u4fbf\u3002\u4f46\u4e0d\u5c0f\u5fc3\u8fdb\u4e86\u5c0f\u9897\u7c92\u6c99\u5b50\u5f88\u4e0d\u597d\u6e05\u6d17","recommended":false,"count_up_vote":0,"count_vote":0,"is_regional_prestation":false,"recruitment_type":"pushed","firstname":"\u65b0","offer":"8315702","review_personal_data_id":"9720C0FB-1289-409B-3E67-DDB6E14A233D","title":"\u4f7f\u7528\u4f53\u9a8c","positive":"","negative":"","note":3,"purchase_store":{"name":"DECATHLON \u4e07\u5e74\u573a\u5e97","id":1245,"code":"1260","code_tiers":7,"code_ss_tiers":1260,"country":{"iso":"CN"}},"tester_review":false,"published_at":"2018-08-29T10:01:58+0200","author":{"id":6046419,"firstname":"\u65b0","updated_at":"2017-10-12T03:00:26+02:00"},"reasons":[],"country_label":{"CN":"\u4e2d\u56fd"},"url_vote":"\/\/reviews.decathlon.com.cn\/zh_CN\/utility\/view\/cubeinstore\/6565580\/1?","fit":{"label":null,"id":null,"message":null},"width":{"label":null,"id":null,"message":null},"review_flag":{"label":"api.label.reviewFlag.checkedPurchase.title","description":"api.label.reviewFlag.checkedPurchase.description"}},{"language":"zh","country":"CN","id":6499651,"created_at":"2018-08-20T14:10:42+0200","body":"\u53bb\u83f2\u5f8b\u5bbe\u6d6e\u6f5c\uff0c\u5b69\u5b50\u73a9\u75af\u4e86\uff0c\u9762\u7f69\u6bd4\u6d6e\u6f5c\u955c+\u547c\u5438\u5634\u5f3a\u592a\u591a\u4e86\u3002\u4e0d\u6f0f\u6c34\uff0c\u89c6\u91ce\u5927\u3002\u975e\u5e38\u6ee1\u610f\uff01\uff01","recommended":true,"count_up_vote":0,"count_vote":0,"is_regional_prestation":false,"recruitment_type":"pushed","firstname":"\u534e","offer":"8315702","review_personal_data_id":"9EC1C351-258F-D785-7BE4-AC895BE69EB3","title":"\u53bb\u83f2\u5f8b\u5bbe\u6d6e\u6f5c\uff0c\u5b69\u5b50\u73a9\u75af\u4e86\uff0c\u9762\u7f69\u6bd4\u6d6e\u6f5c\u955c+\u547c\u5438\u5634\u5f3a\u592a\u591a\u4e86\u3002","positive":"","negative":"","note":5,"purchase_store":{"id":534,"code":"809","code_tiers":7,"code_ss_tiers":809,"country":{"iso":"PL"}},"tester_review":false,"published_at":"2018-08-21T11:10:56+0200","author":{"id":6948023,"firstname":"\u534e","updated_at":"2018-08-20T15:00:22+02:00"},"reasons":[],"country_label":{"CN":"\u4e2d\u56fd"},"url_vote":"\/\/reviews.decathlon.com.cn\/zh_CN\/utility\/view\/cubeinstore\/6499651\/1?","fit":{"label":null,"id":null,"message":null},"width":{"label":null,"id":null,"message":null},"review_flag":{"label":"api.label.reviewFlag.checkedPurchase.title","description":"api.label.reviewFlag.checkedPurchase.description"}},{"language":"zh","country":"CN","id":6482902,"created_at":"2018-08-18T10:44:13+0200","body":"\u5bf9\u4e8e\u4e00\u4e2a\u65f1\u9e2d\u5b50\u548c\u6781\u5ea6\u6050\u6c34\u75c7\u60a3\u8005\u6765\u8bf4 \u8fd9\u4e2a\u9762\u7f69\u5f88\u597d\u7684\u89e3\u51b3\u4e86\u6e38\u6cf3\u548c\u6f5c\u6c34\u5e26\u6765\u7684\u6050\u60e7\u548c\u56f0\u6270 \u8fd9\u51e0\u5929\u51e0\u4e4e\u5929\u5929\u665a\u4e0a\u5c31\u6ce1\u5728\u6cf3\u6c60\u91cc \u8fd9\u51e0\u5929\u4e0d\u4ec5\u80fd\u591f\u514b\u670d\u5bf9\u6c34\u7684\u6050\u60e7\u4e86 \u4e5f\u80fd\u6e38\u51fa\u53bb\u5f88\u8fdc\u4e86 \u53ea\u8981\u8c03\u8282\u597d\u9762\u7f69\u7684\u677e\u7d27\u5e26\u6839\u672c\u5c31\u4e0d\u4f1a\u8fdb\u6c34 \u53ea\u8981\u53e3\u9f3b\u534f\u8c03\u547c\u5438 \u6839\u672c\u4e0d\u4f1a\u618b\u6c14 \u4e5f\u6ca1\u6709\u7f51\u4e0a\u8bf4\u7684\u90a3\u4e48\u4e0d\u597d \u5f88\u503c\u5f97\u63a8\u8350","recommended":true,"count_up_vote":0,"count_vote":0,"is_regional_prestation":false,"recruitment_type":"pushed","firstname":"\u777f","offer":"8315702","review_personal_data_id":"6CEEEF52-881B-D769-965F-753F624D3713","title":"\u4f60\u7528\u4f60\u61c2\u7684","positive":"","negative":"","note":5,"purchase_store":{"name":"DECATHLON \u5efa\u8bbe\u897f\u8def\u5e97","id":877,"code":"801","code_tiers":7,"code_ss_tiers":801,"country":{"iso":"CN"}},"tester_review":false,"published_at":"2018-08-18T11:40:19+0200","author":{"id":2425237,"firstname":"\u777f"},"reasons":[],"country_label":{"CN":"\u4e2d\u56fd"},"url_vote":"\/\/reviews.decathlon.com.cn\/zh_CN\/utility\/view\/cubeinstore\/6482902\/1?","fit":{"label":null,"id":null,"message":null},"width":{"label":null,"id":null,"message":null},"review_flag":{"label":"api.label.reviewFlag.checkedPurchase.title","description":"api.label.reviewFlag.checkedPurchase.description"}},{"language":"zh","country":"CN","id":6410949,"created_at":"2018-08-08T05:02:01+0200","body":"\u4e0d\u597d\u7528 \u4f7f\u7528\u65f6\u5bb9\u6613\u6f0f\u6c34\u554a","recommended":false,"count_up_vote":2,"count_vote":2,"is_regional_prestation":false,"recruitment_type":"pushed","firstname":"\u7426","offer":"8315702","review_personal_data_id":"203DD673-E445-3CF0-3ADF-4B1EDD4BCE25","title":"SM","positive":"","negative":"","note":3,"purchase_store":{"name":"DECATHLON \u5b89\u4ead\u5e97","id":1687,"code":"1667","code_tiers":7,"code_ss_tiers":1667,"country":{"iso":"CN"}},"tester_review":false,"published_at":"2018-08-08T11:33:56+0200","author":{"id":5473521,"firstname":"Jacky","updated_at":"2017-06-15T08:02:55+02:00"},"reasons":[],"country_label":{"CN":"\u4e2d\u56fd"},"url_vote":"\/\/reviews.decathlon.com.cn\/zh_CN\/utility\/view\/cubeinstore\/6410949\/1?","fit":{"label":null,"id":null,"message":null},"width":{"label":null,"id":null,"message":null},"review_flag":{"label":"api.label.reviewFlag.checkedPurchase.title","description":"api.label.reviewFlag.checkedPurchase.description"}},{"language":"zh","country":"CN","id":6364593,"created_at":"2018-08-02T05:21:33+0200","body":"\u989d\u5934\u4f4d\u7f6e\u5c01\u95ed\u4e0d\u4e25\uff0c\u5c0f\u5b69\u5b50\u7684\u8138\u6bd4\u8f83\u5c0f\uff0c\u5efa\u8bae\u989d\u5934\u4f4d\u7f6e\u4e30\u6ee1\u4e00\u70b9","recommended":true,"count_up_vote":5,"count_vote":5,"is_regional_prestation":false,"recruitment_type":"pushed","firstname":"\u73cf","offer":"8315702","review_personal_data_id":"78A5EDE0-A4DE-2301-E759-B867DFE5F05E","title":"\u989d\u5934\u5c01\u95ed\u4e0d\u4e25","positive":"","negative":"","note":5,"purchase_store":{"name":"DECATHLON \u7ea2\u661f\u6d77\u5e97","id":935,"code":"931","code_tiers":7,"code_ss_tiers":931,"country":{"iso":"CN"}},"tester_review":false,"published_at":"2018-08-02T10:28:57+0200","author":{"id":6439301,"firstname":"\u73cf","updated_at":"2018-02-26T08:53:59+01:00"},"reasons":[],"country_label":{"CN":"\u4e2d\u56fd"},"url_vote":"\/\/reviews.decathlon.com.cn\/zh_CN\/utility\/view\/cubeinstore\/6364593\/1?","fit":{"label":null,"id":null,"message":null},"width":{"label":null,"id":null,"message":null},"review_flag":{"label":"api.label.reviewFlag.checkedPurchase.title","description":"api.label.reviewFlag.checkedPurchase.description"}}]}})
    return instance.get(url)
  },

  getPrice(ean, storeId, lang, country) {
    let lang_ = lang == "ZH" ? "zh" : "en";
    let url = `price/ean/${ean}/store_id/${storeId}/lang/${lang_}/country/${country}`;

    // return Promise.resolve({data:{"currency":"TWD","items":{"272640":{"sale_price":"859.00","strikeout_price":"999.00"},"2046935":{"sale_price":"859.00","strikeout_price":"999.00"},"272636":{"sale_price":"859.00","strikeout_price":"999.00"},"2046934":{"sale_price":"859.00","strikeout_price":"999.00"},"328449":{"sale_price":"859.00","strikeout_price":"999.00"},"2046933":{"sale_price":"859.00","strikeout_price":"999.00"}},"models":{"8304667":{"price":"859.00"},"8304664":{"price":"859.00"},"8315702":{"price":"859.00"}}}})
    return instance.get(url)
  },

  getQrcode(modelCode, country) {
    let url = `qrcode/model_code/${modelCode}/country/${country}`;
     // return Promise.resolve()
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
