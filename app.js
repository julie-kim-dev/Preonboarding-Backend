import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import usersRouter from './router/users.js'

dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/', usersRouter);

app.listen(PORT, () => {
    console.log(`server ${PORT} open`);
})