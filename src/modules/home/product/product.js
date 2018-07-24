import { Carousel,Slide } from "@/components/carousel"
import {ScrollNav, ScrollNavPanel} from "@/components/scrollNav"
import CustomSelect from "@/components/custom-select"
import Rate from "@/components/rate/Rate.vue"

import ProductApi from "@/api/modules/product/productInfo.js"
import Qrcode from "qrcodejs2"


export default {
	name: 'product',
	props: {
		rfid: {
			// required: true
		}
	},
	data(){
		return{
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
      	price:{
	      	original:"0.00",
	      	discountInt:"0",
	      	discountDecimal:".00",
	      	off:100
	      }
      },
      sizeSelected:{  //value for display the label of sected size
      	label:null,
      	value:null
      },
      bShowShadow:false,
      bShowQRCode:false,
      qrcodeEle:null,
      productInfoData:{},
      productReviews:[],
      // productConcept:{},
      productScore:0,

    }
	},
	created(){
		this.containerTitle = this.list[0].label;
		ProductApi.getProductInfo().then(res=>{
			res.data.models.forEach((d,modelsIndex)=>{
				// debugger
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
						let original = "0.00", 
								discountInt = "0", 
								discountDecimal = ".00",
								off = 100;
						if(!!d.prices){
							if(!!d.prices.sale_price){
							 	original = d.prices.sale_price;

							}
							if(!!d.prices.strickout_price){
								discountInt = d.prices.strickout_price.substr(0,d.prices.strickout_price.indexOf("."))
								discountDecimal = d.prices.strickout_price.substr(d.prices.strickout_price.indexOf("."),d.prices.strickout_price.length);
								off = +(((+d.prices.strickout_price)*100/(+d.prices.sale_price)).toFixed(0))
							}
						}
						items.push({
							SizeValueId:d.SizeValueId,
							SizeValueLabel:d.SizeValueLabel,
							Stock:d.Stock&&d.Stock.store?d.Stock.store:0,							
							prices:{
								original,
								discountInt,
								discountDecimal,
								off
							}
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
					videosAndImages:[/*...videos,*/...images],
					items:items,
					sizeOptions:sizeOptions
				})

				this.productColors.push({
					colorName: colorName,
					imgUrl:"",
					checked:productColorChecked
				})


			});
			this.productInfoByCurrentColor = this.productAllInfoByColor[0];

			this.imageUrl = this.productInfoByCurrentColor.videosAndImages
			this.imageUrl.length = 6;
			console.log(this.productInfoByCurrentColor)
			// console.log(this.productAllInfoByColor)

			let score = 0;
			this.productInfoData = res.data.dsm;
			this.productReviews = res.data.reviews;
			this.productReviews.forEach(d => {
				score += ~~d.note
			})
			this.productScore = +((score/this.productReviews.length).toFixed(2));

		},err=>{
			console.log(err)
		})

	},
	methods:{
		pageChange(args){
			this.navigateToPhoto = args;
		},
		selectProductColor(color,colorIndex){
			this.productColors.forEach(d=>{
				d.checked = false;
			})
			color.checked = true;

      this.productAllInfoByColor.every(d=>{
      	if(d.colorName == color.colorName){
		      this.productInfoByCurrentColor = Object.assign({},d);
		      this.imageUrl = this.productInfoByCurrentColor.videosAndImages;
		      this.imageUrl.length = 6;
		      return false;
      	}
		    return true;
      })	

      this.productInfoByCurrentSize = {
      	stock:0,
      	price:{
	      	original:"0.00",
	      	discountInt:"0",
	      	discountDecimal:".00",
	      	off:100
	      }
      }
      this.sizeSelected = {label:null,value:null}

      	this.navigateToPhoto = 1;
      // setTimeout(()=>{
      // },300)

		},
		handleSlideClick(){},
		activeNavIndexChanged(args){
			this.activeNavIndex = args;
			this.containerTitle = this.list[args].label;
		},
		selectProductSize(args){
			this.sizeSelected = Object.assign({},args);

			this.productInfoByCurrentColor.items.forEach(d=>{
				if(args.value == d.SizeValueId){
					this.productInfoByCurrentSize =  Object.assign({},{stock:d.Stock,price:d.prices})
				}
			})
		},
		showSizeMenu(args){
			this.bShowShadow = args;
		},
		toggleQRCode(){
			this.bShowQRCode = !this.bShowQRCode;

			if(this.bShowQRCode){
				if(!!this.qrcodeEle){
					this.qrcodeEle.clear();
					this.qrcodeEle.makeCode("a");					
				}else{
					this.qrcodeEle = new Qrcode(this.$refs.qrcodeContainer,{
						text: 'a',
						width:'164',
						height:'164',
					})

				}
			}
		}
	},
	components:{
		Carousel,
		Slide,
		ScrollNav,
		ScrollNavPanel,
		CustomSelect,
		Rate
	}
}