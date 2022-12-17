const windowWidth = () => window.innerWidth;
const windowHeight = () => window.innerHeight;
let prevMpress = false;
const sideStates = {
  ENTRANCE: 3,
  EXIT: 2,
  WALL: 1,
  NOTHING: 0
}
let backtrackCells = [];
let setPath;
const angle = 50;
const angleStep = 1 / 4;
const direction = {
  NORTH: [0, -1, 0, 0, 1, 0],
  EAST: [1, 0, 1, 0, 1, 1],
  SOUTH: [0, 1, 0, 1, 1, 1],
  WEST: [-1, 0, 0, 0, 0, 1]
}
let upPressed = false,
  leftPressed = false,
  rightPressed = false,
  downPressed = false,
  mPressed = false;
mouseMoved = false;
let moveX = 0;
let full = false;
let nextPathCell;
const maze = document.getElementById('maze');
const directions = [direction.NORTH, direction.EAST, direction.SOUTH, direction.WEST];
let startCell;
let cells = [];
let rowNumber = 5;
const cellSize = () => Math.floor(Math.min(windowWidth() / 2, windowHeight()) /* / 2 */ / rowNumber);

const cnvs = document.getElementById('canvas');
const slider = document.getElementById('slider');
const ctx = cnvs.getContext('2d', {
  alpha: false
});
const main = document.getElementById('viewField');
const mCtx = main.getContext('2d');
const mm = document.getElementById('minimap');
const minimap = mm.getContext('2d');

const player = new createPlayer();
const rayWidth = () => Math.round((cellSize() * rowNumber * 2) / (angle * 2) * angleStep);
const gap = () => (cellSize() * rowNumber * 2) - rayWidth() / angleStep * (angle * 2);
const mPos = () => Math.floor(cellSize() * rowNumber / 5);
const cellSizeM = () => Math.floor(mPos() / 3);
//width of canvas / totalAngle

