type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  message: string;
  [key: string]: any;
}

class LoggerService {
  private log(level: LogLevel, entry: LogEntry): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      ...entry,
      timestamp,
      level,
    };

    const output = JSON.stringify(logEntry);
    
    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'debug':
        if (process.env.NODE_ENV !== 'production') {
          console.log(output);
        }
        break;
      default:
        console.log(output);
    }
  }

  debug(entry: LogEntry): void {
    this.log('debug', entry);
  }

  info(entry: LogEntry): void {
    this.log('info', entry);
  }

  warn(entry: LogEntry): void {
    this.log('warn', entry);
  }

  error(entry: LogEntry): void {
    this.log('error', entry);
  }
}

export const logger = new LoggerService();