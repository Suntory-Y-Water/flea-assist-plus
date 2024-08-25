import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './inversify.types';
import { ISelectorService, SelectorService } from '../service/selectorService';
import { IStorageService, StorageService } from '../service/storageService';
import { IPopupService, PopupService } from '../service/popupService';
import { ILoggingService, LoggingService } from '../service/loggingService';
import { MessageService } from '../service/messageService';

const container = new Container();

container.bind<ISelectorService>(TYPES.SelectorService).to(SelectorService);
container.bind<IStorageService>(TYPES.StorageService).to(StorageService);
container.bind<IPopupService>(TYPES.PopupService).to(PopupService);
container.bind<ILoggingService>(TYPES.LoggingService).to(LoggingService);
container.bind<MessageService>(TYPES.MessageService).to(MessageService);

export { container };
