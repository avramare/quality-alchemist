import http from "k6/http";
import { check, sleep } from "k6";
import { API_URL, TEST_USER } from "../helpers/config.js";

/**
 * Gradually increase the number of virtual users
 * (10 → 50 → 100 → 200) to identify the limits of the AUT.
 *Each level is held for 2 minutes before escalating to the next.
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
    { duration: '1m', target: 10 },   // Ramp-up to 10 users over 1 minute
    { duration: '2m', target: 10 },   // Stay at 10 users for 2 minutes
    { duration: '1m', target: 50 },   // Scale up to 50 users over 1 minute
    { duration: '2m', target: 50 },   // Stay at 50 users for 2 minutes
    { duration: '1m', target: 100 },  // Scale up to 100 users over 1 minute
    { duration: '2m', target: 100 },  // Stay at 100 users for 2 minutes
    { duration: '1m', target: 200 },  // Scale up to 200 users over 1 minute
    { duration: '2m', target: 200 },  // Stay at 200 users for 2 minutes
    { duration: '2m', target: 0 },    // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests < 1s
    http_req_failed: ['rate<0.10'],    // error rate < 10%
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

  sleep(0.5);

  // 3. Get users
  const usersRes = http.get(`${API_URL}/users`, {
    jar,
  });
  check(usersRes, {
    "users: status 200": (r) => r.status === 200,
  });

  sleep(0.5);

  // 4. Get notifications
  const notifRes = http.get(`${API_URL}/notifications`, {
    jar,
  });
  check(notifRes, {
    "notifications: status 200": (r) => r.status === 200,
  });

  sleep(0.5);

  // 5. Get contacts
  const contactsRes = http.get(`${API_URL}/contacts/username`, {
    jar,
  });
  check(contactsRes, {
    "contacts: status 200": (r) => r.status === 200,
    "contacts: response body is not empty": (r) => r.json().username === TEST_USER.username,
  });

  sleep(0.5);
}