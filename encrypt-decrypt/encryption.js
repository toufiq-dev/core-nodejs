const { Transform } = require("stream");
const fs = require("fs/promises");

console.time("encryption");
class Encrypt extends Transform {
  _transform(chunk, encoding, callback) {
    // const string = chunk.toString();
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] !== 255) {
        chunk[i] = chunk[i] + 1;
      }
    }
    this.push(chunk);

    callback();
  }
}

(async () => {
  const readFileHandle = await fs.open("data.txt", "r");
  const writeFileHandle = await fs.open("encrypt.txt", "w");
  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  const encrypt = new Encrypt();

  readStream
    .pipe(encrypt)
    .pipe(writeStream)
    .on("finish", () => {
      readFileHandle.close();
      writeFileHandle.close();
    });
})();

console.timeEnd("encryption");
