import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Log request when it starts
    console.log(`[REQUEST START] ${req.method} ${req.originalUrl}`);

    // Only log headers/body if needed (useful for debugging connectivity/auth)
    if (req.headers['x-api-key']) {
        console.log(`- API Key present: ${req.headers['x-api-key'] === 'apple' ? '✅ matches' : '❌ unknown'}`);
    }

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[REQUEST END] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`);
    });

    next();
};
