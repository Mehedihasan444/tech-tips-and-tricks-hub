import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

import { env } from "./env";

export default {
  NODE_ENV: env.NODE_ENV,
  port: env.PORT,
  db_url: env.DB_URL,
  bcrypt_salt_rounds: env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: env.JWT_REFRESH_EXPIRES_IN,
  admin_email: env.ADMIN_EMAIL,
  admin_password: env.ADMIN_PASSWORD,
  admin_profile_photo: env.ADMIN_PROFILE_PHOTO,
  admin_mobile_number: env.ADMIN_MOBILE_NUMBER,
  demo_login_enabled: env.DEMO_LOGIN_ENABLED,
  demo_admin_email: env.DEMO_ADMIN_EMAIL,
  demo_admin_password: env.DEMO_ADMIN_PASSWORD,
  demo_user_email: env.DEMO_USER_EMAIL,
  demo_user_password: env.DEMO_USER_PASSWORD,
  cloudinary_cloud_name: env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: env.CLOUDINARY_API_SECRET,
  meilisearch_host: env.MEILISEARCH_HOST,
  meilisearch_master_key: env.MEILISEARCH_MASTER_KEY,
  sender_email: env.SENDER_EMAIL,
  sender_app_password: env.SENDER_APP_PASS,
  client_url: env.CLIENT_URL,
  server_url: env.SERVER_URL,
  store_Id: env.STORE_ID,
  signature_key: env.SIGNATURE_KEY,
  payment_url: env.PAYMENT_URL,
  payment_verify_url: env.PAYMENT_VERIFY_URL,
  reset_pass_ui_link: `${env.CLIENT_URL}${env.RESET_PASS_UI_LINK}`,
  rate_limit_window_ms: env.RATE_LIMIT_WINDOW_MS,
  rate_limit_max: env.RATE_LIMIT_MAX,
  auth_rate_limit_max: env.AUTH_RATE_LIMIT_MAX,
};

export { env };
