export async function getFromLocalStorage<T>(key: string): Promise<T | null> {
  try {
    const result = localStorage.getItem(key);
    if (result === null) {
      return null;
    }
    return JSON.parse(result) as T;
  } catch (error) {
    throw new Error(`データの取得中にエラーが発生しました ${error}`);
  }
}

export async function setToLocalStorage<T>(key: string, value: T): Promise<void> {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw new Error(`データの設定中にエラーが発生しました ${error}`);
  }
}

export async function removeFromLocalStorage(key: string): Promise<boolean> {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    throw new Error(`データの設定中にエラーが発生しました ${error}`);
  }
}

export async function setToChromeStorage<T>(key: string, value: T): Promise<void> {
  try {
    const data = { [key]: value };
    await chrome.storage.local.set(data);
  } catch (error) {
    console.error('データの保存中にエラーが発生しました:', error);
  }
}

export async function getFromChromeStorage<T>(key: string): Promise<T | null> {
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
