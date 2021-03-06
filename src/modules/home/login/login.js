import IndexApi from '@/api/modules/home/index.js'
import TokenService from '@/services/token-services.js'
import axios from 'axios'
export default {
	name: 'login',
	data(){
		return {
			name: '',
			password: '',
			loginFailed:false
		};
	},
	methods: {
		login(){
			this.loginFailed = false;
			IndexApi.login(this.name, this.password).then(res => {
				// axios.common.headers['Authorization'] = 'Basic ' + res.data.token;		
				axios.defaults.headers.common['Authorization'] = 'Basic ' + res.data.token;
				TokenService.setToken({
					storeId: this.name,
					token: res.data.token
				});
				this.$router.push('/index');
			},
			err=>{
				this.loginFailed = true;
			});
		}
	}
}