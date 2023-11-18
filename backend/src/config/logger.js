import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

export default createLogger({
  format: format.combine(format.simple()),
  transports: [
    new transports.DailyRotateFile({
      datePattern: "YYYYMMDD",
      maxsize: 512000,
      maxFiles: 100,
      filename: `${__dirname}/../../../logs/%DATE%.log`,
    }),
  ],
});
