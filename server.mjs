// import { randomBytes, scrypt as scryptCallback, createHash, timingSafeEqual } from "node:crypto";
// import { promisify } from "node:util";
// import { DatabaseSync } from "node:sqlite";
// import { createServer } from "node:http";
// import { mkdir, readFile, stat } from "node:fs/promises";
// import path from "node:path";
// import { fileURLToPath } from "node:url";

// const scrypt = promisify(scryptCallback);
// const ROOT = path.dirname(fileURLToPath(import.meta.url));
// const PORT = Number(process.env.PORT || 3000);
// const HOST = process.env.HOST || "127.0.0.1";
// const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
// const COOKIE_NAME = "english_sikho_session";
// const MAX_BODY_BYTES = 16 * 1024;
// const DATABASE_PATH = path.resolve(
//   ROOT,
//   process.env.AUTH_DB_PATH || "data/english-sikho.sqlite",
// );

// await mkdir(path.dirname(DATABASE_PATH), { recursive: true });
// const database = new DatabaseSync(DATABASE_PATH);
// database.exec(`
//   PRAGMA foreign_keys = ON;
//   PRAGMA journal_mode = WAL;
//   CREATE TABLE IF NOT EXISTS accounts (
//     id TEXT PRIMARY KEY,
//     full_name TEXT NOT NULL,
//     email TEXT NOT NULL,
//     email_normalized TEXT NOT NULL UNIQUE,
//     username TEXT NOT NULL,
//     username_normalized TEXT NOT NULL UNIQUE,
//     password_salt TEXT NOT NULL,
//     password_hash TEXT NOT NULL,
//     created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
//   );
//   CREATE TABLE IF NOT EXISTS sessions (
//     token_hash TEXT PRIMARY KEY,
//     account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
//     expires_at INTEGER NOT NULL,
//     created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
//   );
//   CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
// `);

// function sendJson(response, status, payload, headers = {}) {
//   response.writeHead(status, {
//     "Content-Type": "application/json; charset=utf-8",
//     "Cache-Control": "no-store",
//     "X-Content-Type-Options": "nosniff",
//     ...headers,
//   });
//   response.end(JSON.stringify(payload));
// }

// function sendError(response, status, code, message) {
//   sendJson(response, status, { code, error: message });
// }

// function sessionCookie(token, request) {
//   const secure =
//     request.socket.encrypted || process.env.COOKIE_SECURE === "true"
//       ? "; Secure"
//       : "";
//   return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
// }

// function expiredCookie(request) {
//   const secure =
//     request.socket.encrypted || process.env.COOKIE_SECURE === "true"
//       ? "; Secure"
//       : "";
//   return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
// }

// function parseCookies(header = "") {
//   return Object.fromEntries(
//     header
//       .split(";")
//       .map((part) => part.trim().split(/=(.*)/s, 2))
//       .filter(([name, value]) => name && value !== undefined),
//   );
// }

// function hashSessionToken(token) {
//   return createHash("sha256").update(token).digest("hex");
// }

// function publicAccount(row) {
//   return {
//     id: row.id,
//     fullName: row.full_name,
//     email: row.email,
//     username: row.username,
//   };
// }

// async function readJson(request) {
//   const chunks = [];
//   let size = 0;
//   for await (const chunk of request) {
//     size += chunk.length;
//     if (size > MAX_BODY_BYTES) {
//       const error = new Error("Request খুব বড়।");
//       error.status = 413;
//       error.code = "REQUEST_TOO_LARGE";
//       throw error;
//     }
//     chunks.push(chunk);
//   }

//   try {
//     const rawBody = Buffer.concat(chunks).toString("utf8");
//     const contentType = request.headers["content-type"]
//       ?.split(";", 1)[0]
//       .trim()
//       .toLowerCase();
//     const body =
//       contentType === "application/x-www-form-urlencoded"
//         ? Object.fromEntries(new URLSearchParams(rawBody))
//         : JSON.parse(rawBody);
//     if (!body || typeof body !== "object" || Array.isArray(body)) {
//       throw new Error("JSON body must be an object.");
//     }
//     return body;
//   } catch {
//     const error = new Error("সঠিক JSON তথ্য পাঠান।");
//     error.status = 400;
//     error.code = "INVALID_JSON";
//     throw error;
//   }
// }

