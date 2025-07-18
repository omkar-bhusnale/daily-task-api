

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME || 'taskmanagement';
if (!mongoUrl) {
  console.error('MongoDB connection string is not defined');
  process.exit(1);
}

const taskController = require('./controllers/taskController');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middlewares/errorHandler');

MongoClient.connect(mongoUrl)
  .then(client => {
    const db = client.db(dbName);
    taskController.setDB(db);
    console.log('Connected to MongoDB');
    // Register routes after DB is set
    app.use('/tasks', taskRoutes);
    // Error handler middleware
    app.use(errorHandler);
    app.listen(5000, () => console.log(`API running on http://localhost:5000`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
