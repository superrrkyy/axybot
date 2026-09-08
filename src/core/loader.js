import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { registerCommand } from "./command.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands() {
  const commandsPath = path.join(
    __dirname,
    "../commands"
  );

  const categories = fs.readdirSync(commandsPath);

  for (const category of categories) {
    const categoryPath = path.join(
      commandsPath,
      category
    );

    if (!fs.statSync(categoryPath).isDirectory()) {
      continue;
    }

    const files = fs
      .readdirSync(categoryPath)
      .filter(file => file.endsWith(".js"));

    for (const file of files) {
      const filePath = path.join(
        categoryPath,
        file
      );

      const module = await import(
        pathToFileURL(filePath).href
      );

      if (module.default) {
        registerCommand(module.default);
      }
    }
  }
}
