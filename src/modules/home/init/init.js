import StoreService from '@/services/store-services.js'

let storeId = StoreService.getStoreId();

export default {
  name: "init",
  data() {
    return {
      storeId: (storeId&&storeId== "null")||!storeId ? "" : StoreService.getStoreId()
    };
  },
  created() {},
  methods: {
    inited() {
      if (!!this.storeId) {
        let vm = this;
        StoreService.setStoreId(this.storeId);
        setTimeout(function() {
          vm.$router.push('/index');
        }, 0);
      }
    },
    inputStoreId(event) {
      event = event || window.event;
      let numberShift = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
      let keyCode = event.keyCode,
        bNumberKey = (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105),
        validKey = ["ArrowLeft", "ArrowRight", "Tab", "Home", "End", "Backspace"];
      if (!(bNumberKey || validKey.includes(event.key)) || numberShift.includes(event.key)) { //invalid key
        event.preventDefault();
        return
      }
    }

  }
}
