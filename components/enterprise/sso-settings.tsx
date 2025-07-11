import React from "react";

export function SSOSettings() {
  return (
    <div>
      <h2>Single Sign-On (SSO) Settings</h2>
      <p>Configure SAML, OAuth, or OpenID Connect for enterprise authentication.</p>
      <ul>
        <li>SAML: <button disabled>Configure (stub)</button></li>
        <li>OAuth: <button disabled>Configure (stub)</button></li>
        <li>OIDC: <button disabled>Configure (stub)</button></li>
      </ul>
      <p>Contact support to enable SSO for your organization.</p>
    </div>
  );
} 