const jwt = require('jsonwebtoken');

// Test JWT generation and verification
const secret = process.env.JWT_SECRET || 'your_development_secret_key_change_in_production';
const payload = { userId: '123', email: 'test@example.com' };

// Generate token
const token = jwt.sign(payload, secret, { expiresIn: '1h' });
console.log('Generated Token:', token);

// Verify token
try {
  const decoded = jwt.verify(token, secret);
  console.log('Decoded Token:', decoded);
  console.log('JWT test passed successfully!');
} catch (error) {
  console.error('JWT verification failed:', error.message);
} 