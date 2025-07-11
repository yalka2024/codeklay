import { useMemo } from 'react';

// Stub: Replace with real user context/provider
function useCurrentUser() {
  if (typeof window === 'undefined') return null;
  // Example: window.CURRENT_USER = { subscription_tier: 'free' | 'individual' | 'team' }
  return (window as any).CURRENT_USER || { subscription_tier: 'free' };
}

export function useEntitlement() {
  const user = useCurrentUser();
  const tier = user?.subscription_tier || 'free';
  const isFree = tier === 'free';
  const isIndividual = tier === 'individual';
  const isTeam = tier === 'team';
  const canAccessAdvancedCollab = tier !== 'free';
  const pluginLimit = tier === 'free' ? 2 : tier === 'individual' ? 10 : 50;
  const aiQuota = tier === 'free' ? 50 : tier === 'individual' ? 1000 : 10000;
  return useMemo(() => ({ user, tier, isFree, isIndividual, isTeam, canAccessAdvancedCollab, pluginLimit, aiQuota }), [tier]);
} 