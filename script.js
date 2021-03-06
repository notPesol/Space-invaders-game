const squares = document.querySelectorAll('.grid div');
const resultDisplay = document.querySelector('#result');

let width = 15;
let currentShooterIndex = 217;
let currentInvaderIndex = 0;
let alienInvaderTakenDown = [];
let result = 0;
let direction = 1;
let invaderId;

// define the alien invaders
const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39
];
// draw alien invaders
for (const invader of alienInvaders) {
  squares[currentInvaderIndex + invader].classList.add('invader');
}
// draw a shooter
squares[currentShooterIndex].classList.add('shooter');

// define control function for shooter
function moveShooter(e) {
  squares[currentShooterIndex].classList.remove('shooter');
  switch (e.keyCode) {
    case 37:
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
      break;
    case 39:
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
      break;
  }
  squares[currentShooterIndex].classList.add('shooter');
  console.log(currentShooterIndex);
}

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;

  // move laser from shooter
  function moveLaser() {
    squares[currentLaserIndex].classList.remove('laser');
    currentLaserIndex -= width;
    squares[currentLaserIndex].classList.add('laser');

    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('laser', 'invader');
      squares[currentLaserIndex].classList.add('boom');

      setTimeout(() => {
        squares[currentLaserIndex].classList.remove('boom');
      }, 100);
      clearInterval(laserId);

      const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
      alienInvaderTakenDown.push(alienTakenDown);
      result++;
      resultDisplay.textContent = result;
    }

    if (currentLaserIndex < width) {
      clearInterval(laserId);
      setTimeout(() => {
        squares[currentLaserIndex].classList.remove('laser');
      }, 100);
    }
  }

  if (e.key === ' ') {
    laserId = setInterval(moveLaser, 250);
  }
}

// move alien invaders
function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
  let laserId;
  let randomShooterIndex = Math.floor(Math.random() * alienInvaders.length);

  // invader shoot
  function shoot() {
    squares[randomShooterIndex].classList.remove('invader-laser');
    randomShooterIndex += width;
    squares[randomShooterIndex].classList.add('invader-laser');

    if (squares[randomShooterIndex].classList.contains('shooter')) {
      squares[randomShooterIndex].classList.remove('invader-laser', 'shooter');
      squares[randomShooterIndex].classList.add('boom');

      setTimeout(() => {
        squares[randomShooterIndex].classList.remove('boom');
      }, 100);
      clearInterval(laserId);
      clearInterval(invaderId);
      over();
    }

    if (randomShooterIndex > squares.length - width - 1) {
      clearInterval(laserId);
      setTimeout(() => {
        squares[randomShooterIndex].classList.remove('invader-laser');
      }, 100);
    }
  }

  laserId = setInterval(shoot, 500);


  if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
    direction = width;
  } else if (direction === width) {
    if (leftEdge) direction = 1;
    else direction = -1;
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader');
  }
  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!alienInvaderTakenDown.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader');
    }
  }

  // decide a game over
  if (squares[currentShooterIndex].classList.contains('invader')) {
    over();
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > (squares.length - (width - 1))) {
      over()
      break;;
    }
  }
  // decide win
  if (alienInvaderTakenDown.length === alienInvaders.length) {
    resultDisplay.textContent = 'You win';
    clearInterval(invaderId);
    alert('Win~~~~~~')
  }
}

document.addEventListener('keydown', moveShooter);
document.addEventListener('keyup', shoot);

invaderId = setInterval(moveInvaders, 500);

function over() {
  clearInterval(invaderId);
  squares[currentShooterIndex].classList.add('boom');
  document.removeEventListener('keydown', moveShooter);
  document.removeEventListener('keyup', shoot);
  resultDisplay.textContent = 'Game over';
  alert('Game over~~~~~~~~~~')
}
