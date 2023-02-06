import { Schema, type } from '@colyseus/schema'
import { v4 as uuidv4 } from 'uuid'
import Player, { AvatarType } from '../../models/player'

export type RoomTypes = 'ParentLayers' | 'OnlyLayers';

export default abstract class BaseState extends Schema {
    @type('string') UUID = ''
    @type('string') roomType : string
    @type('number') playerCountInLayers : number
    
    constructor(type : RoomTypes){
        super()
        this.UUID = uuidv4()
        this.roomType = type
        this.playerCountInLayers = 0
    }

    abstract createPlayer(playerId: string, username: string, avatar: AvatarType, clientId: string, roles: string[]): void;
    abstract removePlayer(userId: string): void;
    abstract getPlayerById(playerId: string): Player | undefined;
    abstract getPlayerByClientId(clientId: string): Player | undefined;
}
