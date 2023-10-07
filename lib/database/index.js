import fs from "fs";
import path from "path";
import chalk from "chalk";
import boxen from "boxen";

import config from "franshiro-express-cli/lib/database/config/index.js";
import models from "franshiro-express-cli/lib/database/models/index.js";

async function createMigrationFolder(folderName) {
  try {
    console.log("");
    console.log(chalk.blue("Creating database/migration folder"));
    fs.mkdirSync(`./${folderName}/src/database/migrations`);
  } catch (error) {
    console.log("");
    console.error("Error creating migrtion folders:", error);
  }
}

async function createSeederFolder(folderName) {
  try {
    console.log("");
    console.log(chalk.blue("Creating database/seeder folder"));
    fs.mkdirSync(`./${folderName}/src/database/seeders`);
  } catch (error) {
    console.log("");
    console.error("Error creating seeder folders:", error);
  }
}

async function database(folderName) {
  await createMigrationFolder(folderName);
  await createSeederFolder(folderName);
  await config(folderName);
  await models(folderName);
}

export default database;