// function validateCredentials({ fullName, email, username, password }) {
//   if (
//     typeof fullName !== "string" ||
//     typeof email !== "string" ||
//     typeof username !== "string" ||
//     typeof password !== "string"
//   ) {
//     return "সব তথ্য পূরণ করুন।";
//   }
//   if (!fullName.trim() || fullName.trim().length > 120) {
//     return "নাম ১ থেকে ১২০ অক্ষরের মধ্যে দিন।";
//   }
//   if (
//     email.trim().length > 254 ||
//     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
//   ) {
//     return "সঠিক email address দিন।";
//   }
//   const normalizedUsername = username.trim();
//   const isUsername =
//     /^[a-zA-Z0-9_]{3,30}$/.test(normalizedUsername) ||
//     (normalizedUsername.length <= 254 &&
//       /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedUsername));
//   if (!isUsername) {
//     return "Username ৩-৩০ অক্ষরের ইংরেজি অক্ষর, সংখ্যা বা _ হতে হবে, অথবা email address দিন।";
//   }
//   if (
//     password.length > 1024 ||
//     password.length < 8 ||
//     !/[A-Z]/.test(password) ||
//     !/[a-z]/.test(password) ||
//     !/[0-9]/.test(password) ||
//     !/[^A-Za-z0-9\s]/.test(password) ||
//     /\s/.test(password)
//   ) {
//     return "Password-এ ৮+ character, uppercase, lowercase, number ও special character দিন; space নয়।";
//   }
//   return null;
// }

// async function makePasswordHash(password, salt) {
//   return scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 });
// }

// async function createSession(accountId, response, request) {
//   const token = randomBytes(32).toString("base64url");
//   const tokenHash = hashSessionToken(token);
//   const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
//   database
//     .prepare(
//       "INSERT INTO sessions (token_hash, account_id, expires_at) VALUES (?, ?, ?)",
//     )
//     .run(tokenHash, accountId, expiresAt);
//   response.setHeader("Set-Cookie", sessionCookie(token, request));
//   database.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(Date.now() / 1000);
// }

// function currentAccount(request) {
//   const token = parseCookies(request.headers.cookie)[COOKIE_NAME];
//   if (!token) return null;
//   const row = database
//     .prepare(
//       `SELECT accounts.* FROM sessions
//        JOIN accounts ON accounts.id = sessions.account_id
//        WHERE sessions.token_hash = ? AND sessions.expires_at > ?`,
//     )
//     .get(hashSessionToken(token), Math.floor(Date.now() / 1000));
//   return row || null;
// }

// async function handleApi(request, response, url) {
//   if (request.method === "POST" && url.pathname === "/api/register") {
//     const body = await readJson(request);
//     const isFormSubmission =
//       request.headers["content-type"]
//         ?.split(";", 1)[0]
//         .trim()
//         .toLowerCase() === "application/x-www-form-urlencoded";
//     const invalidMessage = validateCredentials(body);
//     if (invalidMessage) {
//       return sendError(response, 400, "INVALID_INPUT", invalidMessage);
//     }
//     if (
//       Object.hasOwn(body, "confirmPassword") &&
//       body.confirmPassword !== body.password
//     ) {
//       return sendError(
//         response,
//         400,
//         "PASSWORDS_DO_NOT_MATCH",
//         "দুটি password মিলছে না।",
//       );
//     }

//     const email = body.email.trim();
//     const emailNormalized = email.toLowerCase();
//     const username = body.username.trim();
//     const usernameNormalized = username.toLowerCase();
//     const salt = randomBytes(16).toString("hex");
//     const passwordHash = await makePasswordHash(body.password, salt);
//     const id = randomBytes(16).toString("hex");

