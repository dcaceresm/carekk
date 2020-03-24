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

    removePlayer(name){
        this._players.delete(name)
    }
    getPlayerList(){
        return Array.from(this._players.keys())
    }

    setStatus(manager, newStatus){
        this._status = newStatus;
    }


    drawCard(playerID){
        let p = this._players.get(playerID)
        p.drawCard(this._deck)
    }

    startGame(manager){

    }

    endGame(){}












    //DECK METHODS
    getDeckCards(){
        return this._deck.length()
    }
}

module.exports = Game;