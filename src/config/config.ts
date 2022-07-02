/**
 * Client environment mode.
 * @type { boolean } true if development mode, false if production mode.
 */
export const isDevelopment: boolean = process.env.NODE_ENV === 'development';

/**
 * MongoDB configuration.
 */
export const mongoConfig = {
    port: process.env.MONGO_PORT,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    database: process.env.MONGO_DATABASE,
    uri: process.env.MONGO_URI,
};

/**
 * Discord client token.
 */
export const clientToken = process.env.DISCORD_CLIENT_TOKEN;

// eslint-disable-next-line security/detect-object-injection
const missingEnv = Object.keys(mongoConfig).filter((key) => !mongoConfig[key as keyof typeof mongoConfig]);
if (missingEnv.length) {
    throw new Error(
        `Missing environment variables: ${missingEnv
            .map((key) => `MONGO_${key.toUpperCase()}. Please set in the .env file.`)
            .join('\n')}`,
    );
}

if (!clientToken) throw new Error('Missing environment variable: DISCORD_CLIENT_TOKEN. Please set in the .env file.');
