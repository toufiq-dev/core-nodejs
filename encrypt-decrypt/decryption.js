const { Transform } = require("stream");
const fs = require("fs/promises");

console.time("decryption");
class Decrypt extends Transform {
  _transform(chunk, encoding, callback) {
    // const string = chunk.toString();
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] !== 255) {
        chunk[i] = chunk[i] - 1;
      }
    }
    this.push(chunk);

    callback();
  }
}

(async () => {
  const readFileHandle = await fs.open("encrypt.txt", "r");
  const writeFileHandle = await fs.open("final.txt", "w");
  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  const decrypt = new Decrypt();

  readStream
    .pipe(decrypt)
    .pipe(writeStream)
    .on("finish", () => {
      readFileHandle.close();
      writeFileHandle.close();
    });
})();

console.timeEnd("decryption");
