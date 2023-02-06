# Multiplayer

Essentially, this is a simple node server. The framework that is used to manage all the multiplayer related logic is Colyseus - <https://www.colyseus.io/>

Most of what you need to do, can be found in the documentation, so what you will find here is mostly information regarding this particular architechture.

Due to time contraints, rooms are now defined in server.ts, statically.

**It is important that in the future, rooms can be registered/unregistered dinamically, for example by sending and event through RabitMQ from babylon miscroservice on room create/delete/change that would sync babylon DB and multiplayer rooms.**

As of now, in terms of configuration, all rooms are identlical.

You can find the definition of the room logic in /src/room/room.template.ts

Room state definition in /src/rooms/room.state.template.ts

And player logic & state in /src/rooms/player.schema.template.ts
