import app from "./app";
import { ENV } from "./config/env";
import { connectDB } from "./config/mongoose";

const PORT = ENV.PORT;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 MediTrack server running on port ${PORT}`);
  });
};

startServer();
