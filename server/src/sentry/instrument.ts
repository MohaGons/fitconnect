// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://873791aea37396f60b6c3d584e7d936e@o4509640868102144.ingest.de.sentry.io/4509641018114128",
  sendDefaultPii: true,
});