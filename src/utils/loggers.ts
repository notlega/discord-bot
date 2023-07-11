import path from 'node:path';
import winston, { format } from 'winston';
import { LOG_LEVELS, LogFunction, LogLevels, Loggers } from '../types';

const logsDir = path.join(__dirname, '..', '..', 'logs');

const createLogger = (logLevel: LogLevels) => {
    const fileTransport = new winston.transports.File({
        level: logLevel,
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(
                ({ level, message, timestamp }) =>
                    `[${timestamp}] ${level}: ${message}`,
            ),
        ),
        filename: `${logLevel}.log`,
        dirname: logsDir,
    });

    const consoleTransport = new winston.transports.Console({
        level: logLevel,
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(
                ({ level, message, timestamp }) =>
                    `[${timestamp}] ${level}: ${message}`,
            ),
        ),
    });

    const logger = winston.createLogger({
        level: logLevel,
        levels: { [logLevel]: 0 },
        transports: [fileTransport, consoleTransport],
    });

    return (...message: string[]) => logger.log(logLevel, message.join(' '));
};

const loggerBuilder =
    (level: LogLevels): LogFunction =>
    (...message: string[]) => {
        if (
            process.env.NODE_ENV === 'production' &&
            level === LOG_LEVELS.DEBUG
        ) {
            return;
        }

        createLogger(level)(...message);
    };

const loggers: Loggers = {
    [LOG_LEVELS.DEBUG]: loggerBuilder(LOG_LEVELS.DEBUG),
    [LOG_LEVELS.INFO]: loggerBuilder(LOG_LEVELS.INFO),
    [LOG_LEVELS.EVENT]: loggerBuilder(LOG_LEVELS.EVENT),
    [LOG_LEVELS.COMMAND]: loggerBuilder(LOG_LEVELS.COMMAND),
    [LOG_LEVELS.WARN]: loggerBuilder(LOG_LEVELS.WARN),
    [LOG_LEVELS.ERROR]: loggerBuilder(LOG_LEVELS.ERROR),
};

export default loggers;
