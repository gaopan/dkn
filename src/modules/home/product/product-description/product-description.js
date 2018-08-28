import ProductConfig from '../product.config.js'
import { ScrollNav, ScrollNavPanel } from "@/components/scrollNav"
import Popup from "@/components/popup/Popup.vue"
import Rate from "@/components/rate/Rate.vue"

import ProductApi from "@/api/modules/product/productInfo.js"

export default {
  name: "product-description",
  props: {
    productInfo: {
      type: Object,
      required: true
    },
    userReviewInfo: {
      type: Object,
      required: true
    },
    modelCode: {
      type: String
    },
    lang: {
      type: String
    },
    defaultLang: {
      type: String
    },
    country: {
      type: String
    },
    storeId: {
      type: Number
    }
  },
  components: { ScrollNav, ScrollNavPanel, Rate, Popup },
  data() {
    return {
      labels: ProductConfig.pageInfoLabel,
      productInfoDataDatBase: {},
      productInfoDataDatBase: {},
      navTabList: ProductConfig.navTabList,
      navTabList_: [],
      activeNavIndex: 0,
      productReviews: [],
      productScore: 0,
      bDescriptionDataLoaded: false,
      disableZHbtn: false,
      containerTitle: null,
      showModal: false,
      fieldELeQueried: {},
    };
  },
  watch: {
    modelCode: {
      handler(val) {
        if (val) {
          this.onModelCode();
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      let doc = document;
      let leaveEvent = this.isTouch ? "touchend" : "mouseleave",
        downEvent = this.isTouch ? "touchstart" : "mousedown",
        wheelEvent = this.isTouch ? "touchmove" : "wheel";

      this.fieldELeQueried.carouselPagination = doc.querySelector("#carouselPagination");
      this.fieldELeQueried.scrollnavTab = doc.querySelector("#scrollnavTab");

      this.fieldELeQueried.CarouselWrapper = doc.querySelector("#CarouselWrapper");
      this.fieldELeQueried.ScrollnavContent = doc.querySelector("#ScrollnavContent");

      if (this.fieldELeQueried.carouselPagination) this.fieldELeQueried.carouselPagination.addEventListener("click", this.paginationMonitorClick);
      if (this.fieldELeQueried.scrollnavTab) this.fieldELeQueried.scrollnavTab.addEventListener("click", this.navMonitorClick);

      if (this.fieldELeQueried.CarouselWrapper) {
        this.fieldELeQueried.CarouselWrapper.addEventListener(leaveEvent, this.carouselMonitorMouseout);
        this.fieldELeQueried.CarouselWrapper.addEventListener(downEvent, this.carouselMonitorMousedown);
      }

      if (this.fieldELeQueried.ScrollnavContent) {
        this.fieldELeQueried.ScrollnavContent.addEventListener(leaveEvent, this.scrollMonitorMouseleave);
        this.fieldELeQueried.ScrollnavContent.addEventListener(wheelEvent, this.scrollMonitorMousewheel);
      }

      if (this.defaultLang != 'EN') {
        //"ZH"
        localStorage.setItem("lang", this.defaultLang);
      }

    })
  },
  created() {
    let vm = this;
    if (this.productInfo.dsm) this.productInfoDataDatBase = this.productInfo.dsm;
    if (this.productInfo.models) this.productModelsDatBase = this.productInfo.models;
    this.bDescriptionDataLoaded = true;

    //show or hide the tab  
    checkNavPanelDisplay.call(this, this.productInfoDataDatBase)

    //get product description list
    this.navTabList_ = [];
    this.navTabList.forEach(d => {
      if (d.show) this.navTabList_.push({
        label: d.label,
        id: d.id
      })
    })
    setTimeout(() => {
      //get element for tracking
      let doc = document;
      this.fieldELeQueried.DesignFor = doc.querySelector("#DesignFor");
      this.fieldELeQueried.ProductBenefit = doc.querySelector("#ProductBenefit");
      this.fieldELeQueried.UserReviews = doc.querySelector("#UserReviews");
      this.fieldELeQueried.ProdConceptTech = doc.querySelector("#ProdConceptTech");
      this.fieldELeQueried.TechInfo = doc.querySelector("#TechInfo");
    }, 15)

    // this.activeNavIndex = 0;
    this.containerTitle = this.navTabList_[0].label[this.lang];

    function checkNavPanelDisplay(productInfoData) {
      let bTechInfo = !!(productInfoData.Functionalities && productInfoData.Functionalities.length),

        bProductConcept = !!productInfoData.MaintenanceAdv ||
        !!productInfoData.StorageAdv ||
        !!productInfoData.UsageRestriction,

        bBenefits = !!(productInfoData.Benefits && productInfoData.Benefits.length),

        bDesignedFor = !!productInfoData.DesignedFor || !!productInfoData.Catchline;
      // bUserView = !!(reviewsDataBase&&reviewsDataBase.length); 

      showNavTab(bDesignedFor, "DesignFor")
      showNavTab(bBenefits, "ProductBenefit")
      showNavTab(bProductConcept, "ProdConceptTech")
      showNavTab(bTechInfo, "TechInfo")
    }

    function showNavTab(bShow, id) {
      vm.navTabList.every(d => {
        if (d.id == id) {
          d.show = bShow;
          return false;
        }
        return true;
      })
    }
  },
  beforeDestroy() {
    if (this.fieldELeQueried.carouselPagination) this.fieldELeQueried.carouselPagination.removeEventListener("click", this.paginationMonitorClick);
    if (this.fieldELeQueried.scrollnavTab) this.fieldELeQueried.scrollnavTab.removeEventListener("click", this.navMonitorClick);

    let leaveEvent = this.isTouch ? "touchend" : "mouseleave",
      downEvent = this.isTouch ? "touchstart" : "mousedown",
      wheelEvent = this.isTouch ? "touchmove" : "wheel";

    if (this.fieldELeQueried.CarouselWrapper) {
      this.fieldELeQueried.CarouselWrapper.removeEventListener(leaveEvent, this.carouselMonitorMouseout);
      this.fieldELeQueried.CarouselWrapper.removeEventListener(downEvent, this.carouselMonitorMousedown);
    }

    if (this.fieldELeQueried.ScrollnavContent) {
      this.fieldELeQueried.ScrollnavContent.removeEventListener(leaveEvent, this.scrollMonitorMouseleave);
      this.fieldELeQueried.ScrollnavContent.removeEventListener(wheelEvent, this.scrollMonitorMousewheel);
    }

    if (this.defaultLang != 'EN') {
      localStorage.setItem("lang", this.defaultLang);
    }
  },
  computed: {
    noProductDescription() {
      return this.navTabList_.length == 1;
    }
  },
  methods: {
    onModelCode() {
      let reviewData = this.userReviewInfo[this.modelCode];
      let obj = makeUserReviewData(reviewData);
      this.productReviews = obj.productReviews;
      this.productScore = obj.productScore;

      function makeUserReviewData(_reviewData) {
        let score = 0,
          productScore = 0;
        if (_reviewData && !!_reviewData.length) {
          _reviewData.forEach(d => {
            d.published_at = TimeUtil.getFullDate(new Date(d.published_at), 'yyyy-MM-dd')
            score += ~~d.note
          })
          productScore = +((score / _reviewData.length).toFixed(2));
          return {
            productReviews: _reviewData,
            productScore: productScore
          }
        } else {
          return {
            productReviews: [],
            productScore: 0
          }
        }
      }
    },
    activeNavIndexChanged(args) {
      this.activeNavIndex = args;
      this.containerTitle = this.navTabList_[args].label[this.lang];
    },
    chooseLang(lang) {
      if (this.lang == lang || this.disableZHbtn) return;

      if (lang == "ZH" && this.defaultLang == "ZH") {
        ProductApi.getProductInfo(this.$route.params.rfid, "ZH", "tw").then(res => {
          localStorage.setItem("lang", lang);
          this.$emit('change-product-info', res.data);
        }, err => {
          this.showModal = true;
          this.disableZHbtn = true;
        })
        return;
      } else {
        localStorage.setItem("lang", lang);
        this.$emit('change-product-info');
      }
    },
  }
}
