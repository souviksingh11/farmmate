import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import { connectToDatabase } from './config/db.js';

const port = process.env.PORT || 5000;

async function start() {
  await connectToDatabase(process.env.MONGO_URI);
  const server = http.createServer(app);
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server running on port ${port}`);
  });
}

start();


