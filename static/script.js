const cardStates = new Map();

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

        cardInner.style.transform = "rotateY(0deg)";
        front.style.opacity = "1";
        members.style.opacity = "0";
        locations.style.opacity = "0";
        dates.style.opacity = "0";

        card.addEventListener("click", () => flipCard(card));
    });

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', searchArtists);
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
    const relations = cardElement.querySelector(".card-relations"); // New Relations section

    // Reset opacity and z-index for all faces
    front.style.opacity = "0";
    members.style.opacity = "0";
    locations.style.opacity = "0";
    dates.style.opacity = "0";
    relations.style.opacity = "0"; // Reset Relations section

    front.style.zIndex = "1";
    members.style.zIndex = "1";
    locations.style.zIndex = "1";
    dates.style.zIndex = "1";
    relations.style.zIndex = "1"; // Reset z-index

    // Update the card based on the next state
    if (nextState === 0) {
        console.log(`Flipping ${artistName}'s card to: Front Side`);
        cardInner.style.transform = "rotateY(0deg)";
        front.style.opacity = "1";
        front.style.zIndex = "5"; // Bring front to top
    } else if (nextState === 1) {
        console.log(`Flipping ${artistName}'s card to: Members Section`);
        cardInner.style.transform = "rotateY(180deg)";
        members.style.opacity = "1";
        members.style.zIndex = "5"; // Bring members to top

        const membersTitle = cardElement.querySelector('.card-members .category-title');
        const membersList = cardElement.querySelectorAll('.card-members li');
        membersTitle.textContent = membersList.length === 1 ? 'Artist' : 'Members';
    } else if (nextState === 2) {
        console.log(`Flipping ${artistName}'s card to: Locations Section`);
        cardInner.style.transform = "rotateY(360deg)";
        locations.style.opacity = "1";
        locations.style.zIndex = "5"; // Bring locations to top

        const locationsTitle = cardElement.querySelector('.card-locations .category-title');
        const locationsList = cardElement.querySelectorAll('.card-locations li');
        locationsTitle.textContent = locationsList.length === 1 ? 'Location' : 'Locations';
    } else if (nextState === 3) {
        console.log(`Flipping ${artistName}'s card to: Dates Section`);
        cardInner.style.transform = "rotateY(540deg)";
        dates.style.opacity = "1";
        dates.style.zIndex = "5"; // Bring dates to top

        const datesTitle = cardElement.querySelector('.card-dates .category-title');
        const datesList = cardElement.querySelectorAll('.card-dates li');
        datesTitle.textContent = datesList.length === 1 ? 'Date' : 'Dates';
    } else if (nextState === 4) {
        console.log(`Flipping ${artistName}'s card to: Relations Section`);
        cardInner.style.transform = "rotateY(720deg)";
        relations.style.opacity = "1";
        relations.style.zIndex = "5"; // Bring relations to top

        const relationsTitle = cardElement.querySelector('.card-relations .category-title');
        const relationsList = cardElement.querySelectorAll('.card-relations li');
        relationsTitle.textContent = relationsList.length === 1 ? 'Relation' : 'Relations';
    }
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
        });
        searchSuggestions.appendChild(suggestionElement);
    });
}
