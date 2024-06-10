//for pong
class pongSocket{
    constructor() {
        try {
            this.socket = new WebSocket(`wss://${window.location.host}/ws/pong`);
            this.socket.onopen = this.handleOpen.bind(this);
            this.socket.onerror = this.handleError.bind(this);
            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onclose = this.handleClose.bind(this);
        } catch (error) {
            console.error('WebSocket connection error:', error);
        }
    }
    handleOpen(event) {
        console.log('WebSocket connection opened.');
    }

    handleMessage(event) {
        const data = JSON.parse(event.data);
        console.log(data.message);
    }

    sendInfo(info){
        this.socket.send(JSON.stringify(message));
    };

    handleError(event) {
        console.error('WebSocket connection error:', event);
    }

    handleClose(event) {
        console.log('WebSocket connection closed.');
    }
}


function test()
{
        let router = new pongSocket();
}