import express from 'express';

import { userAuthRequired } from '../../../middleware/auth';

import register from './create';

const competitionsRouter = express.Router();

competitionsRouter.route('/create')
    .post(userAuthRequired, register);

export default competitionsRouter;