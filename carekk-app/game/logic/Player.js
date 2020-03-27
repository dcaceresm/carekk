const CardPile = require('../assets/CardPile');

class Player {
    constructor(name, socketID){
        this._name = name
        this._hand = new CardPile(true);
        this._visibleTriplet = new CardPile(true);
        this._hiddenTriplet = new CardPile(false);
        this._socketID = socketID;
        this._spec = false;
        this._playing = false;
    }

    drawCards(pile){        
        let c = pile.drawCard();
        //console.log(new Date(), "carta Extraída por jugador",this._name,":",c)  
        if (c.length > 0) this._hand.addCards(c)
        
    }

    getHand(){
        return this._hand;
    }

    switchPlaying(){
        this._playing = ! this._playing;
    }

    initPlayer(deck){
        for(let i = 0; i<3;i++) {
            let c = pile.drawCard();
            //console.log(new Date(), "carta Extraída por jugador",this._name,":",c)  
            if (c.length > 0) this._hand.addCards(c)
        }
    }
}

module.exports = Player;