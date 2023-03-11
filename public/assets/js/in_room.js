const controlButtons = document.querySelector('#control-buttons');
const miniCards = document.querySelector('#mini-cards');
const votesText = document.querySelector('.js-votes-text');
const mediumText = document.querySelector('.js-medium');
const imVoterInput = document.querySelector('.js-im-voter');

function imVoter() {
    if(typeof imVoterInput !== "undefined" && imVoterInput !== null) {
        const roomNumber = window.location.pathname.split("/").pop();
        if(getCookie("voter") !== "") {
            imVoterInput.checked = getCookie('voter') === "true";
        }
        imVoterInput.addEventListener('click', function() {
            socket.emit('im voter', imVoterInput.checked, roomNumber, getCookie('socketId'))
            createCookie('voter', imVoterInput.checked, 1)
        });
    }
}

function join(){
    const roomNumber = window.location.pathname.split("/").pop();
    if(getCookie('socketId') === "") {
        socket.emit('join room', roomNumber, getCookie('userName'));
    }
}

socket.on('joined room', function(roomData, socketId) {
   joined(roomData, socketId)
});

function joined(roomData, socketId) {
    createCookie('socketId', socketId, 1);
    imVoterInput.checked = true;
    createCookie('voter', true, 1)
}

function getRoomInfo() {
    const roomNumber = window.location.pathname.split("/").pop();
    socket.emit('room info', roomNumber, handleRoomInfo);
    if(getCookie("voter") === "") {
        createCookie('voter', true, 1)
        imVoterInput.checked = true;
    }
}

function handleRoomInfo(roomInfo) {
    let currentSocketId = getCookie('socketId');
    let room = roomInfo[0];
    let creator = room.creator;
    if(creator === currentSocketId) {
        let buttonReset = document.createElement('button');
        buttonReset.textContent = 'Resetear';
        buttonReset.className = 'btn btn-info';
        buttonReset.id = 'reset_votes';
        buttonReset.addEventListener('click', function() {
            socket.emit('reset points', room.roomNumber);
        });
        let buttonShow = document.createElement('button');
        buttonShow.textContent = 'Mostrar';
        buttonShow.className = 'btn btn-success';
        buttonShow.id = 'show_votes';
        buttonShow.addEventListener('click', function() {
           socket.emit('show points', room.roomNumber);
        });
        controlButtons.append(buttonShow, buttonReset);
    }

    socket.emit('refresh', room.roomNumber, room.miniCards, currentSocketId);
}
join();
imVoter();
getRoomInfo();
addClickListenerToCards();

socket.on('show points', (points) => {
    showPoints(points)
});

socket.on('update points', (votes) => {
    createVotesText(votes);
})

socket.on('refresh room', (miniCards, votes) => {
    createMinicards(miniCards, true);
    createVotesText(votes);
    mediumText.textContent = '';
});

function createVotesText(votes) {
    let totalVotes = votes[0];
    let totalValidVotes = votes[1];
    if(totalVotes === 0) {
        totalValidVotes = 0;
    }
    votesText.textContent = "Vots: (" + totalValidVotes + "/" + totalVotes + ")";
    if(imVoterInput.disabled){
        imVoterInput.disabled = false;
    }
}

function showPoints(points) {
    for(let i = miniCards.childNodes.length - 1; i >= 0; --i) {
        miniCards.removeChild(miniCards.childNodes[i]);
    }

    let indexToAddZero = [];
    for (let i = 0; i < points.length; i++) {
        let divMiniCard = document.createElement('div');
        divMiniCard.className = 'mini-card';
        let spanElement = document.createElement('span');
        if(points[i] === "0"){
            points[i] = "☕";
            indexToAddZero.push(i);
        }
        if(points[i] === null || points[i] === "?") {
            points[i] = "?";
            indexToAddZero.push(i);
        }
        spanElement.textContent = points[i];
        divMiniCard.append(spanElement);
        miniCards.append(divMiniCard);
    }

    for (let i = 0; i < indexToAddZero.length; i++) {
        let index = indexToAddZero[i];
        points[index] = 0;
    }

    let pointsLength = points.filter(p => p !== 0);
    if(pointsLength > 0) {
        let median = (sumValuesOfArray(points)) / pointsLength.length;
        mediumText.textContent = "Mitjana: " + Math.ceil(median);
        imVoterInput.disabled = true;
    }
}

function sumValuesOfArray(values)
{
    let total = 0;
    for (let i = 0; i < values.length; i++) {
        let value = values[i];
        total += parseInt(value, 10);
    }

    return total;
}

function addClickListenerToCards() {
    const roomNumber = window.location.pathname.split("/").pop();
    const cardButtons = document.getElementsByClassName('card');
    for(let i = 0; i < cardButtons.length; i++) {
        let cardButton = cardButtons[i];
        cardButton.addEventListener('click', function() {
            let socketId = getCookie('socketId');
            for(let i = miniCards.childNodes.length - 1; i >= 0; --i) {
                let card = miniCards.childNodes[i];
                let userCard = document.querySelector('[data-user="' + socketId + '"]');
                if(userCard !== null && typeof userCard !== "undefined" && imVoterInput.checked) {
                    userCard.firstChild.textContent = cardButton.dataset.value;
                    userCard.style.backgroundColor = "#d6e9de";
                    if(cardButton.dataset.value === "☕") {
                        cardButton.dataset.value = 0;
                    }
                    socket.emit('selected point', socketId, cardButton.dataset.value, roomNumber)
                    break;
                }

                if(card.firstChild !== null && card.firstChild.textContent === "?" && imVoterInput.checked) {
                    card.dataset.user = socketId;
                    card.firstChild.textContent = cardButton.dataset.value;
                    card.style.backgroundColor = "#d6e9de";
                    socket.emit('selected point', socketId, cardButton.dataset.value, roomNumber)
                    break;
                }
            }
        });
    }
}
function createMinicards(miniCardsServer, refresh = false) {
    if (refresh) {
        for (let i = miniCards.childNodes.length - 1; i >= 0; --i) {
            miniCards.removeChild(miniCards.childNodes[i]);
        }
    }
    let currentSocket = getCookie('socketId');
    for (let i = 0; i < miniCardsServer.length; i++) {
        let key = Object.keys(miniCardsServer[i])[0];
        let miniCard = miniCardsServer[i][key];
        if(miniCard.voter) {
            let divMiniCard = document.createElement('div');
            divMiniCard.className = 'mini-card';
            let spanElement = document.createElement('span');
            if(key === currentSocket) {
                divMiniCard.style.backgroundColor = "#d6e9de";
                divMiniCard.dataset.user = currentSocket;
            }
            if (miniCard.value && miniCard.socket === currentSocket) {
                spanElement.textContent = miniCard.value;
            } else {
                spanElement.textContent = "?"
            }

            divMiniCard.append(spanElement);
            miniCards.append(divMiniCard);
        }
    }
}