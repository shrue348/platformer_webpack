import { context, buffer, size } from './index';

// let map: number[] = [
//   5, 5, 5, 5, 5, 5, 5, 5, 5,
//   0, 0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 4, 0, 5, 5, 5, 0, 0,
//   0, 0, 7, 0, 0, 5, 0, 0, 0,
//   0, 0, 7, 0, 0, 5, 0, 0, 0,
//   0, 0, 7, 0, 0, 5, 0, 0, 0,
//   0, 0, 7, 0, 0, 5, 0, 0, 5,
//   0, 0, 6, 0, 0, 0, 0, 0, 0,
//   1, 0, 0, 0, 0, 4, 4, 0, 0,
//   3, 0, 0, 0, 4, 0, 0, 0, 0,
//   5, 5, 5, 5, 5, 5, 5, 5, 5
// ];

// let mapSize: Array<number> = [9, 9],
//   mapWidth = mapSize[0],
//   mapheight: number = mapSize[1];

let map: number[] = [
  5, 5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 5,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5,
  0, 0, 4, 0, 5, 5, 5, 0, 0, 0, 0, 0, 5,
  0, 0, 7, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5,
  0, 0, 7, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5,
  0, 0, 7, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5,
  0, 0, 7, 0, 0, 5, 0, 0, 5, 0, 0, 0, 5,
  0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5,
  1, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 5,
  3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5,
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5
];

let mapSize: Array<number> = [13, 9],
  mapWidth = mapSize[0],
  mapheight: number = mapSize[1];

let textures: any[] = [];

for (let i = 0; i < 7; i++) {
  let texture = new Image();

  texture.src = `/images/${i + 1}.png`;
  textures.push(texture);
}

/**
 * Сдвиг тайлов
 */
let a: number = 0;

export const aUpdate = () => {
  setTimeout(() => {
    // a = 50;
  }, 3000);
};

/**
 * Заполняем буфер тайлами
 */
function drawMap (): void {
  /**
   * Обнуляем карту
   */
  buffer.fillStyle = '#1f2529';
  buffer.fillRect(0, 0, context.canvas.width, context.canvas.height);

  for (let i = 0; i < map.length; i++) {
    /**
     * Цвет для заполнения
     */
    buffer.fillStyle = (map[i] > 0) ? '#000000' : '#1f2529';

    /**
     * Заполняем коллизии цветом или текстурой
     */
    // buffer.fillRect((i % mapWidth) * size + a, Math.floor(i / mapWidth) * size, size, size);
    if (map[i] > 0) {
      // console.log(map[i] - 1);
      buffer.drawImage(textures[map[i] - 1], (i % mapWidth) * size + a, Math.floor(i / mapWidth) * size, size, size);
    } else buffer.fillRect((i % mapWidth) * size, Math.floor(i / mapWidth) * size, size, size);
  }

  /**
   * Рисуем буфер в канву
   */
  context.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, context.canvas.width, context.canvas.height);
}

export { map, drawMap };
