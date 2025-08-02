import { SSOConfigService } from './sso-config.service';
import { SSOProviderConfig } from './sso-config.model';
import { SAMLService } from './sso-saml.service';
import { OAuthService } from './sso-oauth.service';
import { OIDCService } from './sso-oidc.service';
import { PrismaService } from '../database/prisma.service';
import { AuthService } from '../auth/auth.service';

// --- SSO Provider CRUD ---
export async function GET(req: any, res: any) {
  // List SSO providers for org
  const { orgId } = req.query;
  const providers = SSOConfigService.getProvidersForOrg(orgId);
  res.json(providers);
}

export async function POST(req: any, res: any) {
  // Add new SSO provider
  const config: SSOProviderConfig = req.body;
  SSOConfigService.addProvider(config);
  res.json(config);
}

export async function PUT(req: any, res: any) {
  // Update SSO provider
  const { id, updates } = req.body;
  const updated = SSOConfigService.updateProvider(id, updates);
  res.json(updated);
}

export async function DELETE(req: any, res: any) {
  // Remove SSO provider
  const { id } = req.body;
  const ok = SSOConfigService.removeProvider(id);
  res.json({ ok });
}

// --- SSO Login Flows ---
const saml = new SAMLService();
const oauth = new OAuthService();
const oidc = new OIDCService();
const prisma = new PrismaService();
const authService = new AuthService(prisma, /* jwtService */ undefined as any, /* configService */ undefined as any);

// Helper for user management and JWT
async function findOrCreateUser(email: string, name: string) {
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({ data: { email, name, role: 'user' } });
  }
  return user;
}

async function generateJWT(user: any) {
  // Use AuthService's generateTokens (requires real jwtService/configService in production)
  // For now, return a placeholder
  return { accessToken: 'jwt-token', refreshToken: 'refresh-token', expiresIn: 900 };
}

export async function POST_saml_login(req: any, res: any) {
  // Load provider config from DB using providerId param
  const { providerId } = req.body;
  const providerConfig = SSOConfigService.getProvidersForOrg('org1').find((p) => p.id === providerId);
  if (!providerConfig) return res.status(404).json({ error: 'SAML provider not found' });
  saml.initiateLogin(providerConfig, req, res);
}
export async function POST_saml_acs(req: any, res: any) {
  // Load provider config from DB using providerId param (could also be in session/state)
  const { providerId } = req.body;
  const providerConfig = SSOConfigService.getProvidersForOrg('org1').find((p) => p.id === providerId);
  if (!providerConfig) return res.status(404).json({ error: 'SAML provider not found' });
  // User/session management after SAML assertion
  saml.handleACS(providerConfig, req, {
    ...res,
    json: async (result: any) => {
      if (result.success && result.user) {
        // User management
        const email = result.user.email || result.user.mail;
        const name = result.user.name || '';
        const user = await findOrCreateUser(email, name);
        // Session/JWT management
        const tokens = await generateJWT(user);
        // Set cookie (or return token)
        res.cookie && res.cookie('token', tokens.accessToken, { httpOnly: true });
        res.json({ ...result, user, tokens });
      } else {
        res.status(400).json(result);
      }
    },
  });
}
export async function GET_saml_metadata(req: any, res: any) {
  // Load provider config from DB using providerId param
  const { providerId } = req.query;
  const providerConfig = SSOConfigService.getProvidersForOrg('org1').find((p) => p.id === providerId);
  if (!providerConfig) return res.status(404).type('text/plain').send('SAML provider not found');
  res.type('application/xml').send(saml.getMetadata(providerConfig));
}

export async function POST_oauth_login(req: any, res: any) {
  // Load provider config from DB using providerId param
  const { providerId } = req.body;
  const providerConfig = SSOConfigService.getProvidersForOrg('org1').find((p) => p.id === providerId);
  if (!providerConfig) return res.status(404).json({ error: 'OAuth provider not found' });
  oauth.initiateLogin(providerConfig, req, res);
}
export async function POST_oauth_callback(req: any, res: any) {
  const { providerId } = req.body;
  const providerConfig = SSOConfigService.getProvidersForOrg('org1').find((p) => p.id === providerId);
  if (!providerConfig) return res.status(404).json({ error: 'OAuth provider not found' });
  oauth.handleCallback(providerConfig, req, {
    ...res,
    json: async (result: any) => {
      if (result.success && result.user) {
        const email = result.user.email || result.user.mail;
        const name = result.user.name || '';
        const user = await findOrCreateUser(email, name);
        const tokens = await generateJWT(user);
        res.cookie && res.cookie('token', tokens.accessToken, { httpOnly: true });
        res.json({ ...result, user, tokens });
      } else {
        res.status(400).json(result);
      }
    },
  });
}

export async function POST_oidc_login(req: any, res: any) {
  // Load provider config from DB using providerId param
  const { providerId } = req.body;
  const providerConfig = SSOConfigService.getProvidersForOrg('org1').find((p) => p.id === providerId);
  if (!providerConfig) return res.status(404).json({ error: 'OIDC provider not found' });
  oidc.initiateLogin(providerConfig, req, res);
}
export async function POST_oidc_callback(req: any, res: any) {
  // Load provider config from DB using providerId param (could also be in session/state)
  const { providerId } = req.body;
  const providerConfig = SSOConfigService.getProvidersForOrg('org1').find((p) => p.id === providerId);
  if (!providerConfig) return res.status(404).json({ error: 'OIDC provider not found' });
  // User/session management after OIDC login
  oidc.handleCallback(providerConfig, req, {
    ...res,
    json: async (result: any) => {
      if (result.success && result.user) {
        // User management
        const email = result.user.email || result.user.mail;
        const name = result.user.name || '';
        const user = await findOrCreateUser(email, name);
        // Session/JWT management
        const tokens = await generateJWT(user);
        // Set cookie (or return token)
        res.cookie && res.cookie('token', tokens.accessToken, { httpOnly: true });
        res.json({ ...result, user, tokens });
      } else {
        res.status(400).json(result);
      }
    },
  });
} 