const API_BASE = (process.env.TABLYA_API_URL || 'https://api.appleboy.tech/api').replace(
  /\/$/,
  ''
);

const IOS_STORE_URL = 'https://apps.apple.com/eg/app/tablya/id6794864990?l=ar';
const ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.tablya.app';
const DEFAULT_AVATAR = 'https://media.appleboy.tech/branding/appicon.png';
const LEGACY_MEDIA_PREFIX =
  'https://optfnuhujqezzsrvlwdc.supabase.co/storage/v1/object/public/tablya-media';
const LEGACY_BRANDING_PREFIX =
  'https://optfnuhujqezzsrvlwdc.supabase.co/storage/v1/object/public/branding';

function rewriteLegacyMediaUrl(url) {
  if (!url || typeof url !== 'string') return url;
  return url
    .split(LEGACY_MEDIA_PREFIX)
    .join('https://media.appleboy.tech')
    .split(LEGACY_BRANDING_PREFIX)
    .join('https://media.appleboy.tech/branding');
}

function normalizeKitchen(data) {
  if (!data || typeof data !== 'object' || data.error || !data.id) return null;
  return {
    id: data.id,
    name: data.name,
    avatar_url: data.avatarUrl || data.avatar_url || null,
    location: data.location,
    rating: data.rating,
    rating_count: data.ratingCount ?? data.rating_count,
    slug: data.slug,
    is_active: data.isActive ?? data.is_active,
    review_status: data.reviewStatus ?? data.review_status,
  };
}

