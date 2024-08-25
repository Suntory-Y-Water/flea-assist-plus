import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { ILoggingService } from './loggingService';
import { IMessageService } from './messageService';
import { TYPES } from '../container/inversify.types';
import { IStorageService } from './storageService';

export interface IPopupService {
  getItemListButtonClick(): void;
  getListingItemsButtonClick(): void;
}

@injectable()
export class PopupService implements IPopupService {
  constructor(
    @inject(TYPES.LoggingService) private loggingService: ILoggingService,
    @inject(TYPES.MessageService) private messageService: IMessageService,
    @inject(TYPES.StorageService) private storageService: IStorageService,
  ) {}

  getItemListButtonClick(): void {
    document.addEventListener('DOMContentLoaded', async () => {
      try {
        const button = document.getElementById('item-info');
        if (!button) {
          throw new Error('ボタンがありませんでした');
        }

        button.addEventListener('click', async () => {
          this.loggingService.log('ボタン押下時の処理を開始します');

          this.loggingService.log('ローカルストレージの削除を開始します');
          await this.storageService.pop('itemList');
          this.loggingService.log('ローカルストレージの削除を終了します');

          // ボタン押下時に開始メッセージをBackgroundに送信する
          this.loggingService.log('BackgroundへtodosItemsメッセージ送信を開始します');
          const response = await this.messageService.sendBackgroundMessage({
            action: 'todosItems',
          });
          this.loggingService.log('BackgroundへtodosItemsメッセージ送信を終了します');
          this.loggingService.log('ボタン押下時の処理を終了します。');
          if (!response.success) {
            alert('エラーが発生しました。');
            return;
          }
        });
      } catch (error) {
        this.loggingService.error(`ボタン押下時のエラー: ${(error as Error).message}`);
        alert('エラーが発生しました。');
      }
    });
  }
  getListingItemsButtonClick(): void {
    document.addEventListener('DOMContentLoaded', async () => {
      try {
        const button = document.getElementById('relist-item');
        if (!button) {
          throw new Error('ボタンがありませんでした');
        }

        button.addEventListener('click', async () => {
          this.loggingService.log('ボタン押下時の処理を開始します');

          // ボタン押下時に開始メッセージをBackgroundに送信する
          this.loggingService.log('BackgroundへgetListingItemsメッセージ送信を開始します');
          const response = await this.messageService.sendBackgroundMessage({
            action: 'getListingItems',
          });
          this.loggingService.log('BackgroundへgetListingItemsメッセージ送信を終了します');
          this.loggingService.log('ボタン押下時の処理を終了します。');
          if (!response.success) {
            alert('エラーが発生しました。');
            return;
          }
        });
      } catch (error) {
        this.loggingService.error(`ボタン押下時のエラー: ${(error as Error).message}`);
        alert('エラーが発生しました。');
      }
    });
  }
}
