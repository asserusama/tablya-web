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
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #EFE7EB;
      border-radius: 24px;
      padding: 36px 24px;
      max-width: 400px;
      width: 100%;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #ec0048;
      margin-bottom: 10px;
    }
    p {
      color: #6B5D63;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }
    .btn {
      display: block;
      padding: 16px 20px;
      border-radius: 14px;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      font-family: inherit;
      text-align: center;
    }
    .btn-ios {
      background: #ec0048;
      color: #FFFFFF;
    }
    .btn-ios:active {
      background: #C4003A;
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
    <h1>تطبيق طبلية</h1>
    <p>أكل بيتي مصري طازج ولذيذ، معمول بحب بأيدي أمهات وشيفات مصرية ويوصل لحد باب بيتك.</p>
    <div class="buttons">
      <a class="btn btn-ios" href="${IOS_STORE_URL}" target="_blank">
        تحميل من App Store
      </a>
      <a class="btn btn-android" href="${ANDROID_STORE_URL}" target="_blank">
        تحميل من Google Play
      </a>
    </div>
  </div>
  <p class="footer-text">طبلية · منصة الأكل البيتي المصري الأصيل</p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
};
