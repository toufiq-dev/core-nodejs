const fs = require("fs/promises");
const path = require("path");

// Constants
const COMMANDS_FILE = "./commands.txt";
const CREATE = "create";
const DELETE = "delete";
const RENAME = "rename";
const ADD = "add";

// Command handling functions
async function createFile(filePath) {
  try {
    await fs.access(filePath);
    console.log("File already exists");
  } catch {
    await fs.writeFile(filePath, "");
    console.log("File created");
  }
}

async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log("File deleted");
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
  }
}

async function renameFile(oldPath, newPath) {
  try {
    await fs.rename(oldPath, newPath);
    console.log("File renamed");
  } catch (error) {
    console.error(`Error renaming file: ${error.message}`);
  }
}

async function addContentToFile(filePath, content) {
  try {
    const existingContent = await fs.readFile(filePath, "utf-8");
    if (!existingContent.includes(content)) {
      await fs.appendFile(filePath, content);
      console.log("Content added");
    } else {
      console.log("Content already exists in file");
    }
  } catch (error) {
    console.error(`Error adding content: ${error.message}`);
  }
}

// Main function
(async () => {
  const watcher = fs.watch(COMMANDS_FILE);

  // Handle file changes
  for await (const event of watcher) {
    if (event.eventType === "change") {
      const command = await fs.readFile(COMMANDS_FILE, "utf-8");
      const commandParts = command.split(" ");

      switch (commandParts[0]) {
        case CREATE:
          createFile(commandParts[1]);
          break;
        case DELETE:
          deleteFile(commandParts[1]);
          break;
        case RENAME:
          renameFile(commandParts[1], commandParts[2]);
          break;
        case ADD:
          const content = commandParts.slice(2).join(" ");
          addContentToFile(commandParts[1], content);
          break;
        default:
          console.log("Unknown command");
      }
    }
  }
})();
