const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const cohortName = '2407-FTB-ET-WEB-PT/';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}players`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log(data);
        
        return data.data.players; 
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
        return [];
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${APIURL}players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const renderAllPlayers = (playerList) => {
    try {
        const playerContainerHTML = playerList.map(player => `
            <div class="player-card">
                <h3>${player.name}</h3>
                <img src="${player.imageUrl}" alt="${player.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/150';" />
                <button onclick="fetchSinglePlayer(${player.id})">See details</button>
                <button onclick="removePlayer(${player.id}); refreshPlayers()">Remove from roster</button>
            </div>
        `).join('');
        playerContainer.innerHTML = playerContainerHTML;
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const refreshPlayers = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
};

const renderNewPlayerForm = () => {
    try {
        newPlayerFormContainer.innerHTML = `
            <form id="add-player-form">
                <input type="text" id="player-name" placeholder="Player Name" required />
                <input type="url" id="player-image" placeholder="Image URL" required />
                <button type="submit">Add Player</button>
            </form>
        `;
        
        document.getElementById('add-player-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPlayer = {
                name: document.getElementById('player-name').value,
                imageUrl: document.getElementById('player-image').value,
            };
            await addNewPlayer(newPlayer);
            await refreshPlayers(); 
            document.getElementById('add-player-form').reset(); 
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};


const init = async () => {
    await refreshPlayers(); 
    renderNewPlayerForm();
}

init();