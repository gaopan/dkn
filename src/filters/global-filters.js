export default {
  listItem: function(keyValue, list, key, fieldToDisplay) {
    var res = '';
    list.every(function(item) {
      if (item[key] == keyValue) {
        res = item[fieldToDisplay];
        return false;
      }
      return true;
    });
    return res;
  }
}