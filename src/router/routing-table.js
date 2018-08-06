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
    }]

  }]
}

export default routerTable
