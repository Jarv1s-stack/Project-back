const express = require('express');
const cors = require('cors');
const path = require('path');
const eventRoutes = require('./routes/eventRoutes');
const messageRoutes = require('./routes/messageRoutes');
const shopRoutes = require('./routes/shopRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();

app.use(cors());
app.use(express.json());

require('./utils/cronJobs');
require('dotenv').config();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/users', userRoutes);




// Статус сервера
app.get('/', (req, res) => res.send('EventMate API is working'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