//     try {
//       database
//         .prepare(
//           `INSERT INTO accounts
//            (id, full_name, email, email_normalized, username, username_normalized, password_salt, password_hash)
//            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//         )
//         .run(
//           id,
//           body.fullName.trim(),
//           email,
//           emailNormalized,
//           username,
//           usernameNormalized,
//           salt,
//           passwordHash.toString("hex"),
//         );
//     } catch (error) {
//       if (
//         error.code === "ERR_SQLITE_ERROR" &&
//         error.message.startsWith("UNIQUE constraint failed: accounts.")
//       ) {
//         const duplicate = database
//           .prepare(
//             "SELECT email_normalized, username_normalized FROM accounts WHERE email_normalized = ? OR username_normalized = ?",
//           )
//           .get(emailNormalized, usernameNormalized);
//         const field =
//           duplicate?.email_normalized === emailNormalized ? "email" : "username";
//         return sendError(
//           response,
//           409,
//           `${field.toUpperCase()}_EXISTS`,
//           `এই ${field === "email" ? "email" : "username"} আগে থেকেই নিবন্ধিত।`,
//         );
//       }
//       throw error;
//     }

//     if (isFormSubmission) {
//       return redirect(response, "/login.html?registered=1");
//     }

//     return sendJson(response, 201, {
//       account: {
//         id,
//         fullName: body.fullName.trim(),
//         email,
//         username,
//       },
//     });
//   }

//   if (request.method === "POST" && url.pathname === "/api/login") {
//     const body = await readJson(request);
//     if (
//       typeof body.identifier !== "string" ||
//       typeof body.password !== "string" ||
//       body.identifier.trim().length > 254 ||
//       body.password.length > 1024
//     ) {
//       return sendError(response, 400, "INVALID_INPUT", "Email/username ও password দিন।");
//     }

//     const identifier = body.identifier.trim().toLowerCase();
//     const row = database
//       .prepare(
//         `SELECT * FROM accounts
//          WHERE email_normalized = ? OR username_normalized = ?`,
//       )
//       .get(identifier, identifier);
//     if (!row) {
//       return sendError(response, 401, "INVALID_CREDENTIALS", "Email/username অথবা password সঠিক নয়।");
//     }

//     const suppliedHash = await makePasswordHash(body.password, row.password_salt);
//     const savedHash = Buffer.from(row.password_hash, "hex");
//     if (
//       suppliedHash.length !== savedHash.length ||
//       !timingSafeEqual(suppliedHash, savedHash)
//     ) {
//       return sendError(response, 401, "INVALID_CREDENTIALS", "Email/username অথবা password সঠিক নয়।");
//     }

//     await createSession(row.id, response, request);
//     return sendJson(response, 200, { account: publicAccount(row) });
//   }

//   if (request.method === "GET" && url.pathname === "/api/me") {
//     const account = currentAccount(request);
//     if (!account) {
//       return sendError(response, 401, "NOT_AUTHENTICATED", "Login করা নেই।");
//     }
//     return sendJson(response, 200, { account: publicAccount(account) });
//   }

//   if (request.method === "POST" && url.pathname === "/api/logout") {
//     const token = parseCookies(request.headers.cookie)[COOKIE_NAME];
//     if (token) {
//       database
//         .prepare("DELETE FROM sessions WHERE token_hash = ?")
//         .run(hashSessionToken(token));
//     }
//     response.setHeader("Set-Cookie", expiredCookie(request));
//     return sendJson(response, 200, { ok: true });
//   }

//   return sendError(response, 404, "NOT_FOUND", "API endpoint পাওয়া যায়নি।");
// }

// const MIME_TYPES = {
//   ".css": "text/css; charset=utf-8",
//   ".html": "text/html; charset=utf-8",
//   ".ico": "image/x-icon",
//   ".js": "text/javascript; charset=utf-8",
//   ".json": "application/json; charset=utf-8",
//   ".svg": "image/svg+xml",
// };

// async function serveStatic(request, response, url) {
//   let pathname;
//   try {
//     pathname = decodeURIComponent(url.pathname);
//   } catch {
//     return sendError(response, 400, "INVALID_PATH", "সঠিক URL দিন।");
//   }

