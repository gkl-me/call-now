
import { useEffect, useState } from "react"
import { connectSocket, disconnectSocket, getSocket } from "../socket"

interface Message{
    name:string,
    content:string
}


export default function Room({name}:{name:string}){
    
   const [connectState,setConnectState] = useState<string>('idle')
   const [chat,setChat] = useState<Message[]>([])
   const [msg,setMsg] = useState("")
    const [connectedTo,setConnectedTo] = useState('')

    console.log(chat)

    function newChat(){
        const socket = connectSocket()

                socket.emit('addUser',{name})
    
                socket.on('waiting for user',() => {
                    setConnectState('waiting')
                })
    
                socket.on('connected:user',({name}:{name:string}) => {
                    setConnectState('connnected')
                    setConnectedTo(name)
                })

                socket.on('disconnected:user',() => {
                    setConnectState('idle')
                    disconnectSocket()
                    setChat([])
                    setConnectedTo("")
                })

                socket.on('message',(chat:Message) => {
                    console.log(chat)
                    setChat( c => [...c,chat])
                })
    }

    function stopChat(){
        const socket = getSocket()
        if(socket){
            disconnectSocket()
            setConnectState('idle')
            setChat([])
            setConnectedTo("")
        }
    }

    function sentMessage(){
        const socket = getSocket()
        socket?.emit('send:message',msg.trim())
        setMsg('')
    }

    useEffect(() => {
       newChat()
    
            return stopChat
        },[])

        if(connectState === 'idle'){
            return <div>
                connect to a new chat
                <button onClick={newChat} >New Chat</button>
            </div>
        }

        if(connectState === 'waiting'){
            return <div>Waiting for user
                <button onClick={stopChat} >Stop</button>
            </div>
        }

    return (
      <div>
          <h1>{name} connected to {connectedTo}</h1>
          {chat.map((c,i) => <div key={i}> {c.name}: {c.content}</div>)}
            <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} />
            <button onClick={sentMessage} >Send</button>
          <button onClick={stopChat} >Stop</button>
        </div>
    )
}