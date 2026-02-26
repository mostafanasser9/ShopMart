const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ecommerce.routemisr.com/api/v1";

async function request(path: string, opts: { method?: string; body?: any; token?: string } = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.token) headers["token"] = opts.token;

  const res = await fetch(API_BASE + path, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText || "API error");
  }

  try {
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function signup(data: { name?: string; email: string; password: string }) {
  return request("/auth/signup", { method: "POST", body: data });
}

export async function signin(data: { email: string; password: string }) {
  return request("/auth/signin", { method: "POST", body: data });
}

export async function forgotPassword(data: { email: string }) {
  return request("/auth/forgotPassword", { method: "POST", body: data });
}

export async function verifyResetCode(data: { resetCode: string }) {
  return request("/auth/verifyResetCode", { method: "POST", body: data });
}

export async function resetPassword(data: { email?: string; resetCode?: string; password: string }) {
  return request("/auth/resetPassword", { method: "PUT", body: data });
}

// Cart (v2) helpers — use the production API root for v2 endpoints
const API_ROOT = (process.env.NEXT_PUBLIC_API_ROOT || "https://ecommerce.routemisr.com")

export async function getCartV2(token?: string) {
  const res = await fetch(`${API_ROOT}/api/v2/cart`, {
    headers: token ? { token } : undefined,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Failed to fetch cart: ${res.status}`)
  }
  return res.json()
}

export async function addToCartV2(productId: string, quantity = 1, token?: string) {
  const res = await fetch(`${API_ROOT}/api/v2/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { token } : {}) },
    body: JSON.stringify({ productId, quantity }),
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(txt || res.statusText || 'Failed to add to cart')
  }
  return res.json()
}

export async function addToCartV1(productId: string, quantity = 1, token?: string) {
  const res = await fetch(`${API_ROOT}/api/v1/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { token } : {}) },
    body: JSON.stringify({ productId, quantity }),
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(txt || res.statusText || 'Failed to add to cart (v1)')
  }
  return res.json()
}

export async function updateCartItemV2(itemId: string, quantity: number, token?: string) {
  const res = await fetch(`${API_ROOT}/api/v2/cart/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { token } : {}) },
    body: JSON.stringify({ quantity }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Failed to update cart item: ${res.status}`)
  }
  return res.json()
}

export async function removeCartItemV2(itemId: string, token?: string) {
  const res = await fetch(`${API_ROOT}/api/v2/cart/${itemId}`, {
    method: 'DELETE',
    headers: token ? { token } : undefined,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Failed to remove cart item: ${res.status}`)
  }
  return res.json()
}

// Orders & Payments helpers
export async function createCheckoutSession(cartId: string, token?: string) {
  const res = await fetch(`${API_ROOT}/api/v1/orders/checkout-session/${cartId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { token } : {}) },
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(txt || 'Failed to create checkout session')
  }
  return res.json()
}

export async function createCashOrder(cartId: string, token?: string) {
  // Attempt to create an order with cash payment. The API may expect different body; this is a reasonable default.
  const res = await fetch(`${API_ROOT}/api/v1/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { token } : {}) },
    body: JSON.stringify({ cartId, paymentMethod: 'cash' }),
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(txt || 'Failed to create cash order')
  }
  return res.json()
}

export async function getUserOrders(token?: string) {
  const res = await fetch(`${API_ROOT}/api/v1/orders`, {
    headers: token ? { token } : undefined,
  })
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
}

export default { signup, signin, forgotPassword, verifyResetCode, resetPassword };
