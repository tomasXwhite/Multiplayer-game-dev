import { BaseRoom } from './base/room.base'
import ParentLayersState from './parent_layers_room.state'


export class ParentLayersRoom extends BaseRoom<ParentLayersState> {
  onCreate = (options: any) => {
    this.setState(new ParentLayersState(options.maxPlayerInLayer, true))
    
    super.onCreate(options)
  }
}
