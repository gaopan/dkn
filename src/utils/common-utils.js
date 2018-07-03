import TypeChecker from './type-checker.js'

function clone(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

function arrToStr(arr) {
  var res = '[',
    itemArr = [];
  arr.forEach(function(item) {
    if (TypeChecker.isObject(item)) {
      itemArr.push(objToStr(item));
    } else if (TypeChecker.isArray(item)) {
      itemArr.push(arrToStr(item));
    } else {
      itemArr.push(item);
    }
  });
  return res + itemArr.join(',') + ']';
}

function objToStr(obj) {
  var keys = Object.keys(obj);
  keys.sort(function(a, b) {
    return a.localeCompare(b);
  });
  var res = '{',
    fieldArr = [];
  keys.forEach(function(key) {
    if (obj.hasOwnProperty(key)) {
      if (TypeChecker.isObject(obj[key])) {
        fieldArr.push(key + ":" + objToStr(obj[key]));
      } else if (TypeChecker.isArray(obj[key])) {
        fieldArr.push(key + ":" + arrToStr(obj[key]));
      } else {
        fieldArr.push(key + ":" + obj[key]);
      }
    }
  });
  return res + fieldArr.join(',') + '}';
}

function ascendSort_ObjectsInArray(data, key) {
  if (TypeChecker.isArray(data)) {
    data.sort((a, b) => {
      if (!TypeChecker.isUndefined(a[key]) && !TypeChecker.isUndefined(b[key])) {
        if (/^((\d+\.?\d*)|(\d*\.\d+))\%$/.test(a[key])) {
          var A = a[key].substr(0, a[key].length - 1),
            B = b[key].substr(0, b[key].length - 1);
          return Number(A) - Number(B);
        } else if ((typeof a[key]) != "number") {
          return a[key].localeCompare(b[key]);
        } else {
          return a[key] - b[key];
        }
      } else {
        console.warn("no data for ascend sort or some is undefined!")
      }
    });
  } else {
    console.warn("the ordered data should be a array")
  }
  return this.deepClone(data);
}

function descendSort_ObjectsInArray(data, key) {
  if (TypeChecker.isArray(data)) {
    data.sort((a, b) => {
      if (!TypeChecker.isUndefined(a[key]) && !TypeChecker.isUndefined(b[key])) {
        if (/^((\d+\.?\d*)|(\d*\.\d+))\%$/.test(a[key])) {
          var A = a[key].substr(0, a[key].length - 1),
            B = b[key].substr(0, b[key].length - 1);
          return Number(B) - Number(A);
        } else if ((typeof a[key]) != "number") {
          return b[key].localeCompare(a[key]);
        } else {
          return b[key] - a[key];
        }
      } else {
        console.warn("no data for descend sort or some is undefined!")
      }
    });
  } else {
    console.warn("the ordered data should be a array")
  }
  return this.deepClone(data);
}

function multistageSort(arr,type,labels){
  /**
    @param arr    array    the data to be sorted [{property1:1},{property2:2},{property3:3}]
    @param type   string   the type of sort  ("asc"||"desc")
    @param labels array    the property of being sorted  ["property1","property2","property3"]
  **/
  if(!TypeChecker.isArray(labels))return arr;
  if(!TypeChecker.isString(type)||TypeChecker.isUndefined(type))return arr;
  let fn = null;
  if(type == "asc"){
    fn = "ascendSort_ObjectsInArray";
  }else if(type == "desc"){
    fn = "descendSort_ObjectsInArray";
  }

  labels.forEach((label_d,label_i)=>{
    
    if(label_i==0)this[fn](arr,label_d);

    if(label_i !== 0){
      let arrMultistage = [],newArr = [];

      arr.forEach((arr_d,arr_i)=>{
        if(arr_i==0||labelSeparate(arr,arr_i,labels,label_i)){
          arrMultistage.push([])
        }
        arrMultistage[arrMultistage.length-1].push(arr_d);
      })

      arrMultistage.forEach(arrMult=>{
        arrMult.forEach(item=>{
          this[fn](arrMult,label_d);
        })        
      })

      arrMultistage.forEach(arrMult=>{
        arrMult.forEach(item=>{
          newArr.push(item)
        })
      })

      arr = newArr
    }
  })

  function labelSeparate(arr,arrIndex,labels,deepth){
    for(let i = 1;i < deepth+1; i++){
      let prevLabel = labels[i-1];
      if(arr[arrIndex-1][prevLabel]!==arr[arrIndex][prevLabel]){
        return true
      }
    }
    return false;
  } 
  return arr;
}

function downloadFile(data, type, fileName) {
  let link = document.createElement('a');

  link.download = fileName;
  link.href = window.URL.createObjectURL(new Blob([data], { type: 'application/' + type }));
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}

function getEventPath(event) {
  //6 March 2018: adib.ghazali@hpe.com - IE10+ not recognize event.path
  // Refs - https://github.com/jsdom/jsdom/issues/1563

  if (event.path) {
    return event.path;
  }

  let path = [];
  let target = event.target;

  while (target.parentNode) {
    path.push(target);
    target = target.parentNode;
  }

  path.push(document, window);

  return path;

}

function checkedFirstNumber(number) {
  let arr = number.split(''),
    str = '';

  if (arr[0] == 0) {
    arr.splice(1, 0, '.')
  };
  arr.forEach(o => {
    str = str + o;
  });
  return parseFloat(str);
}

function formatStrToObj(s) {
  var arr = s.split(''),
    str = '',
    strToObj = [];
  str = arr[0];
  for (var i = 1; i < arr.length; i++) {
    var isLastNum = arr[i - 1].charCodeAt() > 47 && arr[i - 1].charCodeAt() < 58 ? true : false;
    var isThisNum = arr[i].charCodeAt() > 47 && arr[i].charCodeAt() < 58 ? true : false;
    if (isLastNum === isThisNum) {
      str = str + arr[i]
    } else {
      var splitStr = {};
      splitStr.str = str;
      splitStr.type = str.charCodeAt() > 47 && str.charCodeAt() < 58 ? 'Number' : 'String';
      strToObj.push(splitStr);
      str = arr[i];
    }
  }
  var splitStr = {};
  splitStr.str = str;
  splitStr.type = str.charCodeAt() > 47 && str.charCodeAt() < 58 ? 'Number' : 'String';
  strToObj.push(splitStr);
  return strToObj;
}

function compareFromLTS(prop) {
  return function(obj1, obj2) {
    var vm = this;
    var val1 = obj1[prop].toLowerCase();
    var val2 = obj2[prop].toLowerCase();

    var o1 = formatStrToObj(val1);
    var o2 = formatStrToObj(val2);
    for (var i = 0; i < o1.length; i++) {
      if (o1[i] == null && o2[i] != null) {
        return -1
      } else if (o1[i] != null && o2[i] == null) {
        return 1
      }

      if (o1[i].type != o2[i].type) {
        if (o1[i].str < o2[i].str) {
          return -1;
        } else if (o1[i].str > o2[i].str) {
          return 1;
        }
      } else {
        if (o1[i].type === 'Number') {
          o1[i].str = checkedFirstNumber(o1[i].str);
          o2[i].str = checkedFirstNumber(o2[i].str);
        }
        if (o1[i].str < o2[i].str) {
          return -1;
        } else if (o1[i].str > o2[i].str) {
          return 1;
        }
      }
    }
    return 0
  }
}

function compareFromSTL(prop) {
  return function(obj1, obj2) {
    var vm = this;
    var val1 = obj1[prop].toLowerCase();
    var val2 = obj2[prop].toLowerCase();

    var o1 = formatStrToObj(val1);
    var o2 = formatStrToObj(val2);

    for (var i = 0; i < o1.length; i++) {
      if (o1[i] == null && o2[i] != null) {
        return 1
      } else if (o1[i] != null && o2[i] == null) {
        return -1
      }

      if (o1[i].type != o2[i].type) {
        if (o1[i].str < o2[i].str) {
          return 1;
        } else if (o1[i].str > o2[i].str) {
          return -1;
        }
      } else {
        if (o1[i].type === 'Number') {
          o1[i].str = checkedFirstNumber(o1[i].str);
          o2[i].str = checkedFirstNumber(o2[i].str);
        }
        if (o1[i].str < o2[i].str) {
          return 1;
        } else if (o1[i].str > o2[i].str) {
          return -1;
        }
      }
    }
    return 0
  }
}

export default {
  deepClone: clone,
  toString: function(obj) {
    if (!obj) {
      return obj;
    }
    return objToStr(obj);
  },
  ascendSort_ObjectsInArray,
  descendSort_ObjectsInArray,
  multistageSort,
  downloadFile,
  eventPath: getEventPath,
  compareFromLTS,
  compareFromSTL
}
