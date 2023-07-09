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

For example, if you'd like to configure `webpack-dev-server` to use HTTPS in serve mode
without having to manually generate and install a self-signed certificate.

## package.json dependencies

None.

## Configuration

The `trust-dev-certificate-plugin` might be loaded as follows:

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
