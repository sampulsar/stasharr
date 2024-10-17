# stasherr

Inspired by [randybudweiser](https://github.com/randybudweiser/stash2whisparr)

# Add StashID to Whisparr

This Tampermonkey userscript allows you to add a StashDB scene to your local Whisparr instance with a single click. It automatically checks if the scene is already in Whisparr and displays appropriate messages.

## Features

- **One-click integration**: Add scenes from StashDB directly to Whisparr.
- **Feedback notifications**: Displays toast notifications for successful actions or errors.
- **Dynamic button injection**: Automatically adds the button when the relevant scene information is available.

## Installation

1. **Install Tampermonkey**: If you haven't already, install the [Tampermonkey](https://www.tampermonkey.net/) browser extension.
2. **Add the script**:
   - Click on the Tampermonkey icon in your browser.
   - Select "Create a new script."
   - Replace the default code with the content of this script.
   - Save the script.

## Configuration

Before using the script, you need to configure a few parameters:

1. **Open the script in Tampermonkey**.
2. **Edit the following constants** at the top of the script:

https://github.com/enymawse/stasherr/blob/d1cbe28443a4be7d247307b035910bbcdbe668e1/stasherr.js#L16-L22

3. **Save your changes**.

## Usage

- Navigate to a scene on [StashDB](https://stashdb.org/).
- The script will automatically add a button titled "Add scene to Whisparr" under the scene information.
- Click the button to add the scene to your Whisparr instance. You will receive a toast notification indicating the success or failure of the operation.

## Dependencies

This script injects FontAwesome for the button icons. It will automatically load FontAwesome if it’s not already present on the page.

## Customization

You can customize the styles and appearance of the toast notifications and buttons by modifying the corresponding styles in the script.

## Troubleshooting

- Ensure that the URL and API key for your Whisparr instance are correct.
- Check the browser console for any errors during execution.
- Ensure you have the required permissions to access the Whisparr API.

## License

This script is released under the GPL License. Feel free to use and modify it as needed.

## Author

**randybudweiser** & **enymawse**

### Tips for Updating

- Replace `*****` in the configuration section with actual values or documentation on how to find them.
- Adjust any additional sections or features as your script evolves.
