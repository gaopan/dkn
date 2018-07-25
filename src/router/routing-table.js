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
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'Home Index',
      components: {
        default: () => import('@/modules/home/index/Index.vue')
      }
    }, {
      path: 'product',
      // path: 'product/:rfid',
      name: 'Product',
      components: {
        default: () => import('@/modules/home/product/Product.vue')
      }
    }]

  }]
}

export default routerTable
