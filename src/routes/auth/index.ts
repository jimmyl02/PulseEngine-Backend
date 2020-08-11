import express from 'express';

import register from './register';

const authRouter = express.Router();

authRouter.route('/register')
    .post(register);

export default authRouter;