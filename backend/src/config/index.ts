import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@shreeshree.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    phone: process.env.ADMIN_PHONE || '9999999999',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  upload: {
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },
};
