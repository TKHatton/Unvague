# Security Notes

## API Key Security

This application uses the Google Gemini API directly from the browser (client-side). This means the API key will be visible in the bundled JavaScript code.

**This is expected behavior for client-side applications**, but you MUST secure your API key properly:

### Required Security Steps:

1. **Restrict your API key in Google Cloud Console:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Find your API key
   - Under "Application restrictions", select "HTTP referrers (web sites)"
   - Add your Netlify domain (e.g., `https://your-site.netlify.app/*`)
   - Add localhost for development: `http://localhost:*`

2. **Set usage quotas:**
   - In Google Cloud Console, set daily/monthly quotas
   - This prevents abuse if someone copies your API key

3. **Monitor usage:**
   - Regularly check your Google Cloud Console for unexpected usage
   - Set up billing alerts

### Why the API key is in the client code:

- This app makes API calls directly from the user's browser
- The API key must be embedded in the JavaScript bundle
- This is the standard approach for client-side apps using Google APIs
- Proper restriction (step 1 above) ensures only your domain can use the key

### Netlify Secret Scanner:

We've disabled Netlify's smart secret detection because:
- The API key is intentionally client-side
- It's properly restricted by domain (you did this in step 1, right?)
- The scanner would otherwise block legitimate builds

### Alternative (More Secure) Approach:

For production apps with sensitive operations, consider:
1. Create a Netlify serverless function
2. Store the API key as a server-side environment variable
3. Have the client call your serverless function
4. The function calls Gemini API with the secure key

This keeps the key truly secret but requires a backend.
