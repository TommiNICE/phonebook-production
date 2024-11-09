const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection URI
const dbUri = process.env.MONGODB_URI

// Define your Mongoose schema and model
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Person.deleteMany({});
    console.log('Existing data cleared');

    // Read and parse the JSON file
    const dataPath = path.join(__dirname, 'test.peope.json');
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    const seedData = JSON.parse(jsonData);

    // Insert new data
    await Person.insertMany(seedData);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

// Execute the seed function
seedDatabase();