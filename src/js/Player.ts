import { context, size, labels, widthMiltipler } from './index';
import { map } from './map';
import { controller } from './controller';

// класс игрока

export class Player {
  width: number;
  height: number;
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  speed: number;
  xVelocity: number;
  yVelocity: number;
  jumping: boolean;
  mouseMoving: boolean;
  controller: any;
  cenerX: number;
  cenerY: number;
  score: number;
  collision: any;
  texture: any;

	/**
	 * @param width ширина игрока
	 * @param height высота игрока равна ширине
	 * @param x координата по горизонтали
	 * @param y коорддината по вертикали
	 * @param speed скорость
	 * @param xVelocity иннерция
	 * @param yVelocity гравитация
	 */
  constructor (width: number, height: number, x: number, y: number, speed: number, xVelocity: number, yVelocity: number, score: number) {
    this.width = width ? width : 30;
    this.height = this.width;
    this.x = x ? x : 0;
    this.y = y ? y : 82;
    this.oldX = this.x ;
    this.oldY = this.y;
    this.speed = speed ? speed / 10 : 1;
    this.xVelocity = xVelocity ? xVelocity : 0;
    this.yVelocity = yVelocity ? yVelocity : 0;
    this.jumping = true;
    this.mouseMoving = false;
    this.controller = controller;
    this.texture = new Image();
    this.texture.src = '/images/human.png';

    this.collision = {
      1: (object: any, row: number, column: number): void => {
        if (this.collision.topCollision(object, row)) { return; }
        this.collision.rightCollision(object, column);
      },
      2: (object: any, row: number, column: number): void => {
        if (this.collision.topCollision(object, row)) { return; }
        this.collision.leftCollision(object, column);
      },
      3: (object: any, row: number, column: number): void => {
        this.collision.rightCollision(object, column);
      },
      4: (object: any, row: number, column: number): void => {
        if (this.collision.topCollision(object, row)) { return; }
        if (this.collision.leftCollision(object, column)) { return; }
        this.collision.rightCollision(object, column);
      },
      5: (object: any, row: number, column: number): void => {
        this.collision.topCollision(object, row);
      },
      6: (object: any, row: number, column: number): void => {
        if (this.collision.bottomCollision(object, row)) { return; }
        if (this.collision.rightCollision(object, column)) { return; }
        this.collision.leftCollision(object, column);
      },
      7: (object: any, row: number, column: number): void => {
        if (this.collision.leftCollision(object, column)) { return; }
        this.collision.rightCollision(object, column);
      },
      leftCollision (object: any, column: number) {
        if (object.xVelocity > 0) {
          let left = column * size;
          if (object.x + object.width > left && object.oldX <= left) {
            object.xVelocity = 0;
            object.x = object.oldX = left - object.width - 0.001;
            return true;
          }
        }
        return false;
      },
      rightCollision (object: any, column: number) {
        if (object.xVelocity < 0) {
          let right = (column + 1) * size;
          if (object.x < right && object.oldX + object.width * 0.5 >= right) {
            object.xVelocity = 0;
            object.oldX = object.x = right;
            return true;
          }
        }
        return false;
      },
      topCollision (object: any, row: number) {
        if (object.yVelocity > 0) {
          let top = row * size;
          if (object.y + object.height > top && object.oldY + object.height <= top) {
            object.jumping = false;
            object.yVelocity = 0;
            object.oldY = object.y = top - object.height - 0.01;
            return true;
          }
        }
        return false;
      },
      bottomCollision (object: any, row: number) {
        if (object.y - object.oldY < 0) {
          let bottom = (row + 1) * size;

          if (object.top < bottom && object.oldTop >= bottom) {
            object.yVelocity = 0;
            object.oldY = object.y = bottom;
          }
        }
      }
    };
  }

  get centerX (): number { return this.x + this.width * 0.5; }
  get centerY (): number { return this.y + this.height * 0.5; }

  get bottom (): number { return this.y + this.height; }
  get oldBottom (): number { return this.oldY + this.height; }
  get left (): number { return this.x; }
  get oldLeft (): number { return this.oldX; }
  get top (): number { return this.y; }
  get oldTop (): number { return this.oldY; }
  get right (): number { return this.x + this.width; }
  get oldRight (): number { return this.oldX + this.width; }

