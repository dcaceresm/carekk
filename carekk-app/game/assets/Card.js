//This module generates and manages the Playing Deck

const cardSymbols = new Map();
cardSymbols.set('C', 'Corazones')
cardSymbols.set('D', 'Diamantes')
cardSymbols.set('P', 'Picas')
cardSymbols.set('T', 'Tréboles')


class Card {

    constructor(symbol, value){
        this._symbol = symbol;
        this._value = value;
    }

    print(){
        console.log("Soy el "+this._value+" de "+cardSymbols.get(this._symbol))
    }

}


module.exports = Card;