# stasherr

# Add StashID to Whisparr

This Tampermonkey userscript allows you to add a StashDB scene to your local Whisparr instance with a single click. It automatically checks if the scene is already in Whisparr and displays appropriate messages.

## Features

- **One-click integration**: Add scenes from StashDB directly to Whisparr.
- **Feedback notifications**: Displays toast notifications for successful actions or errors.
- **Dynamic button injection**: Automatically adds the button when the relevant scene information is available.

## Installation

1. **Install Tampermonkey**: If you haven't already, install the [Tampermonkey](https://www.tampermonkey.net/) browser extension.
2. **Click the latest release** or [click here](https://github.com/enymawse/stasherr/releases/latest/download/stasherr.user.js):
 - Select the file titled `stasherr.user.js`
 - Tampermonkey should prompt to install, choose to install.
3. **Configure**

## Configuration

Before using the script, you need to configure a few parameters:

1. **Navigate to [StashDB](https://stashdb.org)**.
2. **Open the Tampermonkey extension** in your browser:
3. **Click Settings** under the stasherr script and fill in your details:

![image](https://github.com/user-attachments/assets/9184f6b3-c5d2-4d70-a6b2-8f9369e5a65b)

3. **Save your changes**. If your configuration is valid (i.e. your whisparr instance can be reached) your settings will be saved.

## Usage

- Navigate to a scene on [StashDB](https://stashdb.org/).
- The script will automatically add a buttons titled "Add scene to Whisparr" under the scene header information and add icons on the scene cards.
- Click the buttons to add the scene to your Whisparr instance. You will receive a toast notification indicating the success or failure of the operation.

## Troubleshooting

- Ensure that the URL and API key for your Whisparr instance are correct.
- Check the browser console for any errors during execution.
- Ensure your Whisparr server can be reached through the browser.

## License

This script is released under the GPL License. Feel free to use and modify it as needed.

## Author

**enymawse**

<em>Initial script function inspired by [randybudweiser](https://github.com/randybudweiser/stash2whisparr)</em>

