import fs from "fs";
import path from "path";

const logDir = "./logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function timestamp() {
  return new Date().toISOString();
}

function writeLog(level, message, data = "") {
  const line =
    `[${timestamp()}] [${level}] ${message}` +
    (data ? ` ${data}` : "");

  console.log(line);

  const date = new Date().toISOString().slice(0, 10);
  const file = path.join(logDir, `${date}.log`);

  fs.appendFileSync(file, line + "\n");
}

export const logger = {
  info(message, data = "") {
    writeLog("INFO", message, data);
  },

  warn(message, data = "") {
    writeLog("WARN", message, data);
  },

  error(message, data = "") {
    writeLog("ERROR", message, data);
  },

  command(name, jid) {
    writeLog(
      "COMMAND",
      `Command: ${name}`,
      `JID: ${jid}`
    );
  }
};
