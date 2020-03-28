const DeckFactory = require('../assets/DeckFactory')
const Player = require('./Player')
const CardPile = require('../assets/CardPile')
const CardEncoder = require('./CardEncoder')

class Game {

    constructor(id, options){
        this._id = id;
        this._deck = new DeckFactory(options.joker || false).createDeck();
        this._discard = new CardPile();
        this._burnt = new CardPile();
        this._players = new Map()
        this._playerOrder = new Array();
        this._cardEncoder = new CardEncoder(4);
        this._status = "idle";                
    }

    addPlayer(name, socketID){
        this._players.set(name, new Player(name, socketID))
        this._playerOrder.push(name);
    }

    encode(val,sym){
        return this._cardEncoder.encode(val,sym);
    }

    decode(val,sym){
        return this._cardEncoder.decode(val,sym);
    }

    removePlayer(name){
        this._players.delete(name)
        this._playerOrder.splice(this._playerOrder.indexOf(name),1);
    }
    getPlayerList(){
        return Array.from(this._players.keys())
    }

    nextPlayer(){
        let last_player = this._playerOrder.shift();        
        this._playerOrder.push(last_player)        
        return this._playerOrder[0]
    }

    prevPlayer(){
        let last_player = this._playerOrder.pop();        
        this._playerOrder.unshift(last_player)        
        return this._playerOrder[0]
    }

    setStatus(manager, newStatus){
        this._status = newStatus;
    }

    canPlay(playerID){
        let p = this._players.get(playerID) 
        return p._playing && !this._spec;
    }

    canVT(playerID){
        return !this._deck.length() && !this._players.get(playerID).getHand().length()
    }

    canHT(playerID){
        return this.canVT(playerID) && !this._players.get(playerID).getVisibleTriplet().length()
    }

    drawCard(playerID){
        let p = this._players.get(playerID)
        p.drawCards(this._deck)
    }

    fillHand(playerID){
        let p = this._players.get(playerID)
        while(this._deck.length() > 0 && p.getHand().length() < 3) p.drawCards(this._deck);
    }

    initVisibleTriplet(playerID){
        let p = this._players.get(playerID)
        while(this._deck.length() > 0 && p.getVisibleTriplet().length() < 3) p.drawToVT(this._deck);
    }

    initHiddenTriplet(playerID){
        let p = this._players.get(playerID)
        while(this._deck.length() > 0 && p.getHiddenTriplet().length() < 3) p.drawToHT(this._deck);
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

    getVisibleTriplet(playerID, options){
        let p = this._players.get(playerID);
        let h = p.getVisibleTriplet();
        if(options.format){
            if(options.format === "string" ) return h.map(e => e.toString())
            if(options.format === "tuple"  ) return h.map(e => e.toTuple())
        } 
        return h;
    }

    getHiddenTriplet(playerID, options){
        let p = this._players.get(playerID);
        let h = p.getHiddenTriplet();
        if(options.format){
            if(options.format === "tuple"  ) return h.map(e => this._cardEncoder.encode(...e.toTuple()))
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

    addToVT(playerID, card){        
        this._players.get(playerID).getVisibleTriplet().addCard(card);
    }
    

    /*Cards Side-effects:
    *   burnCards() : 10 Card side-effect
    *   flipDirection() : J Card side-effect
    *   burnToNext() : Joker Card side-effect
    */
    burnCards(){
        this._burnt.appendAndEmpty(this._discard)
        this.prevPlayer()
    }

    flipDirection(){

        let currPlayer = this._playerOrder.shift();
        this._playerOrder.reverse();    
        this._playerOrder.unshift(currPlayer);
    }

    burnToNext(){}


    topCard(){
        return this._discard.seeTop()
    }

    startGame(){
        this._discard.addCards(this._deck.drawCard())
    }


    playerWon(playerID){
        return this._players.get(playerID).won();
    }

    spectate(playerID){
        this._playerOrder.splice(this._playerOrder.indexOf(playerID),1);
        this._players.get(playerID).spectate();
    }
    //DECK METHODS
    getDeckCards(){
        return this._deck.length()
    }
}

module.exports = Game;