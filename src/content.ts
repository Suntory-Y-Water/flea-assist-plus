import { ProductData } from './types';

const waitForElementToAppear = async (
  selector: string,
  interval: number = 1000,
  timeout: number = 5000,
): Promise<Element | null> => {
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

const getProductData = (element: Element): ProductData => {
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

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action == 'fetchSelectors') {
    let details = [];

    for (let count = 1; count <= 5; count++) {
      const selector = `#currentListing > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(${count}) > div.content__884ec505 > a > div > div`;
      try {
        const element = await waitForElementToAppear(selector, 1000, 5000);
        if (element) {
          const productData = getProductData(element);
          details.push(productData);
        } else {
          console.log(`Product ${count} not found.`);
        }
      } catch (error) {
        console.log(`Error finding product ${count}:`, error);
      }
    }

    console.log('Product listing completed.');
    sendResponse({ data: details });
  }
  return true;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'clickEditLink') {
    const editLink = document.querySelector<HTMLElement>(
      '#currentListing > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(1) > div.content__884ec505 > a > div > div > #edit-link',
    );
    if (!editLink) {
      throw new Error('Edit link not found.');
    }
    editLink.click();
    sendResponse();
  }
});
