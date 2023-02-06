import { monitor } from '@colyseus/monitor'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import { WebSocketTransport } from '@colyseus/ws-transport'

import { Server } from '@colyseus/core'
import { createServer } from 'http'
import { LayerRoom } from './rooms/layers_room'
import { ParentLayersRoom } from './rooms/parent_layers_room'


const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const PORT = Number(process.env.PORT ?? 8001)

app.get('/multiplayer/ping', (_, res) => {
  res.json({ res: 'pong' })
})

app.use('/multiplayer/monitor', monitor())



const transport = new WebSocketTransport({
  server: createServer(app),
})

const gameServer = new Server({
  transport
})

//Comentario generado para conocimiento
console.log('Transport:')
console.log(transport)
console.log('gameServer:')
console.log(gameServer)

// gameServer.define('central_square', RoomTemplate, {
//   maxPlayerInLayer: 20,
// })

// gameServer.define('classroom', RoomTemplate, {
//   maxPlayerInLayer: 20,
// })

gameServer.define('scene_develop', LayerRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('Ciudad', LayerRoom, {
  maxPlayerInLayer: 100,
})

gameServer.define('avatares', LayerRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('Oficina', LayerRoom, { //limitado 21
  maxPlayerInLayer: 21,
})

gameServer.define('Aula', LayerRoom, { //limitado
  maxPlayerInLayer: 39,
})

gameServer.define('Iniesta', LayerRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('TiendaRopaPequena', LayerRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('TiendaRopaGrande', LayerRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('TiendaElectronica', LayerRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('Cafeteria', LayerRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('Cine', LayerRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('Teatro', LayerRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('Conciertos', ParentLayersRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('ApartamentoConfigurator', LayerRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('Mariverse', LayerRoom, {
  maxPlayerInLayer: 20,
})

// gameServer.define('classroom2', RoomTemplate, {
//   maxPlayerInLayer: 20,
// })

gameServer.define('OficinaBBVA', LayerRoom, {
  maxPlayerInLayer: 21,
})

gameServer.define('ConferenciasBBVA', ParentLayersRoom, { 
  maxPlayerInLayer: 280,
})

gameServer.define('Conferencias', ParentLayersRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('OficinaBBVALarge', LayerRoom, {
  maxPlayerInLayer: 21,
})

gameServer.define('OficinaLegendaryumLarge', LayerRoom, {
  maxPlayerInLayer: 21,
})

gameServer.define('ConferenciasLegendaryum1', ParentLayersRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('ConferenciasLegendaryum', ParentLayersRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('ConferenciasTelefonicaLegendaryum', ParentLayersRoom, {
  maxPlayerInLayer: 20,
})

gameServer.define('HallOficinas', LayerRoom, {
  maxPlayerInLayer: 20,
})
gameServer.define('OficinaFaceToFace', LayerRoom, {
  maxPlayerInLayer: 20,
})
gameServer.define('HallEducativo', LayerRoom, {
  maxPlayerInLayer: 20,
})
gameServer.define('HallConferencias', LayerRoom, {
  maxPlayerInLayer: 20,
})
gameServer.define('HallCine', LayerRoom, {
  maxPlayerInLayer: 20,
})
gameServer.define('HallTeatro', LayerRoom, {
  maxPlayerInLayer: 20,
})
gameServer.define('MuseoIniestaLarge', LayerRoom, {
  maxPlayerInLayer: 20,
})
gameServer.define('GamingRoom', LayerRoom, {
  maxPlayerInLayer: 20,
})

gameServer.listen(PORT)