//   if (pathname === "/") pathname = "/login.html";
//   const filePath = path.resolve(ROOT, `.${pathname}`);
//   const relativePath = path.relative(ROOT, filePath);
//   const isPublicFile =
//     ["/login.html", "/register.html", "/index.html"].includes(pathname) ||
//     /^\/(script|style|assets)\/[^/]+(?:\/[^/]+)*$/.test(pathname);
//   if (
//     !isPublicFile ||
//     relativePath.startsWith("..") ||
//     path.isAbsolute(relativePath) ||
//     relativePath.split(path.sep).some((segment) =>
//       ["data", "node_modules", "supabase", ".git"].includes(segment),
//     )
//   ) {
//     return sendError(response, 404, "NOT_FOUND", "পেজ পাওয়া যায়নি।");
//   }

//   try {
//     const fileStat = await stat(filePath);
//     if (!fileStat.isFile()) {
//       return sendError(response, 404, "NOT_FOUND", "পেজ পাওয়া যায়নি।");
//     }
//     const content = await readFile(filePath);
//     response.writeHead(200, {
//       "Content-Type":
//         MIME_TYPES[path.extname(filePath).toLowerCase()] ||
//         "application/octet-stream",
//       "Cache-Control": "no-cache",
//       "X-Content-Type-Options": "nosniff",
//     });
//     response.end(content);
//   } catch (error) {
//     if (error.code === "ENOENT" || error.code === "ENOTDIR") {
//       return sendError(response, 404, "NOT_FOUND", "পেজ পাওয়া যায়নি।");
//     }
//     throw error;
//   }
// }

// function redirect(response, location) {
//   response.writeHead(302, {
//     Location: location,
//     "Cache-Control": "no-store",
//   });
//   response.end();
// }

// const server = createServer(async (request, response) => {
//   const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
//   try {
//     if (url.pathname.startsWith("/api/")) {
//       await handleApi(request, response, url);
//       return;
//     }
//     if (request.method !== "GET" && request.method !== "HEAD") {
//       return sendError(response, 405, "METHOD_NOT_ALLOWED", "এই method অনুমোদিত নয়।");
//     }

//     if (url.pathname === "/" || url.pathname === "/index.html") {
//       if (!currentAccount(request)) {
//         redirect(response, "/login.html?required=1");
//         return;
//       }
//       if (url.pathname === "/") {
//         redirect(response, "/index.html");
//         return;
//       }
//     }

//     await serveStatic(request, response, url);
//   } catch (error) {
//     if (response.headersSent) {
//       response.destroy(error);
//       return;
//     }
//     if (error.status) {
//       sendError(response, error.status, error.code || "BAD_REQUEST", error.message);
//       return;
//     }
//     console.error("Request failed:", error);
//     sendError(response, 500, "INTERNAL_ERROR", "Server-এ সমস্যা হয়েছে। আবার চেষ্টা করুন।");
//   }
// });

// // server.listen(PORT, HOST, () => {
// //   const address = server.address();
// //   console.log(`English Sikho API listening at http://${HOST}:${address.port}`);
// //   console.log(`SQLite database: ${DATABASE_PATH}`);
// // });

// export default server;















import {
  randomBytes,
  scrypt as scryptCallback,
  createHash,
  timingSafeEqual,
} from "node:crypto";

