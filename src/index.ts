import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

import router from './routes';

// Create express app
const app: express.Application = express();

// Connect to database
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true })
    .then(() => {
        console.log('Successfully connected to mongod server');
    })
    .catch((error) => {
        console.error('Error connecting to the database: ', error);
    });

// Setup middleware
app.use(bodyParser.json());

// Setup router
app.use('/', router);

router.all('*', (req, res) => {
    res.status(404).send('Route not found');
});

app.listen(3000, () => {
    console.log('App is listening on port 3000');
});