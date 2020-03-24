var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', 
    { 
      title: 'CareKK',
      beta: true
    });
});


router.get('/game/:gameId', function(req,res,next){  
  res.render('game', {
    id : req.params.gameId
  })
})




module.exports = router;
