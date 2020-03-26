const names = ['player', 'cardist', 'ludo']


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
                  socket.join('room'+data.room)
                  const newPlayer = names[Math.floor(Math.random()*3)]+Math.floor(Math.random()*1000) 
                  game.addPlayer(newPlayer)
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


                that._io.to('room'+socket.roomNumber).emit('updateGameData', {
                      cardCount : gm.getDeckCards().toString()
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
              

              socket.on('playCard', (data) => {
                  let gm = that._gameManager.getGame(socket.roomNumber)
                  if(data.card){
                    let cardTuple = data.card;
                    let cardToPlay = gm.getHand(socket.playerName, {}).pickCardFromTuple(cardTuple)
                    socket.emit('updatePlayerData',{
                      currentHand : gm.getHand(socket.playerName, {format:"tuple"})
                    })
                    if( cardToPlay.canPlayOver(gm.topCard()) ){
                      gm.playCard(cardToPlay)
                      that._io.to('room'+socket.roomNumber).emit('updateGameData', {
                          cardCount : gm.getDeckCards().toString(),
                          topCard : gm.topCard().toTuple()
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