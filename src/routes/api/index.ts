import express from 'express';

import competitions from './competitions';

const apiRouter = express.Router();

apiRouter.use('/competitions', competitions);

export default apiRouter;