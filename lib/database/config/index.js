import chalk from "chalk";
import fs from "fs";
import path from "path";

async function createFolder(folderName) {
  try {
    console.log("");
    console.log(chalk.blue("Creating config folder"));
    await fs.mkdirSync(`./${folderName}/src/database/config`);
  } catch (error) {
    console.error("Error creating config folders:", error);
  }
}

async function createFile(folderName) {
  console.log("");
  console.log(chalk.blue("Creating config file"));
  const indexPath = path.join(
    process.cwd(),
    `${folderName}/src/database/config`,
    "config.js"
  );
  const content = `require("dotenv").config();

module.exports = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
};`;

  await fs.writeFile(indexPath, content, (err) => {
    if (err) {
      console.log("");
      console.error("Error creating config.js:", err);
    } else {
      console.log("");
      console.log(
        chalk.blue("database/config/config.js created successfully.")
      );
    }
  });
}

async function config(folderName) {
  await createFolder(folderName);
  await createFile(folderName);
}

export default config;
