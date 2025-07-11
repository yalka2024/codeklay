// SSO Provider Config Model (for DB or secure storage)
export type SSOProviderType = 'saml' | 'oauth' | 'oidc';

export interface SSOProviderConfig {
  id: string;
  orgId: string;
  type: SSOProviderType;
  name: string;
  enabled: boolean;
  config: Record<string, any>; // provider-specific config (e.g., SAML metadata, OAuth client ID/secret)
  createdAt: Date;
  updatedAt: Date;
} 