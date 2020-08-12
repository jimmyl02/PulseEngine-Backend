import express from 'express';

import { userAuthRequired } from '../../../middleware/auth';

import create from './create';
import adduser from './adduser';

const competitionsRouter = express.Router();

competitionsRouter.route('/create')
    .post(userAuthRequired, create);

competitionsRouter.route('/adduser')
    .post(userAuthRequired, adduser);

export default competitionsRouter;