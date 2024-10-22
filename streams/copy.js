const fs = require("fs/promises");
const { pipeline } = require("stream");

// (async () => {
//   console.time("copy");
//   const srcFile = await fs.open("src.txt", "r");
//   const destFile = await fs.open("dest.txt", "w");

//   let bytesRead = -1;

//   while (bytesRead !== 0) {
//     const readResult = await srcFile.read();
//     // console.log(readResult);
//     bytesRead = readResult.bytesRead;

//     if (bytesRead !== 16384) {
//       const indexOfNotfilled = readResult.buffer.indexOf(0);
//       const newBuffer = Buffer.alloc(indexOfNotfilled);
//       readResult.buffer.copy(newBuffer, 0, 0, indexOfNotfilled);
//       destFile.write(newBuffer);
//     } else {
//       destFile.write(readResult.buffer);
//     }
//   }

//   console.timeEnd("copy");
// })();

(async () => {
  console.time("copy");

  const srcFile = await fs.open("src.txt", "r");
  const destFile = await fs.open("dest.txt", "w");

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();

  pipeline(readStream, writeStream, (err) => {
    if (err) console.error(err);
  });

  console.timeEnd("copy");
})();
