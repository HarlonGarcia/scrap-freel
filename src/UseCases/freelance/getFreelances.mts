import type { FastifyReply, FastifyRequest } from 'fastify';

export const getFreelances = async (request: FastifyRequest, reply: FastifyReply) => {
    return { freelances: [] };
};