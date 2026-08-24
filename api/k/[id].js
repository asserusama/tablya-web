const SUPABASE_URL = process.env.SUPABASE_URL || 'https://optfnuhujqezzsrvlwdc.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_L_DxM09RGWNuH0DXGkzpTw_Rb8aForN';

const IOS_STORE_URL = 'https://apps.apple.com/app/id6741444000';
const ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.tablya.app';
const DEFAULT_AVATAR = 'https://optfnuhujqezzsrvlwdc.supabase.co/storage/v1/object/public/branding/appicon.png';

module.exports = async (req, res) => {
  const { id } = req.query;
  const targetKey = (id || '').trim();

  let kitchen = null;

  if (targetKey) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetKey);
      const headers = {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      };

      let url = '';
      if (isUuid) {
        url = `${SUPABASE_URL}/rest/v1/kitchens?select=id,name,avatar_url,location,rating,rating_count,slug,is_active&or=(id.eq.${targetKey},slug.eq.${encodeURIComponent(targetKey)})&limit=1`;
      } else {
        url = `${SUPABASE_URL}/rest/v1/kitchens?select=id,name,avatar_url,location,rating,rating_count,slug,is_active&slug=eq.${encodeURIComponent(targetKey)}&limit=1`;
      }

      const response = await fetch(url, { headers });
      if (response.ok) {
        const rows = await response.json();
        if (Array.isArray(rows) && rows.length > 0) {
          kitchen = rows[0];
        }
      }

      // If not found by slug, fallback search by name
      if (!kitchen && !isUuid) {
        const fallbackUrl = `${SUPABASE_URL}/rest/v1/kitchens?select=id,name,avatar_url,location,rating,rating_count,slug,is_active&name=ilike.*${encodeURIComponent(targetKey)}*&limit=1`;
        const fallbackResp = await fetch(fallbackUrl, { headers });
        if (fallbackResp.ok) {
          const fbRows = await fallbackResp.json();
          if (Array.isArray(fbRows) && fbRows.length > 0) {
            kitchen = fbRows[0];
          }
        }
      }
    } catch (err) {
      console.error('Error querying kitchen for smart link:', err);
    }
  }

  const kitchenId = kitchen?.id || targetKey || '';
  const kitchenName = kitchen?.name || 'مطبخ بيتي على طبلية';
  const avatarUrl = kitchen?.avatar_url || DEFAULT_AVATAR;
  const ratingNum = kitchen?.rating ? Number(kitchen.rating).toFixed(1) : '٥.٠';
  const ratingCount = kitchen?.rating_count ? Number(kitchen.rating_count) : 0;
  const locationText = kitchen?.location || 'أكل بيتي طازج وتوصيل سريع';

  const pageTitle = `${kitchenName} | تطبيق طبلية`;
  const pageDescription = `اطلب ألذ أكل بيتي طازج من ${kitchenName} عبر تطبيق طبلية. حمل التطبيق واطلب الآن!`;
  const pageUrl = `https://tablya.vercel.app/k/${targetKey}`;
  const appSchemeUrl = `tablya://mom/${kitchenId}`;

  // Generate QR Code URL for Desktop viewers
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(pageUrl)}&color=FD004C&bgcolor=FFFFFF`;

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(pageTitle)}</title>
  
  <!-- Primary Meta Tags -->
  <meta name="title" content="${escapeHtml(pageTitle)}">
  <meta name="description" content="${escapeHtml(pageDescription)}">
  <meta name="theme-color" content="#FD004C">

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
  <meta property="al:ios:app_store_id" content="6741444000">
  <meta property="al:ios:app_name" content="Tablya">

  <!-- Android App Deep Linking Meta -->
  <meta property="al:android:url" content="${escapeHtml(appSchemeUrl)}">
  <meta property="al:android:package" content="com.tablya.app">
  <meta property="al:android:app_name" content="طبلية">

  <!-- Alexandria Arabic Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;600;700;800&display=swap" rel="stylesheet">

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    body {
      font-family: 'Alexandria', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0D0E11;
      color: #FFFFFF;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 16px;
      text-align: center;
    }
    .card {
      background: #181A20;
      border: 1px solid #262A34;
      border-radius: 28px;
      padding: 32px 24px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: fadeIn 0.4s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .brand-logo {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(253, 0, 76, 0.12);
      border: 1px solid rgba(253, 0, 76, 0.3);
      padding: 6px 14px;
      border-radius: 99px;
      font-size: 13px;
      font-weight: 700;
      color: #FD004C;
      margin-bottom: 24px;
    }
    .avatar-wrapper {
      position: relative;
      width: 104px;
      height: 104px;
      margin-bottom: 18px;
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #FD004C;
      background: #262A34;
      box-shadow: 0 8px 24px rgba(253, 0, 76, 0.25);
    }
    .badge-verified {
      position: absolute;
      bottom: 2px;
      left: 2px;
      background: #12B76A;
      color: #FFFFFF;
      border-radius: 50%;
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      border: 2px solid #181A20;
    }
    .kitchen-name {
      font-size: 22px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 8px;
      line-height: 1.3;
    }
    .kitchen-meta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
      font-size: 13px;
      color: #9E9E9E;
    }
    .rating-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(245, 158, 11, 0.12);
      color: #F59E0B;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 8px;
      border: 1px solid rgba(245, 158, 11, 0.25);
    }
    .location-text {
      color: #9E9E9E;
      font-size: 13px;
      margin-bottom: 24px;
      line-height: 1.5;
    }
    .btn-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: #FD004C;
      color: #FFFFFF;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      padding: 16px 24px;
      border-radius: 16px;
      width: 100%;
      border: none;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(253, 0, 76, 0.35);
      transition: all 0.2s ease;
      margin-bottom: 12px;
    }
    .btn-primary:active {
      transform: scale(0.98);
      background: #E00043;
    }
    .btn-secondary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #262A34;
      color: #E0E0E0;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      padding: 14px 20px;
      border-radius: 16px;
      width: 100%;
      border: 1px solid #333846;
      transition: all 0.2s ease;
    }
    .btn-secondary:active {
      background: #333846;
    }
    .qr-container {
      display: none;
      margin-top: 20px;
      padding: 16px;
      background: #FFFFFF;
      border-radius: 16px;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .qr-container img {
      width: 160px;
      height: 160px;
      border-radius: 8px;
    }
    .qr-label {
      color: #333333;
      font-size: 12px;
      font-weight: 600;
      margin-top: 8px;
    }
    .footer-text {
      margin-top: 24px;
      font-size: 12px;
      color: #666666;
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
    <div class="brand-logo">
      <span>🍲</span>
      <span>تطبيق طبلية</span>
    </div>

    <div class="avatar-wrapper">
      <img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(kitchenName)}" class="avatar-img" onerror="this.src='${DEFAULT_AVATAR}'">
      <div class="badge-verified">✓</div>
    </div>

    <h1 class="kitchen-name">${escapeHtml(kitchenName)}</h1>

    <div class="kitchen-meta">
      <span class="rating-badge">⭐ ${ratingNum}</span>
      ${ratingCount > 0 ? `<span>(${ratingCount} تقييم)</span>` : ''}
    </div>

    <p class="location-text">📍 ${escapeHtml(locationText)}</p>

    <!-- Open App Button -->
    <button class="btn-primary" onclick="launchApp()">
      <span>فتح في تطبيق طبلية</span>
      <span style="font-size: 18px;">↗</span>
    </button>

    <!-- Download App Store / Google Play Button -->
    <a id="storeBtn" class="btn-secondary" href="${ANDROID_STORE_URL}" target="_blank">
      <span>تحميل التطبيق من المتجر</span>
      <span>📲</span>
    </a>

    <!-- Desktop QR Code -->
    <div class="qr-container">
      <img src="${qrCodeUrl}" alt="QR Code">
      <div class="qr-label">امسح الكود بكاميرا الموبايل للطلب مباشرة</div>
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
      storeBtn.innerHTML = '<span>تحميل من App Store</span> <span>🍏</span>';
    } else if (isAndroid) {
      storeBtn.href = androidStore;
      storeBtn.innerHTML = '<span>تحميل من Google Play</span> <span>🤖</span>';
    }

    function launchApp() {
      if (isIOS) {
        window.location.href = appScheme;
        setTimeout(function() {
          if (!document.hidden && !document.webkitHidden) {
            window.location.href = iosStore;
          }
        }, 1800);
      } else if (isAndroid) {
        var intentUrl = 'intent://mom/${kitchenId}#Intent;scheme=tablya;package=com.tablya.app;S.browser_fallback_url=' + encodeURIComponent(androidStore) + ';end';
        window.location.href = intentUrl;
      } else {
        window.location.href = appScheme;
      }
    }

    // Auto-launch on mobile entry (e.g. from Instagram / Social Media)
    window.onload = function() {
      if (isIOS || isAndroid) {
        launchApp();
      }
    };
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
