//actor Lava xon una posicion y un tamaño
function Lava (initialPosition, characterType){
    this.position = initialPosition;
    this.size = new Vector(1,1);

    //damos velocidad dependiendo de su tipo, ademas la V le damos la posibilidad de hacer respawn
    if (characterType=== "=") this.speed = new Vector(2,0);
    else if (characterType==="|") this.speed = new Vector(0 , 2);
    else if (characterType==="v"){
        this.speed = new Vector(0 , 4);
        this.respawnPosition = initialPosition;
    }
}

Lava.prototype.type = "lava";

Lava.prototype.act = function (step, level){
    let newPosition = this.position.sum(this.speed.times(step));
    if(!level.colisiones(newPosition , this.size)) this.position = newPosition;
    else if (this.respawnPosition) this.position = this.respawnPosition;
    else this.speed = this.speed.times(-1);
    
};