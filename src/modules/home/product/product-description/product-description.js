import ProductConfig from '../product.config.js'
import { ScrollNav, ScrollNavPanel } from "@/components/scrollNav"
import Popup from "@/components/popup/Popup.vue"
import Rate from "@/components/rate/Rate.vue"
import VueBetterScroll from "@/components/vue-better-scroll/VueBetterScroll.vue"
import BetterScroll from "better-scroll"

import ProductApi from "@/api/modules/product/productInfo.js"

import TimeUtil from "@/utils/datetime-utils.js"
import TypeChecker from "@/utils/type-checker.js"


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
    itemCode:{
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
      itemCodeBySize:null,
      monitorMousemove: {
        isMouseMoving: false,
        scrollTarget: null,
        movingTime: 0,
      },      
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
    itemCode: {
      handler(newV, oldV) {
        this.itemCodeBySize = newV
      }
    }
  },
  mounted() {
    this.$nextTick(() => {

      if (this.defaultLang != 'EN') {
        //"ZH"
        localStorage.setItem("lang", this.defaultLang);
      }

      let doc = document;
      this.fieldELeQueried.scrollnavTab = doc.querySelector("#scrollnavTab");      

      //get navTab element Object
      this.fieldELeQueried.DesignFor = doc.querySelector("#DesignFor");
      this.fieldELeQueried.ProductBenefit = doc.querySelector("#ProductBenefit");
      this.fieldELeQueried.UserReviews = doc.querySelector("#UserReviews");
      this.fieldELeQueried.ProdConceptTech = doc.querySelector("#ProdConceptTech");
      this.fieldELeQueried.TechInfo = doc.querySelector("#TechInfo");

      //page count down tracking
      window.addEventListener("resize", this.monitorUserAction);

      //navTab click tracking
      if (this.fieldELeQueried.scrollnavTab) this.fieldELeQueried.scrollnavTab.addEventListener("click", this.navMonitorClick);

      //scroll content tracking
      let leaveEvent = this.isTouch ? "touchend" : "mouseleave",
          moveEvent = this.isTouch ? "touchmove" : "mousemove";

      this.fieldELeQueried.ScrollnavContent = doc.querySelector("#ScrollnavContent");
      console.log(this.fieldELeQueried.ScrollnavContent)

      if (this.fieldELeQueried.ScrollnavContent) {
        this.fieldELeQueried.ScrollnavContent.addEventListener(leaveEvent, this.scrollMonitorMouseleave);
        this.fieldELeQueried.ScrollnavContent.addEventListener(moveEvent, this.scrollMonitorMousemove);
        this.fieldELeQueried.ScrollnavContent.addEventListener("mousedown", this.clickScrollArea);
      } 

      let getScrollEleTimer = setTimeout(()=>{

        clearTimeout(getScrollEleTimer);

      },20)


    })
  },
  created() {
    let vm = this;
    this.itemCodeBySize = this.$props.itemCode;

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
        id: d.id,
        cellId: d.cellId
      })
    })

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

    if (this.defaultLang != 'EN') {
      localStorage.setItem("lang", this.defaultLang);
    }


    let leaveEvent = this.isTouch ? "touchend" : "mouseleave",
      moveEvent = this.isTouch ? "touchmove" : "mousemove";

    if (this.fieldELeQueried.scrollnavTab) this.fieldELeQueried.scrollnavTab.removeEventListener("click", this.navMonitorClick);

    if (this.fieldELeQueried.ScrollnavContent) {
      this.fieldELeQueried.ScrollnavContent.removeEventListener(leaveEvent, this.scrollMonitorMouseleave);
      this.fieldELeQueried.ScrollnavContent.removeEventListener(moveEvent, this.scrollMonitorMousemove);
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
    activeIndexChange(args) {
      this.activeNavIndex = args;
      this.containerTitle = this.navTabList_[args].label[this.lang];
    },
    chooseLang(lang) {
      if (this.lang == lang || this.disableZHbtn) return;

      if (lang == "ZH" && this.defaultLang == "ZH") {

        let rfid_storeId = this.$router.currentRoute.params.rfid + "_" + localStorage.getItem("store-id"),
          infoStatusStr = localStorage.getItem(rfid_storeId);

        //send request before by this rfid_storeId
        if (infoStatusStr) {
          if (infoStatusStr == "READY") {
            this.$emit('change-product-info');
          } else if (infoStatusStr == "NOT_READY") {
            this.showModal = true;
            this.disableZHbtn = true;
          }

        } else {
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
    scrollMonitorMouseleave(event) {
      if (this.monitorMousemove.isMouseMoving) {

        let stayTime = +((Date.now() - this.monitorMousemove.movingTime) / 1000).toFixed(2);
        let data = {
          item_code: this.itemCodeBySize,
          item_name: this.productInfoDataDatBase.WebLabel,
          area: "ContentZone",
          field: this.monitorMousemove.scrollTarget,
          event: 2,
          store_id: this.$props.storeId,
          stay_time: stayTime
        }
        // console.log(data)
        ProductApi.postTracking(data)
        // console.log("fetch leave",this.monitorMousemove.scrollTarget)
        this.monitorMousemove.movingTime = 0;
        this.monitorMousemove.scrollTarget = null;
        this.monitorMousemove.isMouseMoving = false;
      }
    },
    // start timer when user click the scroll field
    clickScrollArea(){

      if (!this.monitorMousemove.isMouseMoving) {
        this.monitorMousemove.movingTime = Date.now();
        this.monitorMousemove.isMouseMoving = true;
        this.monitorMousemove.scrollTarget = this.getTargetField(event);
      }      
      // console.log(this.monitorMousemove.scrollTarget)
    },
    scrollMonitorMousemove(event) {

      if(this.monitorMousemove.isMouseMoving){

        event = event || window.event;

        let target = this.getTargetField(event);

        //field is changed
        if (this.monitorMousemove.scrollTarget && this.monitorMousemove.scrollTarget != target) {
          
          let stayTime = +((Date.now() - this.monitorMousemove.movingTime) / 1000).toFixed(2);
          
          let data = {
            event: 2,
            area: "ContentZone",
            stay_time: stayTime,
            item_code: this.itemCodeBySize,
            item_name: this.productInfoDataDatBase.WebLabel,
            field: this.monitorMousemove.scrollTarget,
            store_id: this.$props.storeId,
          }

          ProductApi.postTracking(data)
          // console.log("fetch move:",this.monitorMousemove.scrollTarget)

          //restart timer when the field changed
          this.monitorMousemove.movingTime = Date.now();
        }
        //the newest field
        this.monitorMousemove.scrollTarget = target;

      }
   
    },
    getTargetField(event){
      let target = null,
          eventTarget = event.target,
          elementArr = [
            {
              element:this.$refs.DesignForBlock,
              targetName:"DesignForBlock"
            },{
              element:this.$refs.ProdBenefitBlock,
              targetName:"ProdBenefitBlock"
            },{
              element:this.$refs.UserReviewsBlock,
              targetName:"UserReviewsBlock"
            },{
              element:this.$refs.TechInfoBlock,
              targetName:"TechInfoBlock"
            },{
              element:this.$refs.ConceptTechBlock,
              targetName:"ConceptTechBlock"
            }
          ];

      elementArr.every(ele=>{
        let bTarget = getElementTarget(ele.element,eventTarget);
        if(bTarget){
          target = ele.targetName
          return false;
        }else{
          return true;
        }
      })
      function getElementTarget(ele,eventTarget){
        if (ele) {
          if (TypeChecker.isArray(ele)) {
            if (ele[0] && ele[0].contains(eventTarget)) return true;
          } else {
            if (ele.contains(eventTarget)) return true;
          }
        }
        return false;
      }  

      return target;      
    },
    navMonitorClick(event) {
      // debugger
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
        item_code: this.itemCodeBySize,
        item_name: this.productInfoDataDatBase.WebLabel,
        area: "ContentZone",
        field: field,
        event: 1,
        store_id: this.$props.storeId,
        stay_time: 0
      }
      ProductApi.postTracking(data)
    }
  }
}

