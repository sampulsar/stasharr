// ==UserScript==
// @name         Add StashID to Whisparr
// @namespace    http://tampermonkey.net/
// @version      2024-10-16
// @description  Add a StashDB scene to your local Whisparr instance with a single click.
// @author       enymawse
// @match        https://stashdb.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // EDIT THESE VALUES //
    let config = {
        scheme: "https",
        userDomain: "*****", // Your Whisparr instance URL{:PORT}/IP{:PORT} ex. whisparr.local or whisparr.lan
        apiKey: "*****", // Your Whisparr API key
        quality: "*****", // Quality profile ID, can be found at the /api/v3/qualityprofile endpoint of your local instance
        rootFolderPath: '/root/folder/path' // Path to where you keep your stuff
    };
    config.apiUrl = `${config.scheme}://${config.userDomain}/api/v3/lookup/scene`;

    // Load FontAwesome if not already present
    function injectFontAwesomeStyles() {
        if (!document.querySelector('#fontAwesomeCDN')) {
            const link = document.createElement('link');
            link.id = 'fontAwesomeCDN';
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';
            document.head.appendChild(link);
            console.log('FontAwesome injected');
        }
    }

    // Utility function to create headers
    function createHeaders(additionalHeaders = {}) {
        return {
            'Accept': '*/*',
            'X-Api-Key': config.apiKey,
            'Connection': 'keep-alive',
            ...additionalHeaders
        };
    }

    // Utility function to display a custom toast message
    function showToast(message, isSuccess = true) {
        const toastContainer = document.querySelector('.ToastContainer');
        if (toastContainer) {
            const customToast = document.createElement('div');
            customToast.className = 'Toast';
            customToast.style.cssText = `
                padding: 10px;
                background-color: ${isSuccess ? '#4CAF50' : '#F44336'};
                color: white;
                margin: 10px;
                border-radius: 5px;
            `;
            customToast.innerText = message;
            toastContainer.appendChild(customToast);
            setTimeout(() => customToast.remove(), 5000);
        } else {
            console.log('ToastContainer not found.');
        }
    }

    // Function to add the button when the card-header element is found
    function addButtonToCardHeader() {
        const cardHeader = document.querySelector('.scene-info .card-header');
        if (cardHeader && !document.querySelector('#whisparrButton')) {
            const triggerButton = createButton();
            cardHeader.appendChild(triggerButton);
            handleSceneLookup(triggerButton);
        }
    }

    function createButton() {
        const button = document.createElement('button');
        button.id = 'whisparrButton';
        button.innerHTML = '<i class="fa-solid fa-download"></i> Add scene to Whisparr';
        button.style.cssText = `
            background-color: #e385ed;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        return button;
    }

    function handleSceneLookup(button) {
        const sceneID = window.location.href.split('https://stashdb.org/scenes/')[1];
        if (sceneID) {
            const fullApiUrl = `${config.apiUrl}?term=${encodeURIComponent(sceneID)}`;
            fetch(fullApiUrl, { method: 'GET', headers: createHeaders() })
                .then(response => response.json())
                .then(data => {
                    if (data?.length > 0 && hasBeenAdded(data[0].movie.added)) {
                        updateButtonForExistingScene(button);
                    } else {
                        button.addEventListener('click', () => addSceneToWhisparr(sceneID, button));
                    }
                })
                .catch(error => {
                    console.error('API Call Error:', error);
                    showToast('Error checking scene in Whisparr.', false);
                });
        } else {
            console.log('No StashID in the URL.');
            showToast('No valid StashID found in the URL.', false);
        }
    }

    function updateButtonForExistingScene(button) {
        button.disabled = true;
        button.innerHTML = '<i class="fa-solid fa-check-circle"></i> Scene already in Whisparr';
        button.style.backgroundColor = '#4CAF50';
    }

    function hasBeenAdded(dateString) {
        return !(dateString.startsWith("0001-01-01") || isNaN(new Date(dateString).getTime()));
    }

    // Function to add the scene to Whisparr
    function addSceneToWhisparr(sceneID, button) {
        const fullApiUrl = `${config.apiUrl}?term=${encodeURIComponent(sceneID)}`;
        fetch(fullApiUrl, { method: 'GET', headers: createHeaders() })
            .then(response => response.json())
            .then(data => {
                if (data?.length > 0) {
                    const sceneData = data[0];
                    const payload = createPayload(sceneData);
                    fetch(`${config.scheme}://${config.userDomain}/api/v3/movie`, {
                        method: 'POST',
                        headers: createHeaders({ 'Content-Type': 'application/json' }),
                        body: JSON.stringify(payload)
                    })
                    .then(postResponse => {
                        if (!postResponse.ok) {
                            return postResponse.json().then(postData => {
                                console.log('POST Response:', postData);
                                showToast(postData[0].errorMessage || 'Error occurred.', false);
                            });
                        }
                        return postResponse.json().then(postData => {
                            console.log('POST Response:', postData);
                            button.disabled = true;
                            button.innerHTML = '<i class="fa-solid fa-check-circle"></i> Scene added to Whisparr';
                            button.style.backgroundColor = '#4CAF50';
                            showToast('Scene added to Whisparr successfully!', true);
                        });
                    })
                    .catch(postError => {
                        console.error('POST Call Error:', postError);
                        showToast('Error adding scene to Whisparr.', false);
                    });
                } else {
                    console.log('No scene data returned from API.');
                    showToast('No scene data found for this URL.', false);
                }
            })
            .catch(error => {
                console.error('API Call Error:', error);
                showToast('Error fetching scene data.', false);
            });
    }

    function createPayload(sceneData) {
        return {
            title: sceneData.movie.title,
            studio: sceneData.movie.studioTitle,
            foreignId: sceneData.foreignId,
            year: sceneData.year,
            rootFolderPath: config.rootFolderPath,
            monitored: true,
            addOptions: { searchForMovie: true },
            qualityProfileId: config.quality
        };
    }

    // MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                addButtonToCardHeader(); // Check and add the button if .card-header is found
            }
        }
    });

    // Start observing the body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });

    // Call once initially in case the element is already present
    addButtonToCardHeader();

    // Load FontAwesome from CDN
    injectFontAwesomeStyles();
})();
