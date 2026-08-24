# 🌐 Tablya Web (Smart Deep Links & Social Previews)

Official smart link redirector, OpenGraph preview generator, and Universal Links host for **Tablya (طبلية)** kitchens.

---

## 🚀 How It Works
1. When a kitchen cook shares their link (e.g. `https://tablya.vercel.app/k/assor` or `https://tablya.vercel.app/k/[id]`):
   - **Instagram / WhatsApp / Facebook / Twitter**: Renders rich social cards with the kitchen avatar, name, rating, and description.
   - **User with App Installed**: Instantly opens the kitchen profile inside the Tablya mobile app (`tablya://mom/[id]`).
   - **User without App**: Seamlessly redirects to the **Apple App Store** (`id6741444000`) on iOS or **Google Play Store** (`com.tablya.app`) on Android.
   - **Desktop**: Displays a QR code to scan with a phone camera to open directly on mobile.

---

## 📦 How to Deploy to Vercel in 1 Minute

### Method A: Deploy via GitHub (Recommended)
1. Push this `tablya-web` folder to a GitHub repository (e.g. `github.com/asserusama/tablya-web`).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Add Environment Variables (Optional - defaults are already configured in code):
   - `SUPABASE_URL`: `https://optfnuhujqezzsrvlwdc.supabase.co`
   - `SUPABASE_ANON_KEY`: `sb_publishable_L_DxM09RGWNuH0DXGkzpTw_Rb8aForN`
4. Click **Deploy**.
5. Set your project name to `tablya` (so your domain is `tablya.vercel.app`).

### Method B: Deploy via Vercel CLI
```bash
cd tablya-web
npm install -g vercel
vercel --prod
```

---

## ⚙️ Custom Domain (Optional)
If you own `tablya.app` or `tablya.com`:
1. Go to your Vercel Project Settings → **Domains**.
2. Add `tablya.app` or `go.tablya.app`.
3. Add the CNAME / A record in your domain registrar.
4. Your kitchen links will automatically work at `https://tablya.app/k/assor`!
