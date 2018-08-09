import { Carousel, Slide } from "@/components/carousel"
import { ScrollNav, ScrollNavPanel } from "@/components/scrollNav"
import CustomSelect from "@/components/custom-select"
import Rate from "@/components/rate/Rate.vue"
import StoreService from '@/services/store-services.js'

import ProductApi from "@/api/modules/product/productInfo.js"

import TimeUtil from "@/utils/datetime-utils.js"
import TypeChecker from "@/utils/type-checker.js"
import debounce from "@/utils/debounce"

export default {
	name: 'product',
	props: {
		// rfid: {
		// 	// required: true
		// }
	},
	data(){
		return{
			rfid:null,
			area:null,
			areaOfField:null,
			fieldRef:{},
			monitorCount:0,
			monitorTime:null,
			lang: null,
			navigateToPhoto:1,
			imageUrl:[],
			navTabList: [
        {label:{EN:'DESIGNED FOR',ZH:"適合在"},id:"DesignFor"},
        {label: {EN:'PRODUCT BENEFITS',ZH:"產品優點"},id:"ProductBenefit"},
        {label: {EN:'USER REVIEWS',ZH:"使用者回饋"},id:"UserReviews"},
        {label: {EN:'TPRODUCT CONCEPT & TECHNOLOGY',ZH:"产品概念与技术"},id:"ProdConceptTech"},
        {label: {EN:'TECHNICAL INFORMATION',ZH:"產品性能"},id:"TechInfo"},
      ],
      containerTitle: null,
      activeNavIndex: 0,
      productName: null,

      productColors: [],
      productAllInfoByColor: [],
      productInfoByCurrentColor: {
        colorName: null,
        videosAndImages: [],
        sizeItems: [],
        sizeOptions: []
      },
      productInfoByCurrentSize: {
        stock: 0,
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
      	EN:{}, ZH:{}
      },
      productModels:{
      	EN:{}, ZH:{}
      },
      productReviews: {  //user reviews
      	EN:[], ZH:[]
      }, 
      productScore: {
      	EN:0, ZH:0
      },
      QRCodeSrc: {
      	EN:null, ZH:null
      },
      debounceActionMonitor:debounce(this.actionMonitor,500,100),
      fieldELeQueried:{}      
    }
  },
  created() {
    this.rfid = this.$router.currentRoute.params.rfid;		

    //language
    let langInLocal = localStorage.getItem("lang");
    if (!!langInLocal) {
    	this.lang = langInLocal;
    } else {
      let defaultLang = StoreService.getLang();		
    	this.lang = defaultLang;
    }
		this.initPageData_QR(this.lang);  

		//monitor user's action on the page
		// this.intervalTimer = setInterval(this.checkTime,1000);

		this.$nextTick(()=>{
			let doc = document;
			window.addEventListener("resize",this.monitorUserAction)

      this.$refs.WholePage.addEventListener("mousemove", this.monitorUserAction)
      this.$refs.WholePage.addEventListener("click", this.monitorUserAction)
      this.$refs.WholePage.addEventListener("mousewheel", this.monitorUserAction)
			
			let pageELe = doc.querySelector("#carouselPagination");
			if(!!pageELe)pageELe.addEventListener("click",this.paginationMonitorClick);
			doc.querySelector("#scrollnavTab").addEventListener("click",this.navMonitorClick);

			this.fieldELeQueried.DesignFor = doc.querySelector("#DesignFor");
			this.fieldELeQueried.ProductBenefit = doc.querySelector("#ProductBenefit");
			this.fieldELeQueried.UserReviews = doc.querySelector("#UserReviews");
			this.fieldELeQueried.ProdConceptTech = doc.querySelector("#ProdConceptTech");
			this.fieldELeQueried.TechInfo = doc.querySelector("#TechInfo");

		})    

  },
  beforeDestroy() {
		let doc = document,
				navTabELe = doc.querySelector("#scrollnavTab"),
				pageELe = doc.querySelector("#carouselPagination");

		if(!!navTabELe)doc.querySelector("#scrollnavTab").removeEventListener("click",this.navMonitorClick);
		if(!!pageELe)pageELe.removeEventListener("click",this.paginationMonitorClick);
						  	
    window.removeEventListener("resize", this.monitorUserAction)
    this.$refs.WholePage.removeEventListener("mousemove", this.monitorUserAction)
    this.$refs.WholePage.removeEventListener("click", this.monitorUserAction)
    this.$refs.WholePage.removeEventListener("mousewheel", this.monitorUserAction)
    
    clearInterval(this.intervalTimer);
  },
	methods:{
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
			if(event.target == document.querySelector("#iconDown") || event.target == document.querySelector("#iconUp")){
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

		actionMonitor(event,type){
			this.fieldRef = {};
			event = event||window.event;
			for(let ref in this.$refs){
				if(this.$refs.hasOwnProperty(ref)){

					if(TypeChecker.isArray(this.$refs[ref])){
						if(this.$refs[ref][0].contains(event.target)){
							this.fieldRef[ref] = true;
						}						
					}else{
						if(this.$refs[ref].contains(event.target)){
							this.fieldRef[ref] = true;
						}
					}

				}
			}

			let itemCode = this.productInfoByCurrentSize.itemCode;
			this.area_field_Tracking(null,itemCode,this.fieldRef)
		},

		area_field_Tracking(itemCode,itemName,fieldRef){

			let area,
					allWrapperErea = ["ConversionZone","ContentZone","WholePage"],
			    durationArea = ["DesignForBlock","ProdBenefitBlock","UserReviewsBlock","ConceptTechBlock","TechInfoBlock","MainPicBlock"];

			for(let i in fieldRef){
				if(fieldRef.hasOwnProperty(i)){
					if((!allWrapperErea.includes(i))&&fieldRef[i]){
						 this.areaOfField = i;
					}
				}
			}

			//area
			if(fieldRef.ConversionZone){
				area = "ConversionZone";
			}else if(fieldRef.ContentZone){
				area = "ContentZone";
			}else{
				area = "WholePage";
			}
			this.area = area;
	
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

    pageChange(args) {
      this.navigateToPhoto = args;
    },
    selectProductColor(color, colorIndex) {
      if (color.checked) return;

      this.productColors.forEach(d => { d.checked = false; })
      color.checked = true;

      this.productAllInfoByColor.every(d => {
        if (d.colorName == color.colorName) {
          this.productInfoByCurrentColor = Object.assign({}, d);
          this.imageUrl = this.productInfoByCurrentColor.videosAndImages;
          return false;
        }
        return true;
      })

      this.productInfoByCurrentSize = {
        itemCode: "",
        stock: 0,
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
      this.sizeSelected = { label: null, value: null }

      this.navigateToPhoto = 1;

      //init size
      let firstSizeItem = this.productInfoByCurrentColor.sizeItems[0];
      this.productInfoByCurrentSize = {
        stock: firstSizeItem.stock,
        price: firstSizeItem.prices,
        itemCode: firstSizeItem.itemCode
      }

      this.sizeSelected = {
        label: firstSizeItem.SizeValueLabel,
        value: firstSizeItem.SizeValueId
      }

      this.fnUpdateStock_Qr_UserReview(undefined, this.productInfoByCurrentColor.modelCode, firstSizeItem.itemCode, this.lang);
    },
    handleSlideClick() {},
    activeNavIndexChanged(args) {
      this.activeNavIndex = args;
      this.containerTitle = this.navTabList[args].label[this.lang];
    },
    selectProductSize(args) {

      this.sizeSelected = Object.assign({}, args);
      let itemCode = null;

      this.productInfoByCurrentColor.sizeItems.forEach(d => {
        if (args.value == d.SizeValueId) {
          itemCode = d.itemCode;
          this.productInfoByCurrentSize = Object.assign({}, {
            stock: d.stock,
            price: d.prices,
            itemCode: d.itemCode
          })
        }
      })

      ProductApi.getStock(storeId, itemCode, lang).then((res, err) => {
        let stockData = res.data;
        if (stockData.stock && stockData.stock.stock) {
          this.productStock = stockData.stock.stock;
        } else {
          this.productStock = 0;
        }
      })

    },
    fnUpdateStock_Qr_UserReview(storeId, modelCode, itemCode, lang) {
      this.productReviews = { 
      	EN:[], ZH:[]
      }

      this.productScore = {
      	EN:0, ZH:0
      } 
      this.QRCodeSrc = {
      	EN:null, ZH:null
      }  

      ProductApi.getStock(storeId, itemCode, lang).then((res, err) => {
        let stockData = res.data;
        if (stockData.stock && stockData.stock.stock) {
          this.productStock = stockData.stock.stock;
        } else {
          this.productStock = 0;
        }
      })

      ProductApi.getUserReview(modelCode, lang).then((res, err) => {
        let obj = this.makeUserReviewData(res.data);
        this.productReviews[lang] = obj.productReviews;
        this.productScore[lang] = obj.productScore;
      })

      let country = lang == "EN"? "Malaysia":"tw";
      ProductApi.getQrcode(modelCode,country).then((res,err)=>{
				this.QRCodeSrc[lang] = res.data
			})	    

    },
    showSizeMenu(args) {
      this.bShowShadow = args;
    },
    toggleQRCode() {
      if (this.QRCodeSrc.EN == null && this.QRCodeSrc.ZH == null) return;
      this.bShowQRCode = !this.bShowQRCode;
    },
    chooseLang(lang) {
      if (this.lang == lang) return;
      this.lang = lang;
			
			this.containerTitle = this.navTabList[this.activeNavIndex].label[lang];

			this.makeProductPageInfoData(this.productModels[lang]);
      
      //get user review
      if(this.productReviews[lang].length == 0){
	      ProductApi.getUserReview(this.productInfoByCurrentColor.modelCode, lang).then((res, err) => {
	        let obj = this.makeUserReviewData(res.data);
	        this.productReviews[lang] = obj.productReviews;
	        this.productScore[lang] = obj.productScore;
	      })
      }

      //get QR_code
      if(!this.QRCodeSrc[lang]){
	      let country = lang == "EN"? "Malaysia":"tw";
	      ProductApi.getQrcode(this.productInfoByCurrentColor.modelCode,country).then((res,err)=>{
					this.QRCodeSrc[lang] = res.data
				})		      
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

          let strickout_priceIndex = sale_price.indexOf(".");
          if (strickout_priceIndex >= 0) {
            discount.int = sale_price.substr(0, strickout_priceIndex)
            discount.decimal = sale_price.substr(strickout_priceIndex, sale_price.length);
          } else {
            discount.int = sale_price;
            discount.decimal = ".00";
          }
          off = +(((+strickout_price) * 100 / (+sale_price)).toFixed(0))
        }

        return { original, discount, off }
      }
    },
    makeProductInfoDataByColor(data){
    	let productAllInfoByColor = [],
					productColors = [];

      data.forEach((d, modelsIndex) => {
        let videos = [],
          images = [],
          sizeItems = [],
          sizeOptions = [],
          productColorChecked = modelsIndex === 0 ? true : false;

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
          d.items.forEach(d => {
            let pricesObj = this.calculateDiscount(d.prices);

            sizeItems.push({
              SizeValueId: d.SizeValueId,
              SizeValueLabel: d.SizeValueLabel,
              stock: d.Stock && d.Stock.store ? d.Stock.store : 0,
              itemCode: d.ItemCode,
              prices: pricesObj
            })

            sizeOptions.push({
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
          colorName: colorName,
          imgUrl: images[0].url,
          checked: productColorChecked
        })
      });

      return{
				productAllInfoByColor,
				productColors
      }
    },
    makeProductPageInfoData(productModels){
      if(productModels.length){

      	let model = this.makeProductInfoDataByColor(productModels);

      	this.productAllInfoByColor = model.productAllInfoByColor;
				this.productColors = model.productColors;

				if(this.productAllInfoByColor.length){

	        this.productInfoByCurrentColor = this.productAllInfoByColor[0];

	        this.imageUrl = this.productInfoByCurrentColor.videosAndImages
	        
	        //init size
	        this.productInfoByCurrentSize = {
	          stock: this.productInfoByCurrentColor.sizeItems[0].stock,
	          price: this.productInfoByCurrentColor.sizeItems[0].prices,
	          itemCode: this.productInfoByCurrentColor.sizeItems[0].itemCode
	        }

	        this.sizeSelected = {
	          label: this.productInfoByCurrentColor.sizeItems[0].SizeValueLabel,
	          value: this.productInfoByCurrentColor.sizeItems[0].SizeValueId
	        }

	        this.fnUpdateStock_Qr_UserReview(undefined, this.productInfoByCurrentColor.modelCode, this.productInfoByCurrentColor.sizeItems[0].itemCode, this.lang);

				}
      }
    },
    initPageData_QR(lang) {

      let getProductInfoPromise_ZH = ProductApi.getProductInfo(this.rfid, undefined, "ZH").then(res => {
        if(res.data&&res.data.dsm)this.productInfoData["ZH"] = res.data.dsm;
        if(res.data&&res.data.models)this.productModels["ZH"] = res.data.models;
      },err=>{
      	console.log(err)
      })

      let getProductInfoPromise_EN = ProductApi.getProductInfo(this.rfid, undefined, "EN").then(res => {
        if(res.data&&res.data.dsm)this.productInfoData["EN"] = res.data.dsm;
        if(res.data&&res.data.models)this.productModels["EN"] = res.data.models;
      }, err => {
        console.log(err)
      })

      Promise.all([getProductInfoPromise_ZH,getProductInfoPromise_EN]).then(()=>{
      	console.log(this.productModels[lang])
      	this.makeProductPageInfoData(this.productModels[lang]);
      })					
    }
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
  		return this.productInfoData[this.lang].WebLabel 
  						+ this.productInfoByCurrentColor.modelCode 
  						+ this.productInfoByCurrentSize.itemCode;
  	}
  },
	watch:{

		areaOfField(newV,oldV){
			if(newV){
				let durationArea = ["DesignForBlock","ProdBenefitBlock","UserReviewsBlock","ConceptTechBlock","TechInfoBlock","MainPicBlock"],
						stayTime  = +((Date.now() - this.monitorTime)/1000).toFixed(2);

				if(!!oldV&&durationArea.includes(oldV)&&stayTime>1.5){

					console.log("area:", this.area, "field:", oldV, "stayTime:", stayTime)		
					let data = {
						itemCode:this.productInfoByCurrentSize.itemCode,
						itemName:this.itemName,
						area: this.area,
						field: oldV,
						event: 2,
						stay_time:stayTime
					}	
					ProductApi.postTracking(data).then(res=>{
						// console.log(res.data);
					})					
				}

				//if area changed,clear the start time
				this.monitorTime = Date.now();
				
			}
		}
	}
}
