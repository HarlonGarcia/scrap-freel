import puppeteer from 'puppeteer';

export const performScraping = async (target: string) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(target);

    const freelances = await getItemsFromPage(page);

    await browser.close();

    return freelances;
}

const getItemsFromPage = async (page: puppeteer.Page) => {
    const items = await page.$$('.result-item');
    const freelances = [];

    for (const parentEl of items) {
        try {
            const { title, originialUrl } = await page.evaluate(el => {
                const titleEl = el.querySelector('.title > a');

                return {
                    title: titleEl?.textContent,
                    originialUrl: titleEl.getAttribute('href'),
                };
            }, parentEl); 

            const [createdAt, expiresOn] = await page.$$eval('b[cp-datetime]', (elements) => {
                return elements.map((el) => el.getAttribute('cp-datetime'));
            });

            const allTags = await page.evaluate(
                (el) => el.querySelector('.information').textContent.split('Publicado')[0],
                parentEl,
            );

            const tags = allTags
                .split('|')
                .map((tag) => tag.trim().match(/[^\s].*[^\s]/)?.[0] ?? '')
                .filter(Boolean);

            const description = await page.evaluate(
                (el) => el.querySelector('.description').textContent
                    .split('<br>')[0]
                    .replace(/(\.\.\.|…)?\s*(Expandir|Esconder)\b/gi, '')
                    .replace(/\s{2,}/g, ' ')
                    .trim(),
                parentEl,
            );
      
            freelances.push({
                title,
                tags,
                description,
                originialUrl,
                createdAt,
                expiresOn,
            });
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
