const fs = require("fs");

(async () => {
  console.time("writeMany");
  const filePath = "../uploader/text.txt";
  const writeStream = fs.createWriteStream(filePath, {
    flags: "w",
    encoding: "utf8",
  });

  let i = 0;

  function write() {
    let canWrite = true;
    while (i <= 499999999 && canWrite) {
      canWrite = writeStream.write(`${i}\n`);
      i++;
    }
    if (i <= 499999999) {
      writeStream.once("drain", write);
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
