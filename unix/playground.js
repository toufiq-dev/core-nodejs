const { spawn, exec } = require("node:child_process");

const subprocess = spawn("ls");

// subprocess.stdout.on("data", (data) => {
//   console.log(data.toString());
// });

exec(
  "echo 'start' && sleep 4 && echo 'something went wrong' | tr ' ' '\n'",
  (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  }
);
