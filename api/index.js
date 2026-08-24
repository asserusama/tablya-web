const IOS_STORE_URL = 'https://apps.apple.com/app/id6741444000';
const ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.tablya.app';

module.exports = (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>طبلية | منصة الأكل البيتي الأصيل</title>
  <meta name="description" content="طبلية تطبيق يربطك بأفضل المطابخ المنزلية وأشهى الأكلات البيتي الطازجة. حمل التطبيق الآن!">
  <meta name="theme-color" content="#FD004C">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Alexandria', -apple-system, sans-serif;
      background: #0D0E11;
      color: #FFFFFF;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      text-align: center;
    }
    .card {
      background: #181A20;
      border: 1px solid #262A34;
      border-radius: 28px;
      padding: 40px 24px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }
    .logo {
      font-size: 48px;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 26px;
      font-weight: 800;
      color: #FD004C;
      margin-bottom: 10px;
    }
    p {
      color: #9E9E9E;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 16px 20px;
      border-radius: 16px;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      transition: all 0.2s ease;
    }
    .btn-ios {
      background: #FD004C;
      color: #FFFFFF;
      box-shadow: 0 8px 20px rgba(253,0,76,0.35);
    }
    .btn-android {
      background: #262A34;
      color: #FFFFFF;
      border: 1px solid #333846;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🍲</div>
    <h1>تطبيق طبلية</h1>
    <p>أكل بيتي مصري طازج ولذيذ، معمول بحب بأيدي أمهات وشيفات مصرية ويوصل لحد باب بيتك.</p>
    <div class="buttons">
      <a class="btn btn-ios" href="${IOS_STORE_URL}" target="_blank">
        <span>تحميل من App Store</span>
        <span>🍏</span>
      </a>
      <a class="btn btn-android" href="${ANDROID_STORE_URL}" target="_blank">
        <span>تحميل من Google Play</span>
        <span>🤖</span>
      </a>
    </div>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
};
