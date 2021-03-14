exports.getMatchedValue = (str, arr) => {
  var res = "";
  if (str) {
    for (var i = 0; i < arr.length; i++) {
      var value = arr[i];
      var re = new RegExp(value, "g");
      res = str.match(re);
      if(res) {
        if (res[0] == value) {
          break;
        }
      }
    }
    if(res) {
      return res[0];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
