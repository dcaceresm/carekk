const CardPile = require('../assets/CardPile');

class Player {
    constructor(name){
        this._name = name
        this._hand = new CardPile(true);
        this._visibleTriplet = new CardPile(true);
        this._hiddenTriplet = new CardPile(false);

        this._connected = false;
    }

    drawCards(pile){        
        let c = pile.drawCard();
        //console.log(new Date(), "carta Extraída por jugador",this._name,":",c)  
        if (c.length > 0) this._hand.addCards(c)
        
    }

    getHand(){
        return this._hand;
    }

    
    generateVTriplet(){}

    generateHTriplet(){}
}

module.exports = Player;