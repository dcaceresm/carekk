const Card = require('./Card.js')

class JokerCard extends Card {

    print(){
        console.log("Soy el Joker")
    }
}

module.exports = JokerCard;