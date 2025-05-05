import { config } from 'dotenv';
import User from './modules/user/domain/domain-core/entity/User';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import Application from './app';

config();

declare module 'fastify' {
  interface FastifyRequest {
    executor: User;
  }
}

let env = process.env.NODE_ENV;
if (!env) {
  throw new RuntimeException('Environment variable NODE_ENV is not defined');
}

env = env.trim();
if (env.toLowerCase() !== 'development' && env.toLowerCase() !== 'production') {
  throw new RuntimeException(
    `NODE_ENV must be either development or production [val = ${env}]`,
  );
}

async function main() {
  const application = new Application();
  await application.init();
  await application.listen();
}

main().then(() => {
  console.log('Application started');
});
