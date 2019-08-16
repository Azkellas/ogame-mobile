# Ogame Mobile

Ogame Mobile is a project to provide a user friendly way to play Ogame on smartphones. It can be bundled as a browser app (for firefox mobile or chromium based browsers like Kiwi) and as a native app, via Expo. The latter is not authorized by GameForge, but they rejected it after the birth of the project.

## Downloading

Note: if you know mobile browsers that allow extensions, please let me know.

Ogame Mobile is not yet available on any market (chrome/firefox/...) as it is still in beta. It will be published when I have sufficient feedback (hopefully in a few weeks).

Disable the mobile version in `options > display` before installing the extension. Ogame Mobile is made to execute on the basic ogame view, not the mobile.

Then download the latest beta version here: [releases](https://github.com/Azkellas/ogame-mobile/releases/latest). (if you want the current dev version, download [extension.zip](extension.zip) instead)

### Android

Firefox for Android does not allow unsigned extensions. As of now, only Kiwi browser supports Ogame Mobile (at least that I know of). Go to the Extensions page (either via the menu or the url `chrome://extensions`). Click on `Load`, then navigate to your Downloads folder to add the `.xpi` extension previously downloaded. The file is no longer mandatory.

### iOS

Since Ogame Mobile is quite simple, it might works on Safari as is, but I don't know how Safari extensions work. Anyway, I doubt Apple allows unsigned extensions so for now you should look for a chromium-based browser that has extensions.


## Contributing

### Developping

As Ogame Mobile was first supposed to be packaged as a browser extension and a native app, injected files are written in the `common/` directory, and `extension/common` is only a copy of it. To automatically watch changes, use the `watcher.js` script at the root of the project (run `node watcher.js extension`). The extension has a hot reload feature, which helps when debugging in a desktop browser.

### Bug report / Feature request

The project has a discord: [invite](https://discord.gg/7saJGBA), feel free to join it. You can also open an issue.

## License

This project is licensed under the GNU/GPL License - see the [LICENSE.md](LICENSE.md) file for details
