(function rideScopeWrapper($) {

    // const $ = (selector) => document.querySelectorAll(selector)
    const dom = {
        game: $('.game')[0],
        time: $('.game .time')[0],
        code: $('.game .game-code')[0],
        menu: $('.menu')[0],
        rules: $('.rules')[0],
        rulesCloseBtn: $('.rules-window .close-button')[0],
        leaderboardCloseBtn: $('.leaderboard-window .close-button')[0],
        leaderboard: $('.leaderboard')[0],
        newGame: $('.new-game')[0],
        joinGame: $('.join-game')[0],
        options: $('.options')[0],
        getLevel: () => { return $('.levels input[type=radio]:checked')[0].value },
        getType: () => { return $('.sudoku-types input[type=radio]:checked')[0].value },
        playBtn: $('#play-btn')[0],
        clipboardBtn: $('#clipboard-btn')[0],
        rulesBtn: $('.options .rules-button')[0],
        leaderboardBtn: $('.options .leaderboard-button')[0],
        logoutBtn: $('.options .logout-button')[0],

    }

    const render = {
        updateTime: (value) => {
            dom.time.innerText = value
        }
    }

    const animation = {
        showMenu: () => {
            dom.game.classList.add('stop')
            gsap.to(dom.newGame, 0, { visibility: 'visible', x: 0, delay: 0 })
            gsap.from(dom.newGame, 1, { y: '-300px', ease: Elastic.easeOut.config(0.6, 0.4), delay: 0 })
            gsap.to(dom.joinGame, 0, { visibility: 'visible', x: 0, delay: 0.3 })
            gsap.from(dom.joinGame, 1, { y: '-300px', ease: Elastic.easeOut.config(0.6, 0.4), delay: 0.3 })
            gsap.to(dom.options, 0, { visibility: 'visible', x: 0, delay: 0.15 })
            gsap.from(dom.options, 1, { y: '-300px', ease: Elastic.easeOut.config(0.6, 0.4), delay: 0.15 })
        },
        hideMenu: () => {
            dom.game.classList.remove('stop')
            gsap.to(dom.newGame, 1, { opacity: 0, duration: 0.5, delay: 0 })
            gsap.to(dom.joinGame, 1, { opacity: 0, duration: 0.5, delay: 0.3 })
            gsap.to(dom.options, 1, { opacity: 0, duration: 0.5, delay: 0.15 })
            gsap.to(dom.menu, 1, { display: "none", duration: 0.5, delay: 0.15 })
        },
    }

    let timer

    window.onload = init

    function init() {
        dom.playBtn.addEventListener('click', startGame)
        dom.leaderboardBtn.addEventListener('click', showLeaderboard)
        dom.rulesBtn.addEventListener('click', showRules)
        dom.logoutBtn.addEventListener('click', logout)
        dom.rulesCloseBtn.addEventListener('click', hideRules)
        dom.leaderboardCloseBtn.addEventListener('click', hideLeaderboard)
        dom.clipboardBtn.addEventListener('click', copyToClipBoard)

        $('#linkForm').submit(joinGame);

        newGame()
    }

    function newGame() {
        timer = new Timer(render.updateTime)
        animation.showMenu()
    }

    function startGame() {
        render.updateTime('00:00')
        animation.hideMenu()
        level = dom.getLevel().toUpperCase()
        type = dom.getType().toUpperCase()
        connectToWebSocket()
        requestCreateGame(level, type, "email@email.com")
        timer.start()
    }

    function connectToWebSocket(){
        socket = new WebSocket(_config.websocket.endpointUrl);

        socket.onopen = function(event) {
           console.log('Connection Open');
           console.log(event)
        };

        socket.onmessage = function(event) {
            console.log(event.data)
        };

        socket.onerror = function(event) {
            console.error("WebSocket error observed:", event);
        };

        socket.onclose = function(event) {
           console.log('Connection Closed');
        };
    }

    function sendMessage(){
        payload = { "action": "onMessage", "message": "Message Ania" };

        socket.send(JSON.stringify(payload));
    }

    function joinGame() {
        render.updateTime('00:00')
        animation.hideMenu()
        var code = $('#linkInput').val();
        console.log(code)
        requestJoinGame(code, "email2@email.com")

        timer.start()
    }

    function hideUI(element) {
        element.style.display = "none"
        element.style.visibility = 'hidden'
    }

    function showUI(element) {
        element.style.display = "flex"
        element.style.visibility = 'visible'
    }

    function showRules() {
        hideUI(dom.menu)
        showUI(dom.rules)
    }

    function showLeaderboard() {
        hideUI(dom.menu)
        showUI(dom.leaderboard)
    }

    function hideRules() {
        hideUI(dom.rules)
        showUI(dom.menu)
    }

    function hideLeaderboard() {
        hideUI(dom.leaderboard)
        showUI(dom.menu)
    }

    function logout() {
        // ToDo: wyrzucić to
        addLeaderboardRow("Classic Sudoku", "HARD", "30:20")
    }

    function addLeaderboardRow(type, level, time) {
        if (!document.getElementsByTagName) return;
        tabBody = document.getElementById("leaderboard-table");
        row = document.createElement("tr");
        cell1 = document.createElement("td");
        cell2 = document.createElement("td");
        cell3 = document.createElement("td");
        textnode1 = document.createTextNode(type);
        textnode2 = document.createTextNode(level);
        textnode3 = document.createTextNode(time);
        cell1.appendChild(textnode1);
        cell2.appendChild(textnode2);
        cell3.appendChild(textnode3);
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        tabBody.appendChild(row);
    }

    var WildRydes = window.WildRydes || {};

    var authToken;

    WildRydes.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '/signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });

    function requestCreateGame(lvl, type, email) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/create-game',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                lvl: lvl,
                type: type,
                email: email
            }),
            contentType: 'application/json',
            success: completeCreateGameRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
            }
        });
    }

    function completeCreateGameRequest(result) {
        console.log('Response received from API: ', result);
        initGame(result.board)
        dom.code.innerText = result.roomId
        window.roomId = result.roomId
    }

    function requestJoinGame(roomId, email) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/join-game',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                roomId: roomId,
                email: email
            }),
            contentType: 'application/json',
            success: completeJoinGameRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
            }
        });
    }

    function completeJoinGameRequest(result) {
        console.log('Response received from API: ', result);
        initGame(result.board)
        dom.code.innerText = result.roomId
        window.roomId = result.roomId
    }

    function copyToClipBoard() {
        var copyText = document.getElementById("code-lbl");
        var textArea = document.createElement("textarea");
        textArea.value = copyText.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("Copy");
        textArea.remove();
        // ToDo: to be deleted
        sendMessage();
    }


}(jQuery));