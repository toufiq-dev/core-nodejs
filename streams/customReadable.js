const { Readable } = require("stream");
const fs = require("fs");

class FileReadStream extends Readable {
  constructor(options) {
    super({ highWaterMark: options.highWaterMark });

    this.fileName = options.fileName;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.fileName, "r", (err, fd) => {
      if (err) {
        callback(err);
      }
      this.fd = fd;
      callback();
    });
  }

  _read(size) {
    const buff = Buffer.alloc(size);

    fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      }
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _destroy(error, callback) {
    fs.close(this.fd, (err) => {
      if (err) {
        callback(err || error);
      } else {
        callback();
      }
    });
  }
}

const stream = new FileReadStream({
  fileName: "dest.txt",
});

stream.on("data", (chunk) => {
  console.log(chunk.toString());
});
