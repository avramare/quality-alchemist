import http from "k6/http";
import { check, sleep } from "k6";
import { API_URL, TEST_USER } from "../helpers/config.js";

/**
 * Long duration test at moderate load — catches memory leaks and degradation over time.
 * Keep in mind, test runs for ~35minutes!
 */
export const options = {
  stages: [
    { duration: "2m", target: 50 },
    { duration: "30m", target: 50 },
    { duration: "2m", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<1500", "p(99)<2500"],
  },
};

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

  sleep(1);

  // 3. Get user list
  const usersRes = http.get(`${API_URL}/users`, {
    jar,
  });
  check(usersRes, {
    "users: status 200": (r) => r.status === 200,
  });

  sleep(2);

  // 4. Get notifications
  const notifRes = http.get(`${API_URL}/notifications`, {
    jar,
  });
  check(notifRes, {
    "notifications: status 200": (r) => r.status === 200,
  });

  sleep(1);
}
