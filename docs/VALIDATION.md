# Validation

Checked on 2026-10-19 against DeepSeek Harness **0.2.1-rc.2**, Windows desktop.

## Automated checks

`npm run build` and `npm test` pass. The three tests cover:

- Text, heading, primary-action and inverted-navigation contrast in both palettes.
- Packaged lazy-CJS registration and restoration of DOM attributes, style nodes and theme token layers on disposal.
- Failure before effects when the theme service is unavailable; preservation of native font and font-size preferences.

## Runtime checks

- The theme was installed through the official CLI into an isolated profile and the desktop profile.
- Installed `dist/client.js` matched the local build by SHA256.
- Light/dark appearance, fonts, colored headings and input surfaces were checked in the real desktop client during development.
- Version 0.1.4 sidebar selection, hover, icon inversion and pane dividers were checked in the light desktop client. Both light and dark sidebar selection, headings and code blocks were subsequently checked in the real desktop client when capturing the public screenshots.
- The interactive preview uses sample content and the same palette/CSS sources. It does not connect to a model.

## Limits

Other DSH versions, every third-party plugin page and real mobile browsers have not been validated. The package declares the exact tested host version. Update this declaration only after testing another host.

Public screenshots are unmodified captures of the real Windows desktop client showing a binary-search demonstration conversation, with unrelated community plugins disabled. Other conversation bodies, account-settings pages and balance widgets are not shown. Local runtime records and backups are excluded from the repository.

The public images were replaced with the user's original PNG files. Their dimensions and SHA256 equality with the supplied originals were checked; no resizing or recompression was applied.
