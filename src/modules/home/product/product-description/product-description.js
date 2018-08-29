import ProductConfig from '../product.config.js'
import { ScrollNav, ScrollNavPanel } from "@/components/scrollNav"
import Popup from "@/components/popup/Popup.vue"
import Rate from "@/components/rate/Rate.vue"
import VueBetterScroll from "@/components/vue-better-scroll/VueBetterScroll.vue"
import BetterScroll from "better-scroll"

import ProductApi from "@/api/modules/product/productInfo.js"
import TimeUtil from "@/utils/datetime-utils.js"

const this.$props.storeId = +localStorage.getItem("store-id");

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
    itemCode: {
      type: String
    },
    itemName: {
      type: String
    },
    storeId: {
      type: Number
    }
  },
  components: { ScrollNav, ScrollNavPanel, Rate, Popup, VueBetterScroll },
  data() {
    return {
      labels: ProductConfig.pageInfoLabel,
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
      reviweScrollInstance:null
    };
  },
  watch: {
    modelCode: {
      handler(val) {
        if (val) {
          this.onModelCode();
        }
      }
    },
    productReviews:{
      handler(newV,oldV) {
        if (newV) {
          console.log("new review data")
          if(this.reviweScrollInstance){
            console.log("refresh review")
            this.reviweScrollInstance.refresh();
          }

        }
      },
      deep:true      
    }
  },
  mounted() {
    this.$nextTick(() => {

      if (this.defaultLang != 'EN') {
        //"ZH"
        localStorage.setItem("lang", this.defaultLang);
      }

    })
  },
  created() {
    let vm = this;
    // console.log();
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
    let DOMLoadTimer = setTimeout(() => {
      //get element for tracking
      let doc = document;
      this.fieldELeQueried.DesignFor = doc.querySelector("#DesignFor");
      this.fieldELeQueried.ProductBenefit = doc.querySelector("#ProductBenefit");
      this.fieldELeQueried.UserReviews = doc.querySelector("#UserReviews");
      this.fieldELeQueried.ProdConceptTech = doc.querySelector("#ProdConceptTech");
      this.fieldELeQueried.TechInfo = doc.querySelector("#TechInfo");    

      clearTimeout(DOMLoadTimer)

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
    // activeNavIndexChanged(args) {
    //   this.activeNavIndex = args;
    //   this.containerTitle = this.navTabList_[args].label[this.lang];
    // },
    activeIndexChange(args){
      this.activeNavIndex = args;
      this.containerTitle = this.navTabList_[args].label[this.lang];
    },
    chooseLang(lang) {
      if (this.lang == lang || this.disableZHbtn) return;

      if (lang == "ZH" && this.defaultLang == "ZH") {

        let rfid_storeId = this.$router.currentRoute.params.rfid +"_" + localStorage.getItem("store-id"),
            infoStatusStr = localStorage.getItem(rfid_storeId);
        
        //send request before by this rfid_storeId
        if(infoStatusStr){
          if(infoStatusStr == "READY"){
            this.$emit('change-product-info');
          }else if(infoStatusStr == "NOT_READY"){
            this.showModal = true;
            this.disableZHbtn = true;
          }

        }else{
          //never send request before by this rfid_storeId
          ProductApi.getProductInfo(this.$route.params.rfid, "ZH", "tw").then(res => {

            localStorage.setItem("lang", lang);
            localStorage.setItem(rfid_storeId, "READY");
            this.$emit('change-product-info', res.data);
            
          }, err => {

            localStorage.setItem(rfid_storeId, "NOT_READY");
            this.showModal = true;
            this.disableZHbtn = true;
          })
          
        }
      

        return;

      } else {

        localStorage.setItem("lang", lang);
        this.$emit('change-product-info');

      }
    },
    //tracking on navscroll tab
    navMonitorClick(event) {
      event = event || window.event;
      let target = event.target,
        field,
        fieldEle = this.fieldELeQueried;
      if (target == fieldEle.DesignFor) field = "DesignFor";
      if (target == fieldEle.ProductBenefit) field = "ProductBenefit";
      if (target == fieldEle.UserReviews) field = "UserReviews";
      if (target == fieldEle.ProdConceptTech) field = "ProdConceptTech";
      if (target == fieldEle.TechInfo) field = "TechInfo";

      let data = {
        item_code: this.$props.itemCode,
        item_name: this.$props.itemName,
        area: "ContentZone",
        field: field,
        event: 1,
        store_id: this.$props.storeId,
        stay_time: 0
      }

      ProductApi.postTracking(data).then(res => {
        // console.log(res.data);
      })
    },
    //tracking on pagiantion button
    paginationMonitorClick(event) {

      event = event || window.event;

      let doc = document;
      if (event.target == doc.querySelector("#iconDown") || event.target == doc.querySelector("#iconUp")) {
        let data = {
          item_code: this.$props.itemCode,
          item_name: this.$props.itemName,
          area: "ConversionZone",
          field: "Moreviews",
          event: 1,
          store_id: this.$props.storeId,
          stay_time: 0
        }

        ProductApi.postTracking(data).then(res => {
          // console.log(res.data);
        })
      }
    },
     //tracking on photo carousel
    carouselMonitorMousedown() {
      if (!this.monitorMousemove.carouselClicked) {
        this.monitorMousemove.carouselClicked = true;
        this.monitorMousemove.carouselTime = Date.now();
      }
    },
    carouselMonitorMouseout() {
      if (this.monitorMousemove.carouselClicked) {
        this.monitorMousemove.carouselClicked = false;
        let stayTime = +((Date.now() - this.monitorMousemove.carouselTime) / 1000).toFixed(2);

        let data = {
          item_code: this.$props.itemCode,
          item_name: this.$props.itemName,
          area: "ConversionZone",
          field: "MainPicBlock",
          event: 2,
          store_id: this.$props.storeId,
          stay_time: stayTime
        }

        // console.log("carousel mouse out", data)
        ProductApi.postTracking(data).then(res => {
          // console.log(res.data);
        })
        this.monitorMousemove.carouselTime = Date.now();

      }

    },    

  }
}
