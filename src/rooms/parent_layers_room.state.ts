import { ArraySchema, MapSchema, type } from '@colyseus/schema'
import Player, { AvatarType } from '../models/player'
import BaseState from './base/state.base'

export default class ParentLayersState extends BaseState {
  @type({ map: Player }) players = new MapSchema<Player>()
  @type({ array: 'boolean' }) asientos = new ArraySchema<boolean>()
  @type({ array: ParentLayersState }) nestedRooms = new ArraySchema<ParentLayersState>()
  @type('boolean') isPadre = false
  @type('number') layer = 0

  constructor(maxCapacity: number, isPadre = false, layerNumber = 0) {
    super("ParentLayers")
    this.isPadre = isPadre
    this._setLenghtAsientos(maxCapacity)
    this.layer = layerNumber
    if (isPadre) {
      this._createNewSubLayer(0)
    }
  }


  _setLenghtAsientos(maxCapacity: number): void {
    for (let i = 0; i < maxCapacity; i++) {
      this.asientos.push(false)
    }
  }

  createPlayer(playerId: string, username: string, avatar: AvatarType, clientId: string, roles: string[]) {
    if (this.isPadre) {
      //Pregunto por roles
      if (roles && (roles.includes('ponente'))) {

        //Obtenemos el numero de asiento
        const numeroAsiento = this.asignarAsiento()

        if (numeroAsiento === -1) {
          //TODO: Definir bien el error, asi lo podemos cachear desde otro lado
          this._createPlayerInSubLayer(playerId, username, avatar, clientId, roles, 0)
          return
        }
        //Creamos el player
        const player = new Player(playerId, username, avatar, clientId, numeroAsiento, this.UUID, this.layer)

        //Seteamos el player al array de players
        this.players.set(playerId.toString(), player)
      } else {
        this._createPlayerInSubLayer(playerId, username, avatar, clientId, roles, 0)
        return
      }

    } else {
      //Obtenemos el numero de asiento
      const numeroAsiento = this.asignarAsiento()

      if (numeroAsiento === -1) {
        //TODO: Definir bien el error, asi lo podemos cachear desde otro lado
        throw new Error("Sala llena")
      }
      //Creamos el player
      const player = new Player(playerId, username, avatar, clientId, numeroAsiento, this.UUID, this.layer)

      //Seteamos el player al array de players
      this.players.set(playerId.toString(), player)
    }

  }

  removePlayer(userId: string):boolean {
    //Obtenemos el player
    const player = this.players.get(userId)
    if (player) {
      //Dejamos disponible su asiento
      this.asientos[player?.slotNumber ?? -1] = false

      //Lo borramos de la lista de players
      this.players.delete(userId)
      // if(this.isPadre) this.playerCountInLayers--

      return true
    } else {
      this.nestedRooms.forEach((nestedState) => {
        if(nestedState.removePlayer(userId)){
          if(this.isPadre) this.playerCountInLayers--
        }
      })
    }

    return false
  }

  /**
   * Recorre el array de asientos, y encuntra un lugar disponible.
   * @returns Return index of slot available. Return -1 if are not available any slot.
   */
  asignarAsiento(): number {
    for (let i = 0; i < this.asientos.length; i++) {
      const value = this.asientos[i]
      if (!value) {
        this.asientos[i] = true
        return i
      }
    }
    return -1
  }

  getPlayerById(playerId: string): Player | undefined {
    if (this.players.has(playerId)) {
      return this.players.get(playerId)
    }

    if (this.isPadre) {
      for (let i = 0; i < this.nestedRooms.length; i++) {
        const room = this.nestedRooms[i]
        if (room.players.has(playerId)) {
          return room.players.get(playerId)
        }
      }
    }

    return undefined
  }

  getPlayerByClientId(clientId: string): Player | undefined {

    for (const item of this.players) {
      if (item[1].clientId === clientId) {
        return item[1]
      }
    }

    if (this.isPadre) {
      for (let i = 0; i < this.nestedRooms.length; i++) {
        const room = this.nestedRooms[i]
        for (const item of room.players) {
          if (item[1].clientId === clientId) {
            return item[1]
          }
        }
      }
    }

    return undefined
  }

  _createPlayerInSubLayer(playerId: string, username: string, avatar: AvatarType, clientId: string, roles: string[], layer: number) {
    if (!this.nestedRooms) {
      this.nestedRooms = new ArraySchema<ParentLayersState>()
    }


    if (this.nestedRooms.length == 0 || layer >= this.nestedRooms.length) {
      this._createNewSubLayer(layer)
    }

    //Ultimo room
    const room = this.nestedRooms.at(layer)
    try {
      room.createPlayer(playerId, username, avatar, clientId, roles)
      this.playerCountInLayers++
    } catch (error) {
      //Recursividad
      this._createPlayerInSubLayer(playerId, username, avatar, clientId, roles, layer + 1)
    }
  }

  _createNewSubLayer(layerNumber: number) {
    const newRoom = new ParentLayersState(this.asientos.length, false, layerNumber + 1)
    this.nestedRooms.push(newRoom)
  }
}