import { promisify } from "node:util";
import { DatabaseSync } from "node:sqlite";
import { createServer } from "node:http";
import { mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scrypt = promisify(scryptCallback);

const ROOT = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const COOKIE_NAME = "english_sikho_session";
const MAX_BODY_BYTES = 16 * 1024;

/*
 * Vercel/serverless environment:
 * - If AUTH_DB_PATH is provided, use it.
 * - Otherwise use local data folder.
 *
 * IMPORTANT:
 * SQLite on Vercel is not persistent across serverless instances.
 * For production, use an external database.
 */
const DATABASE_PATH = path.resolve(
  ROOT,
  process.env.AUTH_DB_PATH || "data/english-sikho.sqlite",
);

await mkdir(path.dirname(DATABASE_PATH), {
  recursive: true,
});

const database = new DatabaseSync(DATABASE_PATH);

/* =========================================================
   DATABASE
========================================================= */

database.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    email_normalized TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL,
    username_normalized TEXT NOT NULL UNIQUE,
    password_salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS sessions_expiry_idx
  ON sessions(expires_at);
`);

/* =========================================================
   RESPONSE HELPERS
========================================================= */

function sendJson(response, status, payload, headers = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });

  response.end(JSON.stringify(payload));
}

function sendError(response, status, code, message) {
  return sendJson(response, status, {
    code,
    error: message,
  });
}

/* =========================================================
   COOKIE HELPERS
========================================================= */

function isSecureRequest(request) {
  return (
    Boolean(request.socket?.encrypted) ||
    process.env.COOKIE_SECURE === "true"
  );
}

function sessionCookie(token, request) {
  const secure = isSecureRequest(request) ? "; Secure" : "";

  return (
    `${COOKIE_NAME}=${token}; ` +
    `Path=/; ` +
    `HttpOnly; ` +
    `SameSite=Lax; ` +
    `Max-Age=${SESSION_TTL_SECONDS}` +
    secure
  );
}

function expiredCookie(request) {
  const secure = isSecureRequest(request) ? "; Secure" : "";

  return (
    `${COOKIE_NAME}=; ` +
    `Path=/; ` +
    `HttpOnly; ` +
    `SameSite=Lax; ` +
    `Max-Age=0` +
    secure
  );
}

function parseCookies(header = "") {
  const cookies = {};

  for (const part of header.split(";")) {
    const separatorIndex = part.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const name = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();

    if (name) {
      cookies[name] = value;
    }
  }

  return cookies;
}

/* =========================================================
   SESSION
========================================================= */

function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function publicAccount(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    username: row.username,
  };
}

/* =========================================================
   BODY PARSER
========================================================= */

async function readJson(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;

    if (size > MAX_BODY_BYTES) {
      const error = new Error("Request body is too large.");
      error.status = 413;
      error.code = "REQUEST_TOO_LARGE";
      throw error;
    }

    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");

  if (!rawBody.trim()) {
    const error = new Error("Request body is empty.");
    error.status = 400;
    error.code = "INVALID_JSON";
    throw error;
  }

  try {
    const contentType =
      request.headers["content-type"]
        ?.split(";", 1)[0]
        .trim()
        .toLowerCase() || "";

    let body;

    if (contentType === "application/x-www-form-urlencoded") {
      body = Object.fromEntries(new URLSearchParams(rawBody));
    } else {
      body = JSON.parse(rawBody);
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      throw new Error("Body must be an object.");
    }

    return body;
  } catch {
    const error = new Error("সঠিক JSON তথ্য পাঠান।");
    error.status = 400;
    error.code = "INVALID_JSON";
    throw error;
  }
}

/* =========================================================
   VALIDATION
========================================================= */

function validateCredentials({
  fullName,
  email,
  username,
  password,
}) {
  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return "সব তথ্য পূরণ করুন।";
  }

  if (
    !fullName.trim() ||
    fullName.trim().length > 120
  ) {
    return "নাম ১ থেকে ১২০ অক্ষরের মধ্যে দিন।";
  }

  const normalizedEmail = email.trim();

  if (
    normalizedEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    return "সঠিক email address দিন।";
  }

  const normalizedUsername = username.trim();

  const validUsername =
    /^[a-zA-Z0-9_]{3,30}$/.test(normalizedUsername) ||
    (
      normalizedUsername.length <= 254 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedUsername,
      )
    );

  if (!validUsername) {
    return (
      "Username ৩-৩০ অক্ষরের ইংরেজি অক্ষর, " +
      "সংখ্যা বা _ হতে হবে, অথবা email address দিন।"
    );
  }

  if (
    password.length < 8 ||
    password.length > 1024 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9\s]/.test(password) ||
    /\s/.test(password)
  ) {
    return (
      "Password-এ ৮+ character, uppercase, lowercase, " +
      "number ও special character দিন; space নয়।"
    );
  }

  return null;
}

/* =========================================================
   PASSWORD
========================================================= */

async function makePasswordHash(password, salt) {
  return scrypt(password, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
  });
}

/* =========================================================
   SESSION CREATION
========================================================= */

async function createSession(
  accountId,
  response,
  request,
) {
  const token = randomBytes(32).toString("base64url");

  const tokenHash = hashSessionToken(token);

  const expiresAt =
    Math.floor(Date.now() / 1000) +
    SESSION_TTL_SECONDS;

  database
    .prepare(
      `
      INSERT INTO sessions
        (token_hash, account_id, expires_at)
      VALUES (?, ?, ?)
      `,
    )
    .run(
      tokenHash,
      accountId,
      expiresAt,
    );

  response.setHeader(
    "Set-Cookie",
    sessionCookie(token, request),
  );

  database
    .prepare(
      "DELETE FROM sessions WHERE expires_at <= ?",
    )
    .run(Math.floor(Date.now() / 1000));
}

/* =========================================================
   CURRENT USER
========================================================= */

function currentAccount(request) {
  const cookies = parseCookies(
    request.headers.cookie || "",
  );

  const token = cookies[COOKIE_NAME];

  if (!token) {
    return null;
  }

  const tokenHash = hashSessionToken(token);

  const row = database
    .prepare(
      `
      SELECT accounts.*
      FROM sessions
      JOIN accounts
        ON accounts.id = sessions.account_id
      WHERE sessions.token_hash = ?
        AND sessions.expires_at > ?
      `,
    )
    .get(
      tokenHash,
      Math.floor(Date.now() / 1000),
    );

  return row || null;
}

/* =========================================================
   API
========================================================= */

async function handleApi(
  request,
  response,
  url,
) {
  /* -------------------------------------------------------
     REGISTER
  ------------------------------------------------------- */

  if (
    request.method === "POST" &&
    url.pathname === "/api/register"
  ) {
    const body = await readJson(request);

    const contentType =
      request.headers["content-type"]
        ?.split(";", 1)[0]
        .trim()
        .toLowerCase() || "";

    const isFormSubmission =
      contentType ===
      "application/x-www-form-urlencoded";

    const invalidMessage =
      validateCredentials(body);

    if (invalidMessage) {
      return sendError(
        response,
        400,
        "INVALID_INPUT",
        invalidMessage,
      );
    }

    if (
      Object.hasOwn(body, "confirmPassword") &&
      body.confirmPassword !== body.password
    ) {
      return sendError(
        response,
        400,
        "PASSWORDS_DO_NOT_MATCH",
        "দুটি password মিলছে না।",
      );
    }

    const fullName = body.fullName.trim();
    const email = body.email.trim();
    const emailNormalized =
      email.toLowerCase();

    const username =
      body.username.trim();

    const usernameNormalized =
      username.toLowerCase();

    const salt =
      randomBytes(16).toString("hex");

    const passwordHash =
      await makePasswordHash(
        body.password,
        salt,
      );

    const id =
      randomBytes(16).toString("hex");

    try {
      database
        .prepare(
          `
          INSERT INTO accounts
          (
            id,
            full_name,
            email,
            email_normalized,
            username,
            username_normalized,
            password_salt,
            password_hash
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
        )
        .run(
          id,
          fullName,
          email,
          emailNormalized,
          username,
          usernameNormalized,
          salt,
          passwordHash.toString("hex"),
        );
    } catch (error) {
      if (
        error?.code === "ERR_SQLITE_ERROR" &&
        String(error?.message).includes(
          "UNIQUE constraint failed",
        )
      ) {
        const duplicate =
          database
            .prepare(
              `
              SELECT
                email_normalized,
                username_normalized
              FROM accounts
              WHERE
                email_normalized = ?
                OR username_normalized = ?
              `,
            )
            .get(
              emailNormalized,
              usernameNormalized,
            );

        const field =
          duplicate?.email_normalized ===
          emailNormalized
            ? "email"
            : "username";

        return sendError(
          response,
          409,
          `${field.toUpperCase()}_EXISTS`,
          `এই ${
            field === "email"
              ? "email"
              : "username"
          } আগে থেকেই নিবন্ধিত।`,
        );
      }

      throw error;
    }

    if (isFormSubmission) {
      return redirect(
        response,
        "/login.html?registered=1",
      );
    }

    return sendJson(
      response,
      201,
      {
        success: true,
        account: {
          id,
          fullName,
          email,
          username,
        },
      },
    );
  }

  /* -------------------------------------------------------
     LOGIN
  ------------------------------------------------------- */

  if (
    request.method === "POST" &&
    url.pathname === "/api/login"
  ) {
    const body = await readJson(request);

    if (
      typeof body.identifier !== "string" ||
      typeof body.password !== "string" ||
      body.identifier.trim().length === 0 ||
      body.identifier.trim().length > 254 ||
      body.password.length === 0 ||
      body.password.length > 1024
    ) {
      return sendError(
        response,
        400,
        "INVALID_INPUT",
        "Email/username ও password দিন।",
      );
    }

    const identifier =
      body.identifier.trim().toLowerCase();

    const row = database
      .prepare(
        `
        SELECT *
        FROM accounts
        WHERE
          email_normalized = ?
          OR username_normalized = ?
        `,
      )
      .get(
        identifier,
        identifier,
      );

    if (!row) {
      return sendError(
        response,
        401,
        "INVALID_CREDENTIALS",
        "Email/username অথবা password সঠিক নয়।",
      );
    }

    const suppliedHash =
      await makePasswordHash(
        body.password,
        row.password_salt,
      );

    const savedHash =
      Buffer.from(
        row.password_hash,
        "hex",
      );

    if (
      suppliedHash.length !==
        savedHash.length ||
      !timingSafeEqual(
        suppliedHash,
        savedHash,
      )
    ) {
      return sendError(
        response,
        401,
        "INVALID_CREDENTIALS",
        "Email/username অথবা password সঠিক নয়।",
      );
    }

    await createSession(
      row.id,
      response,
      request,
    );

    return sendJson(
      response,
      200,
      {
        success: true,
        account: publicAccount(row),
      },
    );
  }

  /* -------------------------------------------------------
     CURRENT USER
  ------------------------------------------------------- */

  if (
    request.method === "GET" &&
    url.pathname === "/api/me"
  ) {
    const account =
      currentAccount(request);

    if (!account) {
      return sendError(
        response,
        401,
        "NOT_AUTHENTICATED",
        "Login করা নেই।",
      );
    }

    return sendJson(
      response,
      200,
      {
        success: true,
        account: publicAccount(account),
      },
    );
  }

  /* -------------------------------------------------------
     LOGOUT
  ------------------------------------------------------- */

  if (
    request.method === "POST" &&
    url.pathname === "/api/logout"
  ) {
    const cookies = parseCookies(
      request.headers.cookie || "",
    );

    const token =
      cookies[COOKIE_NAME];

    if (token) {
      database
        .prepare(
          "DELETE FROM sessions WHERE token_hash = ?",
        )
        .run(
          hashSessionToken(token),
        );
    }

    response.setHeader(
      "Set-Cookie",
      expiredCookie(request),
    );

    return sendJson(
      response,
      200,
      {
        success: true,
        ok: true,
      },
    );
  }

  return sendError(
    response,
    404,
    "NOT_FOUND",
    "API endpoint পাওয়া যায়নি।",
  );
}

