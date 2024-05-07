/**
 * 拡張機能はコンテンツスクリプトを使って、Webページにコードを注入します。
 * コンテンツスクリプトは開いているページのDOMツリーにアクセスできるため、
 * 拡張機能はページに新しい要素を挿入したり、ページを変更したりできます。
 *  */

/**
 * ページが読み込まれたときに実行される関数
 */
const waitForElementToAppear = async (selector, interval, timeout) => {
  const startTime = Date.now();

  while (Date.now() - startTime <= timeout) {
    const element = document.querySelector(selector);
    if (element) {
      return element;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  console.log(`Element not found: ${selector}`);
  return null;
};

/**
 * selector情報を受取、該当のシュオ品情報を取得する
 */
const getProductData = (element) => {
  const nameElement = element.querySelector('.content__97a42da1 > span');
  const imageElement = element.querySelector(
    '.merItemThumbnail.medium__a6f874a2.thumbnail__97a42da1 > figure > div.imageContainer__f8ddf3a2 > picture > img',
  );
  const editLinkElement = element.querySelector('#edit-link');

  return {
    name: nameElement ? nameElement.textContent : null,
    imageUrl: imageElement ? imageElement.getAttribute('src') : null,
    hasEditLink: !!editLinkElement,
  };
};

const getListingItems = async () => {
  for (let count = 1; count < 5; count++) {
    const selector = `#currentListing > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(${count}) > div.content__884ec505 > a > div > div`;
    const element = await waitForElementToAppear(selector, 1000, 5000);

    if (element) {
      const productData = getProductData(element);
      console.log(`商品情報 : ${JSON.stringify(productData)}`);
    } else {
      console.log(`Product ${count} not found.`);
    }
  }

  console.log('Product listing completed.');
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == 'fetchSelectors') {
    let details = [];
    let promises = [];
    for (let count = 1; count <= 5; count++) {
      const selector = `#currentListing > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(${count}) > div.content__884ec505 > a > div > div`;
      let promise = waitForElementToAppear(selector, 1000, 5000).then((element) => {
        if (element) {
          const productData = getProductData(element);
          details.push(productData);
        } else {
          console.log(`Product ${count} not found.`);
        }
      });
      promises.push(promise);
    }

    Promise.all(promises).then(() => {
      console.log('Product listing completed.');
      sendResponse({ data: details });
    });
    return true;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'clickEditLink') {
    const editLink = document.querySelector(
      '#currentListing > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(1) > div.content__884ec505 > a > div > div > #edit-link',
    );
    if (!editLink) {
      console.error('Edit link not found.');
      return;
    }
    editLink.click();
    sendResponse();
  }
});
