import express from 'express';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import pino from 'pino-http';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerMiddleware, swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json({ limit: '100kb' }));
  app.use(cors());
  app.use(cookieParser());

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('/api-docs', swaggerMiddleware, swaggerDocs);

  app.use(pino({ transport: { target: 'pino-pretty' } }));
  app.use(router);
  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
};
