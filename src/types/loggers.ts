type ObjectValues<T> = T[keyof T];

export const LOG_LEVELS = {
    DEBUG: 'debug',
    INFO: 'info',
    EVENT: 'event',
    COMMAND: 'command',
    WARN: 'warn',
    ERROR: 'error',
} as const;

export type LogLevels = ObjectValues<typeof LOG_LEVELS>;

export type LogFunction = (...message: string[]) => void;

export type Loggers = Record<LogLevels, LogFunction>;
