const SUPABASE_URL = process.env.SUPABASE_URL || 'https://optfnuhujqezzsrvlwdc.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_L_DxM09RGWNuH0DXGkzpTw_Rb8aForN';

const IOS_STORE_URL = 'https://apps.apple.com/eg/app/tablya/id6794864990?l=ar';
const ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.tablya.app';
const DEFAULT_AVATAR = 'https://optfnuhujqezzsrvlwdc.supabase.co/storage/v1/object/public/branding/appicon.png';

module.exports = async (req, res) => {
  const { id } = req.query;
  const targetKey = (id || '').trim();

  let kitchen = null;

  if (targetKey) {
    try {
      const headers = {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      };

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetKey);
      let url = '';

      if (isUuid) {
        url = `${SUPABASE_URL}/rest/v1/kitchens?select=id,name,avatar_url,location,rating,rating_count,slug,is_active&id=eq.${targetKey}&limit=1`;
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

      // Fallback search by name if not found
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
  const pageUrl = `https://tablya-web.vercel.app/k/${targetKey}`;
  const appSchemeUrl = `tablya://mom/${kitchenId}`;

  // Generate QR Code URL for Desktop viewers
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
      position: relative;
      overflow-x: hidden;
    }
    /* Subtle ambient background glow */
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
      z-index: 0;
    }
    .card {
      position: relative;
      z-index: 1;
      background: #FFFFFF;
      border: 1px solid #EFE7EB;
      border-radius: 28px;
      padding: 36px 24px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 16px 40px rgba(236, 0, 72, 0.06), 0 4px 12px rgba(0, 0, 0, 0.03);
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .brand-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #FFF0F4;
      border: 1px solid #FDE6EC;
      padding: 6px 14px;
      border-radius: 99px;
      font-size: 13px;
      font-weight: 700;
      color: #ec0048;
      margin-bottom: 24px;
    }
    .avatar-wrapper {
      position: relative;
      width: 96px;
      height: 96px;
      margin-bottom: 16px;
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 26px;
      object-fit: cover;
      border: 3px solid #FFF0F4;
      background: #FAF6F8;
      box-shadow: 0 8px 24px rgba(236, 0, 72, 0.15);
    }
    .badge-verified {
      position: absolute;
      bottom: -4px;
      left: -4px;
      background: #12B76A;
      color: #FFFFFF;
      border-radius: 50%;
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      border: 2.5px solid #FFFFFF;
      box-shadow: 0 2px 6px rgba(18, 183, 106, 0.3);
    }
    .kitchen-name {
      font-size: 23px;
      font-weight: 800;
      color: #1A1216;
      margin-bottom: 8px;
      line-height: 1.3;
    }
    .kitchen-meta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 16px;
      font-size: 13px;
      color: #6B5D63;
    }
    .rating-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #FFE7DA;
      color: #FF6B2C;
      font-weight: 700;
      padding: 3px 9px;
      border-radius: 8px;
      font-size: 13px;
    }
    .location-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #FFF0F4;
      color: #ec0048;
      border-radius: 99px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 26px;
      max-width: 90%;
      line-height: 1.4;
    }
    .btn-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: #ec0048;
      color: #FFFFFF;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      padding: 16px 24px;
      border-radius: 16px;
      width: 100%;
      border: none;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(236, 0, 72, 0.32);
      transition: all 0.2s ease;
      margin-bottom: 12px;
      font-family: inherit;
    }
    .btn-primary:active {
      transform: scale(0.98);
      background: #C4003A;
    }
    .btn-secondary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #FAF6F8;
      color: #1A1216;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      padding: 14px 20px;
      border-radius: 16px;
      width: 100%;
      border: 1px solid #EFE7EB;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .btn-secondary:active {
      background: #EFE7EB;
    }
    .qr-container {
      display: none;
      margin-top: 20px;
      padding: 18px;
      background: #FFFDFE;
      border: 1.5px dashed #FDE6EC;
      border-radius: 18px;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .qr-container img {
      width: 140px;
      height: 140px;
      border-radius: 8px;
    }
    .qr-label {
      color: #6B5D63;
      font-size: 12px;
      font-weight: 600;
      margin-top: 10px;
    }
    .footer-text {
      position: relative;
      z-index: 1;
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
      <span>🍲</span>
      <span>طبلية · أكل بيتي مصري</span>
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

    <div class="location-pill">
      <span>📍</span>
      <span>${escapeHtml(locationText)}</span>
    </div>

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
