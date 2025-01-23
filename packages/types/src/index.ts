import { Socket } from "socket.io";

export interface User{
    name:string,
    socket:Socket,
}

export interface Room{
    user1:User,
    user2:User,
}

export interface Message{
    user:User,
    message:string
}


