// save this binary into memory and then log it using utf-8 character encoding
// 0100 1000 0110 1001 0010 0001

const { Buffer } = require("buffer");

// const buffer = Buffer.alloc(3);

// buffer[0] = 0x48;
// buffer[1] = 0x69;
// buffer[2] = 0x21;

// const buffer = Buffer.from([0x48, 0x69, 0x21]);

const buffer = Buffer.from("486921", "hex");

console.log(buffer.toString("utf-8"));

const buff = Buffer.from("Hi!", "utf-8");

console.log(buff);

const name = Buffer.from("E0A685E0A682E0A695E0A6A3", "hex");

console.log(name.toString("utf-8"));