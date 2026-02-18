import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import apiRouter from '../router';

import { notFoundHandler, globalErrorHandler} from '../router/middleware/errors'

import type { Express } from 'express';

export default async function ({ app }: { app: Express}) {

  app.get('/status', (req, res) => res.sendStatus(200).end());
  app.head('/status', (req, res) => res.sendStatus(200).end());

  app.enable('trust proxy');

  //middlewares

  app.use(cors())
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: false }));

  //routes
  app.use('/api', apiRouter)

  //error handlers
  app.use(notFoundHandler);
  app.use(globalErrorHandler);
}
