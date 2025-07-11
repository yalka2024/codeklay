import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

// In production, load these from providerConfig
const googleConfig = {
  clientID: 'GOOGLE_CLIENT_ID',
  clientSecret: 'GOOGLE_CLIENT_SECRET',
  callbackURL: 'https://your-app.com/api/enterprise/sso/oauth_callback',
};
const githubConfig = {
  clientID: 'GITHUB_CLIENT_ID',
  clientSecret: 'GITHUB_CLIENT_SECRET',
  callbackURL: 'https://your-app.com/api/enterprise/sso/oauth_callback',
};

passport.use(new GoogleStrategy(googleConfig, (accessToken, refreshToken, profile, done) => {
  // Extract user info from Google profile
  done(null, { email: profile.emails?.[0]?.value, name: profile.displayName, provider: 'google' });
}));
passport.use(new GitHubStrategy(githubConfig, (accessToken, refreshToken, profile, done) => {
  // Extract user info from GitHub profile
  done(null, { email: profile.emails?.[0]?.value, name: profile.displayName, provider: 'github' });
}));

export class OAuthService {
  initiateLogin(providerConfig: any, req: any, res: any): void {
    // In production, use providerConfig.type to select strategy
    const provider = providerConfig.type || 'google';
    if (provider === 'google') {
      passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
    } else if (provider === 'github') {
      passport.authenticate('github', { scope: ['user:email'] })(req, res);
    } else {
      res.status(400).json({ error: 'Unsupported OAuth provider' });
    }
  }

  handleCallback(providerConfig: any, req: any, res: any): void {
    const provider = providerConfig.type || 'google';
    passport.authenticate(provider, (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({ error: 'OAuth login failed', details: err || info });
      }
      // User/session management (reuse SAML logic)
      // TODO: Check if user exists, create if not, create session/JWT
      // Example: req.session.user = user;
      // Or: const token = createJWT(user)
      // res.cookie('token', token)
      res.json({ success: true, user, token: `jwt-token-for-${user.email}` });
    })(req, res);
  }
} 