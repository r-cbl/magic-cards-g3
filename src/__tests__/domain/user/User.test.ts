import { User, UserProps } from '../../../domain/entities/User';

describe('User Entity', () => {
  const userData: UserProps = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  it('should create a new user with provided data', () => {
    const user = new User(userData);
    
    expect(user.getId()).toBeDefined();
    expect(user.getName()).toBe(userData.name);
    expect(user.getEmail()).toBe(userData.email);
    expect(user.getCreatedAt()).toBeInstanceOf(Date);
    expect(user.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it('should create a user with provided id if given', () => {
    const userWithId = new User({
      ...userData,
      id: 'test-id-123',
    });
    
    expect(userWithId.getId()).toBe('test-id-123');
  });

  it('should update name correctly', () => {
    const user = new User(userData);
    const updatedAt = user.getUpdatedAt();
    
    // Wait a bit to ensure updated timestamp differs
    setTimeout(() => {
      user.setName('Updated Name');
      
      expect(user.getName()).toBe('Updated Name');
      expect(user.getUpdatedAt().getTime()).toBeGreaterThan(updatedAt.getTime());
    }, 5);
  });

  it('should return JSON representation without password', () => {
    const user = new User(userData);
    const json = user.toJSON();
    
    expect(json.id).toBeDefined();
    expect(json.name).toBe(userData.name);
    expect(json.email).toBe(userData.email);
    expect(json.createdAt).toBeDefined();
    expect(json.updatedAt).toBeDefined();
    expect(json).not.toHaveProperty('password');
  });
}); 