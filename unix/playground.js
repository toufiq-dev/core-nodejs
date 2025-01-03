const { spawn, exec } = require("node:child_process");
const { stdin, stdout, stderr } = require("node:process");

const subprocess = spawn("ls");

stdin.on("data", (data) => {
  console.log("Received input:", data.toString());
});

stdout.write("This is stdout\n");

stderr.write("This is stderr\n");

// subprocess.stdout.on("data", (data) => {
//   console.log(data.toString());
// });

// console.log(process.argv);
// console.log(process.pid);
// console.log(process.ppid);

// console.log(process.env);

// exec(
//   "echo 'start' && sleep 4 && echo 'something went wrong' | tr ' ' '\n'",
//   (err, stdout, stderr) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log(stdout);
//   }
// );
