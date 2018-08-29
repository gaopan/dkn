import BetterScroll from "better-scroll"
export default{
	name:"vue-better-scroll",
	data(){
		return{
			scrollInstance:null,
			scrolledData:null,
			scrolledPartialData:null,
			refreshDely:20,
			activeIndex:0,
			scrollCellsEle:null,
			scrollCellsEleTop:[],
			scrollContentEle:null,
			translateValue:0,
			firstCellTop:0,
			scrollTimer:null
		}
	},
	props:{
		/** 
			* 1 滚动的时候会派发scroll事件，会截流。 
			* 2 滚动的时候实时派发scroll事件，不会截流。 
			* 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件 
		*/
		probeType: { 
			type: Number, 
			default: 1 
		},	
		scrollY:{
			type:Boolean,
			default:true
		},
		scrollX:{
			type:Boolean,
			default:false
		},
		list:{
			type:Array
		},
		data:{
			type:Object
		},
		partialData:{
			type:Array
		},
		lang:String
	},
	created(){
			this.$nextTick(()=>{
				this.scrollCellsEle = document.querySelectorAll(".scroll-content li");
				this.scrollContentEle = document.querySelector(".scroll-content");
				this.contentOffsetTop = this.$refs.scrollerWrapper.getBoundingClientRect().top;

				for(let i = 0, len = this.scrollCellsEle.length;i < len; i++){

					this.scrollCellsEleTop.push(this.scrollCellsEle[i].getBoundingClientRect().top - this.contentOffsetTop)

				}

				//init scroller
				this.scrollInstance = new BetterScroll(this.$refs.scrollerWrapper,{
					probeType:this.$props.probeType,
					scrollY:this.$props.scrollY,
					momentum:true,
					swipeTime:1200,
					// observeDOM:false,
					bounce: {
					  top: false,
					  bottom: false,
					  left: false,
					  right: false
					}
				})

				//bind scrollEnd event
				this.scrollInstance.on("scrollEnd",(pos)=>{
					clearInterval(this.scrollTimer);
					this.$emit("scrollEnd",pos)
				})

				this.scrollInstance.on("scroll",(pos,pos_)=>{
					this.$emit("scroll",pos)
				})

				this.scrollInstance.on("scrollStart",(pos)=>{

					this.scrollTimer = setInterval(()=>{
						let transformStyle = this.getStyle(this.scrollContentEle,"transform"),
								transformStyleArr = transformStyle.split(","),
								translateValue = Math.abs(parseInt(transformStyleArr[transformStyleArr.length-1])),
								firstCellTop = this.scrollCellsEle[0].getBoundingClientRect().top;
						
						let viewHeight = firstCellTop < this.firstCellTop ? 100:881;
						this.firstCellTop = firstCellTop;
						// console.log("contentOffsetTop: ",this.contentOffsetTop)
						// console.log("======")
						let newActiveIndex = null;
						for(let i = 0, len = this.scrollCellsEle.length;i < len; i++){

							// console.log("top: ",this.scrollCellsEle[i].getBoundingClientRect().top)
							if(this.scrollCellsEle[i].getBoundingClientRect().top + viewHeight > this.contentOffsetTop){
								if(i != this.activeIndex){
									this.activeIndex = i;
									this.scrollContentEle.style.transform = `translate(0, ${- this.scrollCellsEleTop[i]}px)`
									this.$emit("activeIndexChange",i)
									// clearInterval(this.scrollTimer);
								}
								break;
							}		

						}
						// console.log("======")						
					},200)
					
					this.$emit("scrollStart",pos)

				})

			})
	},
	mounted(){

	},
	methods:{
		 getStyle(ele,attr){
        if (ele.currentStyle) {
            return ele.currentStyle[attr];
        } else {
            return getComputedStyle(ele,false)[attr];
        }
    },
		scrollTo() { 
			this.scrollInstance && this.scrollInstance.scrollTo.apply(this.scrollInstance, arguments) 
		}, 
		scrollToElement() {  
			this.scrollInstance && this.scrollInstance.scrollToElement.apply(this.scrollInstance, arguments) 
		},
		scrollToTargetContent(item, itemIndex){
			this.activeIndex = itemIndex;
			this.$emit("activeIndexChange",itemIndex)
			this.scrollInstance.scrollToElement("#"+item.id, 500, 0, 0)
		},

		refreshScroll(){
			let timer = setTimeout(()=>{
				if(!!this.scrollInstance){
					this.scrollInstance.refresh()
				}
				clearTimeout(timer)
			},this.refreshDely)			
		}

	},
	watch:{
		data:{
			handler:function(newV,oldV){
				this.refreshScroll();
			},
			deep:true
		},
		partialData:{
			handler:function(newV,oldV){
				this.refreshScroll();
			},
			deep:true
		},
		activeIndex(newV,oldV){
			this.refreshScroll();		
		}
	}
}