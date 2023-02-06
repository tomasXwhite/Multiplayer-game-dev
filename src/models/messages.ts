import { AvatarType, MovementOptions } from "./player"

export type PlayerState = {
    id: string
    x?: number
    z?: number
    y?: number
    animationState: MovementOptions
    avatar: AvatarType
}

export type MultiplayerMessage<T> = {
    id: string
    message: T
}