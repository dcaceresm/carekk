const CardPile = require('./CardPile.js')
const NumericCard = require('./NumericCard.js')
const JokerCard = require('./JokerCard.js')


class DeckFactory {
    constructor (joker) {
        this.symbols = [
            'C', //Corazon
            'D', //Diamante
            'P', //Pica
            'T' // Trebol
        ];
        this.numbers = [...Array(12).keys()];  
        this.joker = joker;
    }


    createDeck(){
        let deck = new CardPile(false);

        for(let i = 0; i<2;i++){ //Test
            this.symbols.forEach(sym => {
                this.numbers.forEach( num => {
                    deck.addCard(new NumericCard(sym,num));
                })
            })
    
            if(this.joker){
                deck.addCard(new JokerCard('J',100));
                deck.addCard(new JokerCard('J',100));
            }
    
            deck.shufflePile();
        }

        deck.shufflePile();
        return deck;
    };
}

module.exports = DeckFactory;