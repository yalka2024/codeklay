# CodePal Plugin Developer Guide

Welcome to the CodePal Plugin Ecosystem! This guide will help you build, test, and publish plugins for the CodePal platform.

---

## 1. Overview
- **Plugins** extend CodePal with new features, integrations, and automations.
- **Marketplace**: Publish and share your plugin with the community or your team.

---

## 2. Plugin API & Lifecycle

### Plugin Manifest (`plugin.json`)
```json
{
  "id": "ai-security-scanner",
  "name": "AI Security Scanner",
  "version": "1.0.0",
  "description": "Scans code for security vulnerabilities using AI.",
  "author": "Your Name",
  "main": "index.js",
  "category": "security",
  "icon": "./icon.png",
  "hooks": ["codeReview", "fileSave"]
}
```

### Plugin Lifecycle
- **Install**: User installs from the marketplace.
- **Activate**: Plugin is loaded and initialized.
- **Hooks**: Plugin can register for lifecycle events:
  - `onActivate(context)`
  - `onDeactivate(context)`
  - `onCodeReview(context, file)`
  - `onFileSave(context, file)`
  - `onChatMessage(context, message)`
  - `onCommand(context, command)`

### Example Plugin API
```js
module.exports = {
  onActivate(context) {
    context.log('Plugin activated!');
  },
  onCodeReview(context, file) {
    // Analyze file and return suggestions
    return [{
      line: 42,
      message: 'Potential SQL injection vulnerability.',
      severity: 'high',
    }];
  },
  onFileSave(context, file) {
    // Run checks or automations on save
  },
};
```

---

## 3. Hello World Plugin Example

**Directory Structure:**
```
plugins/
  hello-world/
    plugin.json
    index.js
    README.md
```

**plugin.json**
```json
{
  "id": "hello-world",
  "name": "Hello World",
  "version": "1.0.0",
  "description": "A simple CodePal plugin example.",
  "main": "index.js",
  "category": "productivity"
}
```

**index.js**
```js
module.exports = {
  onActivate(context) {
    context.log('Hello, CodePal!');
  },
  onCommand(context, command) {
    if (command === 'sayHello') {
      context.notify('Hello from your plugin!');
    }
  },
};
```

**README.md**
```
# Hello World Plugin
This is a simple example plugin for CodePal.
```

---

## 4. Testing Your Plugin
- Use the CodePal sandbox to test plugin hooks and UI.
- Log output with `context.log()`.
- Use `context.notify()` to show messages in the UI.

---

## 5. Publishing Your Plugin
- Submit your plugin via the Developer Portal.
- Include a detailed README, icon, and screenshots.
- Plugins are reviewed for security and quality before publishing.

---

## 6. Best Practices
- Keep plugins modular and focused.
- Validate and sanitize all inputs.
- Follow security and performance guidelines.
- Document all commands and hooks.

---

## 7. Support
- Join the CodePal Plugin Developer Community on Discord.
- Read the full API reference at [docs.codepal.com/plugins](https://docs.codepal.com/plugins)
- Contact support: plugins@codepal.com 