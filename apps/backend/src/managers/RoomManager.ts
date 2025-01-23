import { Room, User } from "@repo/types/src";
import { Socket } from "socket.io";

let GLOBAL_ROOM_ID = 1;

export class RoomManager {
    private rooms: Map<string, Room>;
    
    constructor(){
        this.rooms = new Map();
    }

    createRoom(user1:User,user2:User){
        const roomId = GLOBAL_ROOM_ID.toString();
        GLOBAL_ROOM_ID++
        const room:Room = {
            user1,
            user2,
        }
        this.rooms.set(roomId,room)

        this.setupMessageListeners(roomId, user1, user2);

        user1.socket.emit('connected:user', { name:user2.name});
        user2.socket.emit('connected:user', { name:user1.name});
    }

    private setupMessageListeners(roomId: string, user1: User, user2: User) {
        // Broadcast message from one user to the other in the same room
        user1.socket.on('send:message', (content: string) => {
          user2.socket.emit('message', {
            name: user1.name,
            content
          });
          user1.socket.emit('message', {
            name: user1.name,
            content
          });
        });
    
        user2.socket.on('send:message', (content: string) => {
          user1.socket.emit('message', {
            name: user2.name ,
            content
          });
          user2.socket.emit('message', {
            name: user2.name,
            content
          });
        });
    }

    findRoomIdByUser(socket:Socket){
        for(const [roomId,room] of this.rooms){
            if(room.user1.socket === socket || room.user2.socket === socket){
                return roomId
            }
        }
        return null
    }

    deleteRoom(roomId:string){
        this.rooms.delete(roomId)
    }
}
