import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  openaiApiKey: process.env.OPENAI_API_KEY || 'mock_openai_key',
  ghanaNlpApiKey: process.env.GHANANLP_API_KEY || 'mock_ghananlp_key'
};
