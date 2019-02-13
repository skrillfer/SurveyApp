var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/privacy',function(req,res,next){
  res.render('privacy',{title: "Privacy"});
})

module.exports = router;