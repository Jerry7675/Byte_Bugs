type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const environment = process.env.APP_ENVIRONMENT;
const CURRENT_LEVEL: LogLevel = environment === 'DEVELOPMENT' ? 'debug' : 'info';

function shouldLog(level: LogLevel) {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[CURRENT_LEVEL];
}

function format(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  // Dev → readable, Prod → structured
  if (environment === 'DEVELOPMENT') {
    return [`[${level.toUpperCase()}]`, message, meta ? meta : ''];
  }

  return JSON.stringify({
    level,
    message,
    meta,
    ts: new Date().toISOString(),
  });
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>) {
    if (!shouldLog('debug')) return;
    console.debug(...format('debug', message, meta));
  },

  info(message: string, meta?: Record<string, unknown>) {
    if (!shouldLog('info')) return;
    console.info(...format('info', message, meta));
  },

  warn(message: string, meta?: Record<string, unknown>) {
    if (!shouldLog('warn')) return;
    console.warn(...format('warn', message, meta));
  },

  error(message: string, meta?: Record<string, unknown>) {
    if (!shouldLog('error')) return;
    console.error(...format('error', message, meta));
  },
};
