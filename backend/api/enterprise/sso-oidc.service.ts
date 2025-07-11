import { Issuer, generators } from 'openid-client';

export class OIDCService {
  async initiateLogin(providerConfig: any, req: any, res: any) {
    try {
      // In production, load these from providerConfig
      const issuer = await Issuer.discover(providerConfig.issuer || 'https://accounts.google.com');
      const client = new issuer.Client({
        client_id: providerConfig.clientID || 'OIDC_CLIENT_ID',
        client_secret: providerConfig.clientSecret || 'OIDC_CLIENT_SECRET',
        redirect_uris: [providerConfig.redirectUri || 'https://your-app.com/api/enterprise/sso/oidc_callback'],
        response_types: ['code'],
      });
      const state = generators.state();
      const nonce = generators.nonce();
      const url = client.authorizationUrl({
        scope: 'openid email profile',
        state,
        nonce,
      });
      // Store state/nonce in session or DB for validation in callback (not shown)
      res.redirect(url);
    } catch (err: any) {
      res.status(500).json({ error: 'OIDC login initiation failed', details: err.message });
    }
  }

  async handleCallback(providerConfig: any, req: any, res: any) {
    try {
      const issuer = await Issuer.discover(providerConfig.issuer || 'https://accounts.google.com');
      const client = new issuer.Client({
        client_id: providerConfig.clientID || 'OIDC_CLIENT_ID',
        client_secret: providerConfig.clientSecret || 'OIDC_CLIENT_SECRET',
        redirect_uris: [providerConfig.redirectUri || 'https://your-app.com/api/enterprise/sso/oidc_callback'],
        response_types: ['code'],
      });
      const params = client.callbackParams(req);
      // Validate state/nonce from session or DB (not shown)
      const tokenSet = await client.callback(providerConfig.redirectUri || 'https://your-app.com/api/enterprise/sso/oidc_callback', params, {});
      const userinfo = await client.userinfo(tokenSet.access_token!);
      // User/session management (reuse SAML/OAuth logic)
      // TODO: Check if user exists, create if not, create session/JWT
      // Example: req.session.user = userinfo;
      // Or: const token = createJWT(userinfo)
      // res.cookie('token', token)
      res.json({ success: true, user: userinfo, token: `jwt-token-for-${userinfo.email}` });
    } catch (err: any) {
      res.status(401).json({ error: 'OIDC login failed', details: err.message });
    }
  }
} 