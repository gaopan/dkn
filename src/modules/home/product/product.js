import TokenService from '@/services/token-services.js'
import CommonUtils from '@/utils/common-utils.js'

import ElementLoading from '@/components/loader/loader.vue'

import ProductDetails from './product-details/ProductDetails.vue'
import ProductDescription from './product-description/ProductDescription.vue'

import ProductApi from "@/api/modules/product/productInfo.js"
import ProductConfig from './product.config.js'

import TimeUtil from "@/utils/datetime-utils.js"
import TypeChecker from "@/utils/type-checker.js"

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
      storeId: TokenService.getStoreId(),

      showLoader: false,
      monitorCount:0,
      intervalTimer:null,
      defaultLang:null,
      AllLangDataBase:{
        ZH:Object.assign({},dataProto),
        EN:Object.assign({},dataProto),
        MY:Object.assign({},dataProto),
      },

      isTouch: /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
    };
  },
  created() {
    this.init("createVue");

    //remove rfid_storeId In Storage tp prevent Cache
    let rfid_storeId = this.$router.currentRoute.params.rfid + "_" + this.storeId;
    let rfid_storeIdInStorage = localStorage.getItem(this.$router.currentRoute.params.rfid + "_" + this.storeId);      
    
    if(rfid_storeIdInStorage){
      localStorage.removeItem(rfid_storeId);      
    }

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
      this.monitorCount = 0;
      this.init("scanRfid");
    }
  },
  methods: {
    init(behavior) {
      let vm = this;
      this.rfid = this.$router.currentRoute.params.rfid;
      if(behavior == "scanRfid"|| behavior == "createVue")this.initLanguage();

      initProperties.call(this, this.lang, behavior);
      initPageData.call(this, this.lang, behavior);

      //start timecount when productInfo api loaded
      // initTimeChecker(this);

      function initProperties(lang,behavior) {
        //clear all data when user scan new QR code
        if(behavior == "scanRfid"||behavior == "createVue"){

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

      }

      function initPageData(lang,behavior) {
        this.showLoader = true;
        if(!this.AllLangDataBase[lang].productInfo || behavior == "scanRfid" || behavior == "createVue"){

          if(this.intervalTimer)clearInterval(this.intervalTimer);  

          var productInfoPromise = ProductApi.getProductInfo(this.rfid, this.lang, this.country).then(res => {
            this.showLoader = false;
            this.AllLangDataBase[lang].productInfo = res.data;

            initTimeChecker(this);

          }, err => {

            this.AllLangDataBase[lang].noProductInfo = true;
            this.$router.push('/error');

          })

        }else{
          this.showLoader = false;
        }

        if(!this.AllLangDataBase[lang].userReviewInfo || behavior == "scanRfid" || behavior == "createVue"){
          var userReviewPromise = ProductApi.getUserReview(this.rfid, this.lang, this.country).then(res => {
            // console.log("fetch userReviewInfo")
            this.AllLangDataBase[lang].userReviewInfo = res.data;
          }, err => {
            this.AllLangDataBase[lang].noUserReviewInfo = true;
          })        
        }

        if(!this.AllLangDataBase[lang].stockInfo || behavior == "scanRfid" || behavior == "createVue"){
          var stockPromise = ProductApi.getStock(this.rfid, this.storeId, this.lang, this.country).then(res => {
            this.AllLangDataBase[lang].stockInfo = res.data;
          }, err => {
            this.AllLangDataBase[lang].noStockInfo = true;
          })
          
        }

        if(!this.AllLangDataBase[lang].priceInfo || behavior == "scanRfid" || behavior == "createVue"){
          // if(this.rfid == 3608459609668) this.country = "country";
          var pricePromise = ProductApi.getPrice(this.rfid, this.storeId, this.lang, this.country).then(res => {
            this.AllLangDataBase[lang].priceInfo = res.data;
            this.AllLangDataBase[lang].noPriceInfo = false;
          }, err => {
            this.AllLangDataBase[lang].noPriceInfo = true;
          })
        }
      }

      function initTimeChecker(context) {
        if (context.intervalTimer) {
          clearInterval(context.intervalTimer);
          context.intervalTimer = null;
        }

        context.monitorCount = 0;

        context.intervalTimer = setInterval(function() {
          if (context.monitorCount === 1 * 60 - 1) {
            clearInterval(context.intervalTimer);
            context.$router.push("/index")
          } else {
            context.monitorCount += 1;
            // console.log(context.monitorCount)
          }
        }, 1000);
      }
    },
    initLanguage() {
      this.defaultLang = TokenService.getLang();

      if (this.defaultLang == 'EN') {
        this.lang = "MY";
      } else {
        this.lang = "ZH";
      }
      this.country = this.defaultLang == "ZH" ? "tw" : "my";
    },
    changedModel(args) {
      this.AllLangDataBase[this.lang].modelCode = args;
    },
    changeItem(args){
      this.AllLangDataBase[this.lang].itemCode = args;
    },
    monitorUserAction(event) {
      this.monitorCount = 0;
    },
    changeProductInfo(args) {
      this.lang = args.lang;
      this.init("changeLang");
    }
  },
  beforeDestroy() {
    // debugger
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
