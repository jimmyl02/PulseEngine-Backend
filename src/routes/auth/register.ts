import { Request, Response } from 'express';
import Ajv from 'ajv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import user from '../../database/models/user';

const ajv = new Ajv({ allErrors: true });

const schema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
        },
        password: {
            type: 'string'
        },
        passwordConfirm: {
            type: 'string'
        },
        fname: {
            type: 'string'
        },
        lname: {
            type: 'string'
        },
        email: {
            type: 'string',
            format: 'email'
        },
    },
    required: ['username', 'password', 'passwordConfirm', 'fname', 'lname', 'email']
};

const validate = ajv.compile(schema);

const handler = async (req: Request, res: Response) => {
    const body = req.body
    if(validate(body)){
        if(body.password === body.passwordConfirm){
            // Mongo has no way besides parsing error string, this is best alternative to checking for duplicates. Cost is OK because it is register route
            let dupSearch = await user.findOne({ username: body.username });
            if(dupSearch) return res.json({ status: 'error', error: 'Username in use' });
            dupSearch = await user.findOne({ email: body.email });
            if(dupSearch) return res.json({ status: 'error', error: 'Email in use' });

            const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
            const hashedPw = await bcrypt.hash(body.password, salt);
            const newUser = new user({username: body.username, password: hashedPw, fname: body.fname, lname: body.lname, email: body.email});
            newUser.save((err) => {
                if(err){
                    console.error('An error happened in user creation: ', err);
                    return res.json({ error: 'An error occurred during record creation' });
                }
            });
            const token = jwt.sign({ username: body.username }, process.env.JWT_SECRET, { algorithm: 'HS256' });
            res.json({ status: 'success', token });
        }else{
            res.json({ status: 'error', error: 'Passwords do not match' });
        }
    }else{
        res.send(validate.errors);
    }
};

export default handler;