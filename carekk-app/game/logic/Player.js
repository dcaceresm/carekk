const CardPile = require('../assets/CardPile');

class Player {
    constructor(name){
        this._name = name
        this._hand = new CardPile();
        this._visibleTriplet = new CardPile();
        this._hiddenTriplet = new CardPile();

        this._connected = false;
    }

    drawCards(pile){
        this._hand.addCard(...pile.drawCard())
    }

    generateVTriplet(){}

    generateHTriplet(){}
}

module.exports = Player;