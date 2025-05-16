import type { FastifyReply, FastifyRequest } from 'fastify';
import puppeteer from 'puppeteer';
import { scrapeFreelas } from '../../utils/scraping.mts';

const targetUrl = `https://www.99freelas.com.br/projects`;

export const getFreelances = async (_: FastifyRequest, reply: FastifyReply) => {
    console.log('getFreelances');
    const data = await scrapeFreelas(targetUrl);

    return reply.status(200).send(data);
};
