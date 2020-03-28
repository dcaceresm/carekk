/* Thanks Stackoverflow :) */
var alphanum_range = (function() {
    var data = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
    return function (start,stop) {
      start = data.indexOf(start);
      stop = data.indexOf(stop);
      return (!~start || !~stop) ? null : data.slice(start,stop+1);
    };
  })();  

class CardEncoder {
    constructor(counter){
        let pintas = ['C', 'D', 'P', 'T', 'J'];
        let chars = alphanum_range('A', 'z');
        let chosen_encs = []
        this.counter = counter || 3
        //Symbol Encoding
        this.encoders = new Map(pintas.map( p => {
            let encs = []
            let encCounter = 0;
            while(encCounter<this.counter){
                let enc = "";
                for(let j = 0;j<4;j++){
                    enc = enc + chars[Math.floor(Math.random()*chars.length)];
                }
                if(chosen_encs.indexOf(enc)<0){
                    chosen_encs.push(enc);
                    encs.push(enc)
                    encCounter++;
                }
            }                        
            return [p, encs]
        })); 
        this.decoders = new Map(Array.from(this.encoders.keys()).map(p => {
            let encs = this.encoders.get(p);
            return encs.map(enc => ([enc, p]))
        }).flat())
        //Number Encoding
        let numbers = [...Array(13).keys()]
        for(let i = numbers.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * i)
            const temp = numbers[i]
            numbers[i] = numbers[j]
            numbers[j] = temp
        }
        this.rotation = new Map([...Array(13).keys()].map(num => ([num, numbers[num]])))
        this.noitator = new Map([...Array(13).keys()].map(num => ([numbers[num], num])))
    }


    encode(val,sym){
        return [this.rotation.get(val), this.encoders.get(sym)[Math.floor(Math.random()*this.counter)]]
    }

    decode(val,sym){
        return [this.noitator.get(val), this.decoders.get(sym)]
    }
}

module.exports = CardEncoder;