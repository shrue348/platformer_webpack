/**
 * Возвращает рандомное число от min до max
 */
export function randomInt (min: number, max: number): number {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}
