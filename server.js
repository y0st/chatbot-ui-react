import express from 'express';
import authRoutes from './auth.js';
import chatRoutes from './chat.js';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});