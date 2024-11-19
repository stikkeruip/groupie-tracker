const cardStates = new Map();
let debounceTimer;

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".artist-card");
    cards.forEach((card, index) => {
        // Initialize each card's state to 0 (front face)
        cardStates.set(card, 0);

        // Initialize card to show front face
        const cardInner = card.querySelector(".card-inner");
        const front = card.querySelector(".card-front");
        const members = card.querySelector(".card-members");
        const locations = card.querySelector(".card-locations");
        const dates = card.querySelector(".card-dates");
        const relations = card.querySelector(".card-relations");
        const progressBar = document.createElement('div');
        progressBar.classList.add('card-progress');
        card.appendChild(progressBar);

        cardInner.style.transform = "rotateY(0deg)";
        front.style.opacity = "1";
        members.style.opacity = "0";
        locations.style.opacity = "0";
        dates.style.opacity = "0";

        card.addEventListener("click", () => flipCard(card));
    });

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounceSearch);
});

function flipCard(cardElement) {
    const artistName = cardElement.getAttribute('data-artist-name');
    const currentState = cardStates.get(cardElement);
    const nextState = (currentState + 1) % 5; // Cycle through 5 states
    cardStates.set(cardElement, nextState);

    const cardInner = cardElement.querySelector(".card-inner");
    const front = cardElement.querySelector(".card-front");
    const members = cardElement.querySelector(".card-members");
    const locations = cardElement.querySelector(".card-locations");
    const dates = cardElement.querySelector(".card-dates");
    const relations = cardElement.querySelector(".card-relations");
    const progressBar = cardElement.querySelector('.card-progress');

    // Reset opacity and z-index for all faces
    front.style.opacity = "0";
    members.style.opacity = "0";
    locations.style.opacity = "0";
    dates.style.opacity = "0";
    relations.style.opacity = "0";

    front.style.zIndex = "1";
    members.style.zIndex = "1";
    locations.style.zIndex = "1";
    dates.style.zIndex = "1";
    relations.style.zIndex = "1";

    // Update the card based on the next state
    if (nextState === 0) {
        console.log(`Flipping ${artistName}'s card to: Front Side`);
        cardInner.style.transform = "rotateY(0deg)";
        front.style.opacity = "1";
        front.style.zIndex = "5";
        progressBar.style.width = "0"; // Hide progress bar
    } else if (nextState === 1) {
        console.log(`Flipping ${artistName}'s card to: Members Section`);
        cardInner.style.transform = "rotateY(180deg)";
        members.style.opacity = "1";
        members.style.zIndex = "5";
        progressBar.style.width = "25%"; // Update progress bar

        const membersTitle = cardElement.querySelector('.card-members .category-title');
        const membersList = cardElement.querySelectorAll('.card-members li');
        membersTitle.textContent = membersList.length === 1 ? 'Artist' : 'Members';
    } else if (nextState === 2) {
        console.log(`Flipping ${artistName}'s card to: Locations Section`);
        cardInner.style.transform = "rotateY(360deg)";
        locations.style.opacity = "1";
        locations.style.zIndex = "5";
        progressBar.style.width = "50%"; // Update progress bar

        const locationsTitle = cardElement.querySelector('.card-locations .category-title');
        const locationsList = cardElement.querySelectorAll('.card-locations li');
        locationsTitle.textContent = locationsList.length === 1 ? 'Location' : 'Locations';

        // Fetch coordinates for the first location
        if (locationsList.length > 0) {
            const location = locationsList[0].textContent;
            fetchCoordinates(location).then(coordinates => {
                if (coordinates) {
                    const mapLink = cardElement.querySelector('.map-link');
                    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
                }
            });
        }
    } else if (nextState === 3) {
        console.log(`Flipping ${artistName}'s card to: Dates Section`);
        cardInner.style.transform = "rotateY(540deg)";
        dates.style.opacity = "1";
        dates.style.zIndex = "5";
        progressBar.style.width = "75%"; // Update progress bar

        const datesTitle = cardElement.querySelector('.card-dates .category-title');
        const datesList = cardElement.querySelectorAll('.card-dates li');
        datesTitle.textContent = datesList.length === 1 ? 'Date' : 'Dates';
    } else if (nextState === 4) {
        console.log(`Flipping ${artistName}'s card to: Relations Section`);
        cardInner.style.transform = "rotateY(720deg)";
        relations.style.opacity = "1";
        relations.style.zIndex = "5";
        progressBar.style.width = "98%"; // Update progress bar

        const relationsTitle = cardElement.querySelector('.card-relations .category-title');
        const relationsList = cardElement.querySelectorAll('.card-relations li');
        relationsTitle.textContent = relationsList.length === 1 ? 'Relation' : 'Relations';
    }
}

