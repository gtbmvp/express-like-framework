// create send method in res object for json data (res.writeHead + res.end)
module.exports = (req, res) => {
  res.send = (data) => {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(data));
  };
};
