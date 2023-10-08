#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import boxen from "boxen";

import createProject from "franshiro-express-cli/lib/create-new-project/index.js";
import newModule from "franshiro-express-cli/lib/new-module/index.js";

const choices = [
  "Create a new project",
  "Add new module to an existing project",
  "Cancel",
];

const questions = [
  {
    type: "list",
    name: "action",
    message: "Choose action:",
    choices: choices,
  },
];

inquirer.prompt(questions).then((answers) => {
  const answerActions = answers.action;
  switch (answerActions) {
    case choices[0]:
      createNewProject();
      break;
    case choices[1]:
      createNewModule();
      break;
    case choices[2]:
      console.log("");
      console.log("Cancel!");
      break;

    default:
      console.log("");
      console.log(chalk.red("Please choose an action!"));
      break;
  }
});

async function createNewProject() {
  const projectQuestions = [
    {
      type: "input",
      name: "projectName",
      message: "Enter the project name (eq. project-name) :",
    },
  ];

  inquirer.prompt(projectQuestions).then((answers) => {
    const projectName = answers.projectName;

    if (!fs.existsSync(projectName)) {
      createProject(projectName);
    } else {
      console.log("");
      console.error(`Project folder '${projectName}' already exists.`);
    }
  });
}

async function createNewModule() {
  const projectQuestions = [
    {
      type: "input",
      name: "moduleName",
      message: "Enter the module name (eg. UserPayment) :",
    },
    {
      type: "input",
      name: "folderDir",
      message: "Create on Spesific Folder (masterdata, transaction) :",
    },
  ];

  inquirer.prompt(projectQuestions).then((answers) => {
    const moduleName = answers.moduleName;
    const folderDir = answers.folderDir;
    newModule(moduleName, folderDir);
  });
}
