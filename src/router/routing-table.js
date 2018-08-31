import TypeChecker from '../utils/type-checker.js'

let routerTable = {
  //This is for html5 history mode enablement
  // mode: 'history',
  routes: [{
    path: '/',
    name: 'Home',
    components: {
      default: () =>
        import ('@/modules/home/Home.vue')
    },
    children: [{
      path: 'init',
      name: 'Home Init',
      components: {
        default: () => import('@/modules/home/init/Init.vue')
      }
    }, {
      path: 'login',
      name: 'Home Login',
      components: {
        default: () => import('@/modules/home/login/Login.vue')
      },
    },{
      path: 'index',
      name: 'Home Index',
      components: {
        default: () => import('@/modules/home/index/Index.vue')
      }
    }, {
      path: 'product/:rfid',
      name: 'Product',
      components: {
        default: () => import('@/modules/home/product/Product.vue')
      }
    }, {
      path: 'error',
      name: 'Error Page',
      components: {
        default: () => import('@/modules/home/error/Error.vue')
      }
    }]

  }]
}

export default routerTable
