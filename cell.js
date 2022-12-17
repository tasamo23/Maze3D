function cell(x, y) {

  this.xIndex = x;
  this.yIndex = y;
  this.posX = () => Math.floor(this.xIndex * cellSize());
  this.posY = () => Math.floor(this.yIndex * cellSize());
  this.states = [1, 1, 1, 1];
  this.visited = false;
  this.noBackTrack = false;
  this.display = () => {
    const context = maze.getContext('2d');
    for (let i = 0; i < 4; i++) {
      context.lineWidth = 2;
      context.lineJoin = 'round';
      context.lineCap = "butt";
      context.save();
      context.translate(0.5, 0, 5);
      context.beginPath();
      switch (this.states[i]) {
        case sideStates.WALL:

          context.moveTo(this.posX() + (directions[i][2] * cellSize()), this.posY() + (directions[i][3] * cellSize()));
          context.strokeStyle = 'rgb(255,255,255)';
          context.lineTo(this.posX() + (directions[i][4] * cellSize()), this.posY() + (directions[i][5] * cellSize()))
          context.stroke();
          break;
        case sideStates.ENTRANCE:
          context.beginPath();
          context.lineWidth = 10;

          context.moveTo(this.posX() + (directions[i][2] * cellSize()), this.posY() + (directions[i][3] * cellSize()));
          context.strokeStyle = 'lime';
          context.lineTo(this.posX() + (directions[i][4] * cellSize()), this.posY() + (directions[i][5] * cellSize()))
          context.stroke();
          break;
        case sideStates.EXIT:
          context.beginPath();
          context.lineWidth = 10;
          context.moveTo(this.posX() + (directions[i][2] * cellSize()), this.posY() + (directions[i][3] * cellSize()));
          context.strokeStyle = 'gold';
          context.lineTo(this.posX() + (directions[i][4] * cellSize()), this.posY() + (directions[i][5] * cellSize()))
          context.stroke();
          break;
      }
      context.restore();

    }
  }
  this.map = () => {
    for (let i = 0; i < 4; i++) {
      minimap.save();
      minimap.lineWidth = Math.floor(mPos() / 6 / 10);
      minimap.translate(0.5, 0.5);
      minimap.translate((rowNumber - player.posX - (rowNumber - 3)) * cellSizeM(), (rowNumber - player.posY - (rowNumber - 3)) * cellSizeM());
      minimap.beginPath();
      if (this.xIndex + (directions[i][2]) > player.posX - 3 || this.xIndex + (directions[i][2]) < player.posX + 3 ||
        this.yIndex + (directions[i][3]) > player.posY - 3 || this.yIndex + (directions[i][3]) < player.posY + 3 ||
        this.xIndex + (directions[i][4]) > player.posX - 3 || this.xIndex + (directions[i][4]) < player.posX + 3 ||
        this.yIndex + (directions[i][5]) > player.posX - 3 || this.yIndex + (directions[i][5]) < player.posX + 3)
        switch (this.states[i]) {
          case sideStates.WALL:

            minimap.moveTo(this.xIndex * cellSizeM() + (directions[i][2] * cellSizeM()), this.yIndex * cellSizeM() + (directions[i][3] * cellSizeM()));
            minimap.strokeStyle = 'rgb(255,255,255)';
            minimap.lineTo(this.xIndex * cellSizeM() + (directions[i][4] * cellSizeM()), this.yIndex * cellSizeM() + (directions[i][5] * cellSizeM()));
            minimap.stroke();
            break;
          case sideStates.ENTRANCE:
            minimap.beginPath();
            minimap.lineWidth = Math.floor(mPos() / 6 / 10 * 2.5);

            minimap.moveTo(this.xIndex * cellSizeM() + (directions[i][2] * cellSizeM()), this.yIndex * cellSizeM() + (directions[i][3] * cellSizeM()) - Math.floor(mPos() / 6 / 10 * 2.5) / 2);
            minimap.strokeStyle = 'lime';
            minimap.lineTo(this.xIndex * cellSizeM() + (directions[i][4] * cellSizeM()), this.yIndex * cellSizeM() + (directions[i][5] * cellSizeM()) - Math.floor(mPos() / 6 / 10 * 2.5) / 2);
            minimap.stroke();
            break;
          case sideStates.EXIT:
            minimap.beginPath();
            minimap.lineWidth = Math.floor(mPos() / 6 / 10 * 2.5);
            minimap.moveTo(this.xIndex * cellSizeM() + (directions[i][2] * cellSizeM()), this.yIndex * cellSizeM() + (directions[i][3] * cellSizeM()) + Math.floor(mPos() / 6 / 10 * 2.5) / 2);
            minimap.strokeStyle = 'gold';
            minimap.lineTo(this.xIndex * cellSizeM() + (directions[i][4] * cellSizeM()), this.yIndex * cellSizeM() + (directions[i][5] * cellSizeM()) + Math.floor(mPos() / 6 / 10 * 2.5) / 2);
            minimap.stroke();
            break;
        }
      minimap.restore();
    }
  }
}