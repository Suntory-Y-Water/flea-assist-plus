/* eslint-disable @typescript-eslint/no-explicit-any */

enum LogLevel {
  INFO = 'INFO',
  ERROR = 'ERROR',
}

function printLog(level: LogLevel, message: string): void {
  const timestamp = new Date().toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
  });
  const formattedMessage = formatLog(level, timestamp, message);
  console.log(formattedMessage);
}

function formatLog(
  level: LogLevel,
  timestamp: string,
  message: string,
): string {
  return `${timestamp} ${level} ${message}`;
}

function stringifyMessages(messages: any[]): string {
  return messages
    .map((message) => {
      if (typeof message === 'object' && message !== null) {
        return JSON.stringify(message, null, 2);
      }
      return String(message);
    })
    .join(' ');
}

export function log(...messages: any[]): void {
  printLog(LogLevel.INFO, stringifyMessages(messages));
}

export function error(...messages: any[]): void {
  printLog(LogLevel.ERROR, stringifyMessages(messages));
}