function fetchCoordinates(location) {
    return fetch('/api/geocode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: location }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                return {
                    lat: data.results[0].geometry.location.lat,
                    lng: data.results[0].geometry.location.lng
                };
            } else {
                console.error('Geocoding failed:', data.status);
                return null;
            }
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
            return null;
        });
}

function debounceSearch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const searchInput = document.getElementById('searchInput');
        if (searchInput.value.length >= 3) {
            searchArtists();
        } else {
            const searchSuggestions = document.getElementById('searchSuggestions');
            searchSuggestions.innerHTML = '';
            document.querySelectorAll('.artist-card').forEach(card => card.style.display = "");
        }
    }, 300); // 300ms delay
}

function searchArtists() {
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const filter = searchInput.value.toLowerCase();
    const artistCards = document.querySelectorAll('.artist-card');

    // Clear previous suggestions
    searchSuggestions.innerHTML = '';

    if (filter.length < 3) {
        artistCards.forEach(card => card.style.display = "");
        return;
    }

    let suggestions = [];

    artistCards.forEach(card => {
        const artistName = card.getAttribute('data-artist-name').toLowerCase();
        const creationDate = card.querySelector('.artist-info p:nth-child(1) strong').textContent.toLowerCase();
        const firstAlbum = card.querySelector('.artist-info p:nth-child(2) strong').textContent.toLowerCase();
        const members = Array.from(card.querySelectorAll('.card-members li')).map(li => li.textContent.toLowerCase());
        const locations = Array.from(card.querySelectorAll('.card-locations li')).map(li => li.textContent.toLowerCase());
        const dates = Array.from(card.querySelectorAll('.card-dates li')).map(li => li.textContent.toLowerCase());

        let matchFound = false;

        if (artistName.includes(filter)) {
            suggestions.push({ text: card.getAttribute('data-artist-name'), type: 'artist/band' });
            matchFound = true;
        }

        if (creationDate.includes(filter)) {
            suggestions.push({ text: `${card.getAttribute('data-artist-name')} (${creationDate})`, type: 'creation date' });
            matchFound = true;
        }

        if (firstAlbum.includes(filter)) {
            suggestions.push({ text: `${card.getAttribute('data-artist-name')} - ${firstAlbum}`, type: 'first album date' });
            matchFound = true;
        }

        members.forEach(member => {
            if (member.includes(filter)) {
                suggestions.push({ text: `${member} (${card.getAttribute('data-artist-name')})`, type: 'member' });
                matchFound = true;
            }
        });

        locations.forEach(location => {
            if (location.toLowerCase().includes(filter)) {
                suggestions.push({ text: `${location} (${card.getAttribute('data-artist-name')})`, type: 'location' });
                matchFound = true;
            }
        });

        dates.forEach(date => {
            if (date.toLowerCase().includes(filter)) {
                suggestions.push({ text: `${date} (${card.getAttribute('data-artist-name')})`, type: 'date' });
                matchFound = true;
            }
        });

        card.style.display = matchFound ? "" : "none";
    });

    // Display suggestions
    suggestions.slice(0, 5).forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'suggestion';
        suggestionElement.innerHTML = `<span class="suggestion-text">${suggestion.text}</span> <span class="suggestion-type">${suggestion.type}</span>`;
        suggestionElement.addEventListener('click', () => {
            searchInput.value = suggestion.text.split(' (')[0]; // Set only the main part of the suggestion
            searchArtists();
            searchSuggestions.innerHTML = ''; // Clear suggestions after clicking
        });
        searchSuggestions.appendChild(suggestionElement);
    });
}

// Add this event listener to hide suggestions when clicking outside
document.addEventListener('click', function (event) {
    const searchSuggestions = document.getElementById('searchSuggestions');
    const searchInput = document.getElementById('searchInput');
    if (event.target !== searchInput && event.target !== searchSuggestions) {
        searchSuggestions.innerHTML = '';
    }
});

// Prevent the click on suggestions from bubbling up to the document
document.getElementById('searchSuggestions').addEventListener('click', function (event) {
    event.stopPropagation();
});

function flipAllCards() {
    const cards = document.querySelectorAll(".artist-card");
    cards.forEach(card => flipCard(card));
}

// Add this event listener to handle the keyboard shortcut
document.addEventListener('keydown', function (event) {
    // Check if the pressed key is 'F' (you can change this to any key you prefer)
    if (event.key === 'f' || event.key === 'F') {
        flipAllCards();
    }
});