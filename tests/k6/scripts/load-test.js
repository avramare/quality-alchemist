import http from "k6/http";
import { check, sleep } from "k6";
import { API_URL, TEST_USER } from "../helpers/config.js";

/**
 * Simulates a normal loading scenario with ramp-up to 20 virtual users,
 * Steady state for 3 minutes and gradual ramp-down.
 *
 * Endpoints exercised:
 * - POST /login (authentication)
 * - GET /transactions/public (public listing of transactions)
 * - GET /users (list of users)
 * - GET /notifications (user notifications)
 */

export const options = {
  stages: [
    { duration: "1m", target: 20 }, // Ramp-up to 20 users over 1 minute,
    { duration: "3m", target: 20 }, // Stay at 20 users for 3 minutes
    { duration: "1m", target: 0 }, // Ramp-down to 0 users over 1 minute
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // 95% of requests should be below 2000ms
    http_req_failed: ["rate<0.05"], // HTTP request failure rate should be less than 5%
  },
};

/**
 * Helper function that logs in and returns session cookies.
 */
function login() {
  const loginPayload = JSON.stringify({
    username: TEST_USER.username,
    password: TEST_USER.password,
    type: "LOGIN",
  });

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  const loginRes = http.post(`${API_URL}/login`, loginPayload, params);

  check(loginRes, {
    "login: status 200": (r) => r.status === 200,
    "login: has session cookie": (r) =>
      r.headers["Set-Cookie"] !== undefined && r.headers["Set-Cookie"] !== "",
  });

  // Return the cookie jar for authenticated requests
  return http.cookieJar();
}

export default function () {
  // 1. Authenticate
  const jar = login();

  // 2. Get public transactions
  const txPublicRes = http.get(`${API_URL}/transactions/public`, {
    jar,
  });
  check(txPublicRes, {
    "transactions public: status 200": (r) => r.status === 200,
  });

  sleep(1);

  // 3. Get user list
  const usersRes = http.get(`${API_URL}/users`, {
    jar,
  });
  check(usersRes, {
    "users: status 200": (r) => r.status === 200,
  });

  sleep(1);

  // 4. Get notifications
  const notifRes = http.get(`${API_URL}/notifications`, {
    jar,
  });
  check(notifRes, {
    "notifications: status 200": (r) => r.status === 200,
  });

  sleep(1);
}
