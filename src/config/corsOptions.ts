// import { allowedOrigins } from "./allowedOrigins";
// import { CorsOptions } from "cors";

// export const corsOptions: CorsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.error(`Blocked by CORS: ${origin}`);
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type'],
//   credentials: true, // Allow cookies to be sent cross-origin
//   optionsSuccessStatus: 200,
// };


// import { allowedOrigins } from "./allowedOrigins";
// import { CorsOptions } from "cors";

// export const corsOptions: CorsOptions = {
//   origin: (origin: string | undefined, callback) => {
//     if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
//       callback(null, origin);
//     } else {
//       console.log()
//       callback(new Error("Not allowed by CORS"), false);
//     }
//   },
//   optionsSuccessStatus: 200,
// };

