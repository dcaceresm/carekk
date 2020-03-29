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

router.get('/reglas', function(req, res, next) {
  res.render('rules');
});

router.get('/game/:gameId', function(req,res,next){  
  console.log(req.jajajaxd)
  res.render('game', {
    id : req.params.gameId
  })
})


router.get('/game/create', function(req,res,next){

})

router.post('/game/join', (req, res, next) => {
  if(req.body.room){
    let gm = req.app.get('gameManager')
    let exists = gm.getGame(req.body.room) || false 
    if(exists) res.redirect('/game/'+req.body.room)
    else res.redirect(404,'/')
  } else {
    res.redirect(400, '/')
  }
  
})
router.post('/game/create', function(req,res,next){  
  let gameRoom = false;
  let gm = req.app.get('gameManager')
  let roomID = "-1"
  if(gm.gameCount()==10) res.redirect('/game/create?full=true')  
  while(!gameRoom){
    roomID = Math.ceil(Math.random() * 10).toString();
    let exists = gm.getGame(roomID) || false    
    if(!exists){
      gm.addGame(roomID)
      gameRoom = gm.getGame(roomID)
    } 
  }  
  res.req.jajajaxd = true;
  res.redirect('/game/'+roomID);
  // res.render('game', {
  //   id:roomID,
  //   initButton: true
  // })
})


module.exports = router;
