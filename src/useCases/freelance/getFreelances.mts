import type { FastifyReply, FastifyRequest } from 'fastify';
import { performScraping } from '../../utils/scraping.mts';
import { CronJob } from 'cron';

let freelances = null;
const targetUrl = `https://www.99freelas.com.br/projects`;

const job = CronJob.from({
	cronTime: '* * */3 * * *',
	onTick: async () => {
        console.log('Running cron job - Scraping freelances');

        freelances = await performScraping(targetUrl);
    },
	start: true,
}); 

freelances = await performScraping(targetUrl);
job.start();

export const getFreelances = async (_: FastifyRequest, reply: FastifyReply) => {
    if (freelances) {
        return reply.status(200).send(freelances);
    } else {
        reply.status(503).send();
    }
};
