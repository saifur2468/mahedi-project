const API_BASE = "/api";

function isConfigured() {
  return window.location.protocol === "http:" || window.location.protocol === "https:";
}

function getConfigurationError() {
  return "Login API চালু নেই। terminal-এ npm start চালিয়ে http://localhost:3000 খুলুন।";
}

function isPasswordValid(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9\s]/.test(password) &&
    !/\s/.test(password)
  );
}

function togglePasswordVisibility(button) {
  const input = document.getElementById(button.dataset.passwordTarget);
  const showPassword = input.type === "password";
  input.type = showPassword ? "text" : "password";
  button.setAttribute("aria-pressed", String(showPassword));
  button.setAttribute(
    "aria-label",
    showPassword ? "Hide password" : "Show password",
  );
  button
    .querySelector("[data-eye-open]")
    .classList.toggle("hidden", showPassword);
  button
    .querySelector("[data-eye-closed]")
    .classList.toggle("hidden", !showPassword);
}

async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "same-origin",
    });
  } catch (cause) {
    const error = new Error(
      "Login API-তে যোগাযোগ করা যাচ্ছে না। terminal-এ npm start চালিয়ে http://localhost:3000 খুলুন।",
      { cause },
    );
    error.code = "API_UNAVAILABLE";
    throw error;
  }

  if (!response.headers.get("content-type")?.includes("application/json")) {
    const error = new Error(
      "Node API পাওয়া যায়নি। terminal-এ npm start চালিয়ে http://localhost:3000 খুলুন।",
    );
    error.code = "API_UNAVAILABLE";
    throw error;
  }

  let result;
  try {
    result = await response.json();
  } catch (cause) {
    const error = new Error("Server থেকে সঠিক উত্তর পাওয়া যায়নি.", { cause });
    error.code = "INVALID_SERVER_RESPONSE";
    throw error;
  }

  if (!response.ok) {
    const error = new Error(result.error || "Request সম্পন্ন হয়নি।");
    error.code = result.code || "API_ERROR";
    error.status = response.status;
    throw error;
  }
  return result;
}

async function registerAccount(account) {
  const result = await apiRequest("/register", {
    method: "POST",
    body: JSON.stringify(account),
  });
  return { ok: true, account: result.account };
}

async function authenticateAccount(identifier, password) {
  const result = await apiRequest("/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
  return result.account;
}

async function getCurrentAccount() {
  try {
    const result = await apiRequest("/me");
    return result.account;
  } catch (error) {
    if (error.status === 401) return null;
    throw error;
  }
}

async function signOut() {
  await apiRequest("/logout", { method: "POST", body: "{}" });
}

window.EnglishSikhoAuth = {
  isConfigured,
  getConfigurationError,
  isPasswordValid,
  togglePasswordVisibility,
  registerAccount,
  authenticateAccount,
  getCurrentAccount,
  signOut,
};
