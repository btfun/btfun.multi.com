var express = require('express');
var router = express.Router();
var dateV=new Date();
var timeStamp= 'v='+dateV.getFullYear()+(dateV.getMonth()+1)+
                  dateV.getDate()+dateV.getHours()+dateV.getMinutes();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('shop/shop', {
       version: timeStamp,
       resourcesUrl:''
       });
});

module.exports = router;
