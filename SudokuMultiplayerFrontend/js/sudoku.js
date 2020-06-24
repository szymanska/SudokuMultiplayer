(function rideScopeWrapper($) {

    const dom = {
        game: $('.game')[0],

        infoTime: $('.game .time')[0],
        infoCode: $('.game .game-code')[0],
        infoLvl: $('.game #info-lvl')[0],
        infoType: $('.game #info-type')[0],
        infoPlayers: $('.game #info-players')[0],

        menu: $('.menu')[0],
        rules: $('.rules')[0],
        rulesCloseBtn: $('.rules-window .close-button')[0],
        leaderboardCloseBtn: $('.leaderboard-window .close-button')[0],
        leaderboard: $('.leaderboard')[0],
        newGame: $('.new-game')[0],
        joinGame: $('.join-game')[0],
        joinBtn: $('.link-button')[0],
        options: $('.options')[0],
        getLevel: () => { return $('.levels input[type=radio]:checked')[0].value },
        getType: () => { return $('.sudoku-types input[type=radio]:checked')[0].value },
        playBtn: $('#play-btn')[0],
        clipboardBtn: $('#clipboard-btn')[0],
        backBtn: $('#back-btn')[0],
        rulesBtn: $('.options .rules-button')[0],
        leaderboardBtn: $('.options .leaderboard-button')[0],
        logoutBtn: $('.options .logout-button')[0],

    }

    const render = {
        updateTime: (value) => {
            dom.infoTime.innerText = value
        }
    }

    const animation = {
        showMenu: () => {
            dom.game.classList.add('stop')
            dom.newGame.style.opacity = "1"
            dom.joinGame.style.opacity = "1"
            dom.options.style.opacity = "1"
            gsap.to(dom.newGame, 0, { visibility: 'visible', x: 0, delay: 0 })
            gsap.from(dom.newGame, 1, { y: '-300px', ease: Elastic.easeOut.config(0.6, 0.4), delay: 0 })
            gsap.to(dom.joinGame, 0, { visibility: 'visible', x: 0, delay: 0.3 })
            gsap.from(dom.joinGame, 1, { y: '-300px', ease: Elastic.easeOut.config(0.6, 0.4), delay: 0.3 })
            gsap.to(dom.options, 0, { visibility: 'visible', x: 0, delay: 0.15 })
            gsap.from(dom.options, 1, { y: '-300px', ease: Elastic.easeOut.config(0.6, 0.4), delay: 0.15 })
            gsap.to(dom.menu, 1, { display: "flex", duration: 0.5, delay: 0.15 })
        },
        deleteBlur: () => {
            dom.game.classList.remove('stop')
        },
        hideMenuKeepBlur: () => {
            gsap.to(dom.newGame, 1, { opacity: 0, duration: 0.5, delay: 0 })
            gsap.to(dom.joinGame, 1, { opacity: 0, duration: 0.5, delay: 0.3 })
            gsap.to(dom.options, 1, { opacity: 0, duration: 0.5, delay: 0.15 })
            gsap.to(dom.menu, 1, { display: "none", duration: 0.5, delay: 0.15 })
        },
        hideMenu: () => {
            animation.deleteBlur()
            animation.hideMenuKeepBlur()
        },
    }

    let timer
    window.onload = init
    var SudokuGame = window.SudokuGame || {};

    window.onbeforeunload = function () {
        disconnect()
    }

    function init() {
        animation.showMenu()

        dom.playBtn.addEventListener('click', startGame)
        dom.leaderboardBtn.addEventListener('click', showLeaderboard)
        dom.rulesBtn.addEventListener('click', showRules)
        dom.logoutBtn.addEventListener('click', logout)
        dom.rulesCloseBtn.addEventListener('click', hideRules)
        dom.leaderboardCloseBtn.addEventListener('click', hideLeaderboard)
        dom.clipboardBtn.addEventListener('click', copyToClipBoard)
        dom.joinBtn.addEventListener('click', joinGame);
        dom.backBtn.addEventListener('click', goBackToMenu)

        document.getElementById("diagonal").addEventListener('click', comingSoon)
        document.getElementById("windoku").addEventListener('click', comingSoon)

        timer = new Timer(render.updateTime)

        initBoard()

        requestGetLeaderboard()
    }

    function comingSoon() {
        $("#classic").prop("checked", true);
        alert("This game mode is not ready yet. Coming soon!")
    }

    function startGame() {
        level = dom.getLevel().toUpperCase()
        type = dom.getType().toUpperCase()
        requestCreateGame(level, type, getCognitoUsername())
        animation.hideMenuKeepBlur()
    }

    function joinGame() {
        var code = $('#linkInput').val();
        if (code.length != 8) {
            alert("Provide 8-digit Room code!")
            return;
        }
        window.roomId = code
        connectToWebSocket()
        animation.hideMenuKeepBlur()
    }

    function connectToWebSocket() {
        socket = new WebSocket(_config.websocket.endpointUrl + "?email=" + getCognitoUsername() + "&roomId=" + window.roomId);
        window.socket = socket
        socket.onopen = function (event) {
            console.log('Connection Open');

            payload = {
                "action": "joinGame", "message": {
                    "email": getCognitoUsername(),
                    "roomId": window.roomId
                }
            };

            socket.send(JSON.stringify(payload));
        };

        socket.onmessage = function (event) {
            var result = JSON.parse(event.data);

            if (result['message'] == "Internal server error") {
                disconnect()
                connectToWebSocket()
                console.log("Internal server error: ", result)
                console.log("Reconnecting")
                return
            }

            body = result['body']
            switch (body['messageType']) {
                case "JoinResult":
                    launchGame(body['room'])
                    break;
                case "NumberChanged":
                    changeNumber(body['row'], body['column'], body['value'])
                    break;
                case "NewPlayerAnnounce":
                    displayCoplayer(body['email'])
                    break;
                case "NumberChangedError":
                    alert(body['message'])
                    break;
                case "GameIsWon":
                    postTime(timer.time)
                    changeNumber(body['row'], body['column'], body['value'])
                    timer.stop()
                    setTimeout(function () {
                        disconnect()
                        alert("Game is won!!!")
                    }, 2000);
                    break;
                case "PlayerLeftRoom":
                    removeCoplayer(body['email'])
                    break
            }

        };

        socket.onerror = function (event) {
            console.error("WebSocket error observed:", event);
            disconnect()
            connectToWebSocket()
        };

        socket.onclose = function (event) {
            console.log('Connection Closed');
        };
    }

    window.connectToWebSocket = connectToWebSocket

    function disconnect() {
        socket.close();
    }

    function launchGame(room) {
        initGame(room['sudoku'])

        stoper = Math.abs(new Date() - new Date(room.date.replace(/-/g, '/'))) - (2 * 60 * 60 * 1000)
        timer.start(stoper)
        dom.infoCode.innerText = room.GameId
        dom.infoLvl.innerText = room.lvl
        dom.infoType.innerText = room.type
        dom.infoPlayers.innerHTML = '';
        for (var i = 0; i < room.players.length; i++) {
            displayCoplayer(room.players[i][0])
        }
        animation.deleteBlur()
    }

    function displayCoplayer(email) {
        isEmailAlreadyDisplayed = false
        $('#info-players').find('div').each(function () {
            if ($(this)[0].innerText == email) {
                isEmailAlreadyDisplayed = true
                return
            }
        });

        if (isEmailAlreadyDisplayed == false) {
            var newDiv = document.createElement("div");
            newDiv.innerHTML = email;
            dom.infoPlayers.appendChild(newDiv)
        }
    }

    function removeCoplayer(email) {
        $('#info-players').find('div').each(function () {
            if ($(this)[0].innerText == email) {
                dom.infoPlayers.removeChild($(this)[0])
            }
        });
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
        SudokuGame.signOut()
        window.location.href = '/signin.html';
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


    var authToken;

    SudokuGame.authToken.then(function setAuthToken(token) {
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
                alert('An error occured when creating game:\n' + jqXHR.responseText);
            }
        });
    }

    function completeCreateGameRequest(result) {
        window.roomId = result.roomId
        connectToWebSocket()
    }

    function requestGetLeaderboard() {
        $.ajax({
            method: 'GET',
            url: _config.api.invokeUrl + '/get-leaderboard',
            headers: {
                Authorization: authToken
            },
            success: completeGetLeaderboard,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                alert('An error occured when requesting leaderboard:\n' + jqXHR.responseText);
            }
        });
    }

    function completeGetLeaderboard(result) {
        for (var i = 0; i < result.length; i++) {
            row = result[i];
            addLeaderboardRow(row.type, row.level, row.time);
        }
    }

    function postTime(time) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/send-time',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                time: time,
                roomId: window.roomId
            }),
            contentType: 'application/json',
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                alert('An error occured when sending time:\n' + jqXHR.responseText);
            }
        });
    }

    function copyToClipBoard() {
        var copyText = document.getElementById("code-lbl");
        var textArea = document.createElement("textarea");
        textArea.value = copyText.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("Copy");
        textArea.remove();
    }

    function goBackToMenu() {
        disconnect()
        animation.showMenu()
    }


}(jQuery));