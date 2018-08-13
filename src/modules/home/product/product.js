/**

**/
import { Carousel, Slide } from "@/components/carousel"
import { ScrollNav, ScrollNavPanel } from "@/components/scrollNav"
import CustomSelect from "@/components/custom-select"
import Rate from "@/components/rate/Rate.vue"
import StoreService from '@/services/store-services.js'

import ProductApi from "@/api/modules/product/productInfo.js"

import TimeUtil from "@/utils/datetime-utils.js"
import TypeChecker from "@/utils/type-checker.js"

export default {
  name: 'product',
  props: {
    // rfid: {
    //  // required: true
    // }
  },
  data() {
    return {
      rfid: null,

      area: {
        to: null,
        from: null,
      },
			areaOfField:null,
			fieldRef:{},

			monitorCount:0,
			monitorTime:null,

      monitorMousemove:{
        carouselClicked:false,
        carouselTime:0,
        scrollNavMousewheel:false,
        scrollTarget:null,
        scrollNavTime:0,
      },

      
			lang: null,
			navigateToPhoto:1,
			imageUrl:[],
			navTabList: [
        {label:{EN:'DESIGNED FOR',ZH:"適合在"},id:"DesignFor"},
        {label: {EN:'PRODUCT BENEFITS',ZH:"產品優點"},id:"ProductBenefit"},
        {label: {EN:'USER REVIEWS',ZH:"使用者回饋"},id:"UserReviews"},
        {label: {EN:'TPRODUCT CONCEPT & TECHNOLOGY',ZH:"產品細節"},id:"ProdConceptTech"},
        {label: {EN:'TECHNICAL INFORMATION',ZH:"產品性能"},id:"TechInfo"},
      ],
      pageInfoLabel: {
        itemCode: { EN: "Item code", ZH: "貨號" },
        colorOption: { EN: "Color option", ZH: "顏色選項" },
        size: { EN: "Size", ZH: "尺寸" },
        inStock: { EN: "In Stock", ZH: "尚有庫存" },
        outOfStock: { EN: "Out of Stock", ZH: "無庫存" },
        QRCode: { EN: "Want to buy online?Click me!", ZH: "線上購買？點擊我！", },
        maintenanceAdv: { EN: "MAINTENANCE ADVICE", ZH: "保養建議" },
        storageAdv: { EN: "STORAGE ADVICE", ZH: "存放建議" },
        uesRes: { EN: "USE RESTRICTIONS", ZH: "使用限制" }
      },
      containerTitle: null,
      activeNavIndex: 0,

      productColors: [],
      productAllInfoByColor: [],
      productInfoByCurrentColor: {
        colorName: null,
        videosAndImages: [],
        sizeItems: [],
        sizeOptions: []
      },
      productInfoByCurrentSize: {
        // stock: 0,
        itemCode: "",
        price: {
          original: {
            int: "0",
            decimal: ".00"
          },
          discount: {
            int: "0",
            decimal: ".00"
          },
          off: 100
        }
      },

      productStock: 0,
      sizeSelected: { //value for display the label of sected size
        label: null,
        value: null
      },
      bShowShadow: false,
      bShowQRCode: false,

      productInfoData: {
        EN: {},
        ZH: {}
      },
      productModels: {
        EN: {},
        ZH: {}
      },
      productReviews: { //user reviews
        EN: [],
        ZH: []
      },
      productScore: {
        EN: 0,
        ZH: 0
      },
      QRCodeSrc: {
        EN: null,
        ZH: null
      },
      defaultIndex: {
        ZH: {
          defaultColorIndex: null,
          defaultSizeIndex: null,
        },
        EN: {
          defaultColorIndex: null,
          defaultSizeIndex: null
        },
        other: {
          defaultColorIndex: null,
          defaultSizeIndex: null
        }
      },
			defaultIndex:{
				ZH:{
					defaultColorIndex:null,
					defaultSizeIndex:null,
				},
				EN:{
					defaultColorIndex:null,
					defaultSizeIndex:null
				},
				other:{
					defaultColorIndex:null,
					defaultSizeIndex:null
				}
			},
      fieldELeQueried:{}      
    }
  },
  created() {
    this.rfid = this.$router.currentRoute.params.rfid;

    this.defaultLang = StoreService.getLang();

    if (this.defaultLang == 'EN') {
      this.lang = this.defaultLang;
    } else {
      let langInLocal = localStorage.getItem("lang");
      if (!!langInLocal) {
        this.lang = langInLocal;
      } else {
        this.lang = this.defaultLang;
      }
    }
    //the nav title on the right
    this.containerTitle = this.navTabList[0].label[this.lang];

    this.initPageData(this.lang);

  },

  mounted(){
    this.$nextTick(()=>{
      let doc = document;
      window.addEventListener("resize",this.monitorUserAction)


      this.$refs.WholePage.addEventListener("mousemove", this.monitorUserAction)
      this.$refs.WholePage.addEventListener("click", this.monitorUserAction)
      this.$refs.WholePage.addEventListener("mousewheel", this.monitorUserAction)
      
      doc.querySelector("#carouselPagination").addEventListener("click",this.paginationMonitorClick);
      doc.querySelector("#scrollnavTab").addEventListener("click",this.navMonitorClick);

      this.fieldELeQueried.DesignFor = doc.querySelector("#DesignFor");
      this.fieldELeQueried.ProductBenefit = doc.querySelector("#ProductBenefit");
      this.fieldELeQueried.UserReviews = doc.querySelector("#UserReviews");
      this.fieldELeQueried.ProdConceptTech = doc.querySelector("#ProdConceptTech");
      this.fieldELeQueried.TechInfo = doc.querySelector("#TechInfo");

      this.fieldELeQueried.CarouselWrapper = doc.querySelector("#CarouselWrapper");
      this.fieldELeQueried.ScrollnavContent = doc.querySelector("#ScrollnavContent");

      this.fieldELeQueried.CarouselWrapper.addEventListener("mousedown",this.carouselMonitorMousedown);
      this.fieldELeQueried.CarouselWrapper.addEventListener("mouseleave",this.carouselMonitorMouseout);

      this.fieldELeQueried.ScrollnavContent.addEventListener("mousewheel",this.scrollMonitorMousewheel);
      this.fieldELeQueried.ScrollnavContent.addEventListener("mouseleave",this.scrollMonitorMouseleave);
    })        
  },
  beforeDestroy() {
    let doc = document,
      navTabELe = doc.querySelector("#scrollnavTab"),
      pageELe = doc.querySelector("#carouselPagination");

    if (!!navTabELe) navTabELe.removeEventListener("click", this.navMonitorClick);
    if (!!pageELe) pageELe.removeEventListener("click", this.paginationMonitorClick);

    window.removeEventListener("resize", this.monitorUserAction)
    this.$refs.WholePage.removeEventListener("mousemove", this.monitorUserAction)
    this.$refs.WholePage.removeEventListener("click", this.monitorUserAction)
    this.$refs.WholePage.removeEventListener("mousewheel", this.monitorUserAction)

    this.fieldELeQueried.CarouselWrapper.removeEventListener("mousedown",this.carouselMonitorMousedown);
    this.fieldELeQueried.CarouselWrapper.removeEventListener("mouseleave",this.carouselMonitorMouseout);

    this.fieldELeQueried.ScrollnavContent.removeEventListener("mousewheel",this.scrollMonitorMousewheel);
    this.fieldELeQueried.ScrollnavContent.removeEventListener("mouseleave",this.scrollMonitorMouseleave);    
    clearInterval(this.intervalTimer);
  },
	methods:{
    carouselMonitorMousedown(){
      if(!this.monitorMousemove.carouselClicked){
        this.monitorMousemove.carouselClicked = true;
        this.monitorMousemove.carouselTime = Date.now();
      }
    },
    carouselMonitorMouseout(){
      if(this.monitorMousemove.carouselClicked){
        this.monitorMousemove.carouselClicked = false;
        let stayTime = +((Date.now() - this.monitorMousemove.carouselTime)/1000).toFixed(2);
        
        let data = {
          itemCode:this.productInfoByCurrentSize.itemCode,
          itemName:this.itemName,
          area: "ConversionZone",
          field: "MainPicBlock",
          event: 2,
          stay_time:stayTime
        } 

        console.log("carousel mouse out",data)
        ProductApi.postTracking(data).then(res=>{
          // console.log(res.data);
        }) 
        this.monitorMousemove.carouselTime = Date.now();        
        
      }

    },
		navMonitorClick(event){
			event = event || window.event;
			let target = event.target, 
					field,
					fieldEle = this.fieldELeQueried;
			if(target == fieldEle.DesignFor)field = "DesignFor";
			if(target == fieldEle.ProductBenefit)field = "ProductBenefit";
			if(target == fieldEle.UserReviews)field = "UserReviews";
			if(target == fieldEle.ProdConceptTech)field = "ProdConceptTech";
			if(target == fieldEle.TechInfo)field = "TechInfo";

			let data = {
				itemCode:this.productInfoByCurrentSize.itemCode,
				itemName:this.itemName,
				area: "ContentZone",
				field: field,
				event: 1,
			}		
			this.areaOfField = field;	

			ProductApi.postTracking(data).then(res=>{
				// console.log(res.data);
			})			
		},
		paginationMonitorClick(event){
			event = event || window.event;

			let doc = document;
			if(event.target == doc.querySelector("#iconDown") || event.target == doc.querySelector("#iconUp")){
				let data = {
					itemCode:this.productInfoByCurrentSize.itemCode,
					itemName:this.itemName,
					area: "ConversionZone",
					field: "Moreviews",
					event: 1,
				}		

				ProductApi.postTracking(data).then(res=>{
					// console.log(res.data);
				})
			}
		},

		monitorClick_Color_QR_Select(field){
			let data = {
				itemCode:this.productInfoByCurrentSize.itemCode,
				itemName:this.itemName,
				area: "ConversionZone",
				field: field,
				event: 1,
			}
			this.areaOfField = field;

			ProductApi.postTracking(data).then(res=>{
				// console.log(res.data);
			})				
		},
    scrollMonitorMousewheel(event){

      if(!this.monitorMousemove.scrollNavMousewheel){
        this.monitorMousemove.scrollNavTime = Date.now();        
      }

      this.monitorMousemove.scrollNavMousewheel = true;
      let target = null;
      if(this.$refs.DesignForBlock[0].contains(event.target)){
        target = "DesignForBlock";
      }
      if(this.$refs.ProdBenefitBlock[0].contains(event.target)){
        target = "ProdBenefitBlock";
      }
       if(this.$refs.UserReviewsBlock[0].contains(event.target)){
        target = "UserReviewsBlock";
      }
      if(this.$refs.TechInfoBlock[0].contains(event.target)){
        target = "TechInfoBlock";
      }
      if(this.$refs.ConceptTechBlock[0].contains(event.target)){
        target = "ConceptTechBlock";
      }
      if(this.monitorMousemove.scrollTarget&&this.monitorMousemove.scrollTarget != target){
        // debugger
        console.log(target);
        let stayTime = +((Date.now() - this.monitorMousemove.scrollNavTime)/1000).toFixed(2);
        let data = {
          itemCode:this.productInfoByCurrentSize.itemCode,
          itemName:this.itemName,
          area: "ContentZone",
          field: this.monitorMousemove.scrollTarget,
          event: 2,
          stay_time:stayTime
        }  
        console.log(data)
        ProductApi.postTracking(data).then(res=>{
          // console.log(res.data);
        }) 

        this.monitorMousemove.scrollNavTime = Date.now();       
      }

      this.monitorMousemove.scrollTarget = target;

    },
    scrollMonitorMouseleave(event){
      if(this.monitorMousemove.scrollNavMousewheel){

        let stayTime = +((Date.now() - this.monitorMousemove.scrollNavTime)/1000).toFixed(2);
        let data = {
          itemCode:this.productInfoByCurrentSize.itemCode,
          itemName:this.itemName,
          area: "ContentZone",
          field: this.monitorMousemove.scrollTarget,
          event: 2,
          stay_time:stayTime
        }  
        ProductApi.postTracking(data).then(res=>{
          // console.log(res.data);
        }) 
        this.monitorMousemove.scrollNavTime = 0;
        this.monitorMousemove.scrollTarget = null;  
        this.monitorMousemove.scrollNavMousewheel = false;          
      }
    },
		monitorUserAction(event){
			event = event||window.event;
			this.monitorCount = 0;
		},
		checkTime(){
	    if(this.monitorCount === 3*60 - 1){
        clearInterval(this.intervalTimer);
        this.$router.push("/index")
      } else {
        this.monitorCount += 1;
      }
    },

    selectProductColor(color, colorIndex) {
      if (color.checked) return;

      this.productColors.forEach(d => { d.checked = false; })
      color.checked = true;

      this.productAllInfoByColor.every((d, modelsIndex) => {
        if (d.modelCode == color.modelCode) {
          console.log(d)
          this.productInfoByCurrentColor = Object.assign({}, d);
          this.imageUrl = this.productInfoByCurrentColor.videosAndImages;

          this.defaultIndex.other.defaultColorIndex = modelsIndex;

          return false;
        }
        return true;
      })

      this.productInfoByCurrentSize = {
        itemCode: "",
        // stock: 0,
        price: {
          original: {
            int: "0",
            decimal: ".00"
          },
          discount: {
            int: "0",
            decimal: ".00"
          },
          off: 100
        }
      }

      this.productReviews = {
        EN: [],
        ZH: []
      }

      this.productScore = {
        EN: 0,
        ZH: 0
      }
      this.QRCodeSrc = {
        EN: null,
        ZH: null
      }

      this.sizeSelected = { label: null, value: null }

      this.navigateToPhoto = 1;

      //init size
      let firstSizeItem = this.productInfoByCurrentColor.sizeItems[0];
      this.productInfoByCurrentSize = {
        // stock: firstSizeItem.stock,
        price: firstSizeItem.prices,
        itemCode: firstSizeItem.itemCode
      }

      this.sizeSelected = {
        label: firstSizeItem.SizeValueLabel,
        value: firstSizeItem.SizeValueId
      }
      //update QR code and userview by the first size
      this.fnUpdateStock_Qr_UserReview(undefined, this.productInfoByCurrentColor.modelCode, firstSizeItem.itemCode, this.lang);
    },

    pageChange(args) {
      this.navigateToPhoto = args;
    },

    selectProductSize(args) {
      if (args.value == this.sizeSelected.value) return;

      this.defaultIndex.other.defaultSizeIndex = args.index;
      console.log(this.defaultIndex.other)

      this.sizeSelected = Object.assign({}, args);
      let itemCode = null;
      //get the price of selected size
      this.productInfoByCurrentColor.sizeItems.forEach(d => {
        if (args.value == d.SizeValueId) {
          itemCode = d.itemCode;

          this.productInfoByCurrentSize = Object.assign({}, {
            // stock: d.stock,
            price: d.prices,
            itemCode: d.itemCode
          })
        }
      })
      //get the Stock of selected size
      ProductApi.getStock(undefined, itemCode).then((res, err) => {
        let stockData = res.data;
        if (stockData.stock && stockData.stock.stock) {
          this.productStock = stockData.stock.stock;
        } else {
          this.productStock = 0;
        }
      })

    },

    toggleQRCode() {
      if (this.QRCodeSrc.EN == null && this.QRCodeSrc.ZH == null) return;
      this.bShowQRCode = !this.bShowQRCode;
    },

    chooseLang(lang) {
      if (this.lang == lang) return;
      this.lang = lang;

      this.navigateToPhoto = 1;

      this.containerTitle = this.navTabList[this.activeNavIndex].label[lang];

      localStorage.setItem("lang", lang)

      this.productReviews = {
        EN: [],
        ZH: []
      }

      this.productScore = {
        EN: 0,
        ZH: 0
      }
      this.QRCodeSrc = {
        EN: null,
        ZH: null
      }
      //this.defaultIndex.other  request data by user selected color and size currently
      this.makeProductPageInfoData(this.productModels[lang], this.defaultIndex.other);
    },

    activeNavIndexChanged(args) {
      this.activeNavIndex = args;
      this.containerTitle = this.navTabList[args].label[this.lang];
    },

    /**
     *fnUpdateStock_Qr_UserReview is used when user choose another color , default color is got and language is changed
     @storeId -- undefined
     @modelCode -- color selected
     @itemCode -- size selected
     @lang -- language selected
    **/
    fnUpdateStock_Qr_UserReview(storeId, modelCode, itemCode, lang) {

      ProductApi.getStock(storeId, itemCode, lang).then((res, err) => {
        let stockData = res.data;
        if (stockData.stock && stockData.stock.stock) {
          this.productStock = stockData.stock.stock;
        } else {
          this.productStock = 0;
        }
      })

      //get user review
      // if(this.productReviews[lang].length == 0){
      ProductApi.getUserReview(this.productInfoByCurrentColor.modelCode, lang).then((res, err) => {
        let obj = this.makeUserReviewData(res.data);
        this.productReviews[lang] = obj.productReviews;
        this.productScore[lang] = obj.productScore;
      })
      // }

      //get QR_code
      // if(!this.QRCodeSrc[lang]){
      let country = lang == "EN" ? "my" : "tw";
      ProductApi.getQrcode(this.productInfoByCurrentColor.modelCode, country).then((res, err) => {
        this.QRCodeSrc[lang] = res.data
      })
      // }
    },
    showSizeMenu(args) {
      this.bShowShadow = args;
    },

    initPageData(lang) {

      ProductApi.getProductInfo(this.rfid, undefined, "ZH").then(res => {
        // debugger
        if (res.data && res.data.dsm) this.productInfoData["ZH"] = res.data.dsm;
        if (res.data && res.data.models) this.productModels["ZH"] = res.data.models;

        //get default model_code and itemCode
        let defaultData = getDefaultCodeIndex(this.productModels["ZH"], res.data.default_model_code, res.data.default_item_code)
        // let defaultData = getDefaultCodeIndex(this.productModels["ZH"],8315702,328449/*res.data.default_item_code*/)
        this.defaultIndex.ZH.defaultColorIndex = defaultData.defaultColorIndex
        this.defaultIndex.ZH.defaultSizeIndex = defaultData.defaultSizeIndex

        if (lang == "ZH") {
          this.makeProductPageInfoData(this.productModels[lang], this.defaultIndex[lang]);
        }
      }, err => {
        console.log(err)
      })

      ProductApi.getProductInfo(this.rfid, undefined, "EN").then(res => {

        if (res.data && res.data.dsm) this.productInfoData["EN"] = res.data.dsm;
        if (res.data && res.data.models) this.productModels["EN"] = res.data.models;


        let defaultData = getDefaultCodeIndex(this.productModels["EN"], res.data.default_model_code, res.data.default_item_code)
        // let defaultData = getDefaultCodeIndex(this.productModels["EN"],8315702,328449/*res.data.default_item_code*/)
        this.defaultIndex.EN.defaultColorIndex = defaultData.defaultColorIndex
        this.defaultIndex.EN.defaultSizeIndex = defaultData.defaultSizeIndex

        if (lang == "EN") {
          this.makeProductPageInfoData(this.productModels[lang], this.defaultIndex[lang]);
        }
      }, err => {
        console.log(err)
      })

      function getDefaultCodeIndex(model, model_code, item_code) {
        //get default model_code and itemCode
        let defaultColorIndex = null,
          defaultSizeIndex = null;
        if (model.length) {
          model.forEach((d, i) => {
            if (d.ModelCode == model_code) {
              defaultColorIndex = i;
              d.items.every((d_, i_) => {
                if (d_.ItemCode == item_code) {
                  defaultSizeIndex = i_;
                  return false;
                }
                return true;
              })
            }
          })
        }
        return { defaultColorIndex, defaultSizeIndex }
      }
    },
    /**
      *@productModels product's size and color information
      *@defaultIndex the index of default model_code and item_code in api data.
      makeProductPageInfoData is used to generate the product's bascial information
    **/
    makeProductPageInfoData(productModels, defaultIndex) {
      // debugger
      if (productModels.length) {
        let model = this.makeProductInfoDataByColor(productModels, defaultIndex);

        this.productAllInfoByColor = model.productAllInfoByColor;
        this.productColors = model.productColors;

        if (this.productAllInfoByColor.length) {
          this.productInfoByCurrentColor = this.productAllInfoByColor[defaultIndex.defaultColorIndex];

          this.imageUrl = this.productInfoByCurrentColor.videosAndImages

          //init size
          this.productInfoByCurrentSize = {
            // stock: this.productInfoByCurrentColor.sizeItems[defaultIndex.defaultSizeIndex].stock,
            price: this.productInfoByCurrentColor.sizeItems[defaultIndex.defaultSizeIndex].prices,
            itemCode: this.productInfoByCurrentColor.sizeItems[defaultIndex.defaultSizeIndex].itemCode
          }

          this.sizeSelected = {
            label: this.productInfoByCurrentColor.sizeItems[defaultIndex.defaultSizeIndex].SizeValueLabel,
            value: this.productInfoByCurrentColor.sizeItems[defaultIndex.defaultSizeIndex].SizeValueId
          }

          this.defaultIndex.other.defaultColorIndex = defaultIndex.defaultColorIndex;
          this.defaultIndex.other.defaultSizeIndex = defaultIndex.defaultSizeIndex;

          this.fnUpdateStock_Qr_UserReview(undefined,
            this.productInfoByCurrentColor.modelCode,
            this.productInfoByCurrentColor.sizeItems[defaultIndex.defaultSizeIndex].itemCode,
            this.lang
          );

        }
      }
    },
    makeProductInfoDataByColor(data, defaultIndex) {
      let productAllInfoByColor = [],
        productColors = [];

      data.forEach((d, modelsIndex) => {
        let videos = [],
          images = [],
          sizeItems = [],
          sizeOptions = [],
          productColorChecked = modelsIndex === defaultIndex.defaultColorIndex ? true : false;

        if (d.Videos && d.Videos.length) {
          d.Videos.forEach(d => {
            videos.push({ type: "vedio", url: d.link });
          })
        }

        if (d.Images && d.Images.length) {
          d.Images.forEach(d => {
            images.push({ type: "img", url: d.link });
          })
        }

        if (d.items && d.items.length) {
          d.items.forEach((d, itemIndex) => {
            let pricesObj = this.calculateDiscount(d.prices);

            sizeItems.push({
              SizeValueId: d.SizeValueId,
              SizeValueLabel: d.SizeValueLabel,
              // stock: d.Stock && d.Stock.store ? d.Stock.store : 0,
              itemCode: d.ItemCode,
              prices: pricesObj
            })

            sizeOptions.push({
              index: itemIndex,
              itemCode: d.ItemCode,
              label: d.SizeValueLabel,
              value: d.SizeValueId
            })
          })
        }

        let colorName = d.BusinessColors[0].label;
        productAllInfoByColor.push({
          colorName: colorName,
          modelCode: d.ModelCode,
          videosAndImages: [...videos, ...images],
          sizeItems: sizeItems,
          sizeOptions: sizeOptions
        })
        productColors.push({
          index: modelsIndex,
          modelCode: d.ModelCode,
          colorName: colorName,
          imgUrl: images[0].url,
          checked: productColorChecked,

        })
      });

      return {
        productAllInfoByColor,
        productColors
      }
    },
    makeUserReviewData(resData) {
      let score = 0,
        productScore = 0;

      if (!!resData.length) {
        resData.forEach(d => {
          d.published_at = TimeUtil.getFullDate(new Date(d.published_at), 'yyyy-MM-dd')
          score += ~~d.note
        })

        productScore = +((score / resData.length).toFixed(2));

        return {
          productReviews: resData,
          productScore: productScore
        }
      } else {
        return {
          productReviews: [],
          productScore: 0
        }
      }
    },
    calculateDiscount(pricesObj) {
      let original = {
          int: "0",
          decimal: ".00"
        },
        discount = {
          int: "0",
          decimal: ".00",
        },
        off = 100;
      if (!!pricesObj) {
        let sale_price = pricesObj.sale_price + "";
        // let strickout_price = parseInt(Math.random()*800)+"";
        let strickout_price = pricesObj.strickout_price + "";
        if (!!sale_price) {

          let sale_priceIndex = sale_price.indexOf(".");
          if (sale_priceIndex >= 0) {
            original.int = sale_price.substr(0, sale_priceIndex)
            original.decimal = sale_price.substr(sale_priceIndex, sale_price.length);
          } else {
            original.int = sale_price;
            original.decimal = ".00";
          }
        }
        if (!!strickout_price) {

          let strickout_priceIndex = strickout_price.indexOf(".");
          if (strickout_priceIndex >= 0) {
            discount.int = strickout_price.substr(0, strickout_priceIndex)
            discount.decimal = strickout_price.substr(strickout_priceIndex, strickout_price.length);
          } else {
            discount.int = strickout_price;
            discount.decimal = ".00";
          }
          off = +(((+strickout_price) * 100 / (+sale_price)).toFixed(0))
        }
        // console.log({ original, discount, off })
        return { original, discount, off }
      }
    },

  },
  components: {
    Carousel,
    Slide,
    ScrollNav,
    ScrollNavPanel,
    CustomSelect,
    Rate
  },
  computed:{
  	itemName(){
  		return this.productInfoData[this.lang].WebLabel;
  	}
  }

}
