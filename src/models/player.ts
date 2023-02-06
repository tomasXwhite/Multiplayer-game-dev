import { Schema, type } from '@colyseus/schema'

type MovementDirections = 'N' | 'E' | 'W' | 'S' | 'NE' | 'NW' | 'SW' | 'SE'
type MovementStatesWithDirections = 'walking' | 'sprinting' | 'jumping'
type MovementStatesWithoutDirections =
  | 'idle'
  | 'turningLeft'
  | 'turningRight'
  | 'pushButton'
  | 'sitting'
  | 'parachuting'
  | 'sitting_locked'
export type MovementOptions =
  | `${MovementStatesWithDirections}${MovementDirections}`
  | MovementStatesWithoutDirections

export type Gestures = 'hand_raised' | 'none';

export type AvatarType =
  | 'carla'
  | 'claudia'
  | 'eric'
  | 'manuel'
  | 'nathan'
  | 'sophia'
  | 'ariel'
  | ''

export default class Player extends Schema {
  @type('string') id = ''
  @type('string') sessionId = ''
  @type('string') username = ''
  @type('float32') positionX = 0
  @type('float32') positionY = 1.6
  @type('float32') positionZ = 0
  @type('float32') rotationX = 0
  @type('float32') rotationY = 0
  @type('float32') rotationZ = 0
  @type('string') animationState: MovementOptions = 'idle'
  @type('string') gesture: Gestures = 'none'
  @type('string') avatar: AvatarType = 'carla'
  @type('string') clientId: string
  @type('number') slotNumber: number
  @type('number') layer: number
  @type('string') stateUUID = ''

  constructor(
    playerId: string,
    username: string,
    avatar: AvatarType,
    clientId: string,
    slotNumber: number,
    stateUUID: string,
    layerNumber: number
  ) {
    super()

    this.id = playerId
    this.username = username
    this.avatar = avatar
    this.clientId = clientId
    this.slotNumber = slotNumber
    this.stateUUID = stateUUID
    this.layer = layerNumber
  }
}
