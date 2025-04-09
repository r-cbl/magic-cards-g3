import request from 'supertest';
import app from '../../../infrastructure/http/app';
import { InMemoryUserRepository } from '../../../infrastructure/repositories/InMemoryUserRepository';
import config from '../../../infrastructure/config/config';
// Get access to the repository to clean up after tests
const userRepository = new InMemoryUserRepository();

describe('Authentication Flow', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!'
  };
  
  let authToken: string;
  let userId: string;
  let apiPrefix = config.server.apiPrefix;
  // Clean up test data after all tests
  afterAll(async () => {
    // Find and remove the test user
    if (userId) {
      await userRepository.delete(userId);
    }
  });
  
  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post(`${apiPrefix}/auth/register`)
        .send(testUser);
      
      // Verify response status and structure
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('tokens');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).toHaveProperty('name', testUser.name);
      
      // Save the user ID for cleanup
      userId = response.body.user.id;
      
      // Verify token structure
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');
      expect(response.body.tokens).toHaveProperty('expiresIn');
    });
    
    it('should not register a user with missing required fields', async () => {
      const response = await request(app)
        .post(`${apiPrefix}/auth/register`)
        .send({ email: 'incomplete@example.com' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should not register a user with an existing email', async () => {
      const response = await request(app)
        .post(`${apiPrefix}/auth/register`)
        .send(testUser); // Same user data as before
      
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'User with this email already exists');
    });
  });
  
  describe('User Login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post(`${apiPrefix}/auth/login`)
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      // Verify response
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tokens');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      
      // Save token for authenticated requests
      authToken = response.body.tokens.accessToken;
    });
    
    it('should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post(`${apiPrefix}/auth/login`)
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should reject login with non-existent user', async () => {
      const response = await request(app)
        .post(`${apiPrefix}/auth/login`)
        .send({
          email: 'nonexistent@example.com',
          password: 'anypassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('Protected Routes', () => {
    it('should access protected route with valid token', async () => {
      const response = await request(app)
        .get(`${apiPrefix}/auth/me`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });
    
    it('should reject access to protected route without token', async () => {
      const response = await request(app)
        .get(`${apiPrefix}/auth/me`);
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should reject access with invalid token format', async () => {
      const response = await request(app)
        .get(`${apiPrefix}/auth/me`)
        .set('Authorization', 'InvalidTokenFormat');
      
      expect(response.status).toBe(401);
    });
    
    it('should reject access with invalid token', async () => {
      const response = await request(app)
        .get(`${apiPrefix}/auth/me`)
        .set('Authorization', 'Bearer invalidtoken123');
      
      expect(response.status).toBe(401);
    });
  });
});
