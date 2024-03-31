const upcomingEventsContainer = document.getElementById('upcomingEvents');
const recommendedEventsContainer = document.getElementById('recommendedEvents');
const loadingSpinner = document.getElementById('loadingSpinner');
let upcomingPage = 1; // For pagination

// Function to fetch upcoming events
async function fetchUpcomingEvents() {
    try {
        const response = await fetch(`https://gg-backend-assignment.azurewebsites.net/api/Events?code=FOX643kbHEAkyPbdd8nwNLkekHcL4z0hzWBGCd64Ur7mAzFuRCHeyQ==&page=${upcomingPage}&type=upcoming`);
        const data = await response.json();
        return data.events; // Return the 'events' array
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        return [];
    }
}

// Function to fetch recommended events
async function fetchRecommendedEvents() {
    try {
        const response = await fetch(`https://gg-backend-assignment.azurewebsites.net/api/Events?code=FOX643kbHEAkyPbdd8nwNLkekHcL4z0hzWBGCd64Ur7mAzFuRCHeyQ==&type=reco`);
        const data = await response.json();
        return data.events; // Return the 'events' array
    } catch (error) {
        console.error('Error fetching recommended events:', error);
        return [];
    }
}

// Function to display upcoming events
function displayUpcomingEvents(events) {
    if (!Array.isArray(events)) {
        console.error('Upcoming events data is not an array:', events);
        return;
    }

    events.forEach(event => {
        const eventElement = createEventElement(event);
        upcomingEventsContainer.appendChild(eventElement);
    });
}

// Function to display recommended events
function displayRecommendedEvents(events) {
    if (!Array.isArray(events)) {
        console.error('Recommended events data is not an array:', events);
        return;
    }

    events.forEach(event => {
        const eventElement = createEventElement(event);
        recommendedEventsContainer.appendChild(eventElement);
    });
}

// Function to create HTML elements for an event
function createEventElement(event) {
    const eventElement = document.createElement('div');
    eventElement.classList.add('event');

    const imgElement = document.createElement('img');
    imgElement.src = event.imgUrl ? `https://drive.google.com/thumbnail?id=${getIdFromUrl(event.imgUrl)}` : 'placeholder.jpg';
    imgElement.alt = event.eventName;

    const titleElement = document.createElement('h2');
    titleElement.textContent = event.eventName || 'Unknown Event';

    const locationElement = document.createElement('p');
    locationElement.textContent = `${event.cityName || 'Unknown City'} - ${new Date(event.date).toLocaleDateString()}`;

    const weatherElement = document.createElement('p');
    weatherElement.textContent = `Weather: ${event.weather || 'Unknown'}`;

    const distanceElement = document.createElement('p');
    distanceElement.textContent = `Distance: ${event.distanceKm || 'Unknown'} km`;

    eventElement.appendChild(imgElement);
    eventElement.appendChild(titleElement);
    eventElement.appendChild(locationElement);
    eventElement.appendChild(weatherElement);
    eventElement.appendChild(distanceElement);

    return eventElement;
}

// Function to extract file ID from Google Drive URL
function getIdFromUrl(url) {
    const idMatch = url.match(/\/([\w-]{25,})\//);
    return idMatch ? idMatch[1] : null;
}

// Initial fetch and display of events
fetchUpcomingEvents().then(data => {
    displayUpcomingEvents(data);
});

fetchRecommendedEvents().then(data => {
    displayRecommendedEvents(data);
});

// Event listener for scrolling to fetch more upcoming events
upcomingEventsContainer.addEventListener('scroll', () => {
    if (upcomingEventsContainer.scrollTop + upcomingEventsContainer.clientHeight >= upcomingEventsContainer.scrollHeight) {
        upcomingPage++;
        loadingSpinner.style.display = 'block';
        fetchUpcomingEvents().then(data => {
            displayUpcomingEvents(data);
            loadingSpinner.style.display = 'none';
        });
    }
});
