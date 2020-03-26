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

    get 

    print(){
        console.log("Soy el "+this._value+" de "+cardSymbols.get(this._symbol))
    }

    toString(){
        return this._value+" "+cardSymbols.get(this._symbol)
    }
    toTuple(){
        return [this._value, this._symbol]
    }

    equals(card){
        return this._value == card._value && this._symbol === card._symbol;
    }

    equalsTuple(tuple){
        return this._value == tuple[0] && this._symbol === tuple[1]
    }

}


module.exports = Card;