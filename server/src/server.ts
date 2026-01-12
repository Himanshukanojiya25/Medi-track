import app from "./app";
import { ENV } from "./config/env";

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`🚀 MediTrack server running on port ${PORT}`);
});
