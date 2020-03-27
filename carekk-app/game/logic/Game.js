const DeckFactory = require('../assets/DeckFactory')
const Player = require('./Player')
const CardPile = require('../assets/CardPile')


class Game {

    constructor(id, options){
        this._id = id;
        this._deck = new DeckFactory(options.joker || false).createDeck();
        this._discard = new CardPile();
        this._burnt = new CardPile();
        this._players = new Map()
        this._playerOrder = new Array();
        this._status = "idle";
    }

    addPlayer(name, socketID){
        this._players.set(name, new Player(name, socketID))
        this._playerOrder.push(name);
    }

    removePlayer(name){
        this._players.delete(name)
    }
    getPlayerList(){
        return Array.from(this._players.keys())
    }

    nextPlayer(){
        let last_player = this._playerOrder.shift();
        console.log(new Date(), "last player is:",last_player)
        this._playerOrder.push(last_player)
        console.log(new Date(), "next player is:", this._playerOrder[0])
        return this._playerOrder[0]
    }

    setStatus(manager, newStatus){
        this._status = newStatus;
    }

    canPlay(playerID){
        return this._players.get(playerID)._playing;
    }
    drawCard(playerID){
        let p = this._players.get(playerID)
        p.drawCards(this._deck)
    }

    fillHand(playerID){
        let p = this._players.get(playerID)
        console.log(new Date(), "deck size: ", this._deck.length())
        while(this._deck.length() > 0 && p.getHand().length() < 3) p.drawCards(this._deck);
    }

    pickDiscard(playerID){
        this._players.get(playerID)._hand.appendAndEmpty(this._discard)
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

    switchPlaying(playerID){
        this._players.get(playerID).switchPlaying()
    }
    
    getPlayerSocket(playerID){
        return this._players.get(playerID)._socketID;
    }

    playCard(card){
        this._discard.addCard(card)
    }

    addToHand(playerID, card){        
        this._players.get(playerID).getHand().addCard(card);
    }
    

    burnCards(){}

    flipDirection(){
        this._playerOrder.reverse();    
    }

    burnToNext(){}


    topCard(){
        return this._discard.seeTop()
    }

    startGame(){}




    //DECK METHODS
    getDeckCards(){
        return this._deck.length()
    }
}

module.exports = Game;