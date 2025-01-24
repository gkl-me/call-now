import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket, getSocket } from "../socket";
import { Message, ConnectedUser } from "@repo/types/src/index";


export default function Room({ name }: { name: string }) {
  const [connectState, setConnectState] = useState<string>("idle");
  const [chat, setChat] = useState<Message[]>([]);
  const [msg, setMsg] = useState("");
  const [connectedTo, setConnectedTo] = useState<ConnectedUser | null>(null);

  function newChat() {
    const socket = connectSocket();

    socket.emit("addUser", { name });


    socket.on("waiting for user", () => {
      setConnectState("waiting");
    });

    socket.on("connected:user", (user) => {
      setConnectState("connected");
      setConnectedTo(user);
    });

    socket.on("disconnected:user", () => {
      setConnectState("idle");
      disconnectSocket();
      setChat([]);
      setConnectedTo(null);
    });

    socket.on("message", (chat: Message) => {
      setChat((c) => [...c, chat]);
    });
  }

  function stopChat() {
    const socket = getSocket();
    if (socket) {
      disconnectSocket();
      setConnectState("idle");
      setChat([]);
      setConnectedTo(null);
    }
  }

  function sendMessage() {
    const socket = getSocket();
    if (socket && msg.trim()) {
      socket.emit("send:message", msg.trim());
      setMsg("");
    }
  }

  useEffect(() => {
    newChat();
    return stopChat;
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {connectState === "idle" ? (
        <div className="flex flex-col items-center justify-center flex-grow text-gray-600">
          <p className="mb-4 text-center text-lg md:text-xl">Connect to start a new chat</p>
          <button
            onClick={newChat}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            New Chat
          </button>
        </div>
      ) : connectState === "waiting" ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="animate-pulse mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 mb-4 text-center text-lg md:text-xl">
            Connecting, please wait...
          </p>
          <button
            onClick={stopChat}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Stop Connecting
          </button>
        </div>
      ) : (
        <div className="flex-grow flex flex-col">
          {connectedTo && (
            <div className="bg-gray-200 text-center p-4 text-gray-600 text-sm md:text-base">
              Connected to {connectedTo.name}
            </div>
          )}

<div className="flex-grow overflow-y-auto p-4 space-y-4 bg-white">
    {chat.map((c, i) => (
        <div
            key={i}
            className={`mx-3 p-3 overflow-clip rounded-lg max-w-[50%] ${
                c.userId !== connectedTo?.userId
                    ? "bg-blue-100 ml-auto"
                    : "bg-red-100 "
            }`}
        >
            <span className="font-bold mr-2 text-sm md:text-base">{c.name}:</span>
            <span className="text-sm md:text-base break-words whitespace-pre-wrap">{c.content}</span>
        </div>
    ))}
</div>



          <div className="flex items-center p-4 bg-gray-100 border-t space-x-4">
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm md:text-base"
            >
              Send
            </button>
            <button
              onClick={stopChat}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm md:text-base"
            >
              Stop
            </button>
          </div>
        </div>
      )
      
      }
    </div>
  );
}
