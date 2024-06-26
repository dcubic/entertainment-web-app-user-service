const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

class DatabaseConnecter {
  constructor() {
    this.mongoServer = null;
  }

  async connect() {
    if (process.env.NODE_ENV === "test") {
      this.mongoServer = await MongoMemoryServer.create();
      const uri = this.mongoServer.getUri();
      await mongoose.connect(uri);
    } else {
      const uri = process.env.MONGO_URI || "MATTERS_NOT";
      await mongoose.connect(uri);
    }
  }

  async disconnect() {
    await mongoose.disconnect();
    if (this.mongoServer) {
      await this.mongoServer.stop();
    }
  }

  async closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (this.mongoServer) {
      this.mongoServer.stop();
    }
  }

  async clearDatabase() {
    for (const key in mongoose.connection.collections) {
      await mongoose.connection.collections[key].deleteMany();
    }
  }
}

const dbConnector = new DatabaseConnecter();

module.exports = dbConnector;
