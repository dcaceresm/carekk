const Game = require('./Game')

class GameManager {

    constructor(){
        this._games = new Map();
    }


    addGame(roomId, opts){
        //console.log("GAME MANAGER: Attempting Game Creation. Room ID", roomId)
        this._games.set(roomId, new Game(roomId, opts || {}));
    }

    getGame(roomId){
        //console.log("GAME MANAGER: Attempting Game Retrieval. Room ID", roomId)
        return this._games.get(roomId);
    }


    removeGame(roomId){
        this._games.delete(roomId)
    }    

    startGame(roomId){
        this._games.get(roomId).startGame(this)
    };

    gameCount(){
        return this._games.size
    }
}


module.exports = GameManager;