import { Carousel,Slide } from "@/components/carousel"
import {ScrollNav, ScrollNavPanel} from "@/components/scrollNav"
import CustomSelect from "@/components/custom-select"
import Rate from "@/components/rate/Rate.vue"

import ProductApi from "@/api/modules/product/productInfo.js"

import TimeUtil from "@/utils/datetime-utils.js"
import TypeChecker from "@/utils/type-checker.js"
import debounce from "@/utils/debounce"

export default {
	name: 'product',
	props: {
		rfid: {
			// required: true
		}
	},
	data(){
		return{
			area:null,
			areaOfField:null,
			fieldRef:{},
			monitorCount:0,
			monitorTime:null,
			// cursorField:null,
			lang: null,
			navigateToPhoto:1,
			imageUrl:[],
			navTabList: [
        {label: 'DESIGNED FOR',id:"DesignFor"},
        {label: 'PRODUCT BENEFITS',id:"ProductBenefit"},
        {label: 'USER REVIEWS',id:"UserReviews"},
        {label: 'TPRODUCT CONCEPT & TECHNOLOGY',id:"ProdConceptTech"},
        {label: 'TECHNICAL INFORMATION',id:"TechInfo"},
      ],
      containerTitle:null,
      activeNavIndex:0,
      productName:null,

      productColors:[],
      productAllInfoByColor:[],
      productInfoByCurrentColor:{
      	colorName:null,
      	videosAndImages:[],
      	items:[],
      	sizeOptions:[]
      },
      productInfoByCurrentSize:{
      	stock:0,
      	itemCode:"",
      	price:{
	      	original:{
	      		int:"0",
	      		decimal:".00"
	      	},
	      	discount:{
	      		int:"0",
	      		decimal:".00"
	      	},	      	
	      	off:100
	      }
      },

      productStock:0,
      sizeSelected:{  //value for display the label of sected size
      	label:null,
      	value:null
      },
      bShowShadow:false,
      bShowQRCode:false,
      qrcodeEle:null,
      productInfoData:{},
      productReviews:[],
      productScore:0,
      QRCodeSrc:null,
      debounceActionMonitor:debounce(this.actionMonitor,500,100),
      fieldELeQueried:{}
    }
	},
	created(){
		this.containerTitle = this.navTabList[0].label;

		// make sure language
		let langInLocal = localStorage.getItem("lang");
		if(!!langInLocal){
			this.lang = langInLocal
		}else{
			this.lang = "EN"
			localStorage.setItem("lang","EN")
		}

		//monitor user's action on the page
		this.intervalTimer = setInterval(this.checkTime,1000);
		this.$nextTick(()=>{
			let doc = document;
			window.addEventListener("resize",this.monitorUserAction)

			doc.querySelector("#scrollnavTab").addEventListener("click",this.navMonitor);
			doc.querySelector("#carouselPagination").addEventListener("click",this.pageMonitor);
			this.fieldELeQueried.DesignFor = doc.querySelector("#DesignFor");
			this.fieldELeQueried.ProductBenefit = doc.querySelector("#ProductBenefit");
			this.fieldELeQueried.UserReviews = doc.querySelector("#UserReviews");
			this.fieldELeQueried.ProdConceptTech = doc.querySelector("#ProdConceptTech");
			this.fieldELeQueried.TechInfo = doc.querySelector("#TechInfo");

		})
		
	},
	mounted(){
	},
	beforeDestroy(){
		window.removeEventListener("resize",this.monitorUserAction);

		let doc = document;
		doc.querySelector("#scrollnavTab").removeEventListener("click",this.navMonitor);
		doc.querySelector("#carouselPagination").removeEventListener("click",this.pageMonitor);		
		clearInterval(this.intervalTimer);
	},
	methods:{
		navMonitor(event){
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
				itemName:null,
				area: "ContentZone",
				field: field,
				event: 1,
			}		
			this.areaOfField = field;	
			ProductApi.postTracking(data).then(res=>{
				console.log(res.data);
			})
		},
		pageMonitor(event){
			event = event || window.event;
			if(event.target == document.querySelector("#iconDown") || event.target == document.querySelector("#iconUp")){
				let data = {
					itemCode:this.productInfoByCurrentSize.itemCode,
					itemName:null,
					area: "ConversionZone",
					field: "Moreviews",
					event: 1,
				}		

				ProductApi.postTracking(data).then(res=>{
					console.log(res.data);
				})
			}

		},
		monitorClick(field){
			let data = {
				itemCode:this.productInfoByCurrentSize.itemCode,
				itemName:null,
				area: "ConversionZone",
				field: field,
				event: 1,
			}
			// this.fieldRef.field = true;
			this.areaOfField = field;
			ProductApi.postTracking(data).then(res=>{
				console.log(res.data);
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
			this.dispatchTracking(null,itemCode,this.fieldRef)
		},

		dispatchTracking(itemCode,itemName,fieldRef){
			// debugger
			let area, field, stayTime, allWrapperErea = ["ConversionZone","ContentZone","WholePage"],
			    durationArea = ["DesignForBlock","ProdBenefitBlock","UserReviewsBlock","ConceptTechBlock","TechInfoBlock","MainPicBlock"];
			//field
			for(let i in fieldRef){
				if(fieldRef.hasOwnProperty(i)){
					if((!allWrapperErea.includes(i))&&fieldRef[i]){
						// field = i;
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

			if(!allWrapperErea.includes(area))return;
			if(!durationArea.includes(this.areaOfField))return;
			this.area = area;
	
		},
		monitorUserAction(event){
			event = event||window.event;
			this.monitorCount = 0;
		},
		checkTime(){
	    if(this.monitorCount === 3*60 - 1){
	    	console.log("redirect")
        clearInterval(this.intervalTimer);
        this.$router.push("/index")
	    }else{
	      this.monitorCount += 1;
	    }
		},

		pageChange(args){
			this.navigateToPhoto = args;
		},
		selectProductColor(color,colorIndex){
			if(color.checked)return;

			this.productColors.forEach(d=>{ d.checked = false; })
			color.checked = true;

      this.productAllInfoByColor.every(d=>{
      	if(d.colorName == color.colorName){
		      this.productInfoByCurrentColor = Object.assign({},d);
		      this.imageUrl = this.productInfoByCurrentColor.videosAndImages;
		      return false;
      	}
		    return true;
      })	

      this.productInfoByCurrentSize = {
      	itemCode:"",
      	stock:0,
      	price:{
	      	original:{
	      		int:"0",
	      		decimal:".00"
	      	},
	      	discount:{
	      		int:"0",
	      		decimal:".00"
	      	},	      	
	      	off:100
	      }
      }
      this.sizeSelected = {label:null,value:null}

      this.navigateToPhoto = 1;

			//init size
			let firstSizeItem =  this.productInfoByCurrentColor.items[0];
			this.productInfoByCurrentSize = {
				stock:firstSizeItem.stock,
				price:firstSizeItem.prices,
				itemCode:firstSizeItem.itemCode
			}		

			this.sizeSelected = {
				label:firstSizeItem.SizeValueLabel,
				value:firstSizeItem.SizeValueId
			}		

			this.fnUpdateStock_QR_UserReview(undefined,firstSizeItem.itemCode,this.lang);
	      
		},
		handleSlideClick(){

		},
		activeNavIndexChanged(args){
			this.activeNavIndex = args;
			this.containerTitle = this.navTabList[args].label;
		},
		selectProductSize(args){

			this.sizeSelected = Object.assign({},args);
			let itemCode = null;

			this.productInfoByCurrentColor.items.forEach(d=>{
				if(args.value == d.SizeValueId){
					itemCode = d.itemCode;
					this.productInfoByCurrentSize =  Object.assign({},{
						stock:d.stock,
						price:d.prices,
						itemCode:d.itemCode
					})
				}
			})	

			this.fnUpdateStock_QR_UserReview(undefined,itemCode,this.lang)
		},
		fnUpdateStock_QR_UserReview(storeId,itemCode,modelCode,lang){
			ProductApi.getStock(storeId,itemCode).then((res,err)=>{
				let stockData = JSON.parse(res.data)
				if(stockData.stock&&stockData.stock.stock){
					this.productStock = stockData.stock.stock;
				}else{
					this.productStock = 0;
				}
			})

			ProductApi.getUserReview(itemCode,lang).then((res,err)=>{
				let obj = this.makeUserReviewData(res.data);
				this.productReviews = obj.productReviews; 
				this.productScore = obj.productScore;				
			})
		},
		showSizeMenu(args){
			this.bShowShadow = args;
		},
		toggleQRCode(){
			if(this.QRCodeSrc == null)return;
			this.bShowQRCode = !this.bShowQRCode;
		},
		chooseLang(lang){
			if(this.lang == lang)return;
			this.lang = lang;
			// console.log(this.lang)
		},
		makeUserReviewData(resData){
			let score = 0,
			    productScore = 0;

			if(!!resData.length){
				resData.forEach(d => {
					d.published_at = TimeUtil.getFullDate(new Date(d.published_at),'yyyy-MM-dd')
					score += ~~d.note
				})

				productScore = +((score/resData.length).toFixed(2));
	
				return {
					productReviews:resData,
					productScore: productScore
				}	
			}else{
				return {
					productReviews:[],
					productScore: 0
				}					
			}


		},
		calculateDiscount(pricesObj){
			let original = {
						int:"0",
						decimal: ".00"
					}, 
					discount = {
						int: "0", 
						decimal: ".00",
					},
					off = 100;
			if(!!pricesObj){
				let sale_price = pricesObj.sale_price+"";
				let strickout_price = pricesObj.strickout_price+"";
				if(!!sale_price){

					let sale_priceIndex = sale_price.indexOf(".");
					if(sale_priceIndex>=0){
						original.int = sale_price.substr(0,sale_priceIndex)
						original.decimal = sale_price.substr(sale_priceIndex,sale_price.length);							 	
					}else{
						original.int = sale_price;
						original.decimal = ".00";							 	
					}
				}
				if(!!strickout_price){

					let strickout_priceIndex = sale_price.indexOf(".");
					if(strickout_priceIndex>=0){
						discount.int = sale_price.substr(0,strickout_priceIndex)
						discount.decimal = sale_price.substr(strickout_priceIndex,sale_price.length);							 	
					}else{
						discount.int = sale_price;
						discount.decimal = ".00";		 					 	
					}
					off = +(((+strickout_price)*100/(+sale_price)).toFixed(0))
				}

				return { original,discount,off }
			}			
		},
		initPageData(lang){
			ProductApi.getProductInfo(undefined,undefined,lang).then(res=>{
				this.productAllInfoByColor = [];
				this.productColors = [];
				res.data.models.forEach((d,modelsIndex)=>{
					let videos = [],
						  images = [],
						  items = [],
						  sizeOptions = [],
						  productColorChecked = modelsIndex === 0 ? true:false;


					if(d.Images&&d.Images.length){
						d.Videos.forEach(d=>{
							videos.push({type:"vedio",url:d.link});
						})
					}

					if(d.Images&&d.Images.length){
						d.Images.forEach(d=>{
							images.push({type:"img",url:d.link});
						})
					}

					if(d.items&&d.items.length){
						d.items.forEach(d=>{
							let pricesObj = this.calculateDiscount(d.prices);
							items.push({
								SizeValueId:d.SizeValueId,
								SizeValueLabel:d.SizeValueLabel,
								stock:d.Stock&&d.Stock.store?d.Stock.store:0,							
								itemCode:d.ItemCode,							
								prices:pricesObj
							})

							sizeOptions.push({
								label: d.SizeValueLabel,
								value: d.SizeValueId
							})
						})
						
					}

					let colorName = d.BusinessColors[0].label;
					this.productAllInfoByColor.push({
						colorName: colorName,
						videosAndImages:[...videos,...images],
						items:items,
						sizeOptions:sizeOptions
					})
					this.productColors.push({
						colorName: colorName,
						imgUrl:images[0].url,
						checked:productColorChecked
					})
					
				});

				this.productInfoByCurrentColor = this.productAllInfoByColor[0];

				this.imageUrl = this.productInfoByCurrentColor.videosAndImages
				this.imageUrl.length = 4;
				this.productInfoData = res.data.dsm;

				//init size
				this.productInfoByCurrentSize = {
					stock:this.productInfoByCurrentColor.items[0].stock,
					price:this.productInfoByCurrentColor.items[0].prices,
					itemCode:this.productInfoByCurrentColor.items[0].itemCode
				}		

				this.sizeSelected = {
					label:this.productInfoByCurrentColor.items[0].SizeValueLabel,
					value:this.productInfoByCurrentColor.items[0].SizeValueId
				}	

				this.fnUpdateStock_QR_UserReview(undefined,this.productInfoByCurrentColor.items[0].itemCode,lang);				

			},err=>{
				console.log(err)
			})		
		}
	},
	components:{
		Carousel,
		Slide,
		ScrollNav,
		ScrollNavPanel,
		CustomSelect,
		Rate
	},
	watch:{
		lang(newV,oldV){
			if(newV){		
				localStorage.setItem("lang",newV)
				this.initPageData(newV);
		
				//get QR code
				let country = newV == "EN"?"Malaysia":"tw"
				ProductApi.getQrcode(country).then((res,err)=>{
					this.QRCodeSrc = res.data
				})					
			}
		},
		areaOfField(newV,oldV){
			if(newV){

				let stayTime  = +((Date.now() - this.monitorTime)/1000).toFixed(2);

				if(!!oldV){
					console.log("area:", this.area, "field:", oldV, "stayTime:", stayTime)		
					let data = {
						itemCode:this.productInfoByCurrentSize.itemCode,
						itemName:null,
						area: this.area,
						field: oldV,
						event: 2,
						stay_time:stayTime
					}	
					ProductApi.postTracking(data).then(res=>{
						console.log(res.data);
					})					
				}

				//if area changed,clear the start time
				this.monitorTime = Date.now();
				
			}
		}
	}
}