const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const originalPath = url.pathname;

    if (originalPath === "/index" || originalPath === "/index.html") {
      url.pathname = "/";
      return Response.redirect(url.toString(), 308);
    }

    if (originalPath !== "/" && originalPath.endsWith("/")) {
      url.pathname = originalPath.replace(/\/+$/, "");
      return Response.redirect(url.toString(), 308);
    }

    if (originalPath.endsWith(".html")) {
      url.pathname = originalPath.slice(0, -5) || "/";
      return Response.redirect(url.toString(), 308);
    }

    if (originalPath === "/") {
      url.pathname = "/index.html";
    } else if (!originalPath.split("/").pop().includes(".")) {
      url.pathname += ".html";
    }

    const response = await env.ASSETS.fetch(new Request(url, request));
    const headers = new Headers(response.headers);
    headers.set("Content-Security-Policy", "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self'; object-src 'none'");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

    if (originalPath.startsWith("/assets/")) {
      headers.set("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400");
    } else {
      headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

export default worker;
