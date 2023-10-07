import chalk from "chalk";
import fs from "fs";
import path from "path";

function createFolder(folderName) {
  try {
    fs.mkdirSync(`./${folderName}/src/database/models`);
  } catch (error) {
    console.log("");
    console.error("Error creating folders:", error);
  }
}

function createFile(folderName) {
  const indexPath = path.join(
    process.cwd(),
    `${folderName}/src/database/models`,
    "index.js"
  );
  const content = `import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import configJson from '../config/config'

const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'

const config = configJson

// console.log('Sequlize running in environment: ', env)

const db = {}

const sequelize = new Sequelize(config)

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;`;

  fs.writeFile(indexPath, content, (err) => {
    if (err) {
      console.log("");
      console.error("Error creating index.js:", err);
    } else {
      console.log("");
      console.log(chalk.blue("database/models/index.js created successfully."));
    }
  });
}

async function models(folderName) {
  await createFolder(folderName);
  await createFile(folderName);
}

export default models;
