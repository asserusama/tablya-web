module.exports = (req, res) => {
  const assetlinks = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.tablya.app",
        sha256_cert_fingerprints: []
      }
    }
  ];

  if (res.setHeader) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
  return res.status ? res.status(200).json(assetlinks) : res.json(assetlinks);
};
