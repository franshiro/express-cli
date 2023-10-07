import chalk from "chalk";
import fs from "fs";
import path from "path";

async function createFileAsyncForEach(folderName) {
  const indexPath = path.join(
    process.cwd(),
    `${folderName}/src/helpers`,
    "AsyncForEach.js"
  );
  const content = `export default async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}`;

  fs.writeFile(indexPath, content, (err) => {
    if (err) {
      console.log("");
      console.error("Error creating AsyncForEach.js:", err);
    } else {
      console.log("");
      console.log(chalk.green("AsyncForEach.js created successfully."));
    }
  });
}

async function createFileGenerateRouter(folderName) {
  const indexPath = path.join(
    process.cwd(),
    `${folderName}/src/helpers`,
    "GenerateRouter.js"
  );
  const content =
    "export default (prefix, app, router) => {\n  const base_url = `${process.env.API_BASE_URL}/${process.env.API_VERSION}`\n   app.use(`${base_url}/${prefix}`, router(prefix))\n}\n";

  fs.writeFile(indexPath, content, (err) => {
    if (err) {
      console.log("");
      console.error("Error creating GenerateRouter.js:", err);
    } else {
      console.log("");
      console.log(chalk.green("GenerateRouter.js created successfully."));
    }
  });
}

async function createParser(folderName) {
  const indexPath = path.join(
    process.cwd(),
    `${folderName}/src/helpers`,
    "Parser.js"
  );
  const content = `import moment from "moment";
export function ConvertDateToYear(data) {
  if (data && moment(data, "YYYYMMDD").isValid())
    return moment(data, "YYYYMMDD").format("YYYY");
  else return null;
}

export function CheckParseFloat(data) {
  if (data && typeof data == "number") {
    return parseFloat(data);
  }

  if (data && data != "") {
    return data ? parseFloat(data.replace(/,/g, ".")) : 0;
  }

  return 0;
}

export function numberToString(number) {
  if (number) {
    return String(Number(number).toFixed(2)).split(".").join(",");
  }

  return 0;
}

export function stringToNumber(number) {
  if (number) {
    let converted = parseFloat(Number(number).toFixed(2));
    return converted;
  }

  return 0;
}
`;

  fs.writeFile(indexPath, content, (err) => {
    if (err) {
      console.log("");
      console.error("Error creating Parser.js:", err);
    } else {
      console.log("");
      console.log(chalk.green("Parser.js created successfully."));
    }
  });
}

async function createFileReadHTMLFile(folderName) {
  const indexPath = path.join(
    process.cwd(),
    `${folderName}/src/helpers`,
    "ReadHTMLFile.js"
  );
  const content = `import fs from "fs";

export default async function ReadHTMLFile(path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (error, html) {
    if (error) {
      throw error;
    } else {
      callback(null, html);
    }
  });
}
`;

  fs.writeFile(indexPath, content, (err) => {
    if (err) {
      console.log("");
      console.error("Error creating ReadHTMLFile.js:", err);
    } else {
      console.log("");
      console.log(chalk.green("ReadHTMLFile.js created successfully."));
    }
  });
}

async function helpers(folderName) {
  await createFileAsyncForEach(folderName);
  await createFileGenerateRouter(folderName);
  await createParser(folderName);
  await createFileReadHTMLFile(folderName);
}

export default helpers;
