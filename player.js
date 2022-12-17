function createPlayer() {
  this.posX = rowNumber - 0.5;
  this.posY = rowNumber - 0.5;
  this.dir = 0;
  this.r = 0.05;

  this.display = () => {
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.beginPath();
    ctx.arc(this.posX * cellSize(), this.posY * cellSize(), this.r * cellSize(), 0, rad(360));
    ctx.fill();
  }
  this.raycast = () => {
    let checks = [];
    for (let i = -angle; i < angle; i += angleStep) {
      let check;
      let state = 1;
      let first = [this.posX + 3 * Math.cos(rad((this.dir + i) % 360)), this.posY + 3 * Math.sin(rad((this.dir + i) % 360))];
      for (let j = 0; j < ((rowNumber * 2) + 2); j++) {
        if (j <= rowNumber)
          check = checkIntersection(this.posX, (this.posY), this.posX + 3 * Math.cos((this.dir + i) * Math.PI / 180), (this.posY) + 3 * Math.sin((this.dir + i) * Math.PI / 180), 0, (rowNumber) - j, rowNumber + 1, (rowNumber) - j)
        else
          check = checkIntersection((this.posX), this.posY, (this.posX) + 3 * Math.cos((this.dir + i) * Math.PI / 180), this.posY + 3 * Math.sin((this.dir + i) * Math.PI / 180), j - (rowNumber + 1), 0, j - (rowNumber + 1), rowNumber + 1)
        if (check != false) {
          if (Math.hypot(this.posX - check[0], this.posY - check[1]) * Math.cos(rad(i)) <= Math.hypot(this.posX - first[0], this.posY - first[1]) * Math.cos(rad(i))) {
            if (j <= rowNumber) {
              if (cells[Math.floor(check[0]) + Math.floor(check[1]) * rowNumber] != undefined)
                if (cells[Math.floor(check[0]) + Math.floor(check[1]) * rowNumber].states[rowNumber - j < check[1] ? 2 : 0] == 1) {
                  first[0] = check[0];
                  first[1] = check[1];
                  state = 1;
                }
              else if (cells[Math.floor(check[0]) + Math.floor(check[1]) * rowNumber].states[rowNumber - j < check[1] ? 2 : 0] == 2) {
                first[0] = check[0];
                first[1] = check[1];
                state = 2;
              } else {} else if (check[0] >= rowNumber || check[1] >= rowNumber) {
                first[0] = check[0];
                first[1] = check[1];
                if (check[1] == rowNumber && check[0] >= rowNumber - 1)
                  state = 3;
                else
                  state = 1;
              }
            } else {
              if (cells[Math.floor(check[0]) + Math.floor(check[1]) * rowNumber] != undefined)
                if (cells[Math.floor(check[0]) + Math.floor(check[1]) * rowNumber].states[j - (rowNumber + 1) < check[0] ? 1 : 3] == 1) {
                  first[0] = check[0];
                  first[1] = check[1];
                  state = 1;
                }
              else if (cells[Math.floor(check[0]) + Math.floor(check[1]) * rowNumber].states[j - (rowNumber + 1) < check[0] ? 1 : 3] == 2) {
                first[0] = check[0];
                first[1] = check[1];
                state = 2;
              } else {} else if (check[0] >= rowNumber || check[1] >= rowNumber) {
                first[0] = check[0];
                first[1] = check[1];
                state = 1;
              }
            }
          }
        }
      }

      const dist = Math.hypot(this.posX - first[0], this.posY - first[1]);

      const h = 1 / dist / 3 * (cellSize() * rowNumber);
      mCtx.save();
      mCtx.fillStyle = `rgba(${state==1?255:state==3?0:255},255,${state==1?255:0},${(1-dist/3)})`;
      mCtx.beginPath();
      mCtx.rect((gap() / 2) + (Math.floor((i + angle) * (rayWidth() / angleStep))), cellSize() * rowNumber / 2 - (h / 2), rayWidth(), Math.ceil(h))
      mCtx.fill();

      //top//

      mCtx.beginPath();
      mCtx.rect((gap() / 2) + (Math.floor((i + angle) * rayWidth() / angleStep)), 0, rayWidth(), cellSize() * rowNumber / 2 - Math.floor(h) / 2 + 1)
      mCtx.fillStyle = "deepskyblue";
      mCtx.fill();

      //bottom//

      mCtx.beginPath();
      mCtx.rect((gap() / 2) + (Math.floor((i + angle) * rayWidth() / angleStep)), cellSize() * rowNumber / 2 - (h / 2) + Math.ceil(h), rayWidth(), cellSize() * rowNumber - (cellSize() * rowNumber / 2 - (h / 2) + Math.ceil(h)))
      mCtx.fillStyle = "black";
      mCtx.fill();
      mCtx.restore();
      checks.push([first[0], first[1]]);
    }

    ctx.beginPath();
    ctx.moveTo(this.posX * cellSize(), this.posY * cellSize())
    for (let i = 0; i < checks.length; i++)
      ctx.lineTo(checks[i][0] * cellSize(), checks[i][1] * cellSize());
    ctx.lineTo(this.posX * cellSize(), this.posY * cellSize())
    ctx.fillStyle = 'gray';
    // ctx.stroke();
    ctx.fill();

    minimap.save();
    minimap.translate((rowNumber - this.posX - (rowNumber - 3)) * cellSizeM(), (rowNumber - this.posY - (rowNumber - 3)) * cellSizeM());
    minimap.beginPath();
    minimap.moveTo(this.posX * cellSizeM(), this.posY * cellSizeM());
    for (let i = 0; i < checks.length; i++)
      minimap.lineTo(checks[i][0] * cellSizeM(), checks[i][1] * cellSizeM());
    minimap.lineTo(this.posX * cellSizeM(), this.posY * cellSizeM());
    minimap.fillStyle = 'gray';
    minimap.fill();
    minimap.restore();
  }
  this.move = (X, Y) => {
    const angle = (360 + Math.round(Math.atan2(Y, X) * 180 / Math.PI)) % 360;
    const x = 0.025 * Math.cos(rad(this.dir + angle % 360));
    const y = 0.025 * Math.sin(rad(this.dir + angle % 360));
    this.x = Math.floor(this.posX);
    this.y = Math.floor(this.posY);
    if ((this.dir + 360 + angle) % 360 > 180 && this.posY - this.r + y <= this.y && this.x == 0 && this.y == 0)
      restart();
    else
    if ((Math.floor(this.posX + x) > this.x || Math.floor(this.posX + x) < this.x) && (Math.floor(this.posY + y) > this.y || Math.floor(this.posY + y) < this.y)) {} else {
      if ((this.dir + 360 + angle) % 360 > 180)
        if ((this.posY - this.r + y >= this.y || cells[this.x + this.y * rowNumber].states[0] == 0))
          this.posY += y;
        else {}
      else if ((this.dir + 360 + angle) % 360 < 180)
        if ((this.posY + this.r + y <= this.y + 1 || cells[this.x + this.y * rowNumber].states[2] == 0))
          this.posY += y;
      if ((this.dir + 360 + angle) % 360 > 90 && (this.dir + 360 + angle) % 360 < 270)
        if ((this.posX - this.r + x >= this.x || cells[this.x + this.y * rowNumber].states[3] == 0))
          this.posX += x;
        else {}
      else if ((this.dir + 360 + angle) % 360 < 90 || (this.dir + 360 + angle) % 360 > 270)
        if ((this.posX + this.r + x <= this.x + 1 || cells[this.x + this.y * rowNumber].states[1] == 0))
          this.posX += x;
    }
  }
  this.rotate = (x) => {
    this.dir += x;
    this.dir %= 360;
  }

}