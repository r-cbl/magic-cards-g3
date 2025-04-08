import app from './app';
import config from '../config/config';
import logger from '../logging/logger';

const startServer = async () => {
  try {
    const server = app.listen(config.server.port, () => {
      logger.info(`Server running on port ${config.server.port} in ${config.env} mode`);
      logger.info(`API available at http://localhost:${config.server.port}${config.server.apiPrefix}`);
    });

    // Handle shutdown gracefully
    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info('Server closed');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    const unexpectedErrorHandler = (error: Error) => {
      logger.error(`Unexpected Error: ${error.message}`);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received');
      exitHandler();
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received');
      exitHandler();
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error starting server: ${error.message}`);
    } else {
      logger.error('Unknown error occurred during server startup');
    }
    process.exit(1);
  }
};

startServer(); 