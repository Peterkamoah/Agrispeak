import app from './app.js';
import config from './config/index.js';

const PORT = config.port || 3000;

const server = app.listen(PORT, () => {
  console.log(`[AgriSpeak] Server running on port ${PORT} in ${config.env} mode.`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
