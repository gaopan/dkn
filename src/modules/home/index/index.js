import StoreService from '@/services/store-services.js'

export default {
  name: "product-index",
  data() {
    return {
      bRedirection: false,
      bMoveIcon: false,
      intervalTimer: null,
      lang: null,
      indexLabel:{
        levelOne:{ZH:"想了解更多商品資訊 ?",EN:"More Information"},
        levelTwo:{ZH:"掃描商品 , 立即查詢",EN:"Scan the product now!"},
      }
    }
  },
  methods: {
    redirection() {

      this.bRedirection = true;
      let timer = setTimeout(() => {
        clearTimeout(timer);
        this.$router.push("/product/3608459664568")
      }, 510)
    }
  },
  created() {
    this.intervalTimer = setInterval(() => {
      this.bMoveIcon = !this.bMoveIcon;
    }, 1000);

    // console.log(StoreService.getLang());
    this.lang = StoreService.getLang();
  },
  beforeDestroy() {
    clearInterval(this.intervalTimer);
  }
}
