const { Duplex } = require("stream");
const fs = require("fs");

class DuplexStream extends Duplex {
  constructor(options) {
    super({
      readableHighWaterMark: options.readableHighWaterMark,
      writableHighWaterMark: options.writableHighWaterMark,
    });

    this.readFileName = options.readFileName;
    this.writeFileName = options.writeFileName;
    this.fdRead = null;
    this.fdWrite = null;
    this.chunks = [];
    this.chunkSize = 0;
  }

  _construct(callback) {
    fs.open(this.readFileName, "r", (err, fdRead) => {
      if (err) {
        callback(err);
      }
      this.fdRead = fdRead;

      fs.open(this.writeFileName, "w", (err, fdWrite) => {
        if (err) {
          callback(err);
        }
        this.fdWrite = fdWrite;
        callback();
      });
    });
  }

  _write(chunk, encoding, callback) {
    fs.write(this.fdWrite, chunk, 0, chunk.length, null, (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    });
  }

  _read(size) {
    const buff = Buffer.alloc(size);

    fs.read(this.fdRead, buff, 0, size, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      }
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _final(callback) {
    fs.write(this.fdWrite, Buffer.concat(this.chunks), (err) => {
      if (err) {
        callback(err);
      }
      this.chunks = [];
      callback();
    });
  }

  _destroy(error, callback) {
    fs.close(this.fdRead, (err) => {
      if (err) {
        callback(err);
      }
      fs.close(this.fdWrite, (err) => {
        if (err) {
          callback(err);
        }
        callback();
      });
    });
  }
}

const duplex = new DuplexStream({
  readFileName: "read.txt",
  writeFileName: "write.txt",
});

duplex.on("readable", () => {
  let chunk;
  while ((chunk = duplex.read()) !== null) {
    duplex.write(chunk);
  }
});
