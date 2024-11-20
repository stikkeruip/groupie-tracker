document.addEventListener("DOMContentLoaded", () => {

    // New code for setting up date ranges
    const creationDates = Array.from(document.querySelectorAll('.artist-card .artist-info p:nth-child(1) strong')).map(el => parseInt(el.textContent));
    const firstAlbumDates = Array.from(document.querySelectorAll('.artist-card .artist-info p:nth-child(2) strong')).map(el => parseInt(el.textContent.split('-')[2]));

    const minCreationDate = Math.min(...creationDates);
    const maxCreationDate = Math.max(...creationDates);
    const minFirstAlbumDate = Math.min(...firstAlbumDates);
    const maxFirstAlbumDate = Math.max(...firstAlbumDates);

    document.getElementById('creationDateMin').min = minCreationDate;
    document.getElementById('creationDateMin').max = maxCreationDate;
    document.getElementById('creationDateMax').min = minCreationDate;
    document.getElementById('creationDateMax').max = maxCreationDate;

    document.getElementById('firstAlbumDateMin').min = minFirstAlbumDate;
    document.getElementById('firstAlbumDateMin').max = maxFirstAlbumDate;
    document.getElementById('firstAlbumDateMax').min = minFirstAlbumDate;
    document.getElementById('firstAlbumDateMax').max = maxFirstAlbumDate;

    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterOptions = document.getElementById('filterOptions');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const artistCards = document.querySelectorAll('.artist-card');

    // Toggle filter options visibility
    filterToggleBtn.addEventListener('click', function () {
        filterOptions.style.display = filterOptions.style.display === 'none' ? 'block' : 'none';
    });

    // Clear all filters
    clearFiltersBtn.addEventListener('click', function () {
        // Reset range sliders to their initial values
        document.getElementById('creationDateMin').value = document.getElementById('creationDateMin').min;
        document.getElementById('creationDateMax').value = document.getElementById('creationDateMax').max;
        document.getElementById('firstAlbumDateMin').value = document.getElementById('firstAlbumDateMin').min;
        document.getElementById('firstAlbumDateMax').value = document.getElementById('firstAlbumDateMax').max;

        // Update the displayed values
        document.getElementById('creationDateMinValue').textContent = document.getElementById('creationDateMin').min;
        document.getElementById('creationDateMaxValue').textContent = document.getElementById('creationDateMax').max;
        document.getElementById('firstAlbumDateMinValue').textContent = document.getElementById('firstAlbumDateMin').min;
        document.getElementById('firstAlbumDateMaxValue').textContent = document.getElementById('firstAlbumDateMax').max;

        // Uncheck all checkboxes
        document.querySelectorAll('#memberCheckboxes input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('#countryCheckboxes input[type="checkbox"]').forEach(cb => cb.checked = false);

        // Show all artist cards
        document.querySelectorAll('.artist-card').forEach(card => {
            card.style.display = 'block';
        });

        // Optionally, you can call filterArtists() here if you want to apply any default filtering
        filterArtists();
    });

    // Filter artists based on criteria
    function filterArtists() {
        const creationDateMin = parseInt(document.getElementById('creationDateMin').value);
        const creationDateMax = parseInt(document.getElementById('creationDateMax').value);
        const firstAlbumDateMin = parseInt(document.getElementById('firstAlbumDateMin').value);
        const firstAlbumDateMax = parseInt(document.getElementById('firstAlbumDateMax').value);
        const selectedMembers = Array.from(document.querySelectorAll('#memberCheckboxes input[type="checkbox"]:checked')).map(cb => parseInt(cb.value));
        const selectedCountries = Array.from(document.querySelectorAll('#countryCheckboxes input[type="checkbox"]:checked')).map(cb => cb.value.toLowerCase());

        artistCards.forEach(card => {
            const creationDate = parseInt(card.querySelector('.artist-info p:nth-child(1) strong').textContent);
            const firstAlbumDateFull = card.querySelector('.artist-info p:nth-child(2) strong').textContent;
            const firstAlbumDate = parseInt(firstAlbumDateFull.split('-')[2]); // Extract year from DD-MM-YYYY format
            const membersCount = parseInt(card.querySelector('.artist-info p:nth-child(3) strong').textContent);

            // Get countries for this artist
            const artistCountries = Array.from(card.querySelectorAll('.card-locations ul li'))
                .map(li => li.textContent.split(', ').pop().trim().toLowerCase());

            const matchesCreationDate = creationDate >= creationDateMin && creationDate <= creationDateMax;
            const matchesFirstAlbumDate = firstAlbumDate >= firstAlbumDateMin && firstAlbumDate <= firstAlbumDateMax;
            const matchesMembers = selectedMembers.length === 0 || selectedMembers.includes(membersCount);
            const matchesCountries = selectedCountries.length === 0 || artistCountries.some(country => selectedCountries.includes(country));

            if (matchesCreationDate && matchesFirstAlbumDate && matchesMembers && matchesCountries) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }


    // Populate member checkboxes
    const memberCounts = [...new Set(Array.from(artistCards).map(card => parseInt(card.querySelector('.artist-info p:nth-child(3) strong').textContent)))].sort((a, b) => a - b);
    const memberCheckboxes = document.getElementById('memberCheckboxes');
    memberCounts.forEach((count, index) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `member-${count}`;
        checkbox.value = count;
        checkbox.addEventListener('change', filterArtists);

        const label = document.createElement('label');
        label.htmlFor = `member-${count}`;
        label.textContent = count;

        // Remove padding from the 8th (last) checkbox label
        if (index === memberCounts.length - 1) {
            label.style.margin = '0';
        }

        memberCheckboxes.appendChild(checkbox);
        memberCheckboxes.appendChild(label);
    });
    // Setup range sliders
    setupRangeSlider('creationDate', 1958, 2015);
    setupRangeSlider('firstAlbumDate', 1963, 2018);

    function setupRangeSlider(id, min, max) {
        const minSlider = document.getElementById(`${id}Min`);
        const maxSlider = document.getElementById(`${id}Max`);
        const minValue = document.getElementById(`${id}MinValue`);
        const maxValue = document.getElementById(`${id}MaxValue`);

        minSlider.addEventListener('input', function () {
            const minVal = parseInt(minSlider.value);
            const maxVal = parseInt(maxSlider.value);

            if (minVal > maxVal) {
                minSlider.value = maxVal;
            }
            minValue.textContent = minSlider.value;
            filterArtists();
        });

        maxSlider.addEventListener('input', function () {
            const minVal = parseInt(minSlider.value);
            const maxVal = parseInt(maxSlider.value);

            if (maxVal < minVal) {
                maxSlider.value = minVal;
            }
            maxValue.textContent = maxSlider.value;
            filterArtists();
        });
    }

    // Function to close the filter options
    function closeFilterOptions(event) {
        if (!filterOptions.contains(event.target) && event.target !== filterToggleBtn) {
            filterOptions.style.display = 'none';
        }
    }

    // Add click event listener to the document
    document.addEventListener('click', closeFilterOptions);
    // Prevent the click on filter options from closing itself
    filterOptions.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    // Prevent the click on filter toggle button from being caught by the document listener
    filterToggleBtn.addEventListener('click', function (event) {
        event.stopPropagation();
    });
});

// Add this function to extract unique countries from locations
function getUniqueCountries(artists) {
    const countries = new Set();
    artists.forEach(artist => {
        const locations = artist.querySelector('.card-locations ul').querySelectorAll('li');
        locations.forEach(location => {
            const locationText = location.textContent.trim();
            const parts = locationText.split(', ');
            if (parts.length > 1) {
                const country = parts[parts.length - 1].trim();
                countries.add(country);
            }
        });
    });
    return Array.from(countries).sort();
}
document.addEventListener('DOMContentLoaded', function () {
    const dropdownToggle = document.getElementById('countriesDropdownToggle');
    const countryCheckboxes = document.getElementById('countryCheckboxes');

    // Toggle dropdown when clicking the button
    dropdownToggle.addEventListener('click', function () {
        if (countryCheckboxes.style.display === 'none' || countryCheckboxes.style.display === '') {
            countryCheckboxes.style.display = 'block';
        } else {
            countryCheckboxes.style.display = 'none';
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (event) {
        if (!dropdownToggle.contains(event.target) && !countryCheckboxes.contains(event.target)) {
            countryCheckboxes.style.display = 'none';
        }
    });

    // Populate country checkboxes (assuming you have a list of countries)
    const countries = getUniqueCountries(document.querySelectorAll('.artist-card'));
    countries.forEach(country => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `country-${country}`;
        checkbox.value = country;

        const label = document.createElement('label');
        label.htmlFor = `country-${country}`;
        label.textContent = country;

        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);

        countryCheckboxes.appendChild(div);
    });

    // Add event listener for country checkboxes
    countryCheckboxes.addEventListener('change', filterArtistsByCountry);
});

function filterArtistsByCountry() {
    const selectedCountries = Array.from(document.querySelectorAll('#countryCheckboxes input:checked')).map(cb => cb.value);
    const artistCards = document.querySelectorAll('.artist-card');

    artistCards.forEach(card => {
        const locations = card.querySelectorAll('.card-locations li');
        const artistCountries = Array.from(locations).map(location => {
            const parts = location.textContent.trim().split(', ');
            return parts[parts.length - 1].trim();
        });

        const shouldShow = selectedCountries.length === 0 || artistCountries.some(country => selectedCountries.includes(country));
        card.style.display = shouldShow ? '' : 'none';
    });
}