
const PLAYERSPEED = 7;
const GRAVITY = 25;
const JUMPSPEED = 15;

function Player (initialPosition){
    this.position = initialPosition.sum(new Vector(0 , -1));// recalculo la posicion con -1 para ajustar la escala
    this.size = new Vector (0.8 , 2);
    this.speed = new Vector(0,0);
}

Player.prototype.type = "player";
//MOVIMENTO EJE X DEL PLAYER
Player.prototype.moveX =  function (step , level, keys){
    //reseteamos su velocidad
    this.speed.x = 0;
    //calculamos velocidad dependiendo de la tecla que se pulse
    if (keys.left) this.speed.x -= PLAYERSPEED;
    if (keys.right) this.speed.x += PLAYERSPEED;
    // pasamos la velocidad a una variable movimiento
    let movimiento = new Vector(this.speed.x * step , 0);
    //calculamos la posicion sumandole el movimiento
    let newPosition = this.position.sum(movimiento);
    //comprobamos si en esa posicion existe colision a traves de la funcion colisiones
    let colision = level.colisiones(newPosition , this.size);
    if (colision) level.playerTouched(colision); //si hay colision se ejecuta la funcion playertouched

    //si no hay colision se actuliza la posicion
    else this.position = newPosition;
    
};
//MOVIENTO EJE Y DEL PLAYER
Player.prototype.moveY =  function (step , level, keys){
    //asiganmos una gravedad a la velocidad
    this.speed.y += step * GRAVITY;
    //calculamos el moviento
    let movimiento = new Vector(0 ,this.speed.y * step);
    //calculamos el movimiento en base a su nueva posicion
    let newPosition = this.position.sum (movimiento);
    //guardamos las colisiones y comprobamos si ha colisionado con algo
    let colision = level.colisiones(newPosition , this.size);
    if(colision) {
        level.playerTouched(colision);
        //si hay colision y no estamos cayendo. se le da una fuerza de salto
        if (keys.up && this.speed.y > 0) this.speed.y = -JUMPSPEED;
        //sino se resetea la velocidad
        else this.speed.y = 0;
    }
    //si no hay colision se establece la nueva posicion
    else this.position = newPosition;
};

//funcion para que el actor actue en la escena
Player.prototype.act = function (step , level , keys){
    this.moveX(step , level, keys);
    this.moveY(step ,level, keys);
    //comprobamos si estamos tocando a otro actor
    let otherActor = level.actorAct (this);
    //si lo estamos tocando comprobamos que hemos tocado(lava , moneda)
    if (otherActor) level.playerTouched(otherActor.type , otherActor);

    if (level.status === "lost"){
        //si se ha perdido es porque ha tocado la lava
        this.position.y += step; //hacemos que se hunda en la lava
        this.size.y -= step; // hacemos que se haga pequeño
    }
};