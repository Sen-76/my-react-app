import dayjs, { Dayjs } from 'dayjs';

export const util = {
  newGuid() {
    if (crypto?.randomUUID) {
      return crypto.randomUUID();
    }
    return (1e7 + '' + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)
    );
  },
  mathRandom: (number = 1): number => {
    const today = new Date();
    let seed = today.getTime();
    function rnd(): number {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280.0;
    }
    return rnd() * number;
  },
  randomWord(isRandomLength?: boolean, min?: number, max?: number) {
    const arr = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z'
    ];
    let str = '',
      pos,
      range = min ?? 0;

    if (isRandomLength) {
      range = Math.round(util.mathRandom() * (max! - min!)) + min!;
    }
    for (let i = 0; i < range; i++) {
      pos = Math.round(util.mathRandom() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
  },
  randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },
  rgbaToHex(rgba: A) {
    const r = Math.round(rgba.r * 255);
    const g = Math.round(rgba.g * 255);
    const b = Math.round(rgba.b * 255);
    const a = Math.round(rgba.a * 255);

    const alphaHex = a.toString(16).padStart(2, '0');
    const redHex = r.toString(16).padStart(2, '0');
    const greenHex = g.toString(16).padStart(2, '0');
    const blueHex = b.toString(16).padStart(2, '0');

    return `#${redHex}${greenHex}${blueHex}${alphaHex}`;
  },
  rgbToHex(rgba: A): string {
    rgba.r = Math.max(0, Math.min(255, rgba.r));
    rgba.g = Math.max(0, Math.min(255, rgba.g));
    rgba.b = Math.max(0, Math.min(255, rgba.b));
    rgba.a = Math.max(0, Math.min(1, rgba.a));

    const redHex = Math.round(rgba.r).toString(16).padStart(2, '0');
    const greenHex = Math.round(rgba.g).toString(16).padStart(2, '0');
    const blueHex = Math.round(rgba.b).toString(16).padStart(2, '0');
    const alphaHex = Math.round(rgba.a * 255)
      .toString(16)
      .padStart(2, '0');

    const hexColor = `#${redHex}${greenHex}${blueHex}${alphaHex}`;
    return hexColor;
  },

  formatDate(date: string | Date | Dayjs) {
    return dayjs(date).format('DD/MM/YYYY');
  }
};
