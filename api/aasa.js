module.exports = (req, res) => {
  const aasa = {
    applinks: {
      apps: [],
      details: [
        {
          appID: "59N9JDT3LK.com.tablya.app",
          paths: [
            "/k/*",
            "/mom/*"
          ]
        }
      ]
    }
  };

  if (res.setHeader) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
  return res.status ? res.status(200).json(aasa) : res.json(aasa);
};
