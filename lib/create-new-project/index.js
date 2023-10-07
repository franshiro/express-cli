#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import chalk from "chalk";
import boxen from "boxen";

import database from "franshiro-express-cli/lib/database/index.js";
import helpers from "franshiro-express-cli/lib/helpers/index.js";
import routes from "franshiro-express-cli/lib/routes/index.js";
import controllers from "franshiro-express-cli/lib/controllers/index.js";
import services from "franshiro-express-cli/lib/services/index.js";
import utils from "franshiro-express-cli/lib/utils/index.js";

import { promisify } from "util";
const writeFile = promisify(fs.writeFile);

async function createFolders(folderName) {
  try {
    console.log("");
    console.log(chalk.green(`Creating project folder -> ${folderName}`));
    fs.mkdirSync(`./${folderName}`);

    const projectFolder = ["src", "logfiles", "uploads"];

    for (const mainFolder of projectFolder) {
      console.log("");
      console.log(chalk.cyan("Creating main folder: ", mainFolder));
      fs.mkdirSync(`./${folderName}/${mainFolder}`);
    }

    const srcFolders = [
      "controllers",
      "database",
      "helpers",
      "middlewares",
      "routes",
      "services",
      "utils",
    ];
    for (const folder of srcFolders) {
      console.log("");
      console.log(chalk.blueBright("Creating subfolder: ", folder));
      fs.mkdirSync(`./${folderName}/src/${folder}`);

      if (
        folder == "routes" ||
        folder == "services" ||
        folder == "controllers"
      ) {
        fs.mkdirSync(`./${folderName}/src/${folder}/base`);

        if (folder == "services") {
          fs.mkdirSync(`./${folderName}/src/${folder}/mail`);
          fs.mkdirSync(`./${folderName}/src/${folder}/mail/template`);
        }
      }
    }
    console.log("");
    console.log(chalk.blue("Folders created successfully."));
  } catch (error) {
    console.log("");
    console.error(chalk.red("Error creating folders:", error));
  }
}

async function createIndexFile(folderName) {
  try {
    const indexPath = path.join(process.cwd(), `${folderName}/src`, "index.js");
    let content = `import dotenv from "dotenv";

import express from "express";
import cors from "cors";

//import passport from "passport";
//import JwtStrategy from "./utils/PassportStrategy";
import GenerateRouter from "./helpers/GenerateRouter";

// import AuthenticateRouter from "./routes/AuthenticateRouter";
// import UserRouter from "./routes/masterdata/UserRouter";

dotenv.config();

const base_url = \`${process.env.API_BASE_URL}/${process.env.API_VERSION}\`;
const app = express();

//passport.use(JwtStrategy);

app.use(cors());
app.options("*", cors());

app.use(express.json({ limit: "5000mb" }));
app.use(express.urlencoded({ extended: true }));\n
`;

    content += "// app.use(`${base_url}/auth`, AuthenticateRouter);\n";
    content += `// app.use("/file", express.static("./uploads/"));

// GenerateRouter("users", app, UserRouter);

app.get("*", (req, res) => {
return res.status(200).send({ message: "Quiz Games" });
});

const port = process.env.APPLICATION_PORT || 4000;

app.listen(port, () => {\n
`;

    content += "console.log(`Server is running on PORT ${port}`);\n";
    content += `});

export default app;`;

    await writeFile(indexPath, content);
    console.log("");
    console.log(chalk.blue("index.js created successfully."));
  } catch (err) {
    console.log("");
    console.error(chalk.red("Error creating index.js:", err));
  }
}

async function createEnvFile(folderName) {
  try {
    const indexPath = path.join(process.cwd(), `${folderName}`, ".env");
    const content = `NODE_ENV=development
  APPLICATION_PORT=4000
  APP_URL=
  API_BASE_URL=/api
  API_VERSION=v1
  
  JWT_SECRET=input_your_jwv_secret
  
  DB_USERNAME=db_username
  DB_PASSWORD=db_password
  DB_DATABASE=db_name
  DB_HOST=db_host
  DB_PORT=db_port
  DB_DIALECT=db_dialect
  
  EMAIL_HOST=email_smpt_host
  EMAIL_PORT=email_port
EMAIL_SENDER=email_password`;

    await writeFile(indexPath, content);
    console.log("");
    console.log(chalk.blue(".env created successfully."));
  } catch (err) {
    console.log("");
    console.error(chalk.red("Error creating .env:", err));
  }
}

async function createBabelrcFile(folderName) {
  try {
    const indexPath = path.join(process.cwd(), `${folderName}/src`, ".babelrc");
    const content = `{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": [
    [
      "@babel/plugin-proposal-class-properties"
    ],
    ["@babel/plugin-transform-runtime",
      {
        "regenerator": true
      }
    ]
  ]
}
`;

    await writeFile(indexPath, content);
    console.log("");
    console.log(chalk.blue(".babelrc created successfully."));
  } catch (err) {
    console.log("");
    console.error("Error creating .babelrc:", err);
  }
}

async function createLogGitKeep(folderName) {
  try {
    const indexPath = path.join(
      process.cwd(),
      `${folderName}/logfiles`,
      ".gitkeep"
    );
    const content = `*
/*
!.gitkeep`;

    await writeFile(indexPath, content);
    console.log("");
    console.log(chalk.blue("logfiles .gitkeep created successfully."));
  } catch (err) {
    console.log("");
    console.error("Error creating logfiles .gitkeep:", err);
  }
}

async function createSequelizeSettingFile(folderName) {
  try {
    const indexPath = path.join(process.cwd(), `${folderName}`, ".sequelizerc");
    const content = `
const path  = require('path')
module.exports = {
  "config": path.resolve('./src/database/config', 'config.js'),
  "models-path": path.resolve('./src/database/models'),
  "seeders-path": path.resolve('./src/database/seeders'),
  "migrations-path": path.resolve('./src/database/migrations')
};
  `;

    await writeFile(indexPath, content);
    console.log("");
    console.log(chalk.blue(".sequelizerc created successfully."));
  } catch (err) {
    console.log("");
    console.error("Error creating .sequelizerc:", err);
  }
}

async function createPackageFile(folderName) {
  try {
    const indexPath = path.join(process.cwd(), `${folderName}`, "package.json");
    const content = `{
  "name": "${folderName}",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon --exec babel-node -- ./src/index.js",
    "build": "babel --ignore ./src/database/seeders -d ./build ./src --copy-files",
    "prebuild": "rm -rf build/*",
    "start": "node ./build/index.js",
    "prestart": "npm run build",
    "db:seed": "sequelize-cli db:seed",
    "db:seed:all": "sequelize-cli db:seed:all",
    "db:seed:undo": "sequelize-cli db:seed:undo",
    "db:seed:undo:all": "sequelize-cli db:seed:undo:all",
    "db:create": "sequelize-cli db:create",
    "db:migrate": "sequelize-cli db:migrate",
    "db:migrate:undo": "sequelize-cli db:migrate:undo",
    "db:migrate:undo:all": "sequelize-cli db:migrate:undo:all",
    "model:create": "sequelize-cli model:create",
    "model:generate": "sequelize-cli model:generate",
    "seed:generate": "sequelize-cli seed:generate",
    "migration:create": "sequelize-cli migration:create"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/cli": "^7.15.7",
    "@babel/core": "^7.7.5",
    "@babel/node": "^7.7.4",
    "@babel/plugin-proposal-class-properties": "^7.18.6",
    "@babel/plugin-transform-runtime": "^7.7.6",
    "@babel/polyfill": "^7.8.7",
    "@babel/preset-env": "^7.7.6",
    "@babel/register": "^7.7.4",
    "@babel/runtime": "^7.7.6",
    "array.prototype.flatmap": "^1.2.3",
    "babel-loader": "^8.0.6",
    "body-parser": "^1.19.0",
    "dotenv": "^8.2.0",
    "faker": "^4.1.0",
    "jsonwebtoken": "^9.0.0",
    "nodemon": "^2.0.14",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.0",
    "passport-local": "^1.0.0",
    "sequelize-cli": "^5.5.1"
  },
  "dependencies": {
    "axios": "^0.21.4",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "excel4node": "^1.7.2",
    "express": "^4.17.1",
    "handlebars": "^4.7.7",
    "moment": "^2.24.0",
    "multer": "^1.4.3",
    "mysql2": "^2.0.2",
    "nanoid": "^3.3.1",
    "node-cron": "^2.0.3",
    "nodemailer": "^6.6.3",
    "rimraf": "^3.0.2",
    "sequelize": "^5.21.2",
    "simple-node-logger": "^18.12.24",
    "swagger-ui-express": "^4.2.0",
    "xlsx": "^0.18.5",
    "pg": "^8.10.0"
  }
}

`;

    await writeFile(indexPath, content);
    console.log("");
    console.log(chalk.blue("package.json created successfully."));
  } catch (err) {
    console.log("");
    console.error("Error creating package.json:", err);
  }
}

