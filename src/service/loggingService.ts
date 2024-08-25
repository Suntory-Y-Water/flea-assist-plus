import 'reflect-metadata';
import { injectable } from 'inversify';

enum LogLevel {
  INFO = 'INFO',
  ERROR = 'ERROR',
}

export interface ILoggingService {
  log(...messages: any[]): void;
  error(...messages: any[]): void;
}

@injectable()
export class LoggingService implements ILoggingService {
  log(...messages: any[]): void {
    this.printLog(LogLevel.INFO, this.stringifyMessages(messages));
  }

  error(...messages: any[]): void {
    this.printLog(LogLevel.ERROR, this.stringifyMessages(messages));
  }

  private printLog(level: LogLevel, message: string): void {
    const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    const formattedMessage = this.formatLog(level, timestamp, message);
    console.log(formattedMessage);
  }

  private formatLog(
    level: LogLevel,
    timestamp: string,

    message: string,
  ): string {
    return `${timestamp} ${level} ${message}`;
  }

  private stringifyMessages(messages: any[]): string {
    return messages
      .map((message) => {
        if (typeof message === 'object' && message !== null) {
          return JSON.stringify(message, null, 2);
        }
        return String(message);
      })
      .join(' ');
  }
}
