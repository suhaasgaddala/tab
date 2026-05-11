import { config } from "./config.js";
import { createApp } from "./app.js";
import { logger } from "./telemetry/logger.js";

const app = createApp(config);

app.listen(config.port, () => {
  logger.info({
    service: "voya",
    port: config.port,
    mock_ai: config.voya.mockAi
  }, "server started");
});
