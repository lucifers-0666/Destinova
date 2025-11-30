import { app } from './app.js';
import { connectDatabase } from './config/db.js';
import { config } from './config/env.js';

const PORT = config.port;

async function start() {
  try {
    // Connect to MongoDB
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Destinova backend server started`);
      console.log(`📡 API listening on http://localhost:${PORT}`);
    });
    
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();

