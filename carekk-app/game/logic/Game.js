const DeckFactory = require('../assets/DeckFactory')
const Player = require('./Player')


class Game {

    constructor(id, options){
        this._id = id;
        this._deck = new DeckFactory(options.joker || false).createDeck();
        this._players = new Map()
    }

    addPlayer(name){
        this._players.set(name, new Player(name))
    }
}

module.exports = Game;