import 'babel-polyfill';

import './../sass/styles.scss';

import { drawMap } from './map';
import { Player } from './Player';
// import { Enemy } from './Enemy';
import { Rain } from './Rain';
import { MagicRain } from './MagicRain';
import { Label } from './Label';
import { Button } from './Button';
import { randomInt } from './helper';
import { controller } from './controller';
import { assets } from './assets';

export let buffer: any,
  size: number,
  context: any,
  widthMiltipler: number,
  heightMiltipler: number;

size = 40;
widthMiltipler = 9;
heightMiltipler = 13.5;

window.requestAnimationFrame = (function () {
  return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		// @ts-ignore
		window.mozRequestAnimationFrame ||
		// @ts-ignore
		window.oRequestAnimationFrame ||
		// @ts-ignore
		window.msRequestAnimationFrame ||
		function (callback: TimerHandler): void {
  window.setTimeout(callback, 1000 / 30);
};
})();

// context

context = document.querySelector('canvas').getContext('2d', { alpha: false });
context.canvas.width = widthMiltipler * size;
context.canvas.height = heightMiltipler * size;

// Buffer

buffer = document.createElement('canvas').getContext('2d');
buffer.canvas.width = widthMiltipler * size;
buffer.canvas.height = heightMiltipler * size;

// игроки

let players: Array<Player> = [];
for (let i = 0; i < 1; i++) {
  let rect = new Player(
		.51 * size,
		.51 * size,
		1.2 * size,
		0,
		randomInt(50, 100),
		0,
		0,
		0
	);

  players.push(rect);
}

/**
 * Дождь
 */
let rains: Array<Rain> = [];
for (let i = 0; i < 15; i++) {
  let rain = new Rain(
		3,
		3,
		randomInt(0, context.canvas.width),
		randomInt(0, context.canvas.height),
		randomInt(50, 100)
	);

  rains.push(rain);
}

/**
 * Дождь
 */
let magicRains: Array<MagicRain> = [];
for (let i = 0; i < 1; i++) {
  let magicRain = new MagicRain(
		randomInt(10, 30),
		randomInt(10, 30),
		randomInt(0, context.canvas.width),
		randomInt(0, context.canvas.height),
		randomInt(50, 100)
	);

  magicRains.push(magicRain);
}

/**
 * Лейблы
 */
export let labels: any[] = [];
let score = new Label(
	'score',
	'0',
	30,
	'sans-serif',
	'white',
	30,
	30,
	false
);
labels.push(score);

let gameLoop = function () {

	// выделение тайла
  let tileX: number,
    tileY: number;
	// value;
  tileX = Math.floor(controller.pointerX / (context.canvas.width / widthMiltipler));
  tileY = Math.floor(controller.pointerY / (context.canvas.height / heightMiltipler));
	// value = map[tileY * widthMiltipler + tileX];
  context.fillStyle = 'rgba(256, 256, 256, .2)';
  context.fillRect(tileX * size, tileY * size, size, size);
  context.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, context.canvas.width, context.canvas.height);

	// карта
  drawMap();

	// игрок
  players.forEach(item => item.draw());

	// дождь
  rains.forEach(item => item.draw());

	// надписи
  labels.forEach(item => item.draw());

	// кнопки
  controller.buttons.forEach((item: { draw: () => void; }) => item.draw());

  window.requestAnimationFrame(gameLoop);
};

// Listeners

window.addEventListener('mousedown', controller.keyListener);
window.addEventListener('mousedown', controller.mouseMmove);
window.addEventListener('mouseup', controller.keyListener);
window.addEventListener('mouseup', controller.mouseMmove);
window.addEventListener('mousemove', controller.keyListener);
window.addEventListener('mousemove', controller.mouseMmove);
window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);

document.querySelector('canvas').addEventListener('touchend', controller.touchEnd, { passive: false });
document.querySelector('canvas').addEventListener('touchmove', controller.touchMove, { passive: false });
document.querySelector('canvas').addEventListener('touchstart', controller.touchStart, { passive: false });

// Start Game

window.requestAnimationFrame(gameLoop);
