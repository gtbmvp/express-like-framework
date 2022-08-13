const http = require("http");
const EventEmitter = require("events");

module.exports = class Application {
  constructor() {
    this.middlewares = [];
    this.emitter = new EventEmitter();
    this.server = this._createServer();
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  listen(port, cb) {
    this.server.listen(port, cb);
  }

  addRouter(router) {
    Object.keys(router.endpoints).forEach((path) => {
      const endpoint = router.endpoints[path];
      Object.keys(endpoint).forEach((method) => {
        const handler = endpoint[method];
        this.emitter.on(this._getEvent(path, method), (req, res) => {
          handler(req, res);
        });
      });
    });
  }

  _createServer() {
    return http.createServer(async (req, res) => {
      for (const middleware of this.middlewares) {
        await middleware(req, res);
      }

      // emit returns true if the event had listeners, false otherwise.
      const hasListeners = this.emitter.emit(
        this._getEvent(req.pathname, req.method),
        req,
        res
      );
      if (!hasListeners) res.end("No such endpoint");
    });
  }

  _getEvent(path, method) {
    return `[${path}]:[${method}]`;
  }
};
