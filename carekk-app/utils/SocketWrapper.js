const names = ['ca_cos@', 'c4qui_', 'KK', 'el_cacas_']


class SocketWrapper {

    constructor(io, gameManager){
        this._io = io // Socket IO
        this._gameManager = gameManager;
    }


    config(){
        let that = this;
        this._io.on('connection', (socket) => {
            
            socket.on('chatMsg', (data)=>{
              that._io.to('room'+socket.roomNumber).emit('chatBroadcast', {
                message:data.msg,
                user: socket.playerName, 
                color: "#9cbb11"
              });  
            })
            socket.emit('news', { hello: 'world' });
            socket.on('roomConnection',(data) => {                            
              let game = that._gameManager.getGame(data.room)
              if(game){                     
                  if(game._status === "started") {
                    socket.emit('idxredir', {alert : "Este juego ya comenzó"})
                    return;
                  }
                  socket.join('room'+data.room)
                  const newPlayer = names[Math.floor(Math.random()*4)]+Math.floor(Math.random()*1000) 
                  if(!game.addPlayer(newPlayer, socket.id)) {
                    socket.emit('initButton')
                  }
                  socket.emit('playerData', {name : newPlayer})
                  that._io.to('room'+data.room).emit('playerList', {players : game.getPlayerList()});
                  socket.playerName = newPlayer
                  socket.roomNumber = data.room

                  game.getPlayerList().map(pl => {   
                    console.log(pl)                 
                    that._io.to('room'+socket.roomNumber).emit('generatePlayerTable',{
                      currentHand : game.getHand(pl, {format:"tuple"}).length,
                      currentHTriplet : game.getHiddenTriplet(pl, {format:"tuple"}).length,
                      currentVTriplet : game.getVisibleTriplet(pl, {format:"tuple"}),
                      playerID : game.getPlayerSocket(pl),
                      playerName: pl
                    })
                  });
              }
              else{
                  socket.emit('idxredir', {alert : "esta sala no tiene jugadores, redirigiendo..."})                  
              }

              socket.on('startGame', (data)=>{
                let gm = that._gameManager.getGame(socket.roomNumber)        
                gm.switchPlaying(socket.playerName)                                 
                gm.getPlayerList().map(pl => {
                  gm.fillHand(pl)
                  gm.initVisibleTriplet(pl)
                  gm.initHiddenTriplet(pl)
                  socket.broadcast.to(gm.getPlayerSocket(pl)).emit('updatePlayerData',{
                    currentHand : gm.getHand(pl, {format:"tuple"}),
                    currentHTriplet : gm.getHiddenTriplet(pl, {format:"tuple"}),
                    currentVTriplet : gm.getVisibleTriplet(pl, {format:"tuple"}),
                  })
                  if(pl === socket.playerName){
                    socket.emit('updatePlayerData',{
                      currentHand : gm.getHand(pl, {format:"tuple"}),
                      currentHTriplet : gm.getHiddenTriplet(pl, {format:"tuple"}),
                      currentVTriplet : gm.getVisibleTriplet(pl, {format:"tuple"}),
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
                  topCard : (gm.topCard() ? gm.topCard().toTuple() : ["", ""]),                      
                  burntCard: (gm.topBurnt() ? gm.topBurnt().toTuple() : null)             
                });

                gm.getPlayerList().map(pl => {   
                  console.log(pl)                 
                  that._io.to('room'+socket.roomNumber).emit('updatePlayerTable',{
                    currentHand : gm.getHand(pl, {format:"tuple"}).length,
                    currentHTriplet : gm.getHiddenTriplet(pl, {format:"tuple"}).length,
                    currentVTriplet : gm.getVisibleTriplet(pl, {format:"tuple"}),
                    playerID : gm.getPlayerSocket(pl),
                    playerName: pl
                  })
                });

              })

              
              socket.on('drawDiscard', () => {   
                
                let gm = that._gameManager.getGame(socket.roomNumber)      
                if(!gm.canPlay(socket.playerName)){
                  socket.emit('updatePlayerData',{
                    warning : "Aún no es tu turno."
                  })
                  return;
                }          

                if(gm._discard.length() == 0){
                  socket.emit('updatePlayerData',{
                    warning : "No hay cartas para sacar de la mesa."
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
                socket.broadcast.to(gm.getPlayerSocket(nextPlayer)).emit('updatePlayerData', {
                    canPlay : ' '  
                  }
                );
                
                gm.getPlayerList().map(pl => {   
                  console.log(pl)                 
                  that._io.to('room'+socket.roomNumber).emit('updatePlayerTable',{
                    currentHand : gm.getHand(pl, {format:"tuple"}).length,
                    playerID : gm.getPlayerSocket(pl),
                    playerName: pl
                  })
                });
                
                
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
                    if( cardToPlay.canPlayOver(gm.topCard()) ){
                      gm.playCard(cardToPlay)
                      cardToPlay.callEffect(gm)                  
                      that._io.to('room'+socket.roomNumber).emit('updateGameData', {
                          cardCount : gm.getDeckCards().toString(),
                          topCard : (gm.topCard() ? gm.topCard().toTuple() : ["", ""]), 
                          burntCard: (gm.topBurnt() ? gm.topBurnt().toTuple() : null),                                                  
                        }
                      );
                      
                      console.log(new Date(), "updating", socket.playerName, "hand to other players")          
                      gm.getPlayerList().map(pl => {   
                        that._io.to('room'+socket.roomNumber).emit('updatePlayerTable',{
                          currentHand : gm.getHand(pl, {format:"tuple"}).length,
                          playerID : gm.getPlayerSocket(pl),
                          playerName: pl
                        })
                      });

                      //Hay que avisar que gané
                      if(gm.playerWon(socket.playerName)){
                        gm.spectate(socket.playerName)                        
                        socket.emit('won')
                        if(gm._playerOrder.length == 1){
                          that._io.to('room'+socket.roomNumber).emit('endGame', {loser : gm._playerOrder[0]});
                          setTimeout(() => {
                            this._gameManager.removeGame(socket.roomNumber);
                          },30000)
                        }
                      }

                      let nextPlayer = gm.nextPlayer();
                      gm.switchPlaying(socket.playerName) //ends current player's turn
                      gm.fillHand(socket.playerName)
                      socket.emit('updatePlayerData',{
                        canPlay : (socket.playerName === nextPlayer ? ' ' : 'no '),
                        currentHand : gm.getHand(socket.playerName, {format:"tuple"})
                      })
                      gm.switchPlaying(nextPlayer) //next player available
                      socket.broadcast.to(gm.getPlayerSocket(nextPlayer)).emit('updatePlayerData', {
                          canPlay : ' '  
                        }
                      );
                    }
                    else {
                      gm.addToHand(socket.playerName, cardToPlay)
                      socket.emit('updatePlayerData',{
                        warning : "No puedes jugar esta carta.",
                      })
                    }
                  }
              })



              socket.on('playVT', (data) => {

                let gm = that._gameManager.getGame(socket.roomNumber)
                  if(!gm.canPlay(socket.playerName)){
                    socket.emit('updatePlayerData',{
                      warning : "Aún no es tu turno."
                    })
                    return;
                  }

                  if(!gm.canVT(socket.playerName)){
                    socket.emit('updatePlayerData',{
                      warning : "No puedes jugar cartas de la mesa aún."
                    })
                    return;
                  }

                  if(data.card){
                    let cardTuple = data.card;
                    let cardToPlay = gm.getVisibleTriplet(socket.playerName, {}).pickCardFromTuple(cardTuple)
                    if( cardToPlay.canPlayOver(gm.topCard()) ){
                      gm.playCard(cardToPlay)
                      cardToPlay.callEffect(gm)
                      that._io.to('room'+socket.roomNumber).emit('updateGameData', {
                          topCard : (gm.topCard() ? gm.topCard().toTuple() : ["", ""]),                              
                          burntCard: (gm.topBurnt() ? gm.topBurnt().toTuple() : null),                                               
                        }
                      );

                      let nextPlayer = gm.nextPlayer();
                      gm.switchPlaying(socket.playerName) //ends current player's turn
                      socket.emit('updatePlayerData',{
                        canPlay : (socket.playerName === nextPlayer ? ' ' : 'no '),
                        currentVTriplet : gm.getVisibleTriplet(socket.playerName, {format:"tuple"})
                      })
                      gm.switchPlaying(nextPlayer) //next player available
                      socket.broadcast.to(gm.getPlayerSocket(nextPlayer)).emit('updatePlayerData', {
                          canPlay : ' '  
                        }
                      );
                      
                      console.log(new Date(), "updating", socket.playerName, "triplets to other players")    
                      gm.getPlayerList().map(pl => {                                           
                        that._io.to('room'+socket.roomNumber).emit('updatePlayerTable',{                          
                          currentHTriplet : gm.getHiddenTriplet(pl, {format:"tuple"}).length,
                          currentVTriplet : gm.getVisibleTriplet(pl, {format:"tuple"}),
                          playerID : gm.getPlayerSocket(pl),
                          playerName: pl
                        })
                      });


                    }
                    else {
                      gm.addToVT(socket.playerName, cardToPlay)
                      socket.emit('updatePlayerData',{
                        warning : "No puedes jugar esta carta.",
                      })
                    }
                  }


              })


              socket.on('playHT', (data) => {

                let gm = that._gameManager.getGame(socket.roomNumber)
                  if(!gm.canPlay(socket.playerName)){
                    socket.emit('updatePlayerData',{
                      warning : "Aún no es tu turno."
                    })
                    return;
                  }

                  if(!gm.canHT(socket.playerName)){
                    socket.emit('updatePlayerData',{
                      warning : "No puedes jugar las cartas ocultas aún."
                    })
                    return;
                  }

                  if(data.card){
                    let cardTuple = data.card;
                    let cardToPlay = gm.getHiddenTriplet(socket.playerName, {}).pickCardFromTuple(gm.decode(...cardTuple))
                    if( cardToPlay.canPlayOver(gm.topCard()) ){
                      gm.playCard(cardToPlay)
                      cardToPlay.callEffect(gm)
                      that._io.to('room'+socket.roomNumber).emit('updateGameData', {                          
                          topCard : (gm.topCard() ? gm.topCard().toTuple() : ["", ""]),                             
                          burntCard: (gm.topBurnt() ? gm.topBurnt().toTuple() : null),                                                  
                        }
                      );


                      gm.getPlayerList().map(pl => {   
                        console.log(pl)                 
                        that._io.to('room'+socket.roomNumber).emit('updatePlayerTable',{
                          currentHand : gm.getHand(pl, {format:"tuple"}).length,
                          currentHTriplet : gm.getHiddenTriplet(pl, {format:"tuple"}).length,
                          currentVTriplet : gm.getVisibleTriplet(pl, {format:"tuple"}),
                          playerID : gm.getPlayerSocket(pl),
                          playerName: pl
                        })
                      });


                      let nextPlayer = gm.nextPlayer();
                      gm.switchPlaying(socket.playerName) //ends current player's turn
                      socket.emit('updatePlayerData',{
                        canPlay : (socket.playerName === nextPlayer ? ' ' : 'no '),
                        currentHTriplet : gm.getHiddenTriplet(socket.playerName, {format:"tuple"})
                      })
                      gm.switchPlaying(nextPlayer) //next player available
                      socket.broadcast.to(gm.getPlayerSocket(nextPlayer)).emit('updatePlayerData', {
                          canPlay : ' '  
                        }
                      );
                      
                      
                      //Hay que avisar que gané
                      if(gm.playerWon(socket.playerName)){
                        gm.spectate(socket.playerName)                        
                        socket.emit('won')                        
                        if(gm._playerOrder.length == 1){
                          that._io.to('room'+socket.roomNumber).emit('endGame', {loser : gm._playerOrder[0]});
                          setTimeout(() => {                            
                            this._gameManager.removeGame(socket.roomNumber);
                          },30000)
                        }
                        
                      }

                    }
                    else {
                      gm.addToHand(socket.playerName, cardToPlay)
                      gm.pickDiscard(socket.playerName)
                      that._io.to('room'+socket.roomNumber).emit('updateGameData', {
                            topCard : (gm.topCard() ? gm.topCard().toTuple() : ["", ""]),                                
                          }
                      );
                      let nextPlayer = gm.prevPlayer();
                      gm.switchPlaying(socket.playerName) //ends current player's turn
                      socket.emit('updatePlayerData',{
                        canPlay : 'no ',
                        warning : "¡Oh no!, te llevas la pila completa.",
                        currentHand : gm.getHand(socket.playerName, {format:"tuple"}),
                        currentHTriplet : gm.getHiddenTriplet(socket.playerName, {format:"tuple"})
                      })
                      gm.switchPlaying(nextPlayer) //next player available
                      socket.broadcast.to(gm.getPlayerSocket(nextPlayer)).emit('updatePlayerData', {
                          canPlay : ' '  
                        }
                      );


                    }
                  }
              })

              socket.on('disconnect', () => {
                let gm = that._gameManager.getGame(data.room)
                if(gm){
                  gm.removePlayer(socket.playerName)
                  if(!gm._players.size){
                    this._gameManager.removeGame(socket.roomNumber)
                  }
                  that._io.to('room'+data.room).emit('playerList', {players : gm.getPlayerList()});
                }
              })    

              
            });
            

          });  
          
          
    }
}




module.exports = SocketWrapper;