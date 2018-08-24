
export default{
	name:"error-page",
	data(){
		return{
			countdown:10
		}
	},
	created(){
		
		this.timer = setInterval(()=>{
			if(this.countdown == 0){
				clearInterval(this.timer);
				this.$router.push("/index")
			}else{
				this.countdown -= 1;
			}
		},1000) 
	},
	beforeDestroy(){

	},
	methods:{

	},
	watch:{

	}
}