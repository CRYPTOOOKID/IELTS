// Logger utility to control console output based on environment
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args) => {
    if (isDev) {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    if (isDev) {
      console.error(...args);
    }
  },
  info: (...args) => {
    if (isDev) {
      console.info(...args);
    }
  }
};

export default logger; 