import dotenv from 'dotenv';
dotenv.config();

const JWTConfig = {
  secret: process.env.JWT_SECRET,
  expiration: 5 * 24 * 60 * 60, // 5 days (in seconds)
};

export default JWTConfig;
