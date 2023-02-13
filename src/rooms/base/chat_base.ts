import { Client, Room } from 'colyseus'
import BaseState from './state.base'

export class ChatRoom<T extends BaseState> extends Room<T> {
    
  onCreate(options: any) {
    
    this.maxClients= 10

    this.onMessage('delete-player', (client: Client) => {
      const userId = client.id
      this.state.removePlayer(userId)
      this.broadcast('delete-player', userId)
    })
   
    this.onMessage("messageToServer", (client, message) => {
      this.broadcast('messages', {message: message}, { except: client })
    });
    }



  onJoin(client: Client, options: { username: string }) {
    
    console.log(`user logged,${client.id}`);
    this.broadcast('joined', {joinedUser: options.username}, { except: client })
  }

  

  onLeave(client: Client, options: any) {
    const userId = client.id
    console.log(`user left,${client.id}`);
    this.broadcast('left', {userLeft: {options, client}}, {except: client})
  }

 
}