  draw (): void {
    context.fillStyle = '#ff0000';
    // context.fillRect(this.x, this.y, this.width, this.height);

    context.drawImage(this.texture, this.x, this.y, this.width, this.height);

    // context.drawImage(image, this.x, this.y, this.width, this.height);

    /**
     * тянем к правому краю
     */
    this.x += (context.canvas.width - this.x/* - context.canvas.width * 0.5 */) * 0.01;

    /**
     * Проход на сл экран
     */
    // if (this.x > context.canvas.width) {
    //   this.x = -this.width;
    //   console.log('load LEFT');
    // }
    // if (this.x < -this.width) {
    //   this.x = context.canvas.width;
    //   console.log('load RIGHT');
    // }
    if (this.y > context.canvas.height) {
      this.y = -this.height;
      console.log('load UP');
    }
    if (this.y < -this.height) {
      this.y = context.canvas.height;
      console.log('load DOWN');
    }

    /**
     * ЛКМ
     */
    if (this.controller.mouse === true) {
      this.x = this.controller.pointerX - (this.width / 2);
      this.y = this.controller.pointerY - (this.height);
    }

    /**
     * ПКМ
     */
    if (this.controller.reset === true) {
      this.x = 50;
      this.y = 50;
    }

    /**
     * Двигаемся влево
     */
    if (this.controller.left) {
      this.xVelocity -= 0.8;
    }

    /**
     * Двигаемся вправо
     */
    if (this.controller.right) {
      this.xVelocity += 0.8;
    }

    /**
     * Прыжок
     */
    if (this.controller.up && !this.jumping) {
      this.yVelocity = -17;
      this.jumping = true;
      labels[0].increment();
    }

    /**
     * Жмем вниз
     */
    if (this.controller.down) {
      labels[0].decrement();
    }

    /**
     * Гравитация
     */
    if (this.yVelocity < 20) this.yVelocity += 1.1;

    this.oldX = this.x;
    this.oldY = this.y;
    this.x += this.xVelocity;
    this.y += this.yVelocity;

    // столкновение с левой-правой стенкой
    /*if (this.x < 0) {
      this.xVelocity = 0;
      this.oldX = this.x = 0.001;
    } else if (this.x + this.width > context.canvas.width) {
      this.xVelocity = 0;
      this.oldX = this.x = context.canvas.width - this.width - 0.001;
    }

    // столкновение с верхом-низом
    if (this.y < 0) {
      this.yVelocity = 0;
      this.oldY = this.y = 0;
    } else if (this.y + this.height > context.canvas.height) {
      this.yVelocity = 0;
      this.oldY = this.y = context.canvas.height - this.height - 0.001;
    }*/

    /**
     *  Коллизии
     */
    if (this.x - this.oldX < 0) {// left collision
      let leftColumn = Math.floor(this.left / size);
      let bottomRow = Math.floor(this.bottom / size);
      let valueAtIndex = map[bottomRow * 13 + leftColumn];

      if (valueAtIndex > 0) {// Check the bottom left point
        this.collision[valueAtIndex](this, bottomRow, leftColumn);
        document.querySelector('p').innerHTML = `tile: ${valueAtIndex}, bottomRow: ${bottomRow}, leftColumn: ${leftColumn}`;
      }

      let topRow = Math.floor(this.top / size);
      valueAtIndex = map[topRow * 13 + leftColumn];

      if (valueAtIndex > 0) {// Check the top left point
        this.collision[valueAtIndex](this, topRow, leftColumn);
        document.querySelector('p').innerHTML = `tile: ${valueAtIndex}, topRow: ${bottomRow}, leftColumn: ${leftColumn}`;
      }

    } else if (this.x - this.oldX > 0) {// right collision
      let rightColumn = Math.floor(this.right / size);
      let bottomRow = Math.floor(this.bottom / size);
      let valueAtIndex = map[bottomRow * 13 + rightColumn];

      if (valueAtIndex > 0) {// Check the bottom right point
        this.collision[valueAtIndex](this, bottomRow, rightColumn);
        document.querySelector('p').innerHTML = `tile: ${valueAtIndex}, topRow: ${bottomRow}, rightColumn: ${rightColumn}`;
      }

      let topRow = Math.floor(this.top / size);
      valueAtIndex = map[topRow * 13 + rightColumn];

      if (valueAtIndex > 0) {// Check the top right point
        this.collision[valueAtIndex](this, topRow, rightColumn);
        document.querySelector('p').innerHTML = `tile: ${valueAtIndex}, topRow: ${bottomRow}, rightColumn: ${rightColumn}`;
      }
    }

    if (this.y - this.oldY < 0) { // top collision
      let leftColumn = Math.floor(this.left / size);
      let topRow = Math.floor(this.top / size);
      let valueAtIndex = map[topRow * 13 + leftColumn];
      let rightColumn = Math.floor(this.right / size);

      if (valueAtIndex > 0) {// Check the top left point
        this.collision[valueAtIndex](this, topRow, leftColumn);
        document.querySelector('p').innerHTML = `tile: ${valueAtIndex}, topRow: ${topRow}, leftColumn: ${leftColumn}`;
      }

      valueAtIndex = map[topRow * 13 + rightColumn];

      if (valueAtIndex > 0) {// Check the top right point
        this.collision[valueAtIndex](this, topRow, rightColumn);
        document.querySelector('p').innerHTML = `tile: ${valueAtIndex}, topRow: ${topRow}, leftColumn: ${leftColumn}`;
      }

    } else if (this.y - this.oldY > 0) { // bottom collision
      let leftColumn = Math.floor(this.left / size);
      let bottomRow = Math.floor(this.bottom / size);
      let valueAtIndex = map[bottomRow * 13 + leftColumn];
      let rightColumn = Math.floor(this.right / size);

      if (valueAtIndex > 0 && valueAtIndex !== undefined) {// Check the bottom left point
        this.collision[valueAtIndex](this, bottomRow, leftColumn);
        document.querySelector('p').innerHTML = `tile 1: ${valueAtIndex}, bottomRow: ${bottomRow}, leftColumn: ${leftColumn}`;
      }

      valueAtIndex = map[bottomRow * 13 + rightColumn];

      if (valueAtIndex > 0) {// Check the bottom right point
        this.collision[valueAtIndex](this, bottomRow, rightColumn);
        document.querySelector('p').innerHTML = `tile 2: ${valueAtIndex}, bottomRow: ${bottomRow}, leftColumn: ${leftColumn}`;
      }
    }

    // телеметрия
    let tileX = Math.floor((this.x + this.width * 0.5) / size);
    let tileY = Math.floor((this.y + this.height) / size);
    let valueAtIndex = map[tileY * 13 + tileX];
    // document.querySelector('p').innerHTML = '<br>tileX: ' + tileX + '<br>tileY: ' + tileY + '<br>map index: ' + tileY + ' * ' + widthMiltipler + ' + ' + tileX + ' = ' + String(valueAtIndex) + '<br>tile value: ' + map[tileY * widthMiltipler + tileX];

    // трение / торможение
    this.xVelocity *= .9;
    this.xVelocity *= .9;

  }
}
