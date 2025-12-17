export function normalizeToken(token) {
    if (!token) return token;
    return token.startsWith("Bearer ") ? token.slice("Bearer ".length) : token;
  }
  
  export function setAuthHeaders(req, token) {
    const t = normalizeToken(token);
  
    // Send it in multiple common places to match whatever middleware expects
    return req
      .set("Authorization", `Bearer ${t}`)
      .set("x-auth-token", t)
      .set("x-access-token", t);
  }
  