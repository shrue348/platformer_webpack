import { context } from './index';

export class Label {
  name: string;
  text: string;
  textSize: number;
  font: string;
  color: string;
  positionX: number;
  positionY: number;
  clickable: boolean;
  callback: any;

  constructor (name: string, text: string, textSize: number, font: string, color: string, positionX: number, positionY: number, clickable: boolean) {
    this.text = text ? text : 'NULL';
    this.textSize = textSize ? textSize : 30;
    this.font = font ? font : 'sans-serif';
    this.color = color ? color : 'white';
    this.positionX = positionX ? positionX : 30;
    this.positionY = positionY ? positionY : 30;
    this.clickable = clickable ? clickable : false;
  }

  increment (): void {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(this.text)) {
      let num: number = parseInt(this.text, 0);

      num = num + 1;
      this.text = String(num);
    }
  }

  decrement (): void {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(this.text)) {
      let num: number = parseInt(this.text, 0);

      num = num - 1;
      this.text = String(num);
    }
  }

  draw (): void {
    context.font = `${this.textSize}px ${this.font}`;
    context.fillStyle = this.color;
    context.fillText(this.text, this.positionX, this.positionY);
  }
}
