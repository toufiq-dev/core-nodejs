const { stdin, stdout, argv, exit } = require("node:process");
const { createReadStream } = require("node:fs");

console.log(argv);

const filePath = argv[2];

if (filePath) {
  const fileStream = createReadStream(filePath);
  fileStream.pipe(stdout);

  fileStream.on("end", () => {
    exit(0);
  });
}
