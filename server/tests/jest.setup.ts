import { connectDB, disconnectDB } from "../src/config/mongoose";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});
