export declare const config: {
    port: number;
    nodeEnv: string;
    jwt: {
        secret: string;
        expiresIn: string;
    };
    admin: {
        email: string;
        password: string;
        phone: string;
    };
    cors: {
        origin: string;
    };
    upload: {
        maxFileSize: number;
        allowedMimeTypes: string[];
    };
    pagination: {
        defaultPage: number;
        defaultLimit: number;
        maxLimit: number;
    };
};
//# sourceMappingURL=index.d.ts.map