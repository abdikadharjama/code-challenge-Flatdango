document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
});

function fetchMovies() {
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(films => {
            populateFilmsMenu(films);
            if (films.length > 0) {
                displayMovieDetails(films[0]);
            }
        });
}

function populateFilmsMenu(films) {
    const filmsList = document.getElementById('films');
    filmsList.innerHTML = '';
    films.forEach(film => {
        const filmItem = document.createElement('li');
        filmItem.textContent = film.title;
        filmItem.classList.add('film', 'item');
        filmItem.addEventListener('click', () => displayMovieDetails(film));
        filmsList.appendChild(filmItem);
    });
}

function displayMovieDetails(film) {
    document.getElementById('poster').src = film.poster;
    document.getElementById('title').textContent = film.title;
    document.getElementById('runtime').textContent = `Runtime: ${film.runtime} minutes`;
    document.getElementById('showtime').textContent = `Showtime: ${film.showtime}`;
    document.getElementById('description').textContent = film.description;
    updateAvailableTickets(film);

    const buyButton = document.getElementById('buy-ticket');
    buyButton.disabled = film.capacity - film.tickets_sold <= 0;
    buyButton.onclick = () => buyTicket(film);
}

function updateAvailableTickets(film) {
    const availableTickets = film.capacity - film.tickets_sold;
    document.getElementById('available-tickets').textContent = `Available Tickets: ${availableTickets}`;
}

function buyTicket(film) {
    if (film.tickets_sold < film.capacity) {
        film.tickets_sold++;
        updateAvailableTickets(film);

        fetch(`http://localhost:3000/films/${film.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tickets_sold: film.tickets_sold })
        })
        .then(response => response.json())
        .then(updatedFilm => {
            console.log('Update successful:', updatedFilm);
        })
        .catch(error => {
            console.error('Error updating tickets:', error);
        });
    }
}
