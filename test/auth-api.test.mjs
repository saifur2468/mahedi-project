import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { once } from "node:events";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function startServer(databasePath) {
  const child = spawn(process.execPath, ["server.mjs"], {
    cwd: projectRoot,
    env: {
      ...process.env,
      AUTH_DB_PATH: databasePath,
      HOST: "127.0.0.1",
      PORT: "0",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    output += chunk;
  });
  child.stderr.on("data", (chunk) => {
    output += chunk;
  });

  const address = await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error(`Server startup timed out: ${output}`)),
      10000,
    );
    const checkOutput = () => {
      const match = output.match(/listening at http:\/\/127\.0\.0\.1:(\d+)/);
      if (match) {
        clearTimeout(timeout);
        resolve(`http://127.0.0.1:${match[1]}`);
      }
    };
    child.stdout.on("data", checkOutput);
    child.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Server exited (${code}): ${output}`));
    });
    checkOutput();
  });

  return {
    address,
    child,
    async stop() {
      if (child.exitCode !== null) return;
      child.kill();
      await once(child, "exit");
    },
  };
}

async function jsonRequest(address, route, options = {}) {
  const response = await fetch(`${address}${route}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.cookie ? { Cookie: options.cookie } : {}),
      ...options.headers,
    },
  });
  return { response, body: await response.json() };
}

