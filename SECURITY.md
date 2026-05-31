<!--
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: CC0-1.0
-->

# Security Policy

## Supported Versions

GuardGuide is currently in pre-1.0 development. Security fixes are provided for
the actively maintained mainline.

| Version | Supported |
| ------- | --------- |
| 0.x.x   | Yes       |
| < 0.0.1 | No        |

## Reporting a Vulnerability

Do not open public issues for security vulnerabilities.

Use one of these channels instead:

1. GitHub Security Advisories for this repository
2. Email: <security@secpal.app>

Please include:

- affected component
- reproduction steps
- impact assessment
- any workaround or suggested remediation if known

## Security Baseline

GuardGuide follows the SecPal security baseline by default.

- person-related data is encrypted at rest on the application layer
- acknowledgement tokens are stored hashed, never in cleartext
- IP addresses and user-agent strings are not stored persistently by default
- dependencies are monitored from day one through Dependabot and CI checks
- GitHub branch protection and signed commits are expected once the default branch is established
