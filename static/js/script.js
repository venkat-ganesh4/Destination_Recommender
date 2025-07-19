document.getElementById('recommendationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const userPreferences = {
        theme: document.getElementById('theme').value,
        budget: document.getElementById('budget').value,
        travel_companions: document.getElementById('travel_companions').value
    };

    fetch('/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userPreferences)
    })
    .then(response => response.json())
    .then(data => {
        const recommendationsContainer = document.getElementById('recommendations');
        recommendationsContainer.innerHTML = '';
        if (data.length > 0) {
            data = shuffleArray(data);

            data.forEach(destination => {

                const destinationDiv = document.createElement('div');
                destinationDiv.classList.add('destination');

                const image = document.createElement('img');
                image.src = destination.Image_Link;
                image.alt = destination.Destination_Name;
                destinationDiv.appendChild(image);

                const infoDiv = document.createElement('div');
                infoDiv.classList.add('info');

                const name = document.createElement('h3');
                name.textContent = destination.Destination_Name;
                infoDiv.appendChild(name);

                const description = document.createElement('p');
                description.textContent = destination.Description;
                infoDiv.appendChild(description);

                const moreInfo = document.createElement('a');
                moreInfo.href = destination.More_Info;
                moreInfo.textContent = 'More Info';
                moreInfo.target = '_blank';
                infoDiv.appendChild(moreInfo);

                destinationDiv.appendChild(infoDiv);
                recommendationsContainer.appendChild(destinationDiv);
            });
        } else {
            recommendationsContainer.textContent = 'No recommendations found for your preferences.';
        }
    })
    .catch(error => console.error('Error:', error));
});
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
