import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/AppError';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;

    // Detailed logging for ALL errors
    console.error(`\n[!!!] GLOBAL ERROR CAUGHT [!!!]`);
    console.error(`- Timestamp: ${new Date().toISOString()}`);
    console.error(`- Request: ${req.method} ${req.originalUrl}`);
    console.error(`- Client IP: ${req.ip}`);

    // Log body for debugging (avoiding sensitive info if possible)
    if (req.body && Object.keys(req.body).length > 0) {
        const safeBody = { ...req.body };
        if (safeBody.otp) safeBody.otp = '******';
        if (safeBody.password) safeBody.password = '******';
        console.error(`- Body: ${JSON.stringify(safeBody)}`);
    }

    console.error(`- Error Message: ${err.message}`);

    if (err.stack) {
        console.error(`- Stack Trace: \n${err.stack}`);
    }
    console.error(`[!!!] END GLOBAL ERROR LOG [!!!]\n`);

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
