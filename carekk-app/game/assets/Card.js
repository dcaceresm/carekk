//This module generates and manages the Playing Deck

const cardSymbols = new Map();
cardSymbols.set('C', 'Corazones')
cardSymbols.set('D', 'Diamantes')
cardSymbols.set('P', 'Picas')
cardSymbols.set('T', 'Tréboles')

const identityCallback = (any) => {}

class Card {

    constructor(symbol, value, effect){
        this._symbol = symbol;
        this._value = value;
        this._effect = effect || identityCallback;
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

    canPlayOver(anotherCard){
        if(anotherCard){
            return (
                !this._value //La carta a jugar es un 2, entonces se puede jugar siempre sobre todas las cartas
                || (anotherCard._value == 5 && (15-(7 ^ (this._value+2)))>=7 ) //La carta puesta es un 7, se debe jugar leq
                || (anotherCard._value != 5 && this._value >= anotherCard._value) // La carta es normal, debo jugar 1 mas alta
            )
        }
        return true
    }

}


module.exports = Card;