const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection URI
const dbUri = process.env.MONGODB_URI

// Define your Mongoose schema and model
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Function to clear the database
const clearDatabase = async () => {
  try {
  // Connect to MongoDB
  await mongoose.connect(dbUri, {
  });
  console.log('Connected to MongoDB');

  // Clear existing data
  await Person.deleteMany({});
  console.log('Existing data cleared');
  } catch (error) {
  console.error('Error clearing database:', error);
  } finally {
  // Close the connection
  mongoose.connection.close();
  }
};

// Execute the clear function
clearDatabase();
