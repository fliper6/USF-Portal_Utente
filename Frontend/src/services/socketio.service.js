import { io } from 'socket.io-client';

class SocketioService {
  socket;
  constructor() {}

  setupSocketConnection() {
     this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT,{
      query: {
        x: 42
      }
    });
    //this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
    this.socket.on('connect', () => {
      console.log(this.socket.id); // an alphanumeric id...
    });

    this.socket.on('my broadcast', (data) => {
      console.log(data);
    });
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
}
}

export default new SocketioService();