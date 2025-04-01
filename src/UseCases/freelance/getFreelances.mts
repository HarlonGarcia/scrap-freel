import type { FastifyReply, FastifyRequest } from 'fastify';
import puppeteer from 'puppeteer';

const targetUrl = `https://www.99freelas.com.br/projects`;

export const getFreelances = async (_: FastifyRequest, reply: FastifyReply) => {
    const data = await scrapeFreelas();

    return reply.status(200).send(data);
};

const scrapeFreelas = async () => {
    const browser = await puppeteer.launch({
        headless: true,
    });

    const page = await browser.newPage();
    await page.goto(targetUrl);    

    const freelances = [];
    
    for (let i = 0; i < 4; i++) {
        const data = await page.evaluate(async () => {
            const baseUrl = 'https://www.99freelas.com.br';
            const elements = Array.from(document.querySelectorAll('.result-item'));
    
            const data = elements.map((el) => ({
                url: baseUrl + el.querySelector('.title')
                    .children[0]
                    .getAttribute('href'),
                title: el.querySelector('.title')
                    .textContent
                    .replace(/^\s+|\s+$/g, ''),
                description: el.querySelector('.description').textContent,
            }));
    
            
            return data;
        })

        freelances.push(...data);

        await goToNextPage(page);
    }

    await browser.close();

    return freelances;
};

const goToNextPage = async (page: puppeteer.Page) => {
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