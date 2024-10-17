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
        if (cardHeader && !document.querySelector('#whisparrButtonHeader')) {
            const triggerButton = createHeaderButton();
            cardHeader.appendChild(triggerButton);
            const sceneID = window.location.href.split('https://stashdb.org/scenes/')[1];
            handleSceneLookup(triggerButton, sceneID);
        }
    }

    function createHeaderButton() {
        const button = document.createElement('button');
        button.id = 'whisparrButtonHeader';
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

    // Function to add buttons to each SceneCard
    function addButtonsToSceneCards() {
        const sceneCards = document.querySelectorAll('.SceneCard');
        sceneCards.forEach((sceneCard) => {
            if (!sceneCard.querySelector('.whisparrButton')) {
                const button = createCardButton();
                button.classList.add('whisparrButton');
                button.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                    color: #e385ed;
                `;
                button.innerHTML = '<i class="fa-solid fa-download"></i>'; // Just the icon
                sceneCard.style.position = 'relative'; // Ensure the scene card has positioning to allow absolute button placement
                sceneCard.appendChild(button);
                const sceneUrl = sceneCard.querySelector('a').href;
                const sceneID = sceneUrl.split('/scenes/')[1];
                handleSceneLookup(button, sceneID);
            }
        });
    }

    function createCardButton() {
        const button = document.createElement('button');
        return button;
    }

    function handleSceneLookup(button, sceneID) {
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
        button.innerHTML = '<i class="fa-solid fa-check-circle"></i>'; // Update icon
        button.style.color = '#4CAF50';
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
                            button.innerHTML = '<i class="fa-solid fa-check-circle"></i>';
                            button.style.color = '#4CAF50';
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
                addButtonsToSceneCards(); // Check and add buttons to all scene cards
                addButtonToCardHeader(); // Check and add the button to the scene header
            }
        }
    });

    // Start observing the body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });

    // Call once initially in case the elements are already present
    addButtonsToSceneCards();
    addButtonToCardHeader();

    // Load FontAwesome from CDN
    injectFontAwesomeStyles();
})();