test("SQLite auth API registers, logs in, persists accounts, and revokes sessions", async () => {
  const temporaryDirectory = await mkdtemp(
    path.join(tmpdir(), "english-sikho-auth-"),
  );
  const databasePath = path.join(temporaryDirectory, "accounts.sqlite");
  let server;

  try {
    server = await startServer(databasePath);

    const home = await fetch(server.address, { redirect: "manual" });
    assert.equal(home.status, 302);
    assert.equal(home.headers.get("location"), "/login.html?required=1");

    const protectedDashboard = await fetch(`${server.address}/index.html`, {
      redirect: "manual",
    });
    assert.equal(protectedDashboard.status, 302);
    assert.equal(
      protectedDashboard.headers.get("location"),
      "/login.html?required=1",
    );

    const loginPage = await fetch(`${server.address}/login.html`);
    assert.equal(loginPage.status, 200);
    const loginHtml = await loginPage.text();
    assert.match(loginHtml, /<title>Login - English/);
    assert.match(loginHtml, /Registration complete/);
    assert.match(loginHtml, /searchParams\.has\("registered"\)/);
    const registrationPage = await fetch(`${server.address}/register.html`);
    assert.equal(registrationPage.status, 200);
    const registrationHtml = await registrationPage.text();
    assert.match(registrationHtml, /action="\/api\/register"/);
    assert.match(registrationHtml, /method="post"/);
    assert.match(registrationHtml, /event\.preventDefault\(\)/);
    assert.match(registrationHtml, /login\.html\?registered=1/);

    const sourceFile = await fetch(`${server.address}/server.mjs`);
    assert.equal(sourceFile.status, 404);
    const privateDatabase = await fetch(`${server.address}/data/accounts.sqlite`);
    assert.equal(privateDatabase.status, 404);

    const credentials = {
      fullName: "Example Learner",
      email: "learner@example.test",
      username: "example_learner",
      password: "GoodPass123!",
    };
    const registration = await jsonRequest(server.address, "/api/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    assert.equal(registration.response.status, 201);
    assert.equal(registration.body.account.username, credentials.username);
    assert.equal("password" in registration.body.account, false);

    const formCredentials = {
      fullName: "Form Learner",
      email: "form-learner@example.test",
      username: "form_learner",
      password: "GoodPass123!",
      confirmPassword: "GoodPass123!",
    };
    const formRegistration = await fetch(`${server.address}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        ...formCredentials,
        confirmPassword: "DifferentPass123!",
      }),
      redirect: "manual",
    });
    assert.equal(formRegistration.status, 400);
    assert.equal(
      (await formRegistration.json()).code,
      "PASSWORDS_DO_NOT_MATCH",
    );

    const successfulFormRegistration = await fetch(
      `${server.address}/api/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formCredentials),
        redirect: "manual",
      },
    );
    assert.equal(successfulFormRegistration.status, 302);
    assert.equal(
      successfulFormRegistration.headers.get("location"),
      "/login.html?registered=1",
    );

    const emailUsernameCredentials = {
      fullName: "Email Username Learner",
      email: "email-username@example.test",
      username: "email-username@example.test",
      password: "GoodPass123!",
    };
    const emailUsernameRegistration = await jsonRequest(
      server.address,
      "/api/register",
      {
        method: "POST",
        body: JSON.stringify(emailUsernameCredentials),
      },
    );
    assert.equal(emailUsernameRegistration.response.status, 201);
    assert.equal(
      emailUsernameRegistration.body.account.username,
      emailUsernameCredentials.username,
    );

    const emailUsernameLogin = await jsonRequest(server.address, "/api/login", {
      method: "POST",
      body: JSON.stringify({
        identifier: emailUsernameCredentials.username,
        password: emailUsernameCredentials.password,
      }),
    });
    assert.equal(emailUsernameLogin.response.status, 200);
    assert.equal(
      emailUsernameLogin.body.account.email,
      emailUsernameCredentials.email,
    );

    const duplicateEmail = await jsonRequest(server.address, "/api/register", {
      method: "POST",
      body: JSON.stringify({
        ...credentials,
        username: "different_name",
      }),
    });
    assert.equal(duplicateEmail.response.status, 409);
    assert.equal(duplicateEmail.body.code, "EMAIL_EXISTS");

    const duplicateUsername = await jsonRequest(server.address, "/api/register", {
      method: "POST",
      body: JSON.stringify({
        ...credentials,
        email: "another@example.test",
      }),
    });
    assert.equal(duplicateUsername.response.status, 409);
    assert.equal(duplicateUsername.body.code, "USERNAME_EXISTS");

    const wrongPassword = await jsonRequest(server.address, "/api/login", {
      method: "POST",
      body: JSON.stringify({
        identifier: credentials.email,
        password: "WrongPass123!",
      }),
    });
    assert.equal(wrongPassword.response.status, 401);

    const login = await jsonRequest(server.address, "/api/login", {
      method: "POST",
      body: JSON.stringify({
        identifier: credentials.username.toUpperCase(),
        password: credentials.password,
      }),
    });
    assert.equal(login.response.status, 200);
    const cookie = login.response.headers.get("set-cookie").split(";", 1)[0];
    assert.match(login.response.headers.get("set-cookie"), /HttpOnly/);
    assert.match(login.response.headers.get("set-cookie"), /SameSite=Lax/);
    assert.equal(login.body.account.email, credentials.email);

    const currentAccount = await jsonRequest(server.address, "/api/me", {
      cookie,
    });
    assert.equal(currentAccount.response.status, 200);
    assert.equal(currentAccount.body.account.fullName, credentials.fullName);

    const protectedAfterLogin = await fetch(
      `${server.address}/index.html`,
      {
        headers: { Cookie: cookie },
        redirect: "manual",
      },
    );
    assert.equal(protectedAfterLogin.status, 200);
    assert.match(await protectedAfterLogin.text(), /id="learner-name"/);

    const rootAfterLogin = await fetch(server.address, {
      headers: { Cookie: cookie },
      redirect: "manual",
    });
    assert.equal(rootAfterLogin.status, 302);
    assert.equal(rootAfterLogin.headers.get("location"), "/index.html");

    await server.stop();
    server = await startServer(databasePath);
    const persistedLogin = await jsonRequest(server.address, "/api/login", {
      method: "POST",
      body: JSON.stringify({
        identifier: credentials.email.toUpperCase(),
        password: credentials.password,
      }),
    });
    assert.equal(persistedLogin.response.status, 200);

    const logout = await jsonRequest(server.address, "/api/logout", {
      method: "POST",
      body: "{}",
      cookie,
    });
    assert.equal(logout.response.status, 200);
    const signedOut = await jsonRequest(server.address, "/api/me", { cookie });
    assert.equal(signedOut.response.status, 401);

    await server.stop();
    server = null;
    const database = new DatabaseSync(databasePath);
    const savedAccount = database
      .prepare(
        "SELECT password_hash FROM accounts WHERE email_normalized = ?",
      )
      .get(credentials.email);
    assert.ok(savedAccount.password_hash);
    assert.notEqual(savedAccount.password_hash, credentials.password);
    database.close();
  } finally {
    if (server) await server.stop();
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});
