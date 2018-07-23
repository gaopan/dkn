import { Carousel,Slide } from "@/components/carousel"
import {ScrollNav, ScrollNavPanel} from "@/components/scrollNav"
import CustomSelect from "@/components/custom-select"

import ProductApi from "@/api/modules/product/productInfo.js"

import tree from "@/assets/picture/tree.jpg"
import beach from "@/assets/picture/beach.jpg"
import mountains from "@/assets/picture/mountains.jpg"

import tree1 from "@/assets/picture/tree1.jpg"
import beach1 from "@/assets/picture/beach1.jpg"
import mountains1 from "@/assets/picture/mountains1.jpg"

let dataInfo = {
	"DesignedFor" : "PRODUCT BENEFITS"
}
export default {
	name: 'product',
	props: {
		rfid: {
			// required: true
		}
	},
	data(){
		return{
			imageUrl:[tree,beach,mountains,tree1,beach1,mountains1],
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
      sizeSelected:{
      	label:null,
      	value:null
      },
      bShowShadow:false,

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
						videos.push(d.link);
					})
				}

				if(d.Images&&d.Images.length){
					d.Images.forEach(d=>{
						images.push(d.link);
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
					videosAndImages:[...videos,...images],
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

			let score = 0;
			this.productInfoData = res.data.dsm;
			this.productReviews = res.data.reviews;
			this.productReviews.forEach(d => {
				score += ~~d.note
			})
			this.productScore = (score/this.productReviews.length).toFixed(2);

		},err=>{
			console.log(err)
		})

	},
	methods:{
		selectProductColor(color,colorIndex){
			this.productColors.forEach(d=>{
				d.checked = false;
			})
			color.checked = true;

      this.productAllInfoByColor.every(d=>{
      	if(d.colorName == color.colorName){
		      this.productInfoByCurrentColor = Object.assign({},d);
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
			// let productSize = this.productInfoByCurrentColor.items[0];
			// this.productInfoByCurrentSize =  Object.assign({},{stock:productSize.Stock,price:productSize.prices})
      // this.sizeSelected = Object.assign({},{label:productSize.SizeValueLabel,value:productSize.SizeValueId}) 


		},
		handleSlideClick(){},
		activeNavIndexChanged(args){
			console.log(args)
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
			console.log(args)
			this.bShowShadow = args;
		},
	},
	components:{
		Carousel,
		Slide,
		ScrollNav,
		ScrollNavPanel,
		CustomSelect
	}
}