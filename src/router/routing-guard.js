/* Routing Guard
 * This the guard rail for the routing in the application 
 *  
 */
import TypeChecker from '../utils/type-checker.js'
import TokenService from '@/services/token-services.js'

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


  let token = TokenService.getToken();
  if(!token && to.fullPath != '/login') {
    next({path: '/login'});
    return;
  }

  if(to.name == "Home") {
  	next({path: '/index'});
  	return;
  }

  componentRule(to, from, next);
}

export default routingGuard;
