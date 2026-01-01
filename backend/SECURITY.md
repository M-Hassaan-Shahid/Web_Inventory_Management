# Security Features

## Overview

This document outlines the security measures implemented in the Inventory Management System backend.

## Implemented Security Features

### 1. Authentication & Authorization

- **JWT Token-based Authentication**: Secure token generation with 30-day expiration
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Role-Based Access Control (RBAC)**: Three roles - Admin, Manager, Staff
- **Token Verification**: Middleware validates tokens on protected routes
- **Account Status Check**: Deactivated accounts cannot authenticate

### 2. Rate Limiting

- **Authentication Endpoints**: 5 requests per 15 minutes per IP
- **General API Endpoints**: 100 requests per 15 minutes per IP
- Prevents brute force attacks and API abuse

### 3. Data Sanitization

- **NoSQL Injection Prevention**: express-mongo-sanitize removes malicious operators
- **Parameter Pollution Prevention**: hpp middleware prevents HTTP parameter pollution
- **Input Validation**: express-validator on critical endpoints

### 4. HTTP Security Headers

- **Helmet.js**: Sets various HTTP headers for security
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Strict-Transport-Security (HSTS)
  - Content-Security-Policy

### 5. CORS Configuration

- **Origin Restriction**: Only allows requests from configured frontend URL
- **Credentials Support**: Enables secure cookie handling
- **Configurable**: Set via FRONTEND_URL environment variable

### 6. Error Handling

- **Consistent Error Responses**: Standardized error format across all endpoints
- **Stack Trace Protection**: Stack traces only shown in development mode
- **Specific Error Messages**: Clear error messages without exposing sensitive info
- **Async Error Handling**: asyncHandler wrapper prevents unhandled promise rejections

### 7. Request Logging

- **Development Logging**: Detailed request/response logging in dev mode
- **IP Address Tracking**: Logs IP addresses for security auditing
- **Response Time Tracking**: Monitors endpoint performance

### 8. File Upload Security

- **File Type Validation**: Only allows image files (jpeg, jpg, png, gif)
- **File Size Limit**: Maximum 5MB per file
- **Secure Storage**: Files stored outside web root with unique names
- **Error Handling**: Proper error messages for upload failures

### 9. Database Security

- **Connection String Protection**: MongoDB URI stored in environment variables
- **Transaction Support**: ACID transactions for critical operations
- **Audit Logging**: Activity logs track all CRUD operations
- **Soft Deletes**: Records marked inactive instead of hard deletion

### 10. Session Management

- **Token Expiration**: JWT tokens expire after 30 days
- **No Session Storage**: Stateless authentication reduces attack surface
- **User Validation**: Each request validates user exists and is active

## Environment Variables

Required security-related environment variables:

```env
JWT_SECRET=your_strong_secret_key_at_least_32_characters
FRONTEND_URL=http://localhost:3000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/inventory_db
```

## Best Practices

### For Production Deployment

1. **Strong JWT Secret**

   - Use at least 32 random characters
   - Never commit to version control
   - Rotate periodically

2. **HTTPS Only**

   - Always use HTTPS in production
   - Enable HSTS headers
   - Redirect HTTP to HTTPS

3. **Database Security**

   - Use MongoDB authentication
   - Restrict database user permissions
   - Enable MongoDB encryption at rest
   - Use connection string with authentication

4. **Environment Variables**

   - Never commit .env files
   - Use secure secret management (AWS Secrets Manager, Azure Key Vault, etc.)
   - Different secrets for each environment

5. **Regular Updates**

   - Keep dependencies updated
   - Monitor security advisories
   - Run `npm audit` regularly

6. **Monitoring**

   - Set up error tracking (Sentry, Rollbar, etc.)
   - Monitor failed authentication attempts
   - Track unusual API usage patterns

7. **Backup Strategy**
   - Regular database backups
   - Secure backup storage
   - Test restore procedures

## Security Checklist

- [x] JWT authentication implemented
- [x] Password hashing with bcrypt
- [x] Role-based access control
- [x] Rate limiting on auth endpoints
- [x] Rate limiting on API endpoints
- [x] NoSQL injection prevention
- [x] Parameter pollution prevention
- [x] Security headers (Helmet)
- [x] CORS configuration
- [x] File upload validation
- [x] Error handling standardization
- [x] Request logging
- [x] Audit logging
- [x] Input validation
- [x] Async error handling

## Known Limitations

1. **No Password Reset**: Password reset functionality not yet implemented
2. **No Email Verification**: Email verification not implemented
3. **No 2FA**: Two-factor authentication not available
4. **No IP Whitelisting**: No IP-based access restrictions
5. **No API Key Management**: No API key authentication option

## Reporting Security Issues

If you discover a security vulnerability, please email security@example.com instead of using the issue tracker.

## License

This security documentation is part of the Inventory Management System project.
