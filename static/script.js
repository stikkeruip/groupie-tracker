const cardStates = [];
let currentlyFlippedCardIndex = null;

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".artist-card");
    cards.forEach((card, index) => {
        cardStates[index] = 0;
        card.addEventListener("click", () => flipCard(card, index));
    });
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', searchArtists);
});

function flipCard(cardElement, index) {
    const artistName = cardElement.getAttribute('data-artist-name');
    const artistId = cardElement.getAttribute('data-artist-id');

    // Reset all cards except the one being flipped
    const allCards = document.querySelectorAll('.artist-card');
    allCards.forEach((card, idx) => {
        if (idx !== index) {
            resetCard(card, idx);
        }
    });

    // Cycle through card states
    let nextFlipCount = (cardStates[index] + 1) % 3;
    cardStates[index] = nextFlipCount;

    // Set this card as the currently flipped card
    currentlyFlippedCardIndex = index;

    // Log which section we're about to flip to
    if (nextFlipCount === 0) {
        console.log(`About to flip ${artistName}'s card to: Front Side`);
    } else if (nextFlipCount === 1) {
        console.log(`About to flip ${artistName}'s card to: Members Section`);
    } else {
        console.log(`About to flip ${artistName}'s card to: Locations Section`);
        // When flipping to locations, fetch and display the data
        const locationsList = cardElement.querySelector('.locations-list');
        locationsList.innerHTML = '<li>Loading locations...</li>';

        fetch(`/api/locations?id=${artistId}`)
            .then(response => response.json())
            .then(locations => {
                // Format locations before displaying them
                locationsList.innerHTML = locations.map(location => {
                    const formattedLocation = location
                        .replace(/_/g, ' ')
                        .replace(/-/g, ', ')
                        .replace(/\b\w/g, (char) => char.toUpperCase());
                    return `<li>${formattedLocation}</li>`;
                }).join('');
            })
            .catch(error => {
                locationsList.innerHTML = '<li>Error loading locations</li>';
                console.error('Error:', error);
            });
    }

    const cardInner = cardElement.querySelector(".card-inner");
    const front = cardElement.querySelector(".card-front");
    const members = cardElement.querySelector(".card-members");
    const locations = cardElement.querySelector(".card-locations");

    front.style.opacity = "0";
    members.style.opacity = "0";
    locations.style.opacity = "0";

    if (nextFlipCount === 0) {
        cardInner.style.transform = "rotateY(0deg)";
        front.style.opacity = "1";
    } else if (nextFlipCount === 1) {
        cardInner.style.transform = "rotateY(180deg)";
        members.style.opacity = "1";
    } else {
        cardInner.style.transform = "rotateY(360deg)";
        locations.style.opacity = "1";
    }
}
function resetCard(cardElement, index) {
    cardStates[index] = 0;
    const cardInner = cardElement.querySelector(".card-inner");
    const front = cardElement.querySelector(".card-front");
    const members = cardElement.querySelector(".card-members");
    const locations = cardElement.querySelector(".card-locations");

    cardInner.style.transform = "rotateY(0deg)";
    front.style.opacity = "1";
    members.style.opacity = "0";
    locations.style.opacity = "0";
}
function searchArtists() {
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const filter = searchInput.value.toLowerCase();
    const artistCards = document.querySelectorAll('.artist-card');

    // Clear previous suggestions
    searchSuggestions.innerHTML = '';

    if (filter.length === 0) {
        artistCards.forEach(card => card.style.display = "");
        return;
    }

    let suggestions = [];

    artistCards.forEach(card => {
        const artistName = card.getAttribute('data-artist-name').toLowerCase();
        const creationDate = card.querySelector('.artist-info p:nth-child(1) strong').textContent.toLowerCase();
        const firstAlbum = card.querySelector('.artist-info p:nth-child(2) strong').textContent.toLowerCase();
        const members = Array.from(card.querySelectorAll('.card-members li')).map(li => li.textContent.toLowerCase());
        const locations = Array.from(card.querySelectorAll('.locations-list li')).map(li => li.textContent.toLowerCase());

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
        });
        searchSuggestions.appendChild(suggestionElement);
    });
}