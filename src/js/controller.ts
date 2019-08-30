import { context } from './index';
import { Button } from './Button';

let size = 40;

interface Controller {
  pointerX: number;
  pointerY: number;
  pointerTileX: number;
  pointerTileY: number;
  mouse: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  leftMousePressed: boolean;
  rihghtMousePressed: boolean;
  buttons: Array<Button>;

  testButtons: (targetTouches: any[]) => void;
}

export let controller: any = {
  pointerX: 0,
  pointerY: 0,
  pointerTileX: 0,
  pointerTileY: 0,
  mouse: false,
  left: false,
  right: false,
  up: false,
  down: false,
  leftMousePressed: false,
  rihghtMousePressed: false,

  buttons: [
    new Button('left', .5 * size, 11.5 * size, 1.5 * size, 1.5 * size, 'rgba(0, 144, 240, 1)'),
    new Button('right', 2.5 * size, 11.5 * size, 1.5 * size, 1.5 * size, 'rgba(0, 144, 240, 1)'),
    new Button('reset', 5 * size, 11.5 * size, 1.5 * size, 1.5 * size, 'rgba(240, 0, 0, 1)'),
    new Button('up', 7 * size, 11.5 * size, 1.5 * size, 1.5 * size, 'rgba(240, 144, 0, 1)')
  ],

  testButtons: (targetTouches: any[]) => {
    let button: any,
      i: number,
      k: number,
      touch: any,
      boundingRectangle: any;

    boundingRectangle	= context.canvas.getBoundingClientRect();

    for (i = controller.buttons.length - 1; i > -1; --i) {
      button = controller.buttons[i];
      button.active = false;
      controller[button.name] = false;

      for (k = targetTouches.length - 1; k > -1; --k) {
        touch = targetTouches[k];

        if (button.containsPoint(touch.clientX - boundingRectangle.left, touch.clientY - boundingRectangle.top)) {
          document.querySelector('p').innerHTML = 'touches:' + targetTouches.length + '<br>- ';
          button.active = true;
          controller[button.name] = true;
          break;
        }
      }
    }

    document.querySelector('p').innerHTML = 'touches: ' + targetTouches.length + '<br>- ';

    if (controller.buttons[0].active) document.querySelector('p').innerHTML += 'jump ';
    if (controller.buttons[1].active)	document.querySelector('p').innerHTML += 'left ';
    if (controller.buttons[2].active) document.querySelector('p').innerHTML += 'right ';
    if (controller.buttons[3].active) document.querySelector('p').innerHTML += 'reset ';
  },

  touchEnd: (event: TouchEvent) => {
    event.preventDefault();
    controller.testButtons(event.targetTouches);
  },

  touchMove: (event: TouchEvent) => {
    event.preventDefault();
    controller.testButtons(event.targetTouches);
  },

  touchStart: (event: TouchEvent) => {
    event.preventDefault();
    controller.testButtons(event.targetTouches);
  },

  keyListener: (e: any): void => {
    let keyState = (e.type === 'keydown') ? true : false;
    let rectangle = context.canvas.getBoundingClientRect();

		// клавиши

    switch (e.keyCode) {
      case 37:
        controller.left = keyState;
        break;
      case 38:
        controller.up = keyState;
        break;
      case 32: // space
        controller.up = keyState;
        break;
      case 39:
        controller.right = keyState;
        break;
      case 40:
        controller.down = keyState;
        break;
    }

		// мышка

    switch (e.type) {
      case 'mousedown':
        controller.mouse = true;
        controller.pointerX = e.clientX - rectangle.left;
        controller.pointerY = e.clientY - rectangle.top;

        break;
      case 'mouseup':
        controller.mouse = false;
        break;
    }
  },

  mouseMmove: function (event: any): void {
    let rectangle = context.canvas.getBoundingClientRect();

    controller.pointerX = event.clientX - rectangle.left;
    controller.pointerY = event.clientY - rectangle.top;
  }
};
