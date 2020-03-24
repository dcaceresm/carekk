const names = ['player', 'cardist', 'ludo']


class SocketWrapper {

    constructor(io, gameManager){
        this._io = io // Socket IO
        this._gameManager = gameManager;
        console.log("GAME MANAGER EN SOCKET WRAPPER: ", this._gameManager)
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
                      cardCount : gm.getDeckCards()
                    }
                );

              })
              socket.on('playCard', ()=>{
                let gm = that._gameManager.getGame(socket.roomNumber)



                that._io.to('room'+socket.roomNumber).emit('updateGameData', {
                      cardCount : gm.getDeckCards()
                    }
                );
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