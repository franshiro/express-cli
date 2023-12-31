#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";
import boxen from "boxen";
import pluralize from "pluralize";

import { promisify } from "util";
const writeFile = promisify(fs.writeFile);

async function createServiceModuleFile(moduleName, folderDir, isImportModel) {
  try {
    let indexPath = path.join(
      process.cwd(),
      "src/services",
      `${moduleName}Service.js`
    );

    let modelDir = "./../database/models";
    let crudDir = "./base/CrudService";

    if (folderDir && folderDir != "") {
      console.log("folder dir: ", folderDir);
      indexPath = path.join(
        process.cwd(),
        `src/services/${folderDir}`,
        `${moduleName}Service.js`
      );
      modelDir = "../../database/models";
      crudDir = "../base/CrudService";

      if (!fs.existsSync(`./src/services/${folderDir}`)) {
        await fs.mkdirSync(`./src/services/${folderDir}`);
      } else {
        console.log("");
        console.error(`folder '${folderDir}' already exists.`);
      }
    }

    let content = `import { ${moduleName} } from "${modelDir}";\n`;

    if (isImportModel) {
      content += `import CrudService from "${crudDir}";

export default class ${moduleName}Service extends CrudService {
  constructor(prefix) {
    super(prefix, ${moduleName});
  }
}`;
    } else {
      content = `import {
  sequelize,
} from "${modelDir}";
import { Op } from "sequelize";

export class ${moduleName}Service {}
`;
    }

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

async function insertImportOnIndexFile(moduleName, folderDir) {
  try {
    const indexPath = path.join(process.cwd(), `src`, "index.js");
    const data = fs.readFileSync(indexPath, "utf8");

    const importRegex = /import\s+.*?from\s+['"].*?['"]/g;
    const importStatements = data.match(importRegex);

    if (importStatements) {
      const lastImportStatement = importStatements[importStatements.length - 1];

      let fileLoc = `${moduleName}Router`;
      if (folderDir && folderDir != "") {
        fileLoc = `${folderDir}/${moduleName}Router`;
      }
      const updatedData = data.replace(
        lastImportStatement,
        `${lastImportStatement}\nimport ${moduleName}Router from "./routes/${fileLoc}"`
      );

      fs.writeFileSync(indexPath, updatedData, "utf8");
      console.log("Import added successfully.");
    } else {
      console.log("Cannot find row with import.");
    }
  } catch (err) {
    console.error(err);
  }
}

async function insertGenerateAfterAppUse(data, moduleName, folderDir, path) {
  try {
    const lines = data.split("\n");

    let lastIndex = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].trim().startsWith("app.use")) {
        lastIndex = i;
        break;
      }
    }

    if (lastIndex === -1) {
      console.error('Cannot find word with "app.use"');
      process.exit(1);
    }

    lines.splice(
      lastIndex + 1,
      0,
      `GenerateRouter("${pluralize(
        moduleName.toLowerCase()
      )}", app, ${moduleName}Router)`
    );

    const updatedData = lines.join("\n");

    fs.writeFileSync(path, updatedData, "utf8");
    console.log("GenerateRouter added successfully.");
  } catch (err) {
    console.error("Failed:", err);
  }
}

async function insertApiRouteOnIndexFile(moduleName, folderDir) {
  try {
    const indexPath = path.join(process.cwd(), `src`, "index.js");
    const data = fs.readFileSync(indexPath, "utf8");

    const generateRouteRegex =
      /GenerateRouter\(["']([^"']+)["'],\s*([^,]+),\s*([^)]+)\)/g;
    const generateRouteStatements = data.match(generateRouteRegex);

    const appUseRegex = /app\.use\(([^)]+\))/;
    const appUseStatements = data.match(appUseRegex);

    if (generateRouteStatements) {
      const lastImportStatement =
        generateRouteStatements[generateRouteStatements.length - 1];

      let fileLoc = `${moduleName}Router`;
      if (folderDir && folderDir != "") {
        fileLoc = `${folderDir}/${moduleName}Router`;
      }
      const updatedData = data.replace(
        lastImportStatement,
        `${lastImportStatement}\nGenerateRouter("${pluralize(
          moduleName.toLowerCase()
        )}", app, ${moduleName}Router)`
      );

      fs.writeFileSync(indexPath, updatedData, "utf8");
      console.log("GenerateRoute added successfully.");
    } else {
      await insertGenerateAfterAppUse(data, moduleName, folderDir, indexPath);
    }
  } catch (err) {
    console.error(err);
  }
}

async function generateModel(moduleName, folderDir, isImportModel) {
  try {
    await createServiceModuleFile(moduleName, folderDir, isImportModel);
    await createControllerModuleFile(moduleName, folderDir, isImportModel);
    await createRouterModuleFile(moduleName, folderDir, isImportModel);
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

Before Migrate, 
modify template file migration at /src/database/migration
and models at /src/database/models
then
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
  } catch (err) {
    console.log("Error: ", err);
  }
}

async function justCreateFile(moduleName, folderDir, isImportModel) {
  try {
    await createServiceModuleFile(moduleName, folderDir, isImportModel);
    await createControllerModuleFile(moduleName, folderDir, isImportModel);
    await createRouterModuleFile(moduleName, folderDir, isImportModel);
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
  } catch (err) {
    console.log("Error: ", err);
  }
}

async function createNewModule(moduleName, folderDir) {
  await insertImportOnIndexFile(moduleName, folderDir);
  await insertApiRouteOnIndexFile(moduleName, folderDir);

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
        generateModel(moduleName, folderDir, true);
        break;
      case choices[1]:
        justCreateFile(moduleName, folderDir, false);
        break;

      default:
        console.log("");
        console.log(chalk.red("Please choose an action!"));
        break;
    }
  });
}

export default createNewModule;