async function fetchKitchenFromVps(key) {
  const url = `${API_BASE}/kitchens/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  return normalizeKitchen(await res.json());
}

async function fetchKitchen(targetKey) {
  if (!targetKey) return null;

  const cleanKey = targetKey.trim();
  const candidates = [];
  const addCandidate = (key) => {
    if (key && !candidates.includes(key)) candidates.push(key);
  };

  addCandidate(cleanKey);

  // Share links may use a compact UUID (32 hex chars, no dashes)
  if (/^[0-9a-f]{32}$/i.test(cleanKey)) {
    addCandidate(
      `${cleanKey.slice(0, 8)}-${cleanKey.slice(8, 12)}-${cleanKey.slice(12, 16)}-${cleanKey.slice(16, 20)}-${cleanKey.slice(20)}`
    );
  }

  if (cleanKey !== cleanKey.toLowerCase()) {
    addCandidate(cleanKey.toLowerCase());
  }

  for (const key of candidates) {
    try {
      const kitchen = await fetchKitchenFromVps(key);
      if (kitchen) return kitchen;
    } catch (err) {
      console.error('Error fetching kitchen from VPS:', key, err);
    }
  }

  return null;
}

module.exports = async (req, res) => {
  let targetKey = req.query?.id || req.query?.slug || req.query?.key;

  // Fallback: extract targetKey from req.url path if rewrite didn't set req.query
  if (!targetKey && req.url) {
    try {
      const cleanPath = req.url.split('?')[0];
      const segments = cleanPath.split('/').filter(Boolean);
      if (segments.length > 0) {
        targetKey = segments[segments.length - 1];
      }
    } catch (_) {}
  }

  targetKey = (targetKey || '').trim();
  try {
    targetKey = decodeURIComponent(targetKey);
  } catch (_) {}

  // Sanitize: strip any path separators or unwanted control characters
  targetKey = targetKey.replace(/^[\/\\]+|[\/\\]+$/g, '').trim();

  let kitchen = null;
  if (targetKey) {
    kitchen = await fetchKitchen(targetKey);
  }

  // Set standard security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Handle case when kitchen is NOT found / invalid link
  if (!kitchen) {
    const notFoundHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>المطبخ غير متوفر | تطبيق طبلية</title>
  <meta name="theme-color" content="#ec0048">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
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
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .brand-pill {
      display: inline-block;
      background: #FFF0F4;
      border: 1px solid #FDE6EC;
      padding: 6px 14px;
      border-radius: 99px;
      font-size: 13px;
      font-weight: 700;
      color: #ec0048;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      color: #1A1216;
      margin-bottom: 10px;
    }
    p {
      color: #6B5D63;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .btn-primary {
      display: block;
      background: #ec0048;
      color: #FFFFFF;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      padding: 16px 20px;
      border-radius: 14px;
      width: 100%;
      text-align: center;
      font-family: inherit;
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
    <div class="brand-pill">طبلية · أكل بيتي مصري</div>
    <h1>المطبخ غير متوفر</h1>
    <p>هذا الرابط غير صحيح أو أن المطبخ لم يعد متاحاً على التطبيق. يمكنك تصفح باقي المطابخ عبر تطبيق طبلية.</p>
    <a id="storeBtn" class="btn-primary" href="${ANDROID_STORE_URL}" target="_blank">
      تحميل تطبيق طبلية
    </a>
  </div>
  <p class="footer-text">طبلية · منصة الأكل البيتي المصري الأصيل</p>
  <script>
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var storeBtn = document.getElementById('storeBtn');
    if (isIOS && storeBtn) {
      storeBtn.href = '${IOS_STORE_URL}';
      storeBtn.textContent = 'تحميل من App Store';
    }
  </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(404).send(notFoundHtml);
  }

  const kitchenId = kitchen.id;
  const kitchenName = kitchen.name || 'مطبخ على طبلية';
  const avatarUrl = rewriteLegacyMediaUrl(kitchen.avatar_url) || DEFAULT_AVATAR;

  const pageTitle = `${kitchenName} | تطبيق طبلية`;
  const pageDescription = `اطلب ألذ أكل بيتي طازج من ${kitchenName} عبر تطبيق طبلية. حمل التطبيق واطلب الآن!`;
  const pageUrl = `https://tablya-web.vercel.app/k/${kitchen.slug || targetKey}`;
  const appSchemeUrl = `tablya://mom/${kitchenId}`;

  // Clean solid color QR code for desktop
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pageUrl)}&color=ec0048&bgcolor=FFFFFF`;

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(pageTitle)}</title>
  
  <!-- Primary Meta Tags -->
  <meta name="title" content="${escapeHtml(pageTitle)}">
  <meta name="description" content="${escapeHtml(pageDescription)}">
  <meta name="theme-color" content="#ec0048">

  <!-- Open Graph / Facebook / Instagram / WhatsApp -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(pageUrl)}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(pageDescription)}">
  <meta property="og:image" content="${escapeHtml(avatarUrl)}">
  <meta property="og:site_name" content="طبلية - Tablya">

  <!-- Twitter / X -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${escapeHtml(pageUrl)}">
  <meta property="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta property="twitter:description" content="${escapeHtml(pageDescription)}">
  <meta property="twitter:image" content="${escapeHtml(avatarUrl)}">

  <!-- iOS App Deep Linking Meta -->
  <meta property="al:ios:url" content="${escapeHtml(appSchemeUrl)}">
  <meta property="al:ios:app_store_id" content="6794864990">
  <meta property="al:ios:app_name" content="Tablya">

  <!-- Android App Deep Linking Meta -->
  <meta property="al:android:url" content="${escapeHtml(appSchemeUrl)}">
  <meta property="al:android:package" content="com.tablya.app">
  <meta property="al:android:app_name" content="طبلية">

  <!-- Alexandria Arabic Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
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
      padding: 32px 24px;
      max-width: 400px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .brand-pill {
      display: inline-block;
      background: #FFF0F4;
      border: 1px solid #FDE6EC;
      padding: 6px 14px;
      border-radius: 99px;
      font-size: 13px;
      font-weight: 700;
      color: #ec0048;
      margin-bottom: 20px;
    }
    .avatar-wrapper {
      width: 90px;
      height: 90px;
      margin-bottom: 16px;
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 24px;
      object-fit: cover;
      border: 1px solid #EFE7EB;
      background: #FAF6F8;
    }
    .kitchen-name {
      font-size: 22px;
      font-weight: 800;
      color: #1A1216;
      margin-bottom: 24px;
      line-height: 1.3;
    }
    .btn-primary {
      display: block;
      background: #ec0048;
      color: #FFFFFF;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      padding: 16px 20px;
      border-radius: 14px;
      width: 100%;
      border: none;
      cursor: pointer;
      margin-bottom: 10px;
      font-family: inherit;
      text-align: center;
    }
    .btn-primary:active {
      background: #C4003A;
    }
    .btn-secondary {
      display: block;
      background: #FAF6F8;
      color: #1A1216;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      padding: 14px 20px;
      border-radius: 14px;
      width: 100%;
      border: 1px solid #EFE7EB;
      font-family: inherit;
      text-align: center;
    }
    .btn-secondary:active {
      background: #EFE7EB;
    }
    .qr-container {
      display: none;
      margin-top: 20px;
      padding: 16px;
      background: #FFFFFF;
      border: 1px solid #EFE7EB;
      border-radius: 16px;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .qr-container img {
      width: 130px;
      height: 130px;
      border-radius: 6px;
    }
    .qr-label {
      color: #6B5D63;
      font-size: 12px;
      font-weight: 500;
      margin-top: 10px;
    }
    .footer-text {
      margin-top: 24px;
      font-size: 12px;
      color: #A59BA0;
      font-weight: 500;
    }
    @media (min-width: 768px) {
      .qr-container {
        display: flex;
      }
    }
  </style>
</head>
<body>

  <div class="card">
    <div class="brand-pill">
      طبلية · أكل بيتي مصري
    </div>

    <div class="avatar-wrapper">
      <img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(kitchenName)}" class="avatar-img" onerror="this.src='${DEFAULT_AVATAR}'">
    </div>

    <h1 class="kitchen-name">${escapeHtml(kitchenName)}</h1>

    <!-- Open App Button -->
    <button class="btn-primary" onclick="launchApp()">
      فتح في تطبيق طبلية
    </button>

    <!-- Download App Store / Google Play Button -->
    <a id="storeBtn" class="btn-secondary" href="${ANDROID_STORE_URL}" target="_blank">
      تحميل التطبيق من المتجر
    </a>

    <!-- Desktop QR Code -->
    <div class="qr-container">
      <img src="${qrCodeUrl}" alt="QR Code">
      <div class="qr-label">امسح الكود بكاميرا الموبايل لفتح المطبخ مباشرة</div>
    </div>
  </div>

  <p class="footer-text">طبلية · منصة الأكل البيتي المصري الأصيل</p>

  <script>
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isAndroid = /Android/.test(navigator.userAgent);
    var appScheme = '${appSchemeUrl}';
    var iosStore = '${IOS_STORE_URL}';
    var androidStore = '${ANDROID_STORE_URL}';
    var storeBtn = document.getElementById('storeBtn');

    if (isIOS) {
      storeBtn.href = iosStore;
      storeBtn.textContent = 'تحميل من App Store';
    } else if (isAndroid) {
      storeBtn.href = androidStore;
      storeBtn.textContent = 'تحميل من Google Play';
    }

    var appLaunchAttempted = false;
    var appOpened = false;

    window.addEventListener('pagehide', function() { appOpened = true; });
    window.addEventListener('blur', function() { appOpened = true; });
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) appOpened = true;
    });

    function launchApp() {
      appOpened = false;
      appLaunchAttempted = true;
      var startTime = Date.now();

      if (isIOS) {
        // Direct custom scheme trigger without overlapping timer
        window.location.href = appScheme;
        setTimeout(function() {
          // If the app didn't open and page is still focused after 2.5s, direct to App Store
          var elapsed = Date.now() - startTime;
          if (!appOpened && !document.hidden && elapsed < 3500) {
            window.location.href = iosStore;
          }
        }, 2500);
      } else if (isAndroid) {
        var intentUrl = 'intent://mom/${kitchenId}#Intent;scheme=tablya;package=com.tablya.app;S.browser_fallback_url=' + encodeURIComponent(androidStore) + ';end';
        window.location.href = intentUrl;
      } else {
        window.location.href = appScheme;
      }
    }
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return res.status(200).send(html);
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
