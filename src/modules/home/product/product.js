import { Carousel,Slide } from "@/components/carousel"
import {ScrollNav, ScrollNavPanel} from "@/components/scrollNav"
import CustomSelect from "@/components/custom-select"
import Rate from "@/components/rate/Rate.vue"
import StoreService from '@/services/store-services.js'

import ProductApi from "@/api/modules/product/productInfo.js"
import Qrcode from "qrcodejs2"

import TimeUtil from "@/utils/datetime-utils.js"

export default {
	name: 'product',
	props: {
		rfid: {
			// required: true
		}
	},
	data(){
		return{
			monitorCount:0,
			lang: null,
			navigateToPhoto:1,
			imageUrl:[],
			list: [
        {label: 'DESIGNED FOR'},
        {label: 'PRODUCT BENEFITS'},
        {label: 'USER REVIEWS'},
        {label: 'TPRODUCT CONCEPT & TECHNOLOGY'},
        {label: 'TECHNICAL INFORMATION'},
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
      QRCodeSrc:null

    }
	},
	created(){
		this.containerTitle = this.list[0].label;

		// make sure language
		let langInLocal = localStorage.getItem("lang");
		if(!!langInLocal){
			this.lang = langInLocal
		}else{
			let defaultLang = StoreService.getLang();
			this.lang = defaultLang;
			localStorage.setItem("lang", defaultLang)
		}

		//monitor user's action on the page
		this.intervalTimer = setInterval(this.checkTime,1000);
		this.$nextTick(()=>{
			window.addEventListener("resize",this.monitorUserAction)
			this.$refs.productContainer.addEventListener("mousemove",this.monitorUserAction)
			this.$refs.productContainer.addEventListener("click",this.monitorUserAction)
			this.$refs.productContainer.addEventListener("mousewheel",this.monitorUserAction)
		})

	},
	mounted(){
	},
	beforeDestroy(){
		window.removeEventListener("resize",this.monitorUserAction)
		this.$refs.productContainer.removeEventListener("mousemove",this.monitorUserAction)
		this.$refs.productContainer.removeEventListener("click",this.monitorUserAction)
		this.$refs.productContainer.removeEventListener("mousewheel",this.monitorUserAction)
		clearInterval(this.intervalTimer);
	},
	methods:{
		monitorUserAction(){
			this.monitorCount = 0;
		},
		checkTime(){
	    if(this.monitorCount === 3*60 - 1){
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
			this.containerTitle = this.list[args].label;
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
		fnUpdateStock_QR_UserReview(storeId,itemCode,lang){
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
		}
	}
}