import TokenService from '@/services/token-services.js'
import CommonUtils from '@/utils/common-utils.js'

import ElementLoading from '@/components/loader/loader.vue'

import ProductDetails from './product-details/ProductDetails.vue'
import ProductDescription from './product-description/ProductDescription.vue'

import ProductApi from "@/api/modules/product/productInfo.js"
import ProductConfig from './product.config.js'

import TimeUtil from "@/utils/datetime-utils.js"
import TypeChecker from "@/utils/type-checker.js"

const STOREID = TokenService.getStoreId();
console.log(STOREID)
export default {
  name: 'product',
  data(){

    let dataProto = {
     
      productInfo: null,
      noProductInfo: false,
      userReviewInfo: null,
      noUserReviewInfo: false,
      stockInfo: null,
      noStockInfo: false,
      priceInfo: null,
      noPriceInfo: false,
      modelCode: null,
      itemCode:null,      
    }
    return {
      lang: "",
      storeId: STOREID,
      showLoader: false,
      monitorCount:0,
      intervalTimer:null,
      defaultLang:null,
      AllLangDataBase:{
        ZH:Object.assign({},dataProto),
        EN:Object.assign({},dataProto),
        MY:Object.assign({},dataProto),
      },
      dataLoaded:{
        ZH:false,
        EN:false,
        MY:false,
      },
      isTouch: /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
    };
  },
  created() {
    this.init("createVue");
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.monitorUserAction)

      if (this.isTouch) {
        this.$refs.container.addEventListener("touchmove", this.monitorUserAction)
        this.$refs.container.addEventListener("click", this.monitorUserAction)
      } else {
        this.$refs.container.addEventListener("mousemove", this.monitorUserAction)
        this.$refs.container.addEventListener("click", this.monitorUserAction)
        this.$refs.container.addEventListener("wheel", this.monitorUserAction)
      }
    })
  },
  components: { ElementLoading, ProductDetails, ProductDescription },
  watch: {
    '$route.params.rfid': function() {
      this.init("scanRfid");
    }
  },
  methods: {
    init(behavior) {
      let vm = this;
      // console.log(this)
      this.rfid = this.$router.currentRoute.params.rfid;
      if(behavior == "scanRfid"|| behavior == "createVue")this.initLanguage();

      initProperties.call(this, this.lang);
      initPageData.call(this, this.lang);
      initTimeChecker.call(this);

      function initProperties(lang,behavior) {
        //clear all data when user scan new QR code
        if(behavior == "scanRfid"){

          let dataProto = {
            productInfo: null,
            noProductInfo: false,
            userReviewInfo: null,
            noUserReviewInfo: false,
            stockInfo: null,
            noStockInfo: false,
            priceInfo: null,
            noPriceInfo: false,
            modelCode: null,
            itemCode:null     
          }   

          this.AllLangDataBase = {
            ZH:Object.assign({},dataProto),
            EN:Object.assign({},dataProto),
            MY:Object.assign({},dataProto)
          } 

        }

        // if(behavior == "changeLang"){
        //   if(this.AllLangDataBase[lang].productInfo)
        //   this.AllLangDataBase[lang].modelCode = null;
        //   this.AllLangDataBase[lang].itemCode = null;
        //   this.AllLangDataBase[lang].productInfo = null;
        //   this.AllLangDataBase[lang].noProductInfo = false;
        //   this.AllLangDataBase[lang].userReviewInfo = null;
        //   this.AllLangDataBase[lang].noUserReviewInfo = false;
        //   this.AllLangDataBase[lang].stockInfo = null;
        //   this.AllLangDataBase[lang].noStockInfo = false;
        //   this.AllLangDataBase[lang].priceInfo = null;
        //   this.AllLangDataBase[lang].noPriceInfo = false;
        // }
      }

      function initPageData(lang) {
        this.showLoader = true;
        if(!this.AllLangDataBase[lang].productInfo){
          var productInfoPromise = ProductApi.getProductInfo(this.rfid, this.lang, this.country).then(res => {
            console.log(res.data)
            this.showLoader = false;
            this.AllLangDataBase[lang].productInfo = res.data;
          }, err => {
            this.AllLangDataBase[lang].noProductInfo = true;
            this.$router.push('/error');
          })
        }else{
          this.showLoader = false;
        }

        if(!this.AllLangDataBase[lang].userReviewInfo){
          var userReviewPromise = ProductApi.getUserReview(this.rfid, this.lang, this.country).then(res => {
            this.AllLangDataBase[lang].userReviewInfo = res.data;
          }, err => {
            this.AllLangDataBase[lang].noUserReviewInfo = true;
          })        
        }

        if(!this.AllLangDataBase[lang].stockInfo){
          var stockPromise = ProductApi.getStock(this.rfid, this.storeId, this.lang, this.country).then(res => {
            this.AllLangDataBase[lang].stockInfo = res.data;
          }, err => {
            this.AllLangDataBase[lang].noStockInfo = true;
          })
          
        }

        if(!this.AllLangDataBase[lang].priceInfo){
          var pricePromise = ProductApi.getPrice(this.rfid, this.storeId, this.lang, this.country).then(res => {
            this.AllLangDataBase[lang].priceInfo = res.data;
            this.AllLangDataBase[lang].noPriceInfo = false;
          }, err => {
            this.AllLangDataBase[lang].noPriceInfo = true;
          })
        }
      }

      function initTimeChecker() {
        if (this.intervalTimer) {
          clearInterval(this.intervalTimer);
          this.intervalTimer = null;
        }
        this.intervalTimer = setInterval(function() {
          if (vm.monitorCount === 3 * 60 - 1) {
            clearInterval(vm.intervalTimer);
            vm.$router.push("/index")
          } else {
            vm.monitorCount += 1;
          }
        }, 1000);
      }
    },
    initLanguage() {
      this.defaultLang = TokenService.getLang();
      if (this.defaultLang == 'EN') {
        this.lang = "MY";
      } else {
        let langInLocal = localStorage.getItem("lang");
        this.lang = !!langInLocal ? langInLocal : this.defaultLang;
      }
      this.country = this.defaultLang == "ZH" ? "tw" : "my";
    },
    changedModel(args) {
      this.AllLangDataBase[this.lang].modelCode = args;
    },
    changeItem(args){
      console.log("changeItem in product",args)
      this.AllLangDataBase[this.lang].itemCode = args;
    },
    monitorUserAction(event) {
      event = event || window.event;
      this.monitorCount = 0;
    },
    changeProductInfo(args) {
      this.lang = args.lang;
      this.init("changeLang");
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.monitorUserAction)

    if (this.isTouch) {
      this.$refs.container.removeEventListener("touchmove", this.monitorUserAction)
      this.$refs.container.removeEventListener("click", this.monitorUserAction)
    } else {
      this.$refs.container.removeEventListener("mousemove", this.monitorUserAction)
      this.$refs.container.removeEventListener("click", this.monitorUserAction)
      this.$refs.container.removeEventListener("wheel", this.monitorUserAction)
    }
    clearInterval(this.intervalTimer);
  }
}
