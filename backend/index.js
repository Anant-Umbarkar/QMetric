require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const fileRouter = require('./routes/file');
const usersRouter = require('./routes/auth');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

db.once('open', () => {
  console.log('Connected to MongoDB');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001','https://q-metric-3k72.vercel.app/'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));  
app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  // Routes
  app.use('/upload', fileRouter);
  app.use('/auth', usersRouter);

  // 404 handler
  app.use((req, res, next) => {
    next(createError(404));
  });

  // Error handler
  app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json({ error: 'An error occurred' }); 

  });

  // Start server
  const PORT = process.env.PORT || 80;
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
});

module.exports = app;
