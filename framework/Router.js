module.exports = class Router {
  constructor() {
    this.endpoints = {};
  }

  register(path, method, handler) {
    if (!this.endpoints[path]) {
      this.endpoints[path] = {};
    }

    const endpoint = this.endpoints[path];

    if (endpoint[method])
      throw new Error(`${method} по адресу ${path} уже существует`);

    endpoint[method] = handler;
  }

  get(path, handler) {
    this.register(path, "GET", handler);
  }

  post(path, handler) {
    this.register(path, "POST", handler);
  }

  put(path, handler) {
    this.register(path, "PUT", handler);
  }

  delete(path, handler) {
    this.register(path, "DELETE", handler);
  }
};
