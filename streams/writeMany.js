const fs = require("fs");

(async () => {
  console.time("writeMany");
  const filePath = process.argv[2];
  const writeStream = fs.createWriteStream(filePath, {
    flags: "w",
    encoding: "utf8",
  });

  let i = 0;

  function write() {
    if (i <= 499999999) {
      const canWrite = writeStream.write(`${i}\n`);
      if (!canWrite) {
        writeStream.once("drain", write);
      } else {
        i++;
        write();
      }
    } else {
      writeStream.end();
    }
  }

  write();

  writeStream.on("finish", () => {
    console.timeEnd("writeMany");
    console.log("File writing completed.");
  });

  writeStream.on("error", (err) => {
    console.error("An error occurred:", err);
  });
})();
