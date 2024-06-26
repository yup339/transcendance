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
        console.log('WebSocket connection closed.');
    }

    handleMessage(event) {
        console.log("receiving data");
        try{
            const data = JSON.parse(event.data);
            switch (data.type){
                case 'ballPosition':
                    this.updateBallPos(data);
                    break;
                case 'paddlePosition':
                    this.updatePaddlePos(data);
                    break;
                case 'disconect':
                    console.log("disconect TODO");
                    break;
                case 'matchFound':
                    this.side = data.side;
                    setOnlineMode(data);
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
}