// import shared from '@/shared.js'
// import flexibel from '@/utils/flexibel.js';


let maintenanceTimer = null;
export default {
  name: 'app',
  created: function() {
    var vm = this;

    window.rfidFromJava = function(rfid){
    	alert("RFID: " + rfid);
    	vm.$router.push('/product/' + rfid);
    };
  }
}