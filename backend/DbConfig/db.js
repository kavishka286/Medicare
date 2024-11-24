require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    if (!Database.instance) {
      mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Database connected successfully');
      })
      .catch(err => {
        console.error('Database connection error:', err);
      });

      Database.instance = this;
    }

    return Database.instance;
  }
}

module.exports = new Database(); // Export a single instance of the Database
