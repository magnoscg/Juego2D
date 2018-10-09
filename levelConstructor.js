//definimos los actores del juego
const ACTORS = {
    "o": Coin,
    "@": Player,
    "=": Lava,
    "v": Lava,
    "|": Lava
};

const MAX_STEP = 0.05;
const GAMEAUDIO = new Audio("./sounds/moneda.mp3");

// crear constructor del nivel
function Level(plano) {
    //si no es validado el nivel, salta este error
    if (!validateLevel(plano)) throw new Error("Falta un player y una moneda");
    // calculamos el ancho midiendo la longitud del primer String
    this.width = plano[0].length;
    //calculamos la altura con la longitud del array
    this.height = plano.length;
    //estado del juego
    this.status = null;
    //retraso hasta que muere
    this.finishDelay = null;
    

    this.actors =[];
    //conjunto de celdas donde almacenar el nivel
    this.grid = [];
    

    //recorremos el plano y guardamos en cada linea los valores del array
    for (let y = 0; y < this.height; y++) {
        //recorremos el eje y en horizontal
        let line = plano[y]; //Sacamos el ancho del nivel
        let gridLine = []; //inicializamos un array donde guardar el eje y
        //recorremos el eje vertical
        for (let x = 0; x < this.width; x++) {
            let character = line[x];
            let charactertype = null;
            // añadimos
            let Actor = ACTORS[character];

            if (Actor) this.actors.push(new Actor(new Vector(x, y), character));

            //guardamos el tipo de caracter si es x o si es !
            if (character === "x") {
                charactertype = "wall";
            } else if (character === "!") {
                charactertype = "lava";
            }
            //lo añadimos al array gridline
            gridLine.push(charactertype);
        }
        //añadimos cada gridline en el array grid
        this.grid.push(gridLine);
    }
    //filtramos el tipo player del array actors y lo guardamos en la variable player // high-order functions 
    this.player = this.actors.filter(actor => actor.type === "player")[0];

}
//funcion para saber si el juego ha terminado
Level.prototype.isFinished = function () {
    return (this.status !== null && this.finishDelay < 0);
};

//funcion para saber si esta corriendo el juego

Level.prototype.animate = function (step, keys) {
    //comprobamos si 
    if (this.status !== null) this.finishDelay -= step;
    //funcion para controlar que los pasos sean poco a poco
    while (step > 0) {
        let thisStep = Math.min(step, MAX_STEP);
        //loop para que todos los actores actuen en la escena pasandole la funcion act
        this.actors.forEach(actor => actor.act(thisStep, this, keys));

        step -= thisStep;
    }
};
// validar el nivel para que siempre haya un player y una moneda
function validateLevel(level){
    /*
    for (let i = 0; i < actors.length; i++) {
        //recoremos el array buscando el caracter correspondiente al player
        //si es -1 es que no existe, (si existe nos devuelve true)
        if (level[i].indexOf("@") !== - 1) return true;*/
    
    //forma alternativa de lo anterior
        //con some podemos determinar si un elemento esta en el array. devuelve true or false
        // usamos some con indexOf de cada caracter que buscamos en el array si existe el player y la moneda devuelve true
    return (level.some(array => (array.indexOf("@") !== -1))) && level.some(array => (array.indexOf("o")!== -1));
}
//Sistema para detectar colisiones con muro. Funcion que devuelve wall o lava si hay un muro 0 lava en esa posicion
Level.prototype.colisiones = function (position , size){
    let xStart = Math.floor (position.x);
    let xEnd = Math.ceil (position.x + size.x);
    let yStart = Math.floor (position.y);
    let yEnd = Math.ceil (position.y + size.y);
    // Condiciones para saber si estamos fuera de la pantalla, muro para no traspasar la pantalla, lava porque si caemos es como si fuera lava (morimos)
    if (xStart < 0 || xEnd > this.width || yStart < 0) return "wall";
    if (yEnd > this.height)  return "lava";
    //recorremos toda la pantalla para saber con que colisionamos
    for (let y = yStart; y < yEnd; y++) {
        
        for (let x = xStart; x < xEnd; x++){
            
            let collisionType = this.grid[y][x];
            if (collisionType) return collisionType;
        }  
    }
};
// metodo para saber si toca algo el player que pasa
Level.prototype.playerTouched = function (type,actor){
    //condicion si toca la lava se camabia el estado a lost y se pone un delay de 1 segundo.
    if (type === "lava" && this.status === null) {
        this.status = "lost";
        this.finishDelay = 1;
    }    //si toca una moneda
    else if(type === "moneda"){
        audio();
        //sacamos monedas del array de actores
        this.actors = this.actors.filter(otherActor => otherActor !== actor);
        //si se acaban las monedas se cambia el estado y se pone un delay de 2 seg hasta que pasas de nivel
        if (!remainsCoins(this.actors)){
            this.status = "won";
            this.finishDelay = 2;
        }
    }
};
//funcion para saber si quedan monedas
function remainsCoins (actors){
    
    return actors.some(actor => actor.type === "moneda");
}
//funcion para saber si esta un actor esta tocando un actor a otro en el eje x y en el eje y
Level.prototype.actorAct = function (actor) {
    //recooremos los actores
    for(let i = 0; i < this.actors.length; i++){
        //guardamos en una variable para visualizar mejor el codigo
        let otherActor = this.actors[i];
        //comprobamos si el actor se esta tocando en el eje de las x y de la y y lo devolvemos
        if( actor !== otherActor &&
            actor.position.x + actor.size.x > otherActor.position.x &&
            actor.position.x < otherActor.position.x + otherActor.size.x &&
            actor.position.y + actor.size.y > otherActor.position.y &&
            actor.position.y < otherActor.position.y + otherActor.size.y)
            return otherActor;
    }
};

function audio(){
    //forma de hacer que suenen los sonidos
        GAMEAUDIO.pause(); // se pausa si estaba sonando, se pone a 0 el sonido y se reproduce
        GAMEAUDIO.currentTime = 0;
        GAMEAUDIO.play();
}