#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";
import boxen from "boxen";

import { promisify } from "util";
const writeFile = promisify(fs.writeFile);

async function createServiceModuleFile(moduleName, folderDir) {
  try {
    let indexPath = path.join(
      process.cwd(),
      "src/services",
      `${moduleName}Service.js`
    );

    if (folderDir && folderDir != "") {
      console.log("folder dir: ", folderDir);
      indexPath = path.join(
        process.cwd(),
        `src/services/${folderDir}`,
        `${moduleName}Service.js`
      );

      if (!fs.existsSync(`./src/services/${folderDir}`)) {
        await fs.mkdirSync(`./src/services/${folderDir}`);
      } else {
        console.log("");
        console.error(`folder '${folderDir}' already exists.`);
      }
    }

    const content = `import { ${moduleName} } from "${
      folderDir && folderDir != "" ? "." : ""
    }./../database/models";
import CrudService from "${
      folderDir && folderDir != "" ? "." : ""
    }./base/CrudService";

export default class ${moduleName}Service extends CrudService {
  constructor(prefix) {
    super(prefix, ${moduleName});
  }
}
`;

    await writeFile(indexPath, content);
    console.log("");
    console.log(chalk.green(`${moduleName}Service.js created successfully.`));
  } catch (err) {
    console.log("");
    console.error(chalk.red(`Error creating ${moduleName}Service.js:`, err));
    return;
  }
}

async function createControllerModuleFile(moduleName, folderDir) {
  try {
    let indexPath = path.join(
      process.cwd(),
      "src/controllers",
      `${moduleName}Controller.js`
    );

    if (folderDir && folderDir != "") {
      console.log("folder dir: ", folderDir);
      indexPath = path.join(
        process.cwd(),
        `src/controllers/${folderDir}`,
        `${moduleName}Controller.js`
      );

      if (!fs.existsSync(`./src/controllers/${folderDir}`)) {
        await fs.mkdirSync(`./src/controllers/${folderDir}`);
      } else {
        console.log("");
        console.error(`folder '${folderDir}' already exists.`);
      }
    }
    const content = `import ${moduleName}Service from "${
      folderDir && folderDir != "" ? "." : ""
    }./../services${
      folderDir && folderDir != "" ? `/${folderDir}` : ""
    }/${moduleName}Service";
import CrudController from "${
      folderDir && folderDir != "" ? "." : ""
    }./base/CrudController";
import { Message } from '${
      folderDir && folderDir != "" ? "." : ""
    }./../utils/Message'

export default class ${moduleName}Controller extends CrudController {
  constructor(prefix) {
    super(new ${moduleName}Service(prefix));
  }
}
`;

    await writeFile(indexPath, content);
    console.log("");
    console.log(
      chalk.magenta(`${moduleName}Controller.js created successfully.`)
    );
  } catch (err) {
    console.log("");
    console.error(chalk.red(`Error creating ${moduleName}Controller.js:`, err));
    return;
  }
}

async function createRouterModuleFile(moduleName, folderDir) {
  try {
    let indexPath = path.join(
      process.cwd(),
      "src/routes",
      `${moduleName}Router.js`
    );

    if (folderDir && folderDir != "") {
      console.log("folder dir: ", folderDir);
      indexPath = path.join(
        process.cwd(),
        `src/routes/${folderDir}`,
        `${moduleName}Router.js`
      );

      if (!fs.existsSync(`./src/routes/${folderDir}`)) {
        await fs.mkdirSync(`./src/routes/${folderDir}`);
      } else {
        console.log("");
        console.error(`folder '${folderDir}' already exists.`);
      }
    }
    const content = `import ${moduleName}Controller from "${
      folderDir && folderDir != "" ? "." : ""
    }./../controllers${
      folderDir && folderDir != "" ? `/${folderDir}` : ""
    }/${moduleName}Controller";
import CrudRouter from '${
      folderDir && folderDir != "" ? "." : ""
    }./base/CrudRouter'

export default function (prefix) {
  const controller = new ${moduleName}Controller(prefix);
  const router = new CrudRouter(prefix, controller);
  let newRouter = router.getRouter()

  return newRouter;
}`;

    await writeFile(indexPath, content);
    console.log("");
    console.log(chalk.blue(`${moduleName}Router.js created successfully.`));
  } catch (err) {
    console.log("");
    console.error(chalk.red(`Error creating ${moduleName}Router.js:`, err));
    return;
  }
}

async function generateModel(moduleName) {
  console.log("");
  console.log(chalk.magenta("Generate Model"));
  console.log("");
  console.log(chalk.magenta("Wait..."));
  exec(
    `npm run -- model:generate --name ${moduleName} --attributes 'name:string'`,
    (error, stdout, stderr) => {
      if (error) {
        console.log("");
        console.error(chalk.red(`Error running npm install: ${error}`));
        return;
      }
      console.log("");
      console.log(
        chalk.yellow(
          boxen(
            `
Modify file /src/services/${moduleName}Service.js
Modify file /src/controllers/${moduleName}Controller.js
Modify file /src/routes/${moduleName}Router.js

if needed

migrate -> npm run -- db:migrate

    `,
            {
              title: `Congratulation, model generated!`,
              titleAlignment: "center",
              borderStyle: "double",
            }
          )
        )
      );
    }
  );
}

async function createNewModule(moduleName, folderDir) {
  await createServiceModuleFile(moduleName, folderDir);
  await createControllerModuleFile(moduleName, folderDir);
  await createRouterModuleFile(moduleName, folderDir);

  const choices = ["Yes", "No"];

  const questions = [
    {
      type: "list",
      name: "action",
      message: "Generate New Model?",
      choices: choices,
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    const answerActions = answers.action;
    switch (answerActions) {
      case choices[0]:
        generateModel(moduleName);
        break;
      case choices[1]:
        console.log("");
        console.log(
          chalk.yellow(
            boxen(
              `
  Modify file /src/services/${moduleName}Service.js
  Modify file /src/controllers/${moduleName}Controller.js
  Modify file /src/routes/${moduleName}Router.js

  if needed

      `,
              {
                title: `Congratulation, Module ${moduleName} Created!`,
                titleAlignment: "center",
                borderStyle: "double",
              }
            )
          )
        );
        break;

      default:
        console.log("");
        console.log(chalk.red("Please choose an action!"));
        break;
    }
  });
}

export default createNewModule;
