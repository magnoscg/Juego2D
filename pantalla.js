//clase que carga lo que se va en la pantalla
//Constante para escalar el nivel
const SCALE = 20;

//función para crear elemento pasándole el type  y la clase css
function crearElemento(type ,className) {
    //creamos un elemento con la función siguiente y le pasamos el type 
    let elemento = document.createElement(type );
    //si tiene nombre de clase le creas una clase para usar el elemento
    if(className){
        elemento.className = className;
    }
    return elemento;
}


//le pasamos un sitio donde pintar (elemento padre) y un nivel
function DOMDisplay(parent, level) {
    // propiedad wrap para envolver al juego que crea al padre un elemento div hijo con una clase game
    this.wrap = parent.appendChild(crearElemento("div","game"));
    //cargamos el nivel
    this.level = level;
    
    //añadir la table al div llamando a la funcion drawBackground
    this.wrap.appendChild(this.drawBackground());
    //añadimos el div con los actores al div game llamando a la funcion drawActors
    this.actorsLayer = null;
    
    
}


// protoype del metodo drawBackground //método para dibujar el fondo
DOMDisplay.prototype.drawBackground = function () {
    //usamos el método creado para crear un elemento tabla
    let table = crearElemento("table", "background");
    //le asignamos a la tabla el ancho en pixeles del nivel por una escala para ampliarlo
    table.style.width = this.level.width * SCALE + "px";
    //vamos a crear filas y columnas
    //recorremos el array grid para crear los tr y td
    this.level.grid.forEach(row => {
        let rowElement = crearElemento("tr");
        rowElement.style.height = SCALE + 'px';
        table.appendChild(rowElement);
        row.forEach(type=>rowElement.appendChild(crearElemento("td",type)));
    });
    return table;

};
// funcion ;para dibujar a los actores
DOMDisplay.prototype.drawActors = function() {
    //creamos un elemento div que los contendra
    let actorWrap = crearElemento("div");
    /*recorremos los actores usando map pero sin usar for each // map crea un nuevo array 
    con los elementos modificados, el for each no devuelve un array*/
    this.level.actors.map(actor =>{
        // creamos el div que los contendra a los div con cada clase de actor y el estilo
        let actorElement = crearElemento("div", `actor ${actor.type}`);
        //creamos otro div hijo que contendra a los actores
        let rectangulo = actorWrap.appendChild(actorElement);
        //asignamos el estilo con el ancho y altura multiplicado por la escala y su posicion inicial
        rectangulo.style.width = actor.size.x * SCALE + "px";
        rectangulo.style.height = actor.size.y * SCALE + "px";
        rectangulo.style.left = actor.position.x * SCALE + "px";
        rectangulo.style.top = actor.position.y * SCALE + "px";
    });
    //delvovemos el div con toda la info necesaria para localizar el actor, el estilo y la clase
    return actorWrap;
};
//funcion para mover la pantalla
DOMDisplay.prototype.moveDisplay = function(){
    //Almacenamos el alto y ancho del wrap con la propiedad cliente(width, height)
    let width = this.wrap.clientWidth;
    let height = this.wrap.clientHeight;

    //margen que dejamos de la pantalla para que se empiece a mover
    let margen = width / 3;
    
    //calculamos margenes dde nuestra pantalla de juego para hacer scroll
    let left = this.wrap.scrollLeft;
    let right = left + width;
    let top = this.wrap.scrollTop;
    let bottom = top + height;
    //guardamos el objeto player
    let player = this.level.player;
    //calculamos el centro del player calculado la mitad de su tamaño por la escala
    let playerCenter = player.position.sum(player.size.times(0.5)).times(SCALE);

    if ( playerCenter.x < left + margen) this.wrap.scrollLeft = playerCenter.x - margen;
    else if (playerCenter.x > right - margen) this.wrap.scrollLeft = playerCenter.x + margen - width;

    if (playerCenter.y < top + margen){
         this.wrap.scrollTop = playerCenter.y - margen;
    }
    else if (playerCenter.y > bottom - margen){
         this.wrap.scrollTop = playerCenter.y + margen - height;  
    }
};

DOMDisplay.prototype.drawFrame = function(){
    if (this.actorsLayer) {
        this.wrap.removeChild(this.actorsLayer);        
    }
    this.actorsLayer = this.wrap.appendChild(this.drawActors());
    this.wrap.className = "game " + (this.level.status || "");
    this.moveDisplay();
};
//funcion para limpiar la pantalla
DOMDisplay.prototype.clear = function(){
    //elimina al hijo
    this.wrap.parentNode.removeChild(this.wrap);
};