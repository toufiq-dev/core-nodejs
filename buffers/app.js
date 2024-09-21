const { Buffer } = require("buffer");

const buffer = Buffer.alloc(4);

buffer[0] = 0xf4;
buffer[1] = 0x34;
buffer[2] = 0x100;
// buffer[3] = 0xff;

console.log(buffer);
console.log(buffer[0]);
console.log(buffer[1]);
console.log(buffer[2]);
console.log(buffer[3]);
