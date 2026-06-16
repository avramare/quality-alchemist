import http from "k6/http";
import { check, sleep } from "k6";
import { API_URL, TEST_USER } from "../helpers/config.js";

/**
 * Simulates a sudden jump from 0 to 100 virtual users to evaluate
 * how the app handles unexpected traffic spikes.
 * Maintains charge for 1 minute and then drops to 0.
 *
 * Endpoints exercised:
 * - POST /login (authentication)
 * - GET /transactions/public (public listing of transactions)
 * - GET /users (list of users)
 * - GET /notifications (user notifications)
 * - GET /contacts (user contacts)
 */

export const options = {
    stages: [
    { duration: '10s', target: 100 },  // sudden jump to 100 VUs
    { duration: '1m', target: 100 },   // maintain 100 VUs for 1 minute
    { duration: '10s', target: 0 },    // drop to 0 VUs
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% of requests < 3s
    http_req_failed: ['rate<0.15'],    // error rate < 15%
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
  });

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

  sleep(0.3);

  // 3. Get users
  const usersRes = http.get(`${API_URL}/users`, {
    jar,
  });
  check(usersRes, {
    "users: status 200": (r) => r.status === 200,
  });

  sleep(0.3);

  // 4. Get notifications
  const notifRes = http.get(`${API_URL}/notifications`, {
    jar,
  });
  check(notifRes, {
    "notifications: status 200": (r) => r.status === 200,
  });

  sleep(0.3);

  // 5. Get contacts
  const contactsRes = http.get(`${API_URL}/contacts`, {
    jar,
  });
  check(contactsRes, {
    "contacts: status 200": (r) => r.status === 200,
  });
}