(function rideScopeWrapper($) {

    const LEVEL_COUNT = { EASY: 1, NORMAL: 2, HARD: 3 }

    // const $ = (selector) => document.querySelectorAll(selector)
    const dom = {
        game: $('.game')[0],
        time: $('.game .time')[0],
        menu: $('.menu')[0],
        rules: $('.rules')[0],
        rulesCloseBtn: $('.rules-window .close-button')[0],
        leaderboardCloseBtn: $('.leaderboard-window .close-button')[0],
        leaderboard: $('.leaderboard')[0],
        newGame: $('.new-game')[0],
        joinGame: $('.join-game')[0],
        options: $('.options')[0],
        getLevel: () => { return $('input[type=radio]:checked')[0].value },
        playBtn: $('#play-btn')[0],
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
        dom.leaderboardBtn.addEventListener('click', logout)
        dom.rulesCloseBtn.addEventListener('click', hideRules)
        dom.leaderboardCloseBtn.addEventListener('click', hideLeaderboard)

        $('#linkForm').submit(joinGame);

        newGame()
    }

    function newGame() {
        timer = new Timer(render.updateTime)
        animation.showMenu()
    }

    function startGame() {
        initGame()
        render.updateTime('00:00')
        animation.hideMenu()
        level = dom.getLevel().toUpperCase()
        requestCreateGame(level, "0", "email@email.com")
        timer.start()
    }

    function joinGame() {
        var code = $('#linkInput').val();
        console.log(code)

        render.updateTime('00:00')
        animation.hideMenu()
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
    }


}(jQuery));