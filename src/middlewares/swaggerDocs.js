import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import createHttpError from 'http-errors';
import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = (req, res, next) => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH, 'utf-8'));
    return swaggerUI.setup(swaggerDoc)(req, res, next);
  } catch (err) {
    next(createHttpError(500, "Can't load Swagger docs"));
  }
};

export const swaggerMiddleware = swaggerUI.serve;