let init = () => {
  // loop();
  // mCtx.translate(0.5,0.5);

  if (!cnvs.getContext) {
    alert('your browser doesn`t support this format')
    clearInterval(Loop);
  }
  for (let x = 0; x < rowNumber; x++) {
    for (let y = 0; y < rowNumber; y++)
      cells[x + y * rowNumber] = new cell(x, y);
  }

  startCell = cells[cells.length - 1];
  startCell.states[2] = sideStates.ENTRANCE;
  endCell = cells[0];
  endCell.states[0] = sideStates.EXIT;
  nextPathCell = startCell;


  window.onresize = () => {

    cnvs.width = cellSize() * rowNumber;
    cnvs.height = cellSize() * rowNumber;
    maze.height = cellSize() * rowNumber + 1;
    maze.width = cellSize() * rowNumber + 1;
    main.height = cellSize() * rowNumber;
    main.width = cellSize() * rowNumber * 2;
    mm.width = mPos() * 2;
    mm.height = mPos() * 2;
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, windowWidth(), windowHeight())
    ctx.closePath();
    mCtx.beginPath();
    mCtx.fillStyle = 'black';
    mCtx.fillRect(0, 0, main.width, main.height);
    mCtx.closePath();
    // ctx.fillStyle = 'deepskyblue';
    // ctx.fillStyle = "black";
    // ctx.fillRect(0, 0, windowWidth(),windowHeight());
    for (let cell of cells)
      cell.display();
    ctx.drawImage(maze, 0, 0);
    // player.raycast();
    player.raycast();

    player.display();
    // const cPos = Math.floor(Math.min(windowWidth(), windowHeight()) /* / 2 */ / 5) * 4;
    // mCtx.fillStyle = 'red';
    // mCtx.beginPath();
    // mCtx.moveTo(cPos * 2, cPos / 4);
    // mCtx.lineTo(cPos * 2 + cPos / 16 * Math.cos(rad(player.dir)), cPos / 4 + cPos / 16 * Math.sin(rad(player.dir)));
    // mCtx.lineTo(cPos * 2 + cPos / 80 * Math.cos(rad(player.dir - 90 % 360)), cPos / 4 + cPos / 80 * Math.sin(rad(player.dir - 90 % 360)));
    // // mCtx.fill();
    // // mCtx.beginPath();
    // mCtx.moveTo(cPos * 2, cPos / 4);
    // mCtx.lineTo(cPos * 2 + cPos / 16 * Math.cos(rad(player.dir)), cPos / 4 + cPos / 16 * Math.sin(rad(player.dir)));
    // mCtx.lineTo(cPos * 2 - cPos / 80 * Math.cos(rad(player.dir - 90 % 360)), cPos / 4 - cPos / 80 * Math.sin(rad(player.dir - 90 % 360)));
    // mCtx.fill();
    // mCtx.strokeStyle = 'blue';
    // mCtx.strokeWidth = 2;
    // mCtx.beginPath();
    // mCtx.arc(cPos * 2, cPos / 4, cPos / 16, 0, Math.PI * 2);
    // mCtx.stroke();
    if (!mPressed) {

      mCtx.save();
      mCtx.strokeStyle = "black";
      mCtx.fillStyle = "black";
      mCtx.lineWidth = 5;
      mCtx.beginPath();
      mCtx.arc(mPos() * 9 - gap() / 2, mPos(), mPos(), 0, Math.PI * 2);
      mCtx.stroke();
      mCtx.fill();
      mCtx.clip();
      for (let cell of cells)
        cell.map();

      mCtx.imageSmoothingEnabled = false;
      mCtx.drawImage(mm, Math.floor(mPos() * 8 - gap() / 2), 0);
      mCtx.beginPath();
      mCtx.arc(mPos() * 9 - gap() / 2, mPos(), mPos() / 60, 0, Math.PI * 2);
      mCtx.fillStyle = 'red';
      mCtx.fill();
      // mCtx.drawImage(cnvs, Math.floor(player.posX * cellSize() - cellSize() * 2), Math.floor(player.posY * cellSize() - cellSize() * 2), cellSize() * 4, cellSize() * 4, Math.floor(mPos() * 8 - gap() / 2), 0, mPos() * 2, mPos() * 2);
      mCtx.restore();
    }
  }
  // loop();
  // path();
  for (let i = 1; i < rowNumber * rowNumber + 1; i++) {
    path();
  }
  maze.height = cellSize() * rowNumber + 1;
  maze.width = cellSize() * rowNumber + 1;
  for (let cell of cells)
    cell.display();
  cnvs.width = cellSize() * rowNumber;
  cnvs.height = cellSize() * rowNumber;
  main.height = cellSize() * rowNumber;
  main.width = cellSize() * rowNumber * 2;
  mm.width = mPos() * 2;
  mm.height = mPos() * 2;
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, windowWidth(), windowHeight())
  ctx.closePath();
  mCtx.beginPath();
  mCtx.fillStyle = 'black';
  mCtx.fillRect(0, 0, main.width, main.height);
  mCtx.closePath();
  player.dir = cells[rowNumber * rowNumber - 1].states[0] == 0 ? 270 : 180;
  ctx.drawImage(maze, 0, 0);
  player.raycast();
  player.display();
  // const cPos = Math.floor(Math.min(windowWidth(), windowHeight()) /* / 2 */ / 5) * 4;
  // mCtx.fillStyle = 'red';
  // mCtx.beginPath();
  // mCtx.moveTo(cPos * 2, cPos / 4);
  // mCtx.lineTo(cPos * 2 + cPos / 16 * Math.cos(rad(player.dir)), cPos / 4 + cPos / 16 * Math.sin(rad(player.dir)));
  // mCtx.lineTo(cPos * 2 + cPos / 80 * Math.cos(rad(player.dir - 90 % 360)), cPos / 4 + cPos / 80 * Math.sin(rad(player.dir - 90 % 360)));
  // // mCtx.fill();
  // // mCtx.beginPath();
  // mCtx.moveTo(cPos * 2, cPos / 4);
  // mCtx.lineTo(cPos * 2 + cPos / 16 * Math.cos(rad(player.dir)), cPos / 4 + cPos / 16 * Math.sin(rad(player.dir)));
  // mCtx.lineTo(cPos * 2 - cPos / 80 * Math.cos(rad(player.dir - 90 % 360)), cPos / 4 - cPos / 80 * Math.sin(rad(player.dir - 90 % 360)));
  // mCtx.fill();
  // mCtx.strokeStyle = 'blue';
  // mCtx.strokeWidth = 2;
  // mCtx.beginPath();
  // mCtx.arc(cPos * 2, cPos / 4, cPos / 16, 0, Math.PI * 2);
  // mCtx.stroke();
  mCtx.save();
  mCtx.strokeStyle = "black";
  mCtx.fillStyle = "black";
  mCtx.lineWidth = 5;
  mCtx.beginPath();
  mCtx.arc(mPos() * 9 - gap() / 2, mPos(), mPos(), 0, Math.PI * 2);
  mCtx.stroke();
  mCtx.fill();
  mCtx.clip();
  for (let cell of cells)
    cell.map();

  mCtx.imageSmoothingEnabled = false;
  mCtx.drawImage(mm, Math.floor(mPos() * 8 - gap() / 2), 0);
  mCtx.beginPath();
  mCtx.arc(mPos() * 9 - gap() / 2, mPos(), mPos() / 60, 0, Math.PI * 2);
  mCtx.fillStyle = 'red';
  mCtx.fill();
  // mCtx.drawImage(cnvs, Math.floor(player.posX * cellSize() - cellSize() * 2), Math.floor(player.posY * cellSize() - cellSize() * 2), cellSize() * 4, cellSize() * 4, Math.floor(mPos() * 8 - gap() / 2), 0, mPos() * 2, mPos() * 2);
  mCtx.restore();
  // player.raycast();
}

