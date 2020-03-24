const names = ['caqui', 'cacú', 'peo']


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
                  let newPlayer = names[Math.floor(Math.random()*3)]+Math.floor(Math.random()*1000) 
                  game.addPlayer(newPlayer)
                  console.log(new Date(), "Player", newPlayer, "joined game with ID", data.room)
                  

              }
              else{
                  console.log("[404] ERROR: La sala de juegos invocada no existe. ( Sala",data.room,')')
              }

              
            });
            

          });  
          
          
    }
}




module.exports = SocketWrapper;