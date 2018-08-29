import StoreService from '@/services/store-services.js'
import CommonUtils from '@/utils/common-utils.js'

import ElementLoading from '@/components/loader/loader.vue'

import ProductDetails from './product-details/ProductDetails.vue'
import ProductDescription from './product-description/ProductDescription.vue'

import ProductApi from "@/api/modules/product/productInfo.js"
import ProductConfig from './product.config.js'

import TimeUtil from "@/utils/datetime-utils.js"
import TypeChecker from "@/utils/type-checker.js"

const STOREID = +localStorage.getItem("store-id");

export default {
  name: 'product',
  data() {
    return {
      lang: null,
      storeId: STOREID,
      monitorCount: 0,
      showLoader: false,
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
      isTouch: /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
    };
  },
  created() {
    this.init();
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
      this.init();
    }
  },
  methods: {
    init() {
      let vm = this;
      this.rfid = this.$router.currentRoute.params.rfid;

      initProperties.call(this);
      this.initLanguage();
      initPageData.call(this);
      initTimeChecker.call(this);

      function initProperties() {
        this.monitorCount = 0;
        this.showLoader = false;
        this.productInfo = null;
        this.noProductInfo = false;
        this.userReviewInfo = null;
        this.noUserReviewInfo = false;
        this.stockInfo = null;
        this.noStockInfo = false;
        this.priceInfo = null;
        this.noPriceInfo = false;
      }

      function initPageData() {
        this.showLoader = true;
        var productInfoPromise = ProductApi.getProductInfo(this.rfid, this.lang, this.country).then(res => {
          this.showLoader = false;
          this.productInfo = res.data;
        }, err => {
          this.noProductInfo = true;
          this.$router.push('/error');
        })

        var userReviewPromise = ProductApi.getUserReview(this.rfid, this.lang, this.country).then(res => {
          this.userReviewInfo = res.data;
        }, err => {
          this.noUserReviewInfo = true;
        })

        var stockPromise = ProductApi.getStock(this.rfid, this.storeId, this.lang, this.country).then(res => {
          this.stockInfo = res.data;
        }, err => {
          this.noStockInfo = true;
        })

        var pricePromise = ProductApi.getPrice(this.rfid, this.storeId, this.lang, this.country).then(res => {
          this.priceInfo = res.data;
          this.noPriceInfo = false;
        }, err => {
          this.noPriceInfo = true;
        })
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
      this.defaultLang = StoreService.getLang();
      if (this.defaultLang == 'EN') {
        this.lang = "MY";
      } else {
        let langInLocal = localStorage.getItem("lang");
        this.lang = !!langInLocal ? langInLocal : this.defaultLang;
      }
      this.country = this.defaultLang == "ZH" ? "tw" : "my";
    },
    changedModel(args) {
      this.modelCode = args;
    },
    changeItem(args){
      this.itemCode = args;
    },
    monitorUserAction(event) {
      event = event || window.event;
      this.monitorCount = 0;
    },
    changeProductInfo(args) {
      this.init();
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
