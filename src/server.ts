import app from "./app";
import { PostgresDataSource } from "./config/PostgresDataSource";




const initializeDatabase = async () => {
    try {
        console.log("Initializing database...")
        await PostgresDataSource.initialize();
        console.log("Database connected...");
    } catch (error: any) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    }
}


app.listen(3000, () => {
    initializeDatabase();
    console.log("Server running on port 3000");
});

// Process-level error logging
process.on('uncaughtException', (error) => {
    console.error('CRITICAL: Uncaught Exception detected!');
    console.error(error);
    // In production, you might want to perform a graceful shutdown here
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL: Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
});