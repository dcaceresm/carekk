class CardPile {
    constructor(visibility) {
        this.cards = [];
        this._visibility = visibility
    }
    addCard(card) {
        this.cards.push(card);
    }
    addCards(cards){
        this.cards.push(...cards)
    }

    drawCard(){
        if(this.cards.length > 0){
            let popped = this.cards.pop()
            return [popped]
        }
        return []
    }
    
    seeTop(){
        return this.cards[this.cards.length-1]
    }

    pickCardFromTuple(tuple){
        console.log(new Date(), "cards in pile :",this.cards)
        console.log(new Date(), "tuple picked on pickCard:", tuple)
        let idx = this.cards.findIndex(c => {
            console.log(c)
            return c.equalsTuple(tuple)
        });
        if(idx>=0){
            return this.cards.splice(idx, 1)[0]
        }
        return null;
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

    map(callback){
        return this.cards.map(callback)
    }
}

module.exports = CardPile;
