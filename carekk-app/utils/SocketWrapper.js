const names = ['diamond', 'heart', 'pike', 'club']


class SocketWrapper {

    constructor(io, gameManager){
        this._io = io // Socket IO
        this._gameManager = gameManager;
    }


    config(){
        let that = this;
        this._io.on('connection', (socket) => {
            
            
            socket.emit('news', { hello: 'world' });

            socket.on('roomConnection',(data) => {              
              console.log("Attempting connection to Game Room room"+data.room);    
              let game = that._gameManager.getGame(data.room)
              if(game){
                  console.log(socket.id)          
                  socket.join('room'+data.room)
                  const newPlayer = names[Math.floor(Math.random()*3)]+Math.floor(Math.random()*1000) 
                  game.addPlayer(newPlayer, socket.id)
                  console.log(new Date(), "Player", newPlayer, "joined game with ID", data.room)
                  socket.emit('playerData', {name : newPlayer})
                  that._io.to('room'+data.room).emit('playerList', {players : game.getPlayerList()});
                  socket.playerName = newPlayer
                  socket.roomNumber = data.room
              }
              else{
                  console.log("[404] ERROR: La sala de juegos invocada no existe. ( Sala",data.room,')')
              }

              socket.on('startGame', (data)=>{
                console.log(new Date(), "Game start by", data.initPlayer)
                let gm = that._gameManager.getGame(socket.roomNumber)


                gm.switchPlaying(socket.playerName) 
                                
                gm.getPlayerList().map(pl => {
                  gm.fillHand(pl)
                  socket.broadcast.to(gm.getPlayerSocket(pl)).emit('updatePlayerData',{
                    currentHand : gm.getHand(pl, {format:"tuple"})
                  })
                  if(pl === socket.playerName){
                    socket.emit('updatePlayerData',{
                      currentHand : gm.getHand(pl, {format:"tuple"})
                    })
                  }
                });

                that._io.to('room'+socket.roomNumber).emit('updatePlayerData', {
                    canPlay:'no ',                                          
                  }
                );

                gm.startGame();
                socket.emit('updatePlayerData',{ canPlay: ' '})
                    that._io.to('room'+socket.roomNumber).emit('updateGameData', {
                      cardCount : gm.getDeckCards().toString(),
                      topCard : (gm.topCard() ? gm.topCard().toTuple() : ["", ""])                  
                    }
                );
              })


              socket.on('drawAndPlay', ()=>{
                let gm = that._gameManager.getGame(socket.roomNumber)

                gm.drawCard(socket.playerName)
                that._io.to('room'+socket.roomNumber).emit('updateGameData', {
                      cardCount : gm.getDeckCards().toString()
                    }
                );
                
                
                socket.emit('updatePlayerData',{
                  currentHand : gm.getHand(socket.playerName, {format:"tuple"})
                })
              })
              
              socket.on('drawDiscard', () => {   
                
                let gm = that._gameManager.getGame(socket.roomNumber)      
                if(!gm.canPlay(socket.playerName)){
                  socket.emit('updatePlayerData',{
                    warning : "Aún no es tu turno"
                  })
                  return;
                }          

                if(gm._discard.length() == 0){
                  socket.emit('updatePlayerData',{
                    warning : "LA PILA ESTÁ VACÍA!!"
                  })
                  return;
                }
                gm.pickDiscard(socket.playerName)

                that._io.to('room'+socket.roomNumber).emit('updateGameData', {
                      cardCount : gm.getDeckCards().toString(),
                      topCard : (gm.topCard() ? gm.topCard().toTuple() : ["", ""]),    
                    }
                );
                let nextPlayer = gm.prevPlayer();
                gm.switchPlaying(socket.playerName) //ends current player's turn
                socket.emit('updatePlayerData',{
                  canPlay : 'no ',
                  currentHand : gm.getHand(socket.playerName, {format:"tuple"})
                })
                gm.switchPlaying(nextPlayer) //next player available
                console.log(new Date(), "next player socket:", gm.getPlayerSocket(nextPlayer))
                socket.broadcast.to(gm.getPlayerSocket(nextPlayer)).emit('updatePlayerData', {
                    canPlay : ' '  
                  }
                );
              })

              socket.on('playCard', (data) => {
                  let gm = that._gameManager.getGame(socket.roomNumber)
                  if(!gm.canPlay(socket.playerName)){
                    socket.emit('updatePlayerData',{
                      warning : "Aún no es tu turno"
                    })
                    return;
                  }
                  if(data.card){
                    let cardTuple = data.card;
                    let cardToPlay = gm.getHand(socket.playerName, {}).pickCardFromTuple(cardTuple)
                    socket.emit('updatePlayerData',{
                      currentHand : gm.getHand(socket.playerName, {format:"tuple"})
                    })
                    if( cardToPlay.canPlayOver(gm.topCard()) ){
                      gm.playCard(cardToPlay)
                      cardToPlay.callEffect(gm)

                      that._io.to('room'+socket.roomNumber).emit('updateGameData', {
                          cardCount : gm.getDeckCards().toString(),
                          topCard : (gm.topCard() ? gm.topCard().toTuple() : ["", ""]),                                                  
                        }
                      );

                      let nextPlayer = gm.nextPlayer();
                      gm.switchPlaying(socket.playerName) //ends current player's turn
                      gm.fillHand(socket.playerName)
                      socket.emit('updatePlayerData',{
                        canPlay : (socket.playerName === nextPlayer ? ' ' : 'no '),
                        currentHand : gm.getHand(socket.playerName, {format:"tuple"})
                      })
                      gm.switchPlaying(nextPlayer) //next player available
                      console.log(new Date(), "next player socket:", gm.getPlayerSocket(nextPlayer))
                      socket.broadcast.to(gm.getPlayerSocket(nextPlayer)).emit('updatePlayerData', {
                          canPlay : ' '  
                        }
                      );
                    }
                    else {
                      gm.addToHand(socket.playerName, cardToPlay)
                      socket.emit('updatePlayerData',{
                        warning : "No puedes jugar esta carta",
                        currentHand : gm.getHand(socket.playerName, {format:"tuple"})
                      })
                    }
                  }
              })

              socket.on('disconnect', () => {
                let gm = that._gameManager.getGame(data.room)
                gm.removePlayer(socket.playerName)
                that._io.to('room'+data.room).emit('playerList', {players : gm.getPlayerList()});
              })    

              
            });
            

          });  
          
          
    }
}




module.exports = SocketWrapper;