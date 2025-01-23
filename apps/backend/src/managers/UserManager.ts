
import { User } from "@repo/types/src/index";
import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export class UserManager{
    private users:User[];
    private queue:User[];
    private roomManager:RoomManager;

    constructor(){
        this.users = []
        this.queue = []
        this.roomManager = new RoomManager()
    }

    addUser(name:string,socket:Socket){
        const user:User = {
            name,
            socket
        }
        this.users.push(user)
        this.queue.push(user)
        socket.emit('waiting for user')
        this.matchPerson()
    }

    matchPerson(){
        if(this.queue.length < 2) return

        const user1 = this.queue.shift()
        const user2 = this.queue.shift()
        if(!user1 || !user2) return

        this.roomManager.createRoom(user1,user2)

    }

    removeUser(socket:Socket){
        
        const user1 = this.users.find(user => user.socket === socket)
        if(!user1) return

        const roomId = this.roomManager.findRoomIdByUser(socket)
        const user2 = this.users.find(user => user.socket !== socket && this.roomManager.findRoomIdByUser(user.socket) === roomId)
        if(user2){  
            user2.socket.emit('disconnected:user')
            user2.socket.disconnect()   
        }

        if(roomId){
            this.roomManager.deleteRoom(roomId)
        }

        this.users = this.users.filter(user => user.socket !== socket)
        this.queue = this.queue.filter(user => user.socket !== socket)
    }

}