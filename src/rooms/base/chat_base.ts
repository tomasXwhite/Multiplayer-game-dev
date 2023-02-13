import { Client, Room } from 'colyseus'
import { AvatarType, Gestures, MovementOptions } from '../../models/player'
import BaseState from './state.base'

export class ChatRoom<T extends BaseState> extends Room<T> {
    
  onCreate(options: any) {
    // this.setState(new ParentLayersState(options.maxPlayerInLayer, true))
    console.log(options);
    console.log("CHAT CREATED");
    
    
    this.maxClients= 4

    this.onMessage('delete-player', (client: Client) => {
      const userId = client.id
      this.state.removePlayer(userId)
      this.broadcast('delete-player', userId)
    })
   
         this.onMessage("messageToServer", (client, message) => {
            // console.log("ChatRoom received message from", client.sessionId, ":", message);
            // this.broadcast("messageToClient", `(${client.sessionId}) ${message}`);
            console.log(client, message);
            this.broadcast('messages', {message: message}, { except: client })
            
        });




    }



  onJoin(client: Client, params: { id: string, username: string, avatar: AvatarType, roles: string[] }) {
    // this.state.createPlayer(
    //   params.id,
    //   params.username,
    //   params.avatar,
    //   client.id,
    //   params.roles
    // )

    console.log(`user logged,${client.id}`);
    
  }

  

  onLeave(client: Client) {
    const userId = client.id
    console.log(`user left ${userId}` );
    

    // const user = this.state.getPlayerByClientId(client.id)
    // if (user) {
    //   this.state.removePlayer(user.id)
    //   this.broadcast('delete-player', userId)
    // }
    
  }

 
}
