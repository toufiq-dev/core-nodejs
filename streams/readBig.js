const fs = require("fs/promises");

(async () => {
  console.time("readBig");
  const fileHandleRead = await fs.open("src.txt", "r");
  const fileHandleWrite = await fs.open("dest.txt", "w");
  const streamRead = fileHandleRead.createReadStream();
  const sreamWrite = fileHandleWrite.createWriteStream();

  streamRead.on("data", (chunk) => {
    if (!sreamWrite.write(chunk)) {
      streamRead.pause();
    }

    sreamWrite.on("drain", () => {
      streamRead.resume();
    });
  });

  streamRead.on("end", () => {
    fileHandleRead.close();
    fileHandleWrite.close();
  });

  console.timeEnd("readBig");
})();
