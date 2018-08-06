import StoreService from '@/services/store-services.js'

export default {
	name: "init",
	data(){
		return {
			storeId: StoreService.getStoreId()
		};
	},
	created(){
	},
	methods: {
		inited(){
			StoreService.setStoreId(this.storeId);

			this.$router.push('/index');
		}
	}
}