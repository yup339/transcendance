//for user

window.addEventListener('beforeunload', function (event) {
    if (socket)
        socket.disconnect();
    // You can add custom message or actions if needed
});


class UserSocket{

    loggedIn = false;

    constructor() {
        this.loggedIn = false;
        try {
            this.socket = new WebSocket(`wss://${window.location.host}/ws/user`);
            this.socket.onopen = this.handleOpen.bind(this);
            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onclose = this.handleClose.bind(this);
        } catch (error) {
            console.error('WebSocket connection error:', error);
        }
    }
    handleOpen(event) {
        console.log('WebSocket connection opened.');
        if (this.loggedIn == false && localStorage.getItem('token') !== null)
        {
            console.log("Token found: " + localStorage.getItem('token'));
            console.log("Attempting to log in with token");
            this.sendInfo(JSON.stringify({type: 'token_login', token: localStorage.getItem('token')}));
        }
    }

    // use with serialize object
    sendInfo(info){
        this.socket.send(info);
    };
    
    handleClose(event) {
        console.log('WebSocket connection closed.');
    }

    handleMessage(event) {
        console.log("receiving data");
        try{
            const data = JSON.parse(event.data);
            switch (data.type){
                case 'login_success':
                case 'registration_success':
                    this.loginSuccess(data);
                    break;
                case 'registration_error':
                    this.registrationError(data);
                    break;
                case 'login_error':
                    this.loginError(data);
                    break;
                default:
                    this.updateUser(data);
                    break;
            }
        }
        catch (error){console.error(error)}
    }

    loginSuccess(data){
        this.loggedIn = true;
        try{
            const navid = document.getElementById('navid');
            console.log("Successfully logged in " + data.username);
            localStorage.setItem('token', data.token);
            navigateTo('game_choice');
            navid.innerHTML = ` <a class="nav-item nav-link active clickable" onclick="navigateTo('stats')">Stats</a>
                    <a class="nav-item nav-link active clickable" onclick="logout_user()")">Logout</a>`;
            
            
        }
        catch (error){
            console.error(error);
        }
    }

    registrationError(data){
        try{
            console.log("Registration error: " + data.message);
            navigateTo('signup');
        }
        catch (error){
            console.error(error);
        }
    }

    loginError(data){
        try{
            console.log("Login error: " + data.message);
            alert("Invalid username or password");
            navigateTo('login');
        }
        catch (error){
            console.error(error);
        }
    }

    updateUser(data){
        try{
            console.log("User update: " + data.username);
        }
        catch (error){
            console.error(error);
        }
    }

}

//for pong
class GameSocket{
    constructor() {
        try {
            this.socket = new WebSocket(`wss://${window.location.host}/ws/pong`);
            this.socket.onopen = this.handleOpen.bind(this);
            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onclose = this.handleClose.bind(this);
        } catch (error) {
            console.error('WebSocket connection error:', error);
        }
    }

    disconnect() {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.close();
        }
    }

    handleOpen(event) {
        console.log('WebSocket connection opened.');
    }

    // use with serialize object
    sendInfo(info){
        this.socket.send(info);
    };
    
    handleClose(event) {
        console.log('WebSocket connection closed:', event);
    }

    handleMessage(event) {
        try{
            const data = JSON.parse(event.data);
            switch (data.type){
                case 'ballPositionSync':
                    this.updateBallPos(data);
                    break;
                case 'paddlePositionSync':
                    this.updatePaddlePos(data);
                    break;
                case 'disconect':
                    console.log("disconect TODO");
                    break;
                case 'SCCCCOOOORRRREEEEE':
                    score(data.side);
                    balls[0].reset(-1);
                    let resetSide = 1;
                    if (data.side == 'left')
                        resetSide = -1
                    if (data.side == this.side){
                        balls[0].vec.x *= -1;
                        balls[0].reset(resetSide);
                        socket.sendInfo(balls[0].serialize());
                    }
                    break;
                case 'matchFound':
                    this.side = data.side;
                    gameIsOver = false;
                    console.log(this.side);
                    this.group = data.group
                    startOnlineMatch(data);
                break;
                case 'leaver':
                    console.log("bozo left")
                    pongLeaver();
                break;
            }
        }
        catch (error){console.error(error)}
    }

    updateBallPos(data){
        console.log("got an update of ball")
        balls[0].deserialize(data);
    }

    updatePaddlePos(data){
        if (this.side === 'left'){
            rightPaddle.deserialize(data);
        }
        else {
            leftPaddle.deserialize(data);
        }
    }
}

// for up
class UpSocket{
    constructor() {
        try {
            this.socket = new WebSocket(`wss://${window.location.host}/ws/up`);
            this.socket.onopen = this.handleOpen.bind(this);
            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onclose = this.handleClose.bind(this);
        } catch (error) {
            console.error('WebSocket connection error:', error);
        }
    }

    disconnect() {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.close();
        }
    }

    handleOpen(event) {
        console.log('WebSocket connection opened.');
    }

    // use with serialize object
    sendInfo(info){
        // console.log(info);
        this.socket.send(info);
    };
    
    handleClose(event) {
        console.log('WebSocket connection closed.');
    }

    handleMessage(event) {
        // console.log("receiving data");
        try{
            const data = JSON.parse(event.data);
            switch (data.type){
                case 'matchFound':
                    this.side = data.side;
                    startUpOnline(data);
                    break;
                case 'platformSetUp':
                    deserializePlatform(data);
                    break;
                case 'startosgamos':
                    gameReady();
					break;
				case 'playerPosition':
					updatePosition(data);
					break;
				default: console.log("error: type unknown");

            }
        }
        catch (error){console.error(error)}
    }
}
