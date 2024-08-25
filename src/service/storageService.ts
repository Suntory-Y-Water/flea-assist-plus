import 'reflect-metadata';
import { injectable } from 'inversify';

export interface IStorageService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  pop(key: string): Promise<boolean>;
  getFromChromeStorage<T>(key: string): Promise<T | null>;
  setToChromeStorage<T>(key: string, value: T): Promise<void>;
}

@injectable()
export class StorageService implements IStorageService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const result = localStorage.getItem(key);
      if (result === null) {
        return null;
      }
      return JSON.parse(result) as T;
    } catch (error) {
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  }

  async pop(key: string): Promise<boolean> {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }
  async setToChromeStorage<T>(key: string, value: T): Promise<void> {
    try {
      const data = { [key]: value };
      await chrome.storage.local.set(data);
    } catch (error) {
      console.error('データの保存中にエラーが発生しました:', error);
    }
  }

  // chrome.storageからデータを取得するメソッド
  async getFromChromeStorage<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get([key], (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve((result[key] as T) || null);
          }
        });
      } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
        reject(null);
      }
    });
  }
}
