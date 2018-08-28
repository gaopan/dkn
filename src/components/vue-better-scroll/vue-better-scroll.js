import BetterScroll from "better-scroll"
export default{
	name:"vue-better-scroll",
	data(){
		return{
			scrollInstance:null,
			scrolledData:null,
			scrolledPartialData:null,
			refreshDely:20,
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
				this.scrollInstance = new BetterScroll(this.$refs.scrollerWrapper,{
					probeType:this.$props.probeType,
					scrollY:this.$props.scrollY
				})
				console.log(this.scrollInstance)
				this.scrollInstance.on("scrollEnd",(pos)=>{
					this.$emit("scrollEnd",pos)
				})
			})
	},
	mounted(){

	},
	methods:{
		scrollTo() { // 代理better-scroll的scrollTo方法 
			this.scrollInstance && this.scrollInstance.scrollTo.apply(this.scrollInstance, arguments) 
		}, 
		scrollToElement() { // 代理better-scroll的scrollToElement方法 
			this.scrollInstance && this.scrollInstance.scrollToElement.apply(this.scrollInstance, arguments) 
		},
		scrollToTargetContent(args){
			console.log(args)
		}

	},
	watch:{
		data:{
			handler:function(newV,oldV){
				let timer = setTimeout(()=>{
					if(!!this.scrollInstance){
						this.scrollInstance.refresh()
					}else{
						this.scrollInstance = new BetterScroll(this.$refs.scrollerWrapper,{
							probeType:this.$props.probeType,
							scrollY:this.$props.scrollY
						})
					}
					clearTimeout(timer)
				},this.refreshDely)
			},
			deep:true
		},
		partialData:{
			handler:function(newV,oldV){
				let timer = setTimeout(()=>{
					if(!!this.scrollInstance){
						this.scrollInstance.refresh()
					}else{
						this.scrollInstance = new BetterScroll(this.$refs.scrollerWrapper,{
							probeType:this.$props.probeType,
							scrollY:this.$props.scrollY
						})
					}
					clearTimeout(timer)
				},this.refreshDely)
			},
			deep:true
		}
	}
}