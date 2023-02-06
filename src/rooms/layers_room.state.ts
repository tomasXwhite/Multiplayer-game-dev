import { ArraySchema, CollectionSchema, Schema, type } from '@colyseus/schema'
import Player, { AvatarType } from '../models/player'
import BaseState from './base/state.base'

export class CustomLayer extends Schema {
  @type({ collection: Player }) players = new CollectionSchema<Player>()
  @type({ array: 'boolean' }) asientos = new ArraySchema<boolean>()
  @type('number') layerNumber = 0

  constructor(layerNumber: number, capacity: number) {
    super()
    this.layerNumber = layerNumber
    this._setLenghtAsientos(capacity)
  }


  private _setLenghtAsientos(maxCapacity: number): void {
    for (let i = 0; i < maxCapacity; i++) {
      this.asientos.push(false)
    }
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
}


export default class LayerState extends BaseState {
  @type({ array: CustomLayer }) layers = new ArraySchema<CustomLayer>()
  @type('number') capacity = 0

  constructor(capacityPerlayer: number) {
    super("OnlyLayers")
    this.capacity = capacityPerlayer
    this._createNewSubLayer(0)
  }

  createPlayer(playerId: string, username: string, avatar: AvatarType, clientId: string, roles: string[]): void {
    let added = false

    this.layers.forEach((layer, i) => {
      if (added) return
      //Preguntamos si esta lleno el layer
      if (layer.players.size < this.capacity) {
        const player = new Player(playerId, username, avatar, clientId, layer.asignarAsiento(), this.UUID, layer.layerNumber)
        layer.players.add(player)
        added = true
      }
    })

    if (!added) {
      const numberOfLayer = this.layers.length
      this._createNewSubLayer(numberOfLayer)

      const player = new Player(playerId, username, avatar, clientId, 0, this.UUID, numberOfLayer)
      this.layers.at(numberOfLayer).players.add(player)
      added = true
    }

    if (added) {
      this.playerCountInLayers++
    }


  }
  removePlayer(userId: string): void {
    const player = this.getPlayerById(userId)

    if (player) {
      this.layers.at(player.layer).asientos[player.slotNumber] = false
      this.layers.at(player.layer).players.delete(player)
      this.playerCountInLayers--
    }

  }
  getPlayerById(playerId: string): Player | undefined {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i]

      for (let j = 0; j < layer.players.size; j++) {
        const player = layer.players.at(j)
        if (player?.id === playerId) {
          return player
        }
      }
    }
    return undefined
  }

  getPlayerByClientId(clientId: string): Player | undefined {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i]

      for (let j = 0; j < layer.players.size; j++) {
        const player = layer.players.at(j)
        if (player?.clientId === clientId) {
          return player
        }
      }
    }
    return undefined
  }


  _createNewSubLayer(layerNumber: number) {
    if (!this.layers[layerNumber]) {
      this.layers[layerNumber] = new CustomLayer(layerNumber, this.capacity)
    }
  }
}
