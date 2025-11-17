import express from 'express';
import { Request, Response } from 'express';
import routes from './routes/routes';
import { connectConsumer } from './kafka/consumer';

const app = express();
const PORT = 3000;

app.use(express.json());
connectConsumer()
app.use('/api/v1', routes);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Service is running on port ' + PORT
    });
});

export default app;
