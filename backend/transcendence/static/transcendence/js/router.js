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
                case 'matchFound':
                    this.side = data.side;
                    this.group = data.group
                    startOnlineMatch(data);
                break;
            }
        }
        catch (error){console.error(error)}
    }

    updateBallPos(data){
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

    disconect(){
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.close();
            console.log("WebSocket connection closed manually.");
        } else {
            console.log("WebSocket is not open.");
        }
    }
    }
