//for pong
class pongSocket{
    constructor() {
        try {
            this.socket = new WebSocket(`wss://django/ws/pong/`);
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

    handleMessage(event) {
        const data = JSON.parse(event.data);
        console.log(data.message);
    }

    sendInfo(info){
        this.socket.send(JSON.stringify(info));
    };

    handleClose(event) {
        console.log('WebSocket connection closed.');
    }
}


function test()
{
        let router = new pongSocket();
        console.log("test");
        //router.sendInfo("je test");
}