import express, { Request, Response } from 'express';
import routes from './routes/routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(requestLogger);
// connectConsumer()
app.use('/api/v1', routes);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Service is running on port ' + PORT
    });
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Healthy'
    });
});

// Global Error Handler
app.use(errorHandler);

export default app;
