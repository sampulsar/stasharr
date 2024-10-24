# Development Guide

1. Allow Tampermonkey access to local file URIs [tampermonkey/faq](https://tampermonkey.net/faq.php?ext=dhdg#Q204)
2. Install dependencies with `npm i` or `npm ci`
3. `npm run dev` to start the webpack dev server
4. Navigate to [http://localhost:8080/stasharr.dev.proxy.user.js](http://localhost:8080/stasharr.dev.proxy.user.js)
5. Install the development script proxy
6. Make your changes to the code, webpack will recompile the dev scripts in the /dist folder. This directory is served by the dev server. Since you've installed the proxy script above, you just need to tell Tampermonkey to reload the required script.
7. Navigate to `Installed Userscripts` in the Tampermonkey Dashboard
8. Select `Edit` on `stasharr Dev`
9. Select `Externals`
10. Click `Update`
11. Repeat 6 through 11 as required
