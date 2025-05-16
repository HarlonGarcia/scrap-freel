import puppeteer from 'puppeteer';

export const scrapeFreelas = async (target: string) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(target);

    const items = await getItemsFrom(page);

    await browser.close();

    return items;
}

const getItemsFrom = async (page: puppeteer.Page) => {
    const items = await page.$$('.result-item');
    const freelances = [];

    for (const item of items) {
        try {
            const { title, originialUrl } = await page.evaluate(el => {
                const titleEl = el.querySelector('.title > a');

                return {
                    title: titleEl?.textContent,
                    originialUrl: titleEl.getAttribute('href'),
                };
            }, item); 

            const [createdAt, expiresOn] = await page.$$eval('b[cp-datetime]', elements => elements.map(el => el.getAttribute('cp-datetime'))
);


            const payload = {
                title,
                originialUrl,
                createdAt,
                expiresOn,
            };      
      
            freelances.push(payload);
        } catch (error) {
            console.error('Error while scraping items:', error);
        }
    }
        
    return freelances;
}

export const goToNextPage = async (page: puppeteer.Page) => {
    await page.waitForSelector('.pagination-component');

    await page.evaluate(() => {
        const pagination = document.querySelector('.pagination-component');

        const selectedPage = Array.from(pagination.children).find((el) => {
            return el.classList.contains('selected');
        });

        const currentPage = Number(selectedPage.getAttribute('data-page'));
        const nextPage = currentPage + 1;

        const nextPageButton = pagination.querySelector(`span[data-page="${nextPage}"]`);

        if (nextPageButton) {
            (nextPageButton as HTMLElement).click();
        }
    });

    await page.waitForNavigation({ waitUntil: 'networkidle0' });
};
