const CardPile = require('../assets/CardPile');

class Player {
    constructor(name){
        this._name = name
        this._hand = new CardPile();
        this._visibleTriplet = new CardPile();
        this._hiddenTriplet = new CardPile();
    }

    

}

module.exports = Player;