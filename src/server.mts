import env from 'dotenv';
import Fastify from 'fastify';
import routes from './routes.mts';

env.config();

const port = process.env.PORT;

const server = Fastify({
    logger: true,
});

server.register(routes);

try {
    await server.listen({
        port: port ? Number(port) : 3000,
    });
} catch (error) {
    server.log.error(error);
    process.exit(1);
}