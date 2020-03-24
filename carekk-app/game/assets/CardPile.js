class CardPile {
    constructor(visibility) {
        this.cards = [];
        this._visibility = visibility
    }
    addCard(card) {
        this.cards.push(card);
    }

    drawCard(){
        return this.cards.pop() ? [this.cards.pop()] : [];
    }
    
    shufflePile() {
        for(let i = this.cards.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * i)
            const temp = this.cards[i]
            this.cards[i] = this.cards[j]
            this.cards[j] = temp
          }
    }

    viewPile() {
        this.cards.map(e => e.print());
    }
    isEmpty() {
        return this.cards.length == 0;
    }

    length() {
        return this.cards.length;
    }
}

module.exports = CardPile;
