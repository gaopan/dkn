import TokenService from '@/services/token-services.js'

export default{
	name:"error-page",
	data(){
		return{
			countdown:10,
			lang:null,
			timer:null,
      pageInfoLabel: {
        error1: { MY: "OOPS!", EN: "OOPS!", ZH: "糟糕！" },
        error2: { MY: "The product information seems missing.",EN: "The product information seems missing.", ZH: "似乎找不到此產品資訊," },
        error3: { MY: "Please try later or call our teammates to help you.",EN: "Please try later or call our teammates to help you.", ZH: "請稍後再試或尋找現場服務人員協助." },
        errorBack: { MY: "Back to Index in ",EN: "Back to Index in ", ZH: "返回首頁" },
      }			
		}
	},
	created(){
    let defaultLang = TokenService.getLang();

    this.lang = defaultLang == 'EN' ? "MY" : "ZH";
		
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
		clearInterval(this.timer);
	},
	methods:{

	},
  watch: {
  }
}