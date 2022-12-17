document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
document.body.exitPointerLock = document.body.exitPointerLock || document.body.mozExitPointerLock || document.body.webkitExitPointerLock;
document.body.requestFullscreen = document.body.requestFullscreen || document.body.webkitRequestFullscreen || document.body.mozRequestFullscreen || document.body.msRequestFullscreen;
document.body.exitFullscreen = document.body.exitFullscreen || document.body.webkitExitFullscreen || document.body.mozExitFullscreen || document.body.msExitFullscreen;
dblClick = () => {
  if (!full) {
    document.body.requestFullscreen();
    document.body.requestPointerLock();
  } else {
    document.body.exitFullscreen();
    document.body.exitPointerLock();
  }
}
document.body.addEventListener('dblclick', dblClick)
mouseMove = (e) => {
  if (e.movementX != 0) {
    mouseMoved = true;
    moveX += e.movementX;
  }
}
lockChangeAlert = () => {
  if (document.pointerLockElement === document.body ||
    document.mozPointerLockElement === document.body) {
    document.addEventListener("mousemove", mouseMove);
  } else {
    document.removeEventListener("mousemove", mouseMove);
  }
}
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
keyDown = (e) => {
  switch (e.keyCode) {
    case 87:
      downPressed = false;
      upPressed = true;
      break;
    case 65:
      rightPressed = false;
      leftPressed = true;
      break;
    case 83:
      upPressed = false;
      downPressed = true;
      break;
    case 68:
      leftPressed = false;
      rightPressed = true;
      break;
    case 38:
      downPressed = false;
      upPressed = true;
      break;
    case 37:
      rightPressed = false;
      leftPressed = true;
      break;
    case 40:
      upPressed = false;
      downPressed = true;
      break;
    case 39:
      leftPressed = false;
      rightPressed = true;
      break;
    case 77:
      if (!mPressed)
        mPressed = true;
      else
        mPressed = false;
      break;
  }
}
keyUp = (e) => {
  switch (e.keyCode) {
    case 87:
      upPressed = false;
      break;
    case 65:
      leftPressed = false;
      break;
    case 83:
      downPressed = false;
      break;
    case 68:
      rightPressed = false;
      break;
    case 38:
      upPressed = false;
      break;
    case 37:
      leftPressed = false;
      break;
    case 40:
      downPressed = false;
      break;
    case 39:
      rightPressed = false;
      break;
  }
}
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)