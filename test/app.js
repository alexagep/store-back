import { Numeroljs } from 'numeroljs';

const numerolInstance = new Numeroljs();

console.log(numerolInstance.handle('1997-04-08')); // 9
console.log(numerolInstance.handle('1368-10-16', 'jalali')); // 7
