import mongoose from "mongoose";
const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@mongodb-jagrath.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`;

if (!connectionString) {
  throw new Error("Please define the env variables inside .env.local");
}

const connectDB = async () => {
  if (mongoose.connection?.readyState >= 1) {
    console.log("--already connected to MongoDB---");
    return;
  }

  try {
    await mongoose.connect(connectionString);
    console.log("--Connected to MONGODB--");
  } catch (error) {
    console.log("could not connect to MongoDB ", error);
  }
};

export default connectDB;
