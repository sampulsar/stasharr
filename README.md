# stasharr

![GitHub Release](https://img.shields.io/github/v/release/enymawse/stasharr?style=for-the-badge)
<br/>
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/enymawse/stasharr/release.yml?style=for-the-badge)

This userscript adds additional functionality to the StashDB website which allows you to seamlessly integrate your local Whisparr (only v3+ supported) server with minimal interation.

## Features

- **One-click integration**: Add scenes from StashDB directly to Whisparr.
- **Feedback notifications**: Displays toast notifications for successful actions or errors.
- **Dynamic button injection**: Automatically adds the button when the relevant scene information is available.
- **Compatibilitiy**: Compatible with Violentmonkey and Tampermonkey.

## Installation

1. **Install [Tampermonkey](https://www.tampermonkey.net/)** or **[Violentmonkey](https://violentmonkey.github.io/)**: If you haven't already, install your favorite browser extension.
2. **Install Stasharr**: Click [`stasharr.user.js`](https://github.com/enymawse/stasharr/releases/latest/download/stasharr.user.js) to install automatically.
  - The userscript extension should prompt to install, choose to install.
  - Installing this way will also ensure you get updates as they are released.
3. **Configure**

## Configuration

Before using the script, you need to configure a few parameters:

1. **Navigate to [fanDB](https://fansdb.cc/)**.
2. **Open the userscript extension** in your browser:
3. **Click Settings** under the stasharr script and fill in your details:

![image](https://github.com/user-attachments/assets/78cff232-a326-4dec-b6f0-058e319cc2e3)

4. When you've input a valid domain and API key, the userscript extension will prompt to allow access to your Whisparr domain AND the Quality Profile and Root Folder Path dropdowns will populate with additional settings. `This is so the userscript can interact with your Whisparr instance. Ensure you click 'Always allow domain'`
5. Select the remaining settings
6. **Save your changes**. If your configuration is valid (i.e. your whisparr instance can be reached) your settings will be saved.

![image](https://github.com/user-attachments/assets/9804d74c-9c57-4046-85ec-6f6b182cf397)

## Usage

- Navigate to a scene on [StashDB](https://stashdb.org/).
- The script will automatically add additional functionality to the stashdb website allowing integration with your Whisparr server.
- Click the buttons to add the scene to your Whisparr server. You will receive a feedback indicating the status of the operation.

![image](https://github.com/user-attachments/assets/19c5e14d-8e86-41ef-b701-b6b8cd7e11e0)
![image](https://github.com/user-attachments/assets/6a0d105d-b903-43b2-85dd-5b5c4f7a8173)

## Troubleshooting

- Ensure that the URL and API key for your Whisparr instance are correct.
- Check the browser console for any errors during execution.
- Ensure your Whisparr server can be reached through the browser.
- Report bugs [here](https://github.com/enymawse/stasharr/issues/new/choose)

## License

This script is released under the GPL License. Feel free to use and modify it as needed.

## Author

**enymawse**

<em>Initial script function inspired by [randybudweiser](https://github.com/randybudweiser/stash2whisparr)</em>

## Development

See [DEV GUIDE](DEVELOPMENT.md)
