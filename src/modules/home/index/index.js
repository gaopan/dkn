import StoreService from '@/services/store-services.js'

export default {
  name: "product-index",
  data() {
    return {
      bRedirection: false,
      bMoveIcon: false,
      intervalTimer: null,
      lang: null
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

    console.log(StoreService.getLang());
    this.lang = StoreService.getLang();
  },
  beforeDestroy() {
    clearInterval(this.intervalTimer);
  }
}
