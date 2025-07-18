
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB config
const mongoUrl = process.env.MONGO_URL; // Change as needed
const dbName = process.env.DB_NAME || 'taskmanagement'; // Default to 'taskmanagement' if not set
if (!mongoUrl) {
  console.error('MongoDB connection string is not defined');
  process.exit(1);
}
let db;

MongoClient.connect(mongoUrl)
  .then(client => {
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });


// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await db.collection('Tasks').find({}).sort({ _id: -1 }).toArray();
    res.json(tasks);
  } catch (err) {
    console.error('GET /tasks error:', err);
    res.status(500).json({ error: 'Error reading data from MongoDB', details: err.message });
  }
});


// Add a new task
app.post('/tasks', async (req, res) => {
  try {
    const { userName, projectName, task, status, comments, date } = req.body;
    const newTask = { userName, projectName, task, status, comments, date };
    const result = await db.collection('Tasks').insertOne(newTask);
    res.json(result.ops ? result.ops[0] : newTask);
  } catch (err) {
    console.error('POST /tasks error:', err);
    res.status(500).json({ error: 'Error writing data to MongoDB', details: err.message });
  }
});


// Update a task
app.put('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { userName, projectName, task, status, comments, date } = req.body;
    const update = { $set: { userName, projectName, task, status, comments, date } };
    await db.collection('Tasks').updateOne({ _id: new ObjectId(id) }, update);
    const updatedTask = await db.collection('Tasks').findOne({ _id: new ObjectId(id) });
    res.json(updatedTask);
  } catch (err) {
    console.error('PUT /tasks/:id error:', err);
    res.status(500).json({ error: 'Error updating data in MongoDB', details: err.message });
  }
});


app.listen(5000, () => console.log('API running on http://localhost:5000'));
