/**
 * Client environment mode.
 * @type { boolean } true if development mode, false if production mode.
 */
export const isDevelopment: boolean = process.env.NODE_ENV === 'development';

/**
 * MongoDB connection string..
 */
export const mongoURI = process.env.MONGO_URI;

/**
 * Discord client token.
 */
export const clientToken = process.env.DISCORD_CLIENT_TOKEN;

if (!mongoURI) throw new Error('Missing environment variable: MONGO_URI');
if (!clientToken) throw new Error('Missing environment variable: DISCORD_CLIENT_TOKEN. Please set in the .env file.');
