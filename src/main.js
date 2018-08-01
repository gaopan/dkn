// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'

// import store from './store'
// import shared from './shared'
// import WebSocket from './utils/web-socket'
// import './directives'
// import './filters'
// import VeeValidate from 'vee-validate'
// import isURL from 'validator/lib/isURL';


let bootstrap = function() {

  Vue.config.productionTip = false

  const config = {
    errorBagName: 'errors', // change if property conflicts.
    fieldsBagName: 'fields',
    delay: 0,
    locale: 'en',
    dictionary: null,
    strict: true,
    enableAutoClasses: false,
    classNames: {
      touched: 'touched', // the control has been blurred
      untouched: 'untouched', // the control hasn't been blurred
      valid: 'valid', // model is valid
      invalid: 'invalid', // model is invalid
      pristine: 'pristine', // control has not been interacted with
      dirty: 'dirty' // control has been interacted with
    }
  };

  // Vue.use(VeeValidate, config);
  Vue.use(config);

  //     Temporary Fix for Vee-validate bug (Added 6/2/2018 - Fakhrul)
  //     Reference: https://stackoverflow.com/questions/46858242/vue-vee-validate-marking-valid-urls-as-invalid
  // const urlFixRule = (value) => {
  //   return isURL(value, {
  //     require_tld: false
  //   });
  // };
  // VeeValidate.Validator.extend('url', urlFixRule);

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    // store,
    router,
    template: '<App/>',
    components: { App }
  })
}


bootstrap();

