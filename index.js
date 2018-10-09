// Inicio del juego

//diccionario con el codigo de cada tecla y lo que hace
const ARROW_CODES = {
    37: "left",
    38: "up",
    39: "right"
};
let arrows = trackKeys(ARROW_CODES);

//funcion para trackear las teclas que pulsamos
function trackKeys(keyCodes) {
    //registamos el evento y lo guardamos en pressedkeys y se lo pasamos al listener
    let pressedKeys = {};

    function handler(event) {
        //si se ha pulsado una tecla del diccionario se produce el evento y se guarda en el arrya pressedKeys
        if (keyCodes.hasOwnProperty(event.keyCode)) {
            let downPressed = event.type === "keydown";
            pressedKeys[keyCodes[event.keyCode]] = downPressed;
            //aseguramos que no se ejecutan eventos no esperados
            event.preventDefault();
        }
    }
    //funciones que registran las teclas pulsadas
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
    //devolvemmos las teclas pulsadas en el array
    return pressedKeys;
}
//funcion para crear las animaciones por frame
// con esto se sabe cuanto tiempo pasa entre frame y frame = step
function runAnimation(frameFunction) {
    let lastTime = null;

    function frame(time) {
        let stop = false;
        if (lastTime !== null) {
            let timeStep = Math.min(time - lastTime, 100) / 1000;
            stop = frameFunction(timeStep) === false;
        }
        lastTime = time;
        if (!stop) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}
//funcion para cargar el nivel
function runLevel(level, Display, callback) {
    let display = new Display(document.body, level);
    runAnimation(function (step) {
        //animar el nivel antes de dibujarlo pasandole el tiempo y las teclas
        level.animate(step, arrows);
        //dibuja los actores por cada fotograma
        display.drawFrame();
        //comprueba si ha actualizado y limpia y ajusta el estado del juego
        if (level.isFinished()) {
            display.clear();
            if (callback) callback(level.status);
            return false;
        }

    });
}

function runGame(levels, Pantalla) {
    //funcion para ir carganado los niveles de un array de arrays
    function startLevel(levelNumber) {

        let levelCharged;
        //usamos un trycatch para capturar el error if (!validateLevel(plano)) throw new Error("Falta un player y una moneda");
        try {

            levelCharged = new Level(levels[levelNumber]);
        } catch (error) {
            return alert(error.message);
        }
        //creamos una fuincion interna para cargar el nivel la pantalla y el estado del juego
        runLevel(levelCharged, Pantalla, status => {
            if (status === "lost") startLevel(levelNumber);//reinicias el nivel que jugabas
            else if (levelNumber < levels.length - 1) startLevel(levelNumber + 1); //subes de nivel
        });

    }
    //cargamos el primer nivel
    startLevel(0);

}

// llamamos al metodo runGame para pasar el nivel y la pantalla
runGame(GAME_LEVELS, DOMDisplay);