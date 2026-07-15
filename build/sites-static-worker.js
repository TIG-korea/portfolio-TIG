const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      url.pathname = "/index.html";
    } else if (!url.pathname.endsWith("/") && !url.pathname.split("/").pop().includes(".")) {
      url.pathname += ".html";
    }

    return env.ASSETS.fetch(new Request(url, request));
  },
};

export default worker;
