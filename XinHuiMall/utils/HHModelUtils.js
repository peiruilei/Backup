var encryptUtils = require("HHEncryptUtils.js")

function getList(res) 
{
   var list = []
   for (var i = 0; i < res.length; i++) {
      var item = {}
      for (var key in res[i]) {

         var value = res[i][key]
         var v_type = typeof (value)
         if (v_type == "object")
          {
            if (isArray(value)) {
               var itemList = getList(value)
               item[key] = itemList
            } else {
               var itemModel = getModel(value)
               item[key] = itemModel

            }

         } else {
            item[key] = encryptUtils.base64Decode(value)
         }
      }
      list = list.concat(item)
   }

   return list
}

function getModel(res) {
   var model = {}
   for (var key in res) {

      var value = res[key]
      var v_type = typeof (value)
      if (v_type == "object") {
         if (isArray(value)) {
            var itemList = getList(value)
            model[key] = itemList
         } else {
            var itemModel = getModel(value)
            model[key] = itemModel

           

         }

      } else {
         model[key] = encryptUtils.base64Decode(value)
      }
   }
   return model


}

var isArray = function (obj) {
   return Object.prototype.toString.call(obj) === '[object Array]';
}
module.exports =
   {
      getList: getList,
      getModel: getModel
   }