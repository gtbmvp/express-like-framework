module.exports = (req, res) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (bufferChunk) => {
      body += bufferChunk; // string + buffer (or buffer.toString() uses UTF-8)
    });
    req.on("end", () => {
      if (body) {
        req.body = JSON.parse(body);
      }
      resolve();
    });
  });
};
