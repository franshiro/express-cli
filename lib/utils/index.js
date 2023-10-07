import chalk from "chalk";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createFile(folderName) {
  try {
    const sourceFolder = __dirname + "/files";

    const files = await readdir(sourceFolder);

    if (files && files.length > 0) {
      for (let i in files) {
        const filename = files[i];
        const sourceFilePath = path.join(sourceFolder, filename);
        const destinationFilePath = path.join(
          process.cwd(),
          `${folderName}/src/utils`,
          filename
        );

        await copyFile(sourceFilePath, destinationFilePath);
        console.log("");
        console.log(chalk.yellow(`Copied ${filename}.js to /src/utils`));
      }
    }
  } catch (error) {
    console.log("");
    console.log("Error create file utils: ", error);
  }
}

async function utils(folderName) {
  await createFile(folderName);
}

export default utils;
