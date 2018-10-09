
// CONSTANTE DE VELOCIDAD DE MOVIMIENTO DE LA MONEDA
const WOBBLESPEED = 10;
const WOBBLEDISTANCE = 0.1;

function Coin (initialPosition){
    //propiedades del actor moneda
    //sacamos la posicion inicial con la suma de dos vectores
    this.basePosition = this.position = initialPosition.sum(new Vector(0.2,0.1));
    this.size = new Vector(0.6 , 0.6);
    this.wobble = Math.PI * 2 * Math.random();
}
//asignamos el tipo a la moneda
Coin.prototype.type = "moneda";

//funcion que dice lo que tiene que hacer la moneda
Coin.prototype.act = function (step){
    // assignamos a wobble una velocidad por cada  step (unidad de tiempo) 
    this.wobble += step * WOBBLESPEED;
    // usamos el seno de un angulo para calcular la posicion de un angulo y lo multiplicamos por un factor de distancia
    let wobblePosition = Math.sin(this.wobble) * WOBBLEDISTANCE;
    // determinamos su posicion con una suma de vectores pero solo en el eje y para que solo se mueve verticalmente
    this.position = this.basePosition.sum(new Vector (0, wobblePosition));
};