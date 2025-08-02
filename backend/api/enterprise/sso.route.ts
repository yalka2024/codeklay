// SSO API Route (Stub)
import { SSOService } from "./sso.service";

export async function POST(req, res) {
  // TODO: Handle SSO login/initiation
  const { provider } = req.body;
  const sso = new SSOService();
  let result;
  if (provider === 'saml') result = await sso.initiateSAMLLogin();
  else if (provider === 'oauth') result = await sso.initiateOAuthLogin('google');
  else if (provider === 'oidc') result = await sso.initiateOIDCLogin();
  else result = { error: 'Unknown provider' };
  res.json(result);
} 