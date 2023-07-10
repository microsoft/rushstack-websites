---
title: Dev certificate plugins
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin package:** | [@rushstack/heft-dev-cert-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-dev-cert-plugin) |
| **Plugin names:** | [trust-dev-certificate-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-dev-cert-plugin/heft-plugin.json) implemented by [TrustDevCertificatePlugin.ts](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-dev-cert-plugin/src/TrustDevCertificatePlugin.ts) <br/> [untrust-dev-certificate-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-dev-cert-plugin/heft-plugin.json) implemented by [UntrustDevCertificatePlugin.ts](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-dev-cert-plugin/src/UntrustDevCertificatePlugin.ts) |
| **Plugin config file:** | (none) |
| **heft.json options:** | (none) |
<!-- prettier-ignore-end -->

This is a Heft plugin to manage self-signed SSL certificates for an `https://localhost` development server.

The underlying functionality is provided by the
[@rushstack/debug-certificate-manager](https://github.com/microsoft/rushstack/tree/main/libraries/debug-certificate-manager)
library, which provides functions to generate, self-sign, trust, and untrust .pem certificates for both Windows
and Mac OS.

## When to use it

Generally `http://localhost` works fine for local development, however HTTPS may be required if your
app needs to make requests to a production service whose [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
policy requires SSL. For that situation, your `webpack-dev-server` or Node.js service will need to be
configured with a self-signed certificate. This plugin automatically generates the certificate, installs it,
and configures your OS to trust it.

## package.json dependencies

```bash
# If you are using Rush, run this shell command in your project folder:
rush add --package @rushstack/heft-dev-cert-plugin --dev

# Or if you are using plain NPM, run this shell command:
npm install @rushstack/heft-dev-cert-plugin --save-dev
```

## Configuration

The `trust-dev-certificate-plugin` can be mapped to `heft trust-dev-cert` and `heft untrust-dev-cert` actions
with a configuration such as:

**&lt;project folder&gt;/config/heft.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

  "phasesByName": {
    "trust-dev-cert": {
      "tasksByName": {
        "trust-dev-cert": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-dev-cert-plugin",
            "pluginName": "trust-dev-certificate-plugin"
          }
        }
      }
    },
    "untrust-dev-cert": {
      "tasksByName": {
        "untrust-dev-cert": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-dev-cert-plugin",
            "pluginName": "untrust-dev-certificate-plugin"
          }
        }
      }
    }
  }
}
```
