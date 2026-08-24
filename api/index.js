const IOS_STORE_URL = 'https://apps.apple.com/eg/app/tablya/id6794864990?l=ar';
const ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.tablya.app';

module.exports = (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>طبلية | منصة الأكل البيتي الأصيل</title>
  <meta name="description" content="طبلية تطبيق يربطك بأفضل المطابخ المنزلية وأشهى الأكلات البيتي الطازجة. حمل التطبيق الآن!">
  <meta name="theme-color" content="#ec0048">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Alexandria', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #FAF6F8;
      color: #1A1216;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      text-align: center;
      position: relative;
    }
    body::before {
      content: "";
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 350px;
      background: radial-gradient(circle, rgba(236, 0, 72, 0.08) 0%, rgba(250, 246, 248, 0) 70%);
      pointer-events: none;
    }
    .card {
      position: relative;
      z-index: 1;
      background: #FFFFFF;
      border: 1px solid #EFE7EB;
      border-radius: 28px;
      padding: 40px 24px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 16px 40px rgba(236, 0, 72, 0.06), 0 4px 12px rgba(0, 0, 0, 0.03);
    }
    .logo {
      font-size: 52px;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 26px;
      font-weight: 800;
      color: #ec0048;
      margin-bottom: 10px;
    }
    p {
      color: #6B5D63;
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
      font-family: inherit;
    }
    .btn-ios {
      background: #ec0048;
      color: #FFFFFF;
      box-shadow: 0 8px 24px rgba(236, 0, 72, 0.32);
    }
    .btn-ios:active {
      background: #C4003A;
      transform: scale(0.98);
    }
    .btn-android {
      background: #FAF6F8;
      color: #1A1216;
      border: 1px solid #EFE7EB;
    }
    .btn-android:active {
      background: #EFE7EB;
    }
    .footer-text {
      margin-top: 24px;
      font-size: 12px;
      color: #A59BA0;
      font-weight: 500;
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
  <p class="footer-text">طبلية · منصة الأكل البيتي المصري الأصيل</p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
};
