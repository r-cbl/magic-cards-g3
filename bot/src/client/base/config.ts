const isDocker = process.env.RUNNING_IN_DOCKER === 'true';

export const API_BASE_URL = isDocker
  ? 'http://app:3001/api'
  : process.env.BACKEND_URL || 'http://localhost:3001/api';
