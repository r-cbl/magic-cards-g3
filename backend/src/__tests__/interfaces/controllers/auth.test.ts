import { Request, Response } from 'express';
import { AuthController } from '../../../interfaces/controllers/AuthController';
import { AuthService } from '../../../application/services/AuthService';
import { InMemoryUserRepository } from '../../../infrastructure/persistence/inMemory/InMemoryUserRepository';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { CreateUserDTO } from '../../../application/dtos/UserDTO';
import { UserService } from '../../../application/services/UserService';

describe('Authentication Flow', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userRepository: InMemoryUserRepository;
  let jwtService: JwtService;
  
  const testUser: CreateUserDTO = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!'
  };
  
  let userId: string;
  let authToken: string;
  
  // Mock request and response objects
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;
  
  beforeEach(() => {
    // Reset mocks before each test
    userRepository = new InMemoryUserRepository();
    const userService = new UserService(userRepository);
    jwtService = new JwtService();
    authService = new AuthService(jwtService, userService);
    authController = new AuthController(authService);
    
    // Setup mock response
    responseObject = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      })
    };
  });
  
  // Clean up test data after all tests
  afterAll(async () => {
    if (userId) {
      await userRepository.delete(userId);
    }
  });
  
  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      // Setup request
      mockRequest = {
        body: testUser
      };
      
      // Call the controller method
      await authController.register(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject).toHaveProperty('tokens');
      expect(responseObject).toHaveProperty('user');
      expect(responseObject.user).toHaveProperty('id');
      expect(responseObject.user.email).toBe(testUser.email);
      expect(responseObject.user.name).toBe(testUser.name);
      
      // Save the user ID for cleanup
      userId = responseObject.user.id;
      
      // Verify token structure
      expect(responseObject.tokens).toHaveProperty('accessToken');
      expect(responseObject.tokens).toHaveProperty('refreshToken');
      expect(responseObject.tokens).toHaveProperty('expiresIn');
    });
    
    it('should not register a user with missing required fields', async () => {
      // Setup request with missing fields
      mockRequest = {
        body: { email: 'incomplete@example.com' }
      };
      
      // Call the controller method
      await authController.register(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toHaveProperty('error');
    });
    
    it('should not register a user with an existing email', async () => {
      // First register a user
      mockRequest = {
        body: testUser
      };
      
      await authController.register(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Try to register the same user again
      await authController.register(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(responseObject).toHaveProperty('error', 'User with this email already exists');
    });
  });
  
  describe('User Login', () => {
    beforeEach(async () => {
      // Register a user before each login test
      mockRequest = {
        body: testUser
      };
      
      await authController.register(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      userId = responseObject.user.id;
    });
    
    it('should login successfully with valid credentials', async () => {
      // Setup login request
      mockRequest = {
        body: {
          email: testUser.email,
          password: testUser.password
        }
      };
      
      // Call the controller method
      await authController.login(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toHaveProperty('tokens');
      expect(responseObject).toHaveProperty('user');
      expect(responseObject.user).toHaveProperty('id');
      expect(responseObject.user.email).toBe(testUser.email);
      
      // Save token for authenticated requests
      authToken = responseObject.tokens.accessToken;
    });
    
    it('should reject login with invalid credentials', async () => {
      // Configuración de la solicitud con credenciales incorrectas
      mockRequest = {
        body: {
          email: testUser.email,           // Usamos el email válido del test
          password: 'wrongpassword'        // Usamos una contraseña incorrecta
        }
      };
    
      // Llamamos al método 'login' del controlador de autenticación
      await authController.login(
        mockRequest as Request,            // Pasamos la solicitud simulada
        mockResponse as Response           // Pasamos la respuesta simulada
      );
    
      // Verificación de la respuesta
      // Esperamos que la respuesta tenga un código de estado 401 (no autorizado)
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    
      // Verificamos que la respuesta contenga un campo 'error' con el mensaje esperado
      expect(responseObject).toHaveProperty('error');
      
      // Verificamos que el mensaje de error sea adecuado para credenciales inválidas
      expect(responseObject.error).toBe('Invalid email or password');
    });
    
    it('should reject login with non-existent user', async () => {
      // Setup login request with non-existent email
      mockRequest = {
        body: {
          email: 'nonexistent@example.com',
          password: 'anypassword'
        }
      };
      
      // Mock the authService to throw an error if the user does not exist
      jest.spyOn(authService, 'login').mockRejectedValueOnce(new Error('Invalid credentials'));
      
      // Call the controller method
      await authController.login(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(401);  // Status 401 for invalid credentials
      expect(responseObject).toHaveProperty('error');  // Ensure error message is returned
      expect(responseObject.error).toBe('Invalid email or password');  // Specific error message
    });
  });
  
  describe('Get Current User', () => {
    beforeEach(async () => {
      // Register and login a user before each test
      mockRequest = {
        body: testUser
      };
      
      await authController.register(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      userId = responseObject.user.id;
      
      // Login to get token
      mockRequest = {
        body: {
          email: testUser.email,
          password: testUser.password
        }
      };
      
      await authController.login(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      authToken = responseObject.tokens.accessToken;
    });
    
    it('should get current user with valid token', async () => {
      // Setup request with auth token
      mockRequest = {
        headers: {
          authorization: `Bearer ${authToken}`
        },
        user: {
          userId: userId,
          email: testUser.email
        }
      };
      
      // Call the controller method
      await authController.getCurrentUser(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toHaveProperty('user');
      expect(responseObject.user).toHaveProperty('id', userId);
      expect(responseObject.user).toHaveProperty('email', testUser.email);
    });
    
    it('should reject request without user in request object', async () => {
      // Setup request without user
      mockRequest = {
        headers: {
          authorization: `Bearer ${authToken}`
        }
      };
      
      // Call the controller method
      await authController.getCurrentUser(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(responseObject).toHaveProperty('error', 'Authentication required');
    });
  });
});
