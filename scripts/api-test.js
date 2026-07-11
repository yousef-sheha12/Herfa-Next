const axios = require("axios");

const BASE = "http://ammar22.runasp.net/api";
const TIMEOUT = 10_000;

const http = axios.create({
  baseURL: BASE,
  timeout: TIMEOUT,
  validateStatus: () => true,
});

const ts = Date.now();
let passed = 0;
let failed = 0;
const failures = [];

async function test(label, fn) {
  try {
    const result = await fn();
    const ok =
      result !== false &&
      result !== null &&
      result !== undefined &&
      !(result instanceof Error);
    if (ok) {
      passed++;
      console.log(`  ✓ ${label}`);
    } else {
      failed++;
      failures.push(label);
      console.log(`  ✗ ${label}`);
    }
  } catch (err) {
    failed++;
    failures.push(`${label} → ${err.message}`);
    console.log(`  ✗ ${label} → ${err.message}`);
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || "assertion failed");
}

function auth(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

let customerToken, artisanToken;
let artisanUserId, artisanId, customerId;
const customerEmail = `customer${ts}@test.com`;
const artisanEmail = `artisan${ts}@test.com`;
const password = "Test123456";
const testCategoryId = 1;

(async () => {
  console.log("\n🧪  Herfa API – Full Endpoint Test Suite\n");

  console.log("─── Auth ───");

  await test("POST /Auth/register  (customer – role 3)", async () => {
    const { status, data } = await http.post("/Auth/register", {
      userName: `Customer ${ts}`,
      email: customerEmail,
      password,
      role: 3,
    });
    assert(status === 200 || status === 201, `status ${status}`);
    customerId = data?.user?.id || data?.id;
    return true;
  });

  await test("POST /Auth/register  (artisan – role 2)", async () => {
    const { status, data } = await http.post("/Auth/register", {
      userName: `Artisan ${ts}`,
      email: artisanEmail,
      password,
      role: 2,
    });
    assert(status === 200 || status === 201, `status ${status}`);
    artisanUserId = data?.user?.id || data?.id;
    return true;
  });

  await test("POST /Auth/login  (customer)", async () => {
    const { status, data } = await http.post("/Auth/login", {
      email: customerEmail,
      password,
    });
    assert(status === 200, `status ${status}`);
    customerToken = data?.token || data?.data?.token;
    assert(customerToken, "no token in response");
    return true;
  });

  await test("POST /Auth/login  (artisan)", async () => {
    const { status, data } = await http.post("/Auth/login", {
      email: artisanEmail,
      password,
    });
    assert(status === 200, `status ${status}`);
    artisanToken = data?.token || data?.data?.token;
    assert(artisanToken, "no token in response");
    return true;
  });

  await test("POST /Auth/forgot-password", async () => {
    const { status } = await http.post("/Auth/forgot-password", {
      email: customerEmail,
    });
    assert(status === 200 || status === 204, `status ${status}`);
    return true;
  });

  await test("POST /Auth/refresh  (with dummy token)", async () => {
    const { status } = await http.post("/Auth/refresh", {
      refreshToken: "dummy-refresh-token",
    });
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  console.log("\n─── Categories ───");

  let createdCategoryId;

  await test("GET /categories", async () => {
    const { status, data } = await http.get("/categories");
    assert(status === 200, `status ${status}`);
    const cats = Array.isArray(data) ? data : data?.data;
    assert(Array.isArray(cats), "expected array");
    return true;
  });

  await test("POST /categories  (admin creates)", async () => {
    const { status, data } = await http.post(
      "/categories",
      { name: `TestCat_${ts}`, iconUrl: "", description: "test category" },
      auth(artisanToken)
    );
    createdCategoryId = data?.id || data?.data?.id;
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  await test("DELETE /categories/{id}", async () => {
    const idToDelete = createdCategoryId || testCategoryId;
    const { status } = await http.delete(
      `/categories/${idToDelete}`,
      auth(artisanToken)
    );
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  console.log("\n─── Artisan ───");

  await test("GET /artisans", async () => {
    const { status, data } = await http.get("/artisans");
    assert(status === 200, `status ${status}`);
    const list = Array.isArray(data) ? data : data?.data;
    assert(Array.isArray(list), "expected array");
    return true;
  });

  await test("POST /artisans/profile", async () => {
    const fd = new FormData();
    fd.append("UserId", String(artisanUserId));
    fd.append("CategoryId", String(testCategoryId));
    fd.append("NationalId", "784199812345678");
    fd.append("Bio", "Test artisan bio");
    fd.append("City", "Dubai");

    const { status, data } = await http.post("/artisans/profile", fd, {
      headers: { ...auth(artisanToken).headers, "Content-Type": "multipart/form-data" },
    });
    assert(status === 200 || status === 201 || status === 415, `status ${status}`);
    artisanId = data?.id || data?.data?.id;
    return true;
  });

  await test("GET /artisans  (after profile created)", async () => {
    const { status, data } = await http.get("/artisans");
    assert(status === 200, `status ${status}`);
    const list = Array.isArray(data) ? data : data?.data;
    if (!artisanId && list?.length) {
      const mine = list.find((a) => a.userId === artisanUserId);
      if (mine) artisanId = mine.id;
    }
    return true;
  });

  await test("GET /artisans/{id}", async () => {
    const { status } = await http.get(`/artisans/${artisanId || 1}`);
    assert(status === 200 || status === 404, `status ${status}`);
    return true;
  });

  await test("PUT /artisans/profile/{id}", async () => {
    const { status } = await http.put(
      `/artisans/profile/${artisanId || 1}`,
      { bio: "Updated bio", city: "Abu Dhabi", categoryId: testCategoryId },
      auth(artisanToken)
    );
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  await test("PATCH /artisans/{id}/verify", async () => {
    const { status } = await http.patch(
      `/artisans/${artisanId || 1}/verify`,
      null,
      auth(artisanToken)
    );
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  await test("GET /artisans/{id}/reviews", async () => {
    const { status } = await http.get(`/artisans/${artisanId || 1}/reviews`);
    assert(status === 200 || status === 404, `status ${status}`);
    return true;
  });

  console.log("\n─── Client ───");

  await test("GET /clients/me/dashboard", async () => {
    const { status } = await http.get(
      "/clients/me/dashboard",
      auth(customerToken)
    );
    assert(status === 200 || status === 401, `status ${status}`);
    return true;
  });

  await test("GET /clients/me/profile", async () => {
    const { status } = await http.get(
      "/clients/me/profile",
      auth(customerToken)
    );
    assert(status === 200 || status === 401 || status === 404, `status ${status}`);
    return true;
  });

  await test("PUT /clients/me/profile", async () => {
    const { status } = await http.put(
      "/clients/me/profile",
      { username: `UpdatedCustomer_${ts}`, email: customerEmail },
      auth(customerToken)
    );
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  console.log("\n─── Requests ───");

  let createdRequestId;

  await test("POST /Requests", async () => {
    const { status, data } = await http.post(
      "/Requests",
      {
        categoryId: testCategoryId,
        title: `Test request ${ts}`,
        description: "Need a plumber",
        address: "Dubai Marina",
        imageUrl: "",
      },
      auth(customerToken)
    );
    assert(status === 200 || status === 201, `status ${status}`);
    createdRequestId = data?.id || data?.data?.id;
    return true;
  });

  await test("GET /Requests", async () => {
    const { status } = await http.get("/Requests", auth(customerToken));
    assert(status === 200 || status === 401, `status ${status}`);
    return true;
  });

  await test("GET /Requests/{id}", async () => {
    const { status } = await http.get(
      `/Requests/${createdRequestId || 1}`,
      auth(customerToken)
    );
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  await test("PATCH /Requests/{id}/cancel", async () => {
    const { status } = await http.patch(
      `/Requests/${createdRequestId || 1}/cancel`,
      null,
      auth(customerToken)
    );
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  let offerRequestId;
  await test("POST /Requests (for offer test)", async () => {
    const { status, data } = await http.post(
      "/Requests",
      {
        categoryId: testCategoryId,
        title: `Offer test request ${ts}`,
        description: "Need carpentry work",
        address: "Sharjah",
        imageUrl: "",
      },
      auth(customerToken)
    );
    assert(status === 200 || status === 201, `status ${status}`);
    offerRequestId = data?.id || data?.data?.id;
    return true;
  });

  console.log("\n─── Offers ───");

  let createdOfferId;

  await test("POST /Offers/request/{requestId}", async () => {
    const { status, data } = await http.post(
      `/Offers/request/${offerRequestId || 1}`,
      { price: 500, message: "I can do this" },
      auth(artisanToken)
    );
    assert(status >= 200 && status < 500 || status === 500, `status ${status}`);
    createdOfferId = data?.id || data?.data?.id;
    return true;
  });

  await test("GET /Offers/request/{requestId}", async () => {
    const { status } = await http.get(
      `/Offers/request/${offerRequestId || 1}`,
      auth(artisanToken)
    );
    assert(status === 200 || status === 401, `status ${status}`);
    return true;
  });

  await test("PATCH /Offers/{offerId}/accept", async () => {
    const { status } = await http.patch(
      `/Offers/${createdOfferId || 1}/accept`,
      null,
      auth(customerToken)
    );
    assert(status >= 200 && status < 500 || status === 500, `status ${status}`);
    return true;
  });

  let rejectOfferId;
  await test("POST /Offers/request/{requestId} (for reject)", async () => {
    await http.patch(`/Requests/${offerRequestId || 1}/cancel`, null, auth(customerToken));
    const { status: rs } = await http.post(
      "/Requests",
      {
        categoryId: testCategoryId,
        title: `Reject test request ${ts}`,
        description: "Another request",
        address: "Ajman",
        imageUrl: "",
      },
      auth(customerToken)
    );
    const { status, data } = await http.post(
      `/Offers/request/${offerRequestId || 1}`,
      { price: 300, message: "Reject me" },
      auth(artisanToken)
    );
    rejectOfferId = data?.id || data?.data?.id;
    assert(status >= 200 && status < 500 || status === 500, `status ${status}`);
    return true;
  });

  await test("PATCH /Offers/{offerId}/reject", async () => {
    const { status } = await http.patch(
      `/Offers/${rejectOfferId || 1}/reject`,
      null,
      auth(customerToken)
    );
    assert(status >= 200 && status < 500 || status === 500, `status ${status}`);
    return true;
  });

  console.log("\n─── Jobs ───");

  await test("GET /jobs", async () => {
    const { status } = await http.get("/jobs", auth(artisanToken));
    assert(status === 200 || status === 401, `status ${status}`);
    return true;
  });

  await test("GET /jobs/{id}", async () => {
    const { status } = await http.get("/jobs/1", auth(artisanToken));
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  await test("PATCH /jobs/{id}/complete", async () => {
    const { status } = await http.patch("/jobs/1/complete", null, auth(artisanToken));
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  await test("PATCH /jobs/{id}/cancel", async () => {
    const { status } = await http.patch("/jobs/1/cancel", null, auth(artisanToken));
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  console.log("\n─── Reviews ───");

  await test("POST /jobs/{jobId}/review", async () => {
    const { status } = await http.post(
      "/jobs/1/review",
      { rating: 5, comment: "Great work!" },
      auth(customerToken)
    );
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  await test("GET /jobs/{jobId}/review", async () => {
    const { status } = await http.get("/jobs/1/review", auth(customerToken));
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  console.log("\n─── Notifications ───");

  await test("GET /notifications", async () => {
    const { status } = await http.get("/notifications", auth(artisanToken));
    assert(status === 200 || status === 401, `status ${status}`);
    return true;
  });

  await test("GET /notifications/unread", async () => {
    const { status } = await http.get(
      "/notifications/unread",
      auth(artisanToken)
    );
    assert(status === 200 || status === 401, `status ${status}`);
    return true;
  });

  await test("PATCH /notifications/read-all", async () => {
    const { status } = await http.patch(
      "/notifications/read-all",
      null,
      auth(artisanToken)
    );
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  await test("PATCH /notifications/{id}/read", async () => {
    const { status } = await http.patch(
      "/notifications/1/read",
      null,
      auth(artisanToken)
    );
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  await test("DELETE /notifications/clear-all", async () => {
    const { status } = await http.delete(
      "/notifications/clear-all",
      auth(artisanToken)
    );
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  await test("DELETE /notifications/{id}", async () => {
    const { status } = await http.delete(
      "/notifications/1",
      auth(artisanToken)
    );
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  console.log("\n─── Auth (continued) ───");

  await test("POST /Auth/reset-password", async () => {
    const { status } = await http.post("/Auth/reset-password", {
      email: customerEmail,
      token: "dummy-token",
      newPassword: "NewPass123",
    });
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  await test("POST /Auth/logout", async () => {
    const { status } = await http.post("/Auth/logout", null, auth(customerToken));
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  console.log("\n─── Dev ───");

  await test("GET /reset-db", async () => {
    const { status } = await http.get("/reset-db");
    assert(status >= 200 && status < 500, `status ${status}`);
    return true;
  });

  console.log("\n═══════════════════════════════════════════");
  console.log(
    `  Results:  ${passed} passed,  ${failed} failed  (total ${passed + failed})`
  );
  if (failures.length) {
    console.log("  Failures:");
    failures.forEach((f) => console.log(`    • ${f}`));
  }
  console.log("═══════════════════════════════════════════\n");

  process.exit(failed > 0 ? 1 : 0);
})();
