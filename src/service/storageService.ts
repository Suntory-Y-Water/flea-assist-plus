import 'reflect-metadata';
import { injectable } from 'inversify';

export interface IStorageService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  pop(key: string): Promise<boolean>;
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
}
