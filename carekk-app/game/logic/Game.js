const DeckFactory = require('../assets/DeckFactory')
const Player = require('./Player')


class Game {

    constructor(id, options){
        this._id = id;
        this._deck = new DeckFactory(options.joker || false).createDeck();
        this._players = new Map()
        this._status = "idle";
    }

    addPlayer(name){
        this._players.set(name, new Player(name))
    }

    setStatus(manager, newStatus){
        this._status = newStatus;
    }

    startGame(manager){

    }

    endGame(){}
}

module.exports = Game;