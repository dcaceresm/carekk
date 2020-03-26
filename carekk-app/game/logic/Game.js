const DeckFactory = require('../assets/DeckFactory')
const Player = require('./Player')
const CardPile = require('../assets/CardPile')


class Game {

    constructor(id, options){
        this._id = id;
        this._deck = new DeckFactory(options.joker || false).createDeck();
        this._discard = new CardPile();
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
        p.drawCards(this._deck)
    }

    getHand(playerID, options){
        let p = this._players.get(playerID);
        let h = p.getHand();
        if(options.format){
            if(options.format === "string" ) return h.map(e => e.toString())
            if(options.format === "tuple"  ) return h.map(e => e.toTuple())
        } 
        return h;
    }

    playCard(card){
        this._discard.addCard(card)
    }

    addToHand(playerID, card){        
        this._players.get(playerID).getHand().addCard(card);
    }
    startGame(manager){

    }

    endGame(){}





    topCard(){
        return this._discard.seeTop()
    }






    //DECK METHODS
    getDeckCards(){
        return this._deck.length()
    }
}

module.exports = Game;