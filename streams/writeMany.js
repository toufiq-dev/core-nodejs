const fs = require("fs/promises");

// (async () => {
//   console.time("writeMany");
//   const fileHandler = await fs.open("test.txt", "w");
//   const stream = fileHandler.createWriteStream();

//   for (let i = 0; i < 1000000; i++) {
//     const buff = Buffer.from(`${i}\n`, "utf-8");
//     stream.write(buff);
//   }

//   stream.end();
//   console.timeEnd("writeMany");
// })();

// the above program has memory issues

// Execution Time: 300ms
// Memory Usage: 50MB
(async () => {
  console.time("writeMany");
  const fileHandle = await fs.open("test.txt", "w");

  const stream = fileHandle.createWriteStream();

  let i = 0;

  const numberOfWrites = 10000000;

  const writeMany = () => {
    while (i < numberOfWrites) {
      const buff = Buffer.from(`${i}\n`, "utf-8");

      // this is our last write
      if (i === numberOfWrites - 1) {
        return stream.end(buff);
      }

      // if stream.write returns false, stop the loop
      if (!stream.write(buff)) break;

      i++;
    }
  };

  writeMany();

  // resume our loop once our stream's internal buffer is emptied
  stream.on("drain", () => {
    // console.log("Drained!!!");
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("writeMany");
    fileHandle.close();
  });
})();
