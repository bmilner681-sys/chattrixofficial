import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { setupSocketHandlers } from './handlers/socketHandlers.js';
import { initializeDatabase } from './database/init.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Socket.IO handlers
io.on('connection', (socket: Socket) => {
  setupSocketHandlers(socket, io);
});

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    // Initialize database
    await initializeDatabase();
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 Chattrix server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
