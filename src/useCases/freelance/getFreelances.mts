import type { FastifyReply, FastifyRequest } from 'fastify';
import { performScraping } from '../../utils/scraping.mts';

const targetUrl = `https://www.99freelas.com.br/projects`;

export const getFreelances = async (_: FastifyRequest, reply: FastifyReply) => {
    const data = await performScraping(targetUrl);

    return reply.status(200).send(data);
};
