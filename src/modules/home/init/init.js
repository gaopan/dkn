import StoreService from '@/services/store-services.js'

export default {
  name: "init",
  data() {
    return {
      storeId: StoreService.getStoreId()
    };
  },
  created() {},
  methods: {
    inited() {
    	let vm = this;
      StoreService.setStoreId(this.storeId);
      setTimeout(function() {
        vm.$router.push('/index');
      }, 0);
    }
  }
}
