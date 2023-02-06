import { Client, Room } from 'colyseus'
import { MultiplayerMessage, PlayerState } from '../../models/messages'
import { AvatarType, Gestures, MovementOptions } from '../../models/player'
import BaseState from './state.base'

export class BaseRoom<T extends BaseState> extends Room<T> {
  onCreate(options: any) {
    // this.setState(new ParentLayersState(options.maxPlayerInLayer, true))

    this.onMessage('delete-player', (client: Client) => {
      const userId = client.id
      this.state.removePlayer(userId)
      this.broadcast('delete-player', userId)
    })

    this.onMessage('updatePosition', (client: Client, message: MultiplayerMessage<PlayerState>) => {
      this.onMove(message.id.toString(), message.message)
    })
    this.onMessage('updateRotation', (client: Client, message: MultiplayerMessage<PlayerState>) => {
      this.onRotate(message.id.toString(), message.message)
    })
    this.onMessage('updateAvatar', (client: Client, message: MultiplayerMessage<AvatarType>) => {
      this.onAvatarUpdated(message.id.toString(), message.message)
    })
    this.onMessage('updateAnimation', (client: Client, message: MultiplayerMessage<MovementOptions>) => {
      this.onAnimationUpdated(message.id.toString(), message.message)
    })
    this.onMessage('updateGesture', (client: Client, message: MultiplayerMessage<Gestures>) => {
      this.onGestureUpdated(message.id.toString(), message.message)
      const player =this.state.getPlayerById(message.id)
      this.broadcast('gestureUpdated', {id: message.id, username: player?.username, gesture: message.message})
    })
  }

  onJoin(client: Client, params: { id: string, username: string, avatar: AvatarType, roles: string[] }) {
    this.state.createPlayer(
      params.id,
      params.username,
      params.avatar,
      client.id,
      params.roles
    )
  }

  onMove(playerId: string, data: PlayerState) {
    const player = this.state.getPlayerById(playerId)
    if (!player) return

    player.positionX = data.x ?? player.positionX
    player.positionY = data.y ?? player.positionY
    player.positionZ = data.z ?? player.positionZ
  }

  onRotate(playerId: string, data: PlayerState) {
    const player = this.state.getPlayerById(playerId)
    if (!player) return

    player.rotationY = data.y ?? player.rotationY
    player.rotationX = data.x ?? player.rotationX
    player.rotationZ = data.z ?? player.rotationZ
  }

  onLeave(client: Client) {
    const userId = client.id

    const user = this.state.getPlayerByClientId(client.id)
    if (user) {
      this.state.removePlayer(user.id)
      this.broadcast('delete-player', userId)
    }
  }

  onAvatarUpdated(playerId: string, avatar: AvatarType) {
    const player = this.state.getPlayerById(playerId)
    if (!player) return

    player.avatar = avatar
  }

  onAnimationUpdated(playerId: string, animation: MovementOptions) {
    const player = this.state.getPlayerById(playerId)
    if (!player) return

    player.animationState = animation
  }

  onGestureUpdated(playerId: string, animation: Gestures) {
    const player = this.state.getPlayerById(playerId)
    if (!player) return

    player.gesture = animation
  }
}
