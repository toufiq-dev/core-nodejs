const { Writable } = require("stream");
const fs = require("fs");

class FileWriteStream extends Writable {
  constructor(options) {
    super({ highWaterMark: options.highWaterMark });

    this.fileName = options.fileName;
    this.fd = null;
    this.chunks = [];
    this.chunkSize = 0;
    this.writesCount = 0;
  }

  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;

    if (this.chunkSize >= this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          callback(err);
        }
        this.chunks = [];
        this.chunkSize = 0;
        ++this.writesCount;
        callback();
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) {
        callback(err);
      }
      this.chunks = [];
      callback();
    });
  }

  _destroy(error, callback) {
    console.log("Number of writes", this.writesCount);
    if (this.fd) {
      fs.close(this.fd, (err) => {
        if (err) {
          callback(err || error);
        } else {
          callback();
        }
      });
    }
  }
}

const stream = new FileWriteStream({
  highWaterMark: 1800,
  fileName: "dest.txt",
});

stream.write(Buffer.from("Hello Ankan\n", "utf-8"));
stream.end(
  Buffer.from(
    "This will end the stream and will be the last write into the dest file"
  )
);
stream.on("finish", () => console.log("Stream finished"));