loop = () => {
  if (leftPressed || rightPressed || upPressed || downPressed || mouseMoved || prevMpress != mPressed) {
    prevMpress = mPressed;
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, windowWidth(), windowHeight())
    ctx.closePath();
    mCtx.beginPath();
    mCtx.fillStyle = 'black';
    mCtx.fillRect(0, 0, main.width, main.height);
    mCtx.closePath();
    mm.width = mPos() * 2;
    mm.height = mPos() * 2;
    // player.raycast();
    if (upPressed || downPressed || rightPressed || leftPressed)
      player.move(upPressed ? 1 : downPressed ? -1 : 0, leftPressed ? -1 : rightPressed ? 1 : 0);
    if (mouseMoved)
      player.rotate(moveX / slider.value);
    moveX = 0;
    player.raycast();
    ctx.drawImage(maze, 0, 0);
    player.display();
    // const cPos = Math.floor(Math.min(windowWidth(), windowHeight()) /* / 2 */ / 5) * 4;
    // mCtx.fillStyle = 'red';

    // mCtx.beginPath();
    // mCtx.moveTo(cPos * 2, cPos / 4);
    // mCtx.lineTo(cPos * 2 + cPos / 16 * Math.cos(rad(player.dir)), cPos / 4 + cPos / 16 * Math.sin(rad(player.dir)));
    // mCtx.lineTo(cPos * 2 + cPos / 80 * Math.cos(rad(player.dir - 90 % 360)), cPos / 4 + cPos / 80 * Math.sin(rad(player.dir - 90 % 360)));
    // mCtx.moveTo(cPos * 2, cPos / 4);
    // mCtx.lineTo(cPos * 2 + cPos / 16 * Math.cos(rad(player.dir)), cPos / 4 + cPos / 16 * Math.sin(rad(player.dir)));
    // mCtx.lineTo(cPos * 2 - cPos / 80 * Math.cos(rad(player.dir - 90 % 360)), cPos / 4 - cPos / 80 * Math.sin(rad(player.dir - 90 % 360)));
    // mCtx.fill();
    // mCtx.strokeStyle = 'blue';
    // mCtx.strokeWidth = 2;
    // mCtx.beginPath();
    // mCtx.arc(cPos * 2, cPos / 4, cPos / 16, 0, Math.PI * 2);
    // mCtx.stroke();
    if (mPressed) {
      // mCtx.save();
      // mCtx.globalAlpha = 0.5;
      mCtx.drawImage(cnvs, cellSize() * rowNumber / 2, 0);
      // mCtx.restore();
    } else {

      mCtx.save();
      mCtx.strokeStyle = "black";
      mCtx.fillStyle = "black";
      mCtx.lineWidth = 5;
      mCtx.beginPath();
      mCtx.arc(mPos() * 9 - gap() / 2, mPos(), mPos(), 0, Math.PI * 2);
      mCtx.stroke();
      mCtx.fill();
      mCtx.clip();
      for (let cell of cells)
        cell.map();

      mCtx.imageSmoothingEnabled = false;
      mCtx.drawImage(mm, Math.floor(mPos() * 8 - gap() / 2), 0);
      mCtx.beginPath();
      mCtx.arc(mPos() * 9 - gap() / 2, mPos(), mPos() / 60, 0, Math.PI * 2);
      mCtx.fillStyle = 'red';
      mCtx.fill();
      // mCtx.drawImage(cnvs, Math.floor(player.posX * cellSize() - cellSize() * 2), Math.floor(player.posY * cellSize() - cellSize() * 2), cellSize() * 4, cellSize() * 4, Math.floor(mPos() * 8 - gap() / 2), 0, mPos() * 2, mPos() * 2);
      mCtx.restore();
    }

  }



}
restart = () => {
  cells = [];
  rowNumber += Math.floor(rowNumber / 4);
  player.posX = rowNumber - 0.5;
  player.posY = rowNumber - 0.5;
  init();
  player.dir = cells[rowNumber * rowNumber - 1].states[0] == 0 ? 270 : 180;
}

