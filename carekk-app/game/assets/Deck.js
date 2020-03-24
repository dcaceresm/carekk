class Deck {

    constructor(){
        this.cards = []

    }

    addCard(card){
        this.cards.push(card)
    }

    shuffleDeck(){}

    viewDeck(){
        this.cards.map(e => e.print())
    }

    isEmpty(){
        return this.cards.length == 0;
    }
    
}

module.exports = Deck;