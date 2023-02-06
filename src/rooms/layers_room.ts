import { BaseRoom } from './base/room.base'
import LayerState from './layers_room.state'


export class LayerRoom extends BaseRoom<LayerState> {
  onCreate = (options: any) => {
    this.setState(new LayerState(options.maxPlayerInLayer))
    
    super.onCreate(options)
  }
}