path = () => {
  let currentX = nextPathCell.xIndex;
  let currentY = nextPathCell.yIndex;
  let nextCell = undefined;
  let currentCell = nextPathCell;
  // console.log(currentCell)
  let nextDirection;
  let validDirections = [direction.NORTH, direction.EAST, direction.SOUTH, direction.WEST];
  if (!(cells[currentX + 1 + currentY * rowNumber] != undefined && currentX + 1 < rowNumber && cells[currentX + 1 + currentY * rowNumber].visited != true))
    validDirections.splice(validDirections.indexOf(direction.EAST), 1);
  if (!(cells[currentX - 1 + currentY * rowNumber] != undefined && currentX - 1 > -1 && cells[currentX - 1 + currentY * rowNumber].visited != true))
    validDirections.splice(validDirections.indexOf(direction.WEST), 1);
  if (!(cells[currentX + (currentY + 1) * rowNumber] != undefined && currentY + 1 < rowNumber && cells[currentX + (currentY + 1) * rowNumber].visited != true))
    validDirections.splice(validDirections.indexOf(direction.SOUTH), 1);
  if (!(cells[currentX + (currentY - 1) * rowNumber] != undefined && currentY - 1 > -1 && cells[currentX + (currentY - 1) * rowNumber].visited != true))
    validDirections.splice(validDirections.indexOf(direction.NORTH), 1);
  if (validDirections.length != 0) {
    nextDirection = validDirections[Math.floor(Math.random() * validDirections.length)];

    nextCell = cells[currentX + nextDirection[0] + (currentY + nextDirection[1]) * rowNumber];
    currentCell.states[directions.indexOf(nextDirection)] = 0;
    nextCell.states[(directions.indexOf(nextDirection) + 2) % 4] = 0;
    currentCell.visited = true;
    nextPathCell = nextCell;
    if (validDirections.length > 1)
      backtrackCells.unshift(currentCell);
  } else {
    if (backtrackCells.length != 0) {
      currentCell.visited = true;
      nextPathCell = backtrackCells[0];
      backtrackCells.shift();
      path();
    }
  }
}

let Loop = setInterval(loop, 20);
checkIntersection = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  const denom = ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
  if (denom != 0) {
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom * -1;
    if (0 <= t && t <= 1 && 0 <= u && u <= 1)
      return [x3 + u * (x4 - x3), y3 + u * (y4 - y3)];
    else
      return false;
  } else
    return false;

}
let rad = (deg) => deg * (Math.PI / 180);