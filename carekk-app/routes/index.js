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


router.get('/game/create', function(req,res,next){

})


router.post('/game/create', function(req,res,next){
  console.log(new Date(), "received Room creation request.")
  let gameRoom = false;
  let gm = req.app.get('gameManager')
  let roomID = "-1"
  if(gm.gameCount()==10) res.redirect('/game/create?full=true')
  console.log(new Date(), "Available Rooms. Creating Game.")
  while(!gameRoom){
    roomID = Math.ceil(Math.random() * 10).toString();
    console.log(new Date(), "Trying to create room with ID ", roomID)
    let exists = gm.getGame(roomID) || false    
    if(!exists){
      gm.addGame(roomID)
      gameRoom = gm.getGame(roomID)
    } 
  }
  console.log(new Date(), "Game created successfully, redirecting...")
  res.redirect('/game/'+roomID)
})


module.exports = router;