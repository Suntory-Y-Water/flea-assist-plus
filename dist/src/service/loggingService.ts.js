var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import "/vendor/.vite-deps-reflect-metadata.js__v--1a5dcd18.js";
import { injectable } from "/vendor/.vite-deps-inversify.js__v--1a5dcd18.js";
var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
  LogLevel2["INFO"] = "INFO";
  LogLevel2["ERROR"] = "ERROR";
  return LogLevel2;
})(LogLevel || {});
export let LoggingService = class {
  log(...messages) {
    this.printLog("INFO" /* INFO */, this.stringifyMessages(messages));
  }
  error(...messages) {
    this.printLog("ERROR" /* ERROR */, this.stringifyMessages(messages));
  }
  printLog(level, message) {
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
    const formattedMessage = this.formatLog(level, timestamp, message);
    console.log(formattedMessage);
  }
  formatLog(level, timestamp, message) {
    return `${timestamp} ${level} ${message}`;
  }
  stringifyMessages(messages) {
    return messages.map((message) => {
      if (typeof message === "object" && message !== null) {
        return JSON.stringify(message, null, 2);
      }
      return String(message);
    }).join(" ");
  }
};
LoggingService = __decorateClass([
  injectable()
], LoggingService);
