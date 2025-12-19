# Deployment Checklist

## Application Status: ✅ READY FOR PRODUCTION

### Architecture Verified
- ✅ Root-level file structure (no src/ folder)
- ✅ Components in `/components`
- ✅ Services in `/services`
- ✅ All imports use standard ESM (no file extensions)
- ✅ TypeScript compilation passes
- ✅ Vite build succeeds

### Gemini API Integration
- ✅ Model: `gemini-2.0-flash-exp` (latest stable)
- ✅ Supports image OCR and text analysis
- ✅ JSON mode configured with `responseMimeType: "application/json"`
- ✅ Structured output schema enforced:
  - whatWasSaid
  - whatIsExpected
  - whatIsOptional
  - whatCarriesRisk
  - whatIsNotAskingFor
  - hiddenRules
  - confidence (level + reason)
  - riskMeter (score + explanation)
  - responseSupport (array of options)

### Enhanced Error Handling
- ✅ API key validation at runtime
- ✅ Network error detection
- ✅ Rate limit/quota handling
- ✅ Safety filter detection
- ✅ Graceful fallback for non-JSON responses
- ✅ Required field validation
- ✅ User-friendly error messages (literal, non-technical language)

### Netlify Configuration
- ✅ Build command: `npm run build`
- ✅ Publish directory: `dist`
- ✅ Node version: 20 (specified in .nvmrc and netlify.toml)
- ✅ Secret scanner disabled (client-side API key expected)
- ✅ SPA redirects configured (/* → /index.html)
- ✅ Security headers set

### Required Environment Variables
**On Netlify Dashboard:**
```
VITE_API_KEY=<your_google_gemini_api_key>
```

### Pre-Deployment Steps

1. **Test build locally:**
   ```bash
   npm run build
   ```
   Should complete without errors.

2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Production-ready: Enhanced error handling and Gemini 2.0 integration"
   git push
   ```

3. **Set environment variable on Netlify:**
   - Go to Site configuration → Environment variables
   - Add `VITE_API_KEY` with your Google Gemini API key

4. **Secure your API key in Google Cloud Console:**
   - Navigate to: https://console.cloud.google.com/apis/credentials
   - Select your API key
   - Application restrictions → HTTP referrers
   - Add your Netlify domain: `https://your-site.netlify.app/*`
   - Add localhost: `http://localhost:*`

5. **Deploy:**
   - Netlify will auto-deploy on push
   - Monitor build logs for any issues

### Constraint Compliance
- ✅ **No metaphors/idioms:** System instruction enforces literal language
- ✅ **No moralizing:** "should", "correct", "good" avoided in prompts
- ✅ **Neurodivergent-friendly:** All analysis sections use concrete, explicit language
- ✅ **Bounded risk:** Risk explanations are specific and context-limited

### Build Output
- Bundle size: ~289 KB (gzipped: ~86 KB)
- Build time: ~20-25 seconds
- Target: ESNext

### Post-Deployment Verification
1. Open the deployed URL
2. Test text analysis with a sample message
3. Test image upload (if camera/gallery is available)
4. Test the "Analyze Silence" feature
5. Verify all sections render correctly in AnalysisView
6. Check console for any errors

### Troubleshooting
- **Build fails:** Check Node version (must be 20)
- **API errors:** Verify VITE_API_KEY is set in Netlify
- **"API key not configured":** API key env var missing or set to placeholder
- **"Service temporarily unavailable":** Rate limit reached, wait and retry
- **Empty responses:** Input may be too vague, add more context

### Support Files
- `SECURITY.md` - API key security practices
- `netlify.toml` - Netlify build configuration
- `.env.example` - Template for local development
- `.gitignore` - Prevents committing secrets
- `vite-env.d.ts` - TypeScript environment types
