import TypeChecker from './type-checker.js'

export default {
  convertSecondToStr: function(duration, precision) {
    precision = precision || 0;
    var divisorOfMinute = 60,
      divisorOfHour = 60 * 60,
      divisorOfDay = 60 * 60 * 24;
    // Seconds -> Minutes -> Hours -> Days
    if (!TypeChecker.isNumber(duration)) return 'N/A';
    if (duration / divisorOfMinute < 1) {
      return duration.toFixed(precision) + ' seconds';
    } else if (duration / divisorOfHour < 1) {
      return (duration / divisorOfMinute).toFixed(precision) + ' minutes';
    } else if (duration / divisorOfDay < 1) {
      return (duration / divisorOfHour).toFixed(precision) + ' hours';
    } else {
      return (duration / divisorOfDay).toFixed(precision) + ' days';
    }
  },
  convertedUnitFromSecond: function(duration, precision) {
    precision = precision || 0;
    var divisorOfMinute = 60,
      divisorOfHour = 60 * 60,
      divisorOfDay = 60 * 60 * 24;
    // Seconds -> Minutes -> Hours -> Days
    if (!TypeChecker.isNumber(duration)) return '';
    if (duration / divisorOfMinute < 1) {
      return ' secs';
    } else if (duration / divisorOfHour < 1) {
      return ' mins';
    } else if (duration / divisorOfDay < 1) {
      return ' hours';
    } else {
      return ' days';
    }
  },
  convertValueFromSecond: function(duration, precision) {
    precision = precision || 0;
    var divisorOfMinute = 60,
      divisorOfHour = 60 * 60,
      divisorOfDay = 60 * 60 * 24;
    // Seconds -> Minutes -> Hours -> Days
    if (!TypeChecker.isNumber(duration)) return 'N/A';
    if (duration / divisorOfMinute < 1) {
      return duration.toFixed(precision);
    } else if (duration / divisorOfHour < 1) {
      return (duration / divisorOfMinute).toFixed(precision);
    } else if (duration / divisorOfDay < 1) {
      return (duration / divisorOfHour).toFixed(precision);
    } else {
      return (duration / divisorOfDay).toFixed(precision);
    }
  },
  convertNumberToStr: function(number, precision) {
    var s = number + "";
    if (s.indexOf('.') < 0) {
      s += '.';
      for (var i = 0; i < precision; i++) {
        s += "0";
      }
      return s;
    }
    return number.toFixed(precision);
  },
  convertSecondToStr1: function(duration, precision) {
    precision = precision || 0;
    var divisorOfMinute = 60,
      divisorOfHour = 60 * 60,
      divisorOfDay = 60 * 60 * 24;
    // Seconds -> Minutes -> Hours -> Days
    if (!TypeChecker.isNumber(duration)) return '';
    if (duration < 0) {
      return '';
    } else {
      if (duration / divisorOfMinute < 1) {
        return duration.toFixed(precision) + ' s';
      } else if (duration / divisorOfHour < 1) {
        return (duration / divisorOfMinute).toFixed(precision) + ' m';
      } else if (duration / divisorOfDay < 1) {
        return (duration / divisorOfHour).toFixed(precision) + ' h';
      } else {
        return (duration / divisorOfDay).toFixed(precision) + ' d';
      }
    }
  },
  convertUrlStr: function(oQuery) {
    if (!TypeChecker.isObject(oQuery)) return '';

    var sQuery = '?', k;

    for (k in oQuery) {
      if (TypeChecker.isArray(oQuery[k])) {
        if (oQuery[k].length) {
          oQuery[k].forEach(function(ele){ 
            if (!TypeChecker.isUndefined(ele) && !TypeChecker.isNull(ele)) {
              sQuery += encodeURIComponent(k) + '=' + encodeURIComponent(ele.toString()) + '&';
            }
          });
        }
      } else {
        if (!TypeChecker.isUndefined(oQuery[k]) && !TypeChecker.isNull(oQuery[k])) {
          sQuery += encodeURIComponent(k) + '=' + encodeURIComponent(oQuery[k].toString()) + '&';
        }
      }
    }

    return sQuery.substr(0, sQuery.length - 1);
  }
}
