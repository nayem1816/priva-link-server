const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(process.cwd(), ".env") });

const isProduction = process.env.NODE_ENV === "production";

const envFilePath = path.join(
  process.cwd(),
  isProduction ? ".env.production" : ".env.development"
);

dotenv.config({ path: envFilePath });

module.exports = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  frontend_link: process.env.FRONTEND_LINK,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  encryption_key: process.env.ENCRYPTION_KEY,
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  nodemailer: {
    user: process.env.NODEMAILER_USER,
    password: process.env.NODEMAILER_PASSWORD,
  },
  company: {
    name: process.env.COMPANY_NAME,
    email: process.env.COMPANY_EMAIL,
    logo_url: process.env.COMPANY_LOGO_URL,
    facebook_url: process.env.COMPANY_FACEBOOK_URL,
    twitter_url: process.env.COMPANY_TWITTER_URL,
    instagram_url: process.env.COMPANY_INSTAGRAM_URL,
    linkedin_url: process.env.COMPANY_LINKEDIN_URL,
    location: process.env.COMPANY_LOCATION,
    phone: process.env.COMPANY_PHONE,
    website: process.env.COMPANY_WEBSITE,
  },
  aws: {
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket_name: process.env.AWS_BUCKET_NAME,
  },
};