async function createGitIgnoreFile(folderName) {
  try {
    const indexPath = path.join(process.cwd(), `${folderName}`, ".gitignore");
    const content = `node_modules/
yarn-error.log
*.log
.env
*.yml
Dockerfile
*.sh
temp/`;

    await writeFile(indexPath, content);
    console.log("");
    console.log(chalk.blue(".gitignore created successfully."));
  } catch (err) {
    console.log("");
    console.error("Error creating .gitignore:", err);
  }
}

async function createReadmeFile(folderName) {
  try {
    const indexPath = path.join(process.cwd(), `${folderName}`, "README.md");
    const content = `# ${folderName}`;

    await writeFile(indexPath, content);
    console.log("");
    console.log(chalk.blue("README.md created successfully."));
  } catch (err) {
    console.log("");
    console.error("Error creating README.md:", err);
  }
}

async function installDependencies(folderName) {
  const projectFolder = folderName; // Ganti dengan path proyek Anda
  console.log("");
  console.log(chalk.magenta("Installing Dependencies"));
  console.log("");
  console.log(chalk.magenta("Wait..."));

  const npmInstall = spawn("npm", ["install"], {
    cwd: projectFolder, // Tentukan direktori kerja (current working directory)
    shell: true, // Aktifkan shell
  });

  // Menampilkan output dari proses npm install
  npmInstall.stdout.on("data", (data) => {
    console.log("");
    console.log(chalk.greenBright(data.toString()));
  });

  npmInstall.stderr.on("data", (data) => {
    console.log("");
    console.error(chalk.red(data.toString()));
  });

  // Menangani peristiwa selesai dan kesalahan
  npmInstall.on("close", (code) => {
    if (code === 0) {
      console.log("");
      console.log(chalk.greenBright("npm install selesai."));
      console.log("");
      console.log(
        chalk.yellow(
          boxen(
            `
  to project dir -> cd ${folderName}

  modify file .env

  add module and migration -> npx franshiro-express-cli -> option 2

  run backend local -> npm run dev

  create database -> npm run -- db:create

  migrate database -> npm run -- db:migrate

      `,
            {
              title: "Congratulation, Project Created!",
              titleAlignment: "center",
              borderStyle: "double",
            }
          )
        )
      );
    } else {
      console.log("");
      console.error(
        chalk.red(`npm install gagal dengan kode keluaran ${code}`)
      );
    }
  });
}

async function createProject(folderName) {
  if (folderName && folderName.length < 3) {
    console.log("");
    console.error("Please provide a Project Name as argument");
    return;
  }

  await createFolders(folderName);

  console.log("");
  console.log(chalk.magenta("Creating project files..."));
  await createIndexFile(folderName);
  await createBabelrcFile(folderName);
  await createSequelizeSettingFile(folderName);
  await createPackageFile(folderName);
  await createGitIgnoreFile(folderName);
  await createLogGitKeep(folderName);
  await createReadmeFile(folderName);
  await createEnvFile(folderName);

  await database(folderName);
  await helpers(folderName);
  await routes(folderName);
  await controllers(folderName);
  await services(folderName);
  await utils(folderName);

  await installDependencies(folderName);
}

export default createProject;
