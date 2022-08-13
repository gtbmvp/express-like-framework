//req.url has only pathname, but new URL needs full adress, that's why we pass base;
module.exports = (base) => (req, res) => {
  const parsedURL = new URL(req.url, base);
  const searchParams = parsedURL.searchParams;

  req.pathname = parsedURL.pathname;
  req.query = {};

  searchParams.forEach((value, key) => {
    req.query[key] = value;
  });
};
