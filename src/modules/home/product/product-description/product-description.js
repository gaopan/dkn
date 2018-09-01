import ProductConfig from '../product.config.js'
import Popup from "@/components/popup/Popup.vue"

import ProductScroller from './product-scroller/ProductScroller.vue'

import ProductApi from "@/api/modules/product/productInfo.js"
import TokenService from '@/services/token-services.js'

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
    // country: {
    //   type: String
    // },
    storeId: {
      type: Number
    },
    rfid:String
  },
  components: { Popup, ProductScroller },
  data() {
    return {
      isTouch: /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent),
      labels: ProductConfig.pageInfoLabel,
      productInfoDataDatBase: {},
      navTabList: ProductConfig.navTabList,
      navTabList_: [],
      activeNavIndex: 0,
      productReviews: [],
      productScore: 0,
      disableZHbtn: false,
      containerTitle: null,
      showModal: false,
      fieldELeQueried: {},
      itemCodeBySize:null,
      monitorDescription: {
        isMouseMoving: false,
        scrollTarget: null,
        movingTime: 0,
        mobileTouchTarget:null,
        isMobileTouching: false,
        mobileMovingTime: 0,
      }, 
      dataForMouseMonitor:null,
      dataLoaded:{
        ZH:false,
        EN:false,
        MY:false,
      },
      rfid_storeId:null    
    };
  },
  watch: {
    rfid:{
      handler(val) {
        if (val) {
          localStorage.setItem(this.rfid_storeId,null);
          this.rfid_storeId = this.$router.currentRoute.params.rfid + "_" + TokenService.getStoreId();
        }
      }      
    },
    modelCode: {
      handler(val) {
        if (val) {
          this.onModelCode();
        }
      }
    },

    itemCode: {
      handler(newV, oldV) {
        if(newV){
          this.itemCodeBySize = newV;
          this.dataForMouseMonitor.item_code =newV;
        }
      }
    },

    productInfo:{
      handler(newV, oldV) {
        if (this.productInfo.dsm) this.productInfoDataDatBase = this.productInfo.dsm;
        if (this.productInfo.models) this.productModelsDatBase = this.productInfo.models;

        this.dataForMouseMonitor.item_name = this.productInfoDataDatBase.WebLabel;

        this.checkNavPanelDisplay(this.productInfoDataDatBase)

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
        this.containerTitle = this.navTabList_[this.activeNavIndex].label[this.lang];
      },
      deep:true      
    },

    defaultLang(newV, oldV){

      if (newV&&this.defaultLang != 'EN')localStorage.setItem("lang", this.defaultLang);     
    }
  },
  mounted() {
    this.$nextTick(() => {

      if (this.defaultLang != 'EN') {
        localStorage.setItem("lang", this.defaultLang);
      }

      let doc = document;
      this.fieldELeQueried.scrollnavTab = doc.querySelector(".product-scroller-nav");      
      this.fieldELeQueried.productContainer = doc.querySelector(".product-container");      
      this.fieldELeQueried.ScrollnavContent = doc.querySelector(".product-scroller");

      //get navTab element Object
      this.fieldELeQueried.DesignFor = doc.querySelector("#DesignFor");
      this.fieldELeQueried.ProductBenefit = doc.querySelector("#ProductBenefit");
      this.fieldELeQueried.UserReviews = doc.querySelector("#UserReviews");
      this.fieldELeQueried.ProdConceptTech = doc.querySelector("#ProdConceptTech");
      this.fieldELeQueried.TechInfo = doc.querySelector("#TechInfo");

      this.fieldELeQueried.DesignForBlock = doc.querySelector(".designed-for"); 
      this.fieldELeQueried.ProdBenefitBlock = doc.querySelector(".product-benefits");
      this.fieldELeQueried.UserReviewsBlock = doc.querySelector(".product-scorce");
      this.fieldELeQueried.TechInfoBlock = doc.querySelector(".product-tech");
      this.fieldELeQueried.ConceptTechBlock = doc.querySelector(".tech-information");
      //page count down tracking
      window.addEventListener("resize", this.monitorUserAction);

      //navTab click tracking
      if (this.fieldELeQueried.scrollnavTab) this.fieldELeQueried.scrollnavTab.addEventListener("click", this.navMonitorClick);

      //scroll content tracking
      if (this.fieldELeQueried.ScrollnavContent) {
        if(this.isTouch){
          this.fieldELeQueried.ScrollnavContent.addEventListener("touchstart", this.clickScrollArea);
          this.fieldELeQueried.productContainer.addEventListener("touchstart", this.clickProductContainer);
        }else{          
          this.fieldELeQueried.ScrollnavContent.addEventListener("mouseleave", this.scrollMonitorMouseleave);
          this.fieldELeQueried.ScrollnavContent.addEventListener("mousemove", this.scrollMonitorMousemove);
          this.fieldELeQueried.ScrollnavContent.addEventListener("mousedown", this.clickScrollArea);
        }
      } 

    })
  },
  created() {

    this.rfid_storeId = this.$router.currentRoute.params.rfid + "_" + TokenService.getStoreId();

    let vm = this;
    this.itemCodeBySize = this.$props.itemCode;
    this.dataLoaded[this.lang] = true;

    if (this.productInfo.dsm) this.productInfoDataDatBase = this.productInfo.dsm;
    if (this.productInfo.models) this.productModelsDatBase = this.productInfo.models;

    this.dataForMouseMonitor = {
      item_code: this.$props.itemCode,
      item_name: this.productInfoDataDatBase.WebLabel,
      area: "ContentZone",
      event: 2,
      store_id: this.$props.storeId,
    }

    //show or hide the tab  
    this.checkNavPanelDisplay(this.productInfoDataDatBase)

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

  },
  beforeDestroy() {

    if (this.defaultLang != 'EN') {
      localStorage.setItem("lang", this.defaultLang);
    }

    window.removeEventListener("resize", this.monitorUserAction);

    if (this.fieldELeQueried.scrollnavTab) this.fieldELeQueried.scrollnavTab.removeEventListener("click", this.navMonitorClick);

    if (this.fieldELeQueried.ScrollnavContent) {
      if(this.isTouch){
        this.fieldELeQueried.ScrollnavContent.removeEventListener("touchstart", this.clickScrollArea);
        this.fieldELeQueried.productContainer.removeEventListener("touchstart", this.clickProductContainer);
      }else{        
        this.fieldELeQueried.ScrollnavContent.removeEventListener("mouseleave", this.scrollMonitorMouseleave);
        this.fieldELeQueried.ScrollnavContent.removeEventListener("mousemove", this.scrollMonitorMousemove);
        this.fieldELeQueried.ScrollnavContent.removeEventListener("mousedown", this.clickScrollArea);
      }
    } 

  },
  computed: {
    noProductDescription() {
      return this.navTabList_.length == 1;
    }
  },
  methods: {

    checkNavPanelDisplay(productInfoData) {
      let vm = this;
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
    tabIndexUpdate(index){
      this.activeNavIndex = index;      
      this.containerTitle = this.navTabList_[index].label[this.lang];
    },
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

    chooseLang(lang) {
      // debugger
      if (this.lang == lang || this.disableZHbtn) return;

      if (lang == "ZH" && this.defaultLang == "ZH") {

        let infoStatusStr = localStorage.getItem(this.rfid_storeId);

        //send request before by this rfid_storeId
        if (infoStatusStr) { //deep_false
          if (infoStatusStr == "READY") {
            this.$emit('change-product-info',{ lang:lang,load:false });
          }else{
            this.showModal = true;
            this.disableZHbtn = true;
          }
        } else { //deep_true
          //never send request before by this rfid_storeId
          ProductApi.getProductInfo(this.$route.params.rfid, "ZH", "tw").then(res => {

            localStorage.setItem("lang", lang);
            localStorage.setItem(rfid_storeId, "READY");
            this.$emit('change-product-info',{ lang:lang,load:true,data:res.data });

          }, err => {

            localStorage.setItem(rfid_storeId, "NOT_READY");
            this.showModal = true;
            this.disableZHbtn = true;
          })
        }

        return;

      } else if(lang == "EN"){

        if(this.dataLoaded[lang]){
          this.$emit('change-product-info',{ lang:lang,load:false });
        }else{
          this.$emit('change-product-info',{ lang:lang,load:true });
        }        
        localStorage.setItem("lang", lang);
      }

      //mark: data by this language loaded
      this.dataLoaded[lang] = true

    },
    scrollMonitorMouseleave(event) {
      if (this.monitorDescription.isMouseMoving) {

        let stayTime = +((Date.now() - this.monitorDescription.movingTime) / 1000).toFixed(2);

        let data = Object.assign({},{ field:this.monitorDescription.scrollTarget,stay_time: stayTime}, this.dataForMouseMonitor)

        ProductApi.postTracking(data)
        // console.log("fetch leave",this.monitorDescription.scrollTarget,data)
        this.monitorDescription.movingTime = 0;
        this.monitorDescription.scrollTarget = null;
        this.monitorDescription.isMouseMoving = false;
      }
    },
    // start timer when user click the scroll field
    clickScrollArea(){

        if(this.isTouch){
          if (!this.monitorDescription.isMobileTouching) {
            this.monitorDescription.mobileMovingTime = Date.now();
            this.monitorDescription.isMobileTouching = true;
            this.monitorDescription.mobileTouchTarget = this.getTargetField(event);
          }
        }else{
          if (!this.monitorDescription.isMouseMoving) {
            this.monitorDescription.movingTime = Date.now();
            this.monitorDescription.isMouseMoving = true;
            this.monitorDescription.scrollTarget = this.getTargetField(event);
          }      
        }
      // console.log(this.monitorDescription.scrollTarget)
    },
    clickProductContainer(event){
      //start mintor the whole page after description area was touched
      if(this.fieldELeQueried.ScrollnavContent && this.monitorDescription.isMobileTouching){
        
        event = event || window.event;

        //other area (except description area) was touched
        if(!this.fieldELeQueried.ScrollnavContent.contains(event.target)||this.fieldELeQueried.scrollnavTab.contains(event.target)){
                    
          let stayTime = +((Date.now() - this.monitorDescription.mobileMovingTime) / 1000).toFixed(2);
          
          let data = Object.assign({},{ field:this.monitorDescription.mobileTouchTarget,stay_time: stayTime}, this.dataForMouseMonitor)

          ProductApi.postTracking(data)
          //end touching on description
          this.monitorDescription.isMobileTouching = false;
        }else{
          let newTarget = this.getTargetField(event);
          
          let stayTime = +((Date.now() - this.monitorDescription.mobileMovingTime) / 1000).toFixed(2);
          
          let data = Object.assign({},{ field:newTarget,stay_time: stayTime}, this.dataForMouseMonitor)

          ProductApi.postTracking(data);
          this.monitorDescription.mobileTouchTarget = newTarget
          this.monitorDescription.mobileMovingTime = Date.now();
        }
      }
      
    },
    scrollMonitorMousemove(event) {

      if(this.monitorDescription.isMouseMoving){

        event = event || window.event;

        let target = this.getTargetField(event);

        //field is changed
        if (this.monitorDescription.scrollTarget && this.monitorDescription.scrollTarget != target) {
          
          let stayTime = +((Date.now() - this.monitorDescription.movingTime) / 1000).toFixed(2);
          
          let data = Object.assign({},{ field:this.monitorDescription.scrollTarget,stay_time: stayTime}, this.dataForMouseMonitor)

          ProductApi.postTracking(data)
          // console.log("fetch move:",this.monitorDescription.scrollTarget,data)

          //restart timer when the field changed
          this.monitorDescription.movingTime = Date.now();
        }
        //the newest field
        this.monitorDescription.scrollTarget = target;

      }
   
    },
    getTargetField(event){
      let target = null,
          eventTarget = event.target,
          elementArr = [
            {
              element:this.fieldELeQueried.DesignForBlock,
              targetName:"DesignForBlock"
            },{
              element:this.fieldELeQueried.ProdBenefitBlock,
              targetName:"ProdBenefitBlock"
            },{
              element:this.fieldELeQueried.UserReviewsBlock,
              targetName:"UserReviewsBlock"
            },{
              element:this.fieldELeQueried.TechInfoBlock,
              targetName:"TechInfoBlock"
            },{
              element:this.fieldELeQueried.ConceptTechBlock,
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
        item_code: this.$props.itemCode,
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

