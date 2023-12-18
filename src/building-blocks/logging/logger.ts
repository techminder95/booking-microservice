import winston, { debug, format } from 'winston';
import config from '../config/config';
import { injectable } from 'tsyringe';

export interface ILogger {
  debug(message: string): void;

  error(message: string | Error): void;

  info(message: string): void;
}

@injectable()
export class Logger implements ILogger {
  private static logger: winston.Logger;

  constructor() {
    Logger.logger = winston.createLogger({
      level: config.env === 'development' ? 'debug' : 'info',
      format: format.combine(
        format.colorize(),
        format.errors({ stack: true }),
        format.timestamp(),
        format.align(),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      transports: [new winston.transports.Console()]
    });
  }
  debug(message: string): void {
    Logger.logger.debug(message);
  }

  static debug(message: string): void {
    Logger.logger.debug(message);
  }

  info(message: string): void {
    Logger.logger.info(message);
  }

  static info(message: string): void {
    Logger.logger.info(message);
  }

  error(message: string | Error): void {
    Logger.logger.error(message);
  }

  static error(message: string | Error): void {
    Logger.logger.error(message);
  }
}