/* =========================================================
   STATIC FILES
========================================================= */

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

/* =========================================================
   STATIC FILE SERVER
========================================================= */

async function serveStatic(
  request,
  response,
  url,
) {
  let pathname;

  try {
    pathname = decodeURIComponent(
      url.pathname,
    );
  } catch {
    return sendError(
      response,
      400,
      "INVALID_PATH",
      "সঠিক URL দিন।",
    );
  }

  if (pathname === "/") {
    pathname = "/login.html";
  }

  const filePath = path.resolve(
    ROOT,
    `.${pathname}`,
  );

  const relativePath =
    path.relative(
      ROOT,
      filePath,
    );

  const publicPages = [
    "/login.html",
    "/register.html",
    "/index.html",
  ];

  const publicAsset =
    /^\/(script|style|assets)(\/[^/]+)+$/.test(
      pathname,
    );

  const isPublicFile =
    publicPages.includes(pathname) ||
    publicAsset;

  const blockedSegments = [
    "data",
    "node_modules",
    "supabase",
    ".git",
    ".env",
  ];

  const containsBlockedSegment =
    relativePath
      .split(path.sep)
      .some((segment) =>
        blockedSegments.includes(segment),
      );

  if (
    !isPublicFile ||
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath) ||
    containsBlockedSegment
  ) {
    return sendError(
      response,
      404,
      "NOT_FOUND",
      "পেজ পাওয়া যায়নি।",
    );
  }

  try {
    const fileStat =
      await stat(filePath);

    if (!fileStat.isFile()) {
      return sendError(
        response,
        404,
        "NOT_FOUND",
        "পেজ পাওয়া যায়নি।",
      );
    }

    const content =
      await readFile(filePath);

    response.writeHead(
      200,
      {
        "Content-Type":
          MIME_TYPES[
            path
              .extname(filePath)
              .toLowerCase()
          ] ||
          "application/octet-stream",

        "Cache-Control":
          "no-cache",

        "X-Content-Type-Options":
          "nosniff",
      },
    );

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    response.end(content);
  } catch (error) {
    if (
      error?.code === "ENOENT" ||
      error?.code === "ENOTDIR"
    ) {
      return sendError(
        response,
        404,
        "NOT_FOUND",
        "পেজ পাওয়া যায়নি।",
      );
    }

    throw error;
  }
}

