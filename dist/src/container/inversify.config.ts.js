import "/vendor/.vite-deps-reflect-metadata.js__v--1a5dcd18.js";
import { Container } from "/vendor/.vite-deps-inversify.js__v--1a5dcd18.js";
import { TYPES } from "/src/container/inversify.types.ts.js";
import { SelectorService } from "/src/service/selectorService.ts.js";
import { ProductService } from "/src/service/productService.ts.js";
import { StorageService } from "/src/service/storageService.ts.js";
import { PopupService } from "/src/service/popupService.ts.js";
import { LoggingService } from "/src/service/loggingService.ts.js";
import { MessageService } from "/src/service/messageService.ts.js";
const container = new Container();
container.bind(TYPES.SelectorService).to(SelectorService);
container.bind(TYPES.ProductService).to(ProductService);
container.bind(TYPES.StorageService).to(StorageService);
container.bind(TYPES.PopupService).to(PopupService);
container.bind(TYPES.LoggingService).to(LoggingService);
container.bind(TYPES.MessageService).to(MessageService);
export { container };
