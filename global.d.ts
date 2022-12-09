declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            BOT_CLIENT_ID: string;
        }
    }
}

export {};
