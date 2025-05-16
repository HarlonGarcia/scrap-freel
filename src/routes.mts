import type { FastifyInstance } from 'fastify';
import { getFreelances } from './useCases/freelance/getFreelances.mts';

async function routes(instance: FastifyInstance) {
    instance.get('/freelances', getFreelances);
}

export default routes;