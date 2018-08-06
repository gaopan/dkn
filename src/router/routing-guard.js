/* Routing Guard
 * This the guard rail for the routing in the application 
 *  
 */
import TypeChecker from '../utils/type-checker.js'
import StoreService from '@/services/store-services.js'

function componentRule(to, from, next) {
  next();
}

function routingGuard(to, from, next) {

  if (to.matched.length == 0) {
    next({ path: from.path });
    console.warn("No Matched route found for: ");
    console.warn(to);
    return;
  }

  let storeId = StoreService.getStoreId();
  if(!storeId && to.fullPath != '/init') {
  	next({path: '/init'});
  	return;
  }

  if(to.name == "Home") {
  	next({path: '/index'});
  	return;
  }

  componentRule(to, from, next);
}

export default routingGuard;
