import { context } from './index';

export class Snow {
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
  xVelocity: number;

  constructor (width: number, height: number, x: number, y: number, speed: number, xVelocity: number) {
    this.width = 3;
    this.height = this.width;
    this.x = x ? x : 0;
    this.y = y ? y : 0;
    this.speed = speed ? speed / 10 : 1;
    this.xVelocity = xVelocity ? xVelocity : 0.8;
  }

  draw (): void {
    this.x = this.x + this.speed;
    this.y = this.y + this.speed;

    context.fillStyle = 'grey';
    context.fillRect(this.x, this.y, this.width, this.height);

    this.x += this.width;

    if (this.y > context.canvas.height) this.y = -this.height;
  }
}