/* =========================================================
   REDIRECT
========================================================= */

function redirect(
  response,
  location,
) {
  response.writeHead(
    302,
    {
      Location: location,
      "Cache-Control": "no-store",
    },
  );

  response.end();
}

/* =========================================================
   HTTP SERVER
========================================================= */

const server = createServer(
  async (request, response) => {
    const host =
      request.headers.host ||
      "localhost";

    let url;

    try {
      url = new URL(
        request.url || "/",
        `http://${host}`,
      );
    } catch {
      return sendError(
        response,
        400,
        "INVALID_URL",
        "সঠিক URL দিন।",
      );
    }

    try {
      /* ---------------------------------------------------
         API
      --------------------------------------------------- */

      if (
        url.pathname.startsWith("/api/")
      ) {
        await handleApi(
          request,
          response,
          url,
        );

        return;
      }

      /* ---------------------------------------------------
         Only GET / HEAD for pages
      --------------------------------------------------- */

      if (
        request.method !== "GET" &&
        request.method !== "HEAD"
      ) {
        return sendError(
          response,
          405,
          "METHOD_NOT_ALLOWED",
          "এই method অনুমোদিত নয়।",
          {
            Allow: "GET, HEAD",
          },
        );
      }

      /* ---------------------------------------------------
         Protected home page
      --------------------------------------------------- */

      if (
        url.pathname === "/" ||
        url.pathname === "/index.html"
      ) {
        const account =
          currentAccount(request);

        if (!account) {
          redirect(
            response,
            "/login.html?required=1",
          );

          return;
        }

        if (
          url.pathname === "/"
        ) {
          redirect(
            response,
            "/index.html",
          );

          return;
        }
      }

      /* ---------------------------------------------------
         Static
      --------------------------------------------------- */

      await serveStatic(
        request,
        response,
        url,
      );
    } catch (error) {
      if (response.headersSent) {
        response.destroy(error);
        return;
      }

      if (
        typeof error?.status === "number"
      ) {
        sendError(
          response,
          error.status,
          error.code ||
            "BAD_REQUEST",
          error.message ||
            "Request failed.",
        );

        return;
      }

      console.error(
        "Request failed:",
        error,
      );

      sendError(
        response,
        500,
        "INTERNAL_ERROR",
        "Server-এ সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      );
    }
  },
);

/* =========================================================
   LOCAL DEVELOPMENT
========================================================= */

/*
 * Vercel-এ server.listen() করা যাবে না।
 *
 * Local machine-এ:
 *   npm start
 *
 * চালালে manually listen করতে চাইলে নিচের অংশ
 * uncomment করা যাবে।
 *
 * Vercel deployment-এর জন্য comment রেখেই রাখবে.
 */

// if (process.env.NODE_ENV !== "production") {
//   server.listen(PORT, HOST, () => {
//     const address = server.address();
//
//     console.log(
//       `English Sikho API listening at http://${HOST}:${address.port}`,
//     );
//
//     console.log(
//       `SQLite database: ${DATABASE_PATH}`,
//     );
//   });
// }

/* =========================================================
   VERCEL EXPORT
========================================================= */

export default server;

