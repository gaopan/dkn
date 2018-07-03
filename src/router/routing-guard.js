/* Routing Guard
 * This the guard rail for the routing in the application 
 *  
 */
import TypeChecker from '../utils/type-checker.js'

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

  componentRule(to, from, next);
}

export default routingGuard;
