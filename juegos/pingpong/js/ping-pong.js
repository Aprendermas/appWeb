var conteo = 0;
var gameover = false;
var isClicked = false; // Nueva variable para controlar el clic

// primero selecciono mi canvas
const canvas = document.getElementById("canvas");
// selecciono los métodos y propiedades
const ctx = canvas.getContext("2d");

// jugador
const user = {
  x: 0,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "WHITE",
};

// computadora
const com = {
  x: canvas.width - 10,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "WHITE",
};

// línea que separa el canvas
const net = {
  x: (canvas.width - 2) / 2,
  y: 0,
  height: 10,
  width: 2,
  color: "WHITE",
};

// Detectar clic o toque
canvas.addEventListener("mousedown", () => {
  isClicked = true; // Habilita el movimiento
});

canvas.addEventListener("mouseup", () => {
  isClicked = false; // Desactiva el movimiento
});

// Para dispositivos táctiles
canvas.addEventListener("touchstart", () => {
  isClicked = true;
});

canvas.addEventListener("touchend", () => {
  isClicked = false;
});

// función para obtener la posición del mouse/táctil
function getMousePos(evt) {
  if (isClicked) { // Solo mueve la barra si se ha hecho clic o toque
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
  }
}

// evento para el movimiento del mouse o táctil
canvas.addEventListener("mousemove", getMousePos);
canvas.addEventListener("touchmove", (evt) => {
  if (isClicked) {
    let rect = canvas.getBoundingClientRect();
    let touch = evt.touches[0]; // Obtiene el primer toque
    user.y = touch.clientY - rect.top - user.height / 2;
  }
});

// para crear la liena puntiada en el canvas
function drawNet() {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}

// bola
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  velocityX: 5,
  velocityY: 5,
  speed: 7,
  color: "WHITE",
};

//dibujar un rectángulo, se utilizará para dibujar las paletas.
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

//dibuja el circulo que se usara cmo bola
function drawArc(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

// boton espacio
//teclado espacio 
document.addEventListener('keydown', function (evento) {
    //las teclas con el codigo ascii
    if (evento.keyCode == 32) {
        //espacio es 32
        console.debug("espacio");
        if (gameover == true) {
            gameover = false;
            user.score = 0;
            com.score = 0;
            resetBall();
        } 
    }
});

//resetear bola
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX = -ball.velocityX;
  ball.speed = 7;
}

// dibujamos texto
function drawText(text, x, y) {
  ctx.fillStyle = "#FFF";
  ctx.font = "75px fantasy";
  ctx.fillText(text, x, y);
}

// funcion de colision
// jugador y la pelota
function collision(b, p) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  return (
    p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top
  );
}
//funcion update
function update() {
  if (ball.x - ball.radius < 0) {
    com.score++;
    conteo = 0;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    conteo = 0;
    resetBall();
  }
  if(com.score == 10 || user.score== 10){
      gameover = true;
  }
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  if (conteo > 10) {
    com.y += (ball.y - (com.y + com.height / 2)) * 0.05;
  } else if (conteo > 15) {
    com.y += (ball.y - (com.y + com.height / 2)) * 0.01;
  } else {
    com.y += (ball.y - (com.y + com.height / 2)) * 0.1;
  }

  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velocityY = -ball.velocityY;
  }

  let player = ball.x + ball.radius < canvas.width / 2 ? user : com;

  if (collision(ball, player)) {
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);

    let angleRad = (Math.PI / 4) * collidePoint;

    let direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    ball.speed += 0.1;
    conteo++;
  }
}

//limpiar el lienzo
function render() {
  drawRect(0, 0, canvas.width, canvas.height, "#000");
  drawText(user.score, canvas.width / 4, canvas.height / 5);
  drawText(com.score, (3 * canvas.width) / 4, canvas.height / 5);
  drawNet();
  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(com.x, com.y, com.width, com.height, com.color);
  drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function game() {
  if (!gameover) {
    update();
    render();
  } else {
    drawText("GAME OVER", canvas.width / 8, canvas.height / 2);
  }
}

let framePerSecond = 50;
let loop = setInterval(game, 1000 / framePerSecond);


//para mover solo con el cursor

canvas.addEventListener("mousemove", getMousePos);
canvas.addEventListener("touchmove", (evt) => {
  if (isClicked) {
    let rect = canvas.getBoundingClientRect();
    let touch = evt.touches[0]; // Obtiene el primer toque
    user.y = touch.clientY - rect.top - user.height / 2;
  }
});

// Evento para mover la barra con el mouse sin necesidad de hacer clic
canvas.addEventListener("mousemove", (evt) => {
  if (!isClicked) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
  }
});