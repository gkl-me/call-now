'use client'

import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket, getSocket } from "../socket";
import { Message, ConnectedUser } from "@repo/types/src/index";
import { LandingPage } from "../components/LandingPage";
import { Loading } from "../components/Loading";
import { ChatRoom } from "../components/ChatRoom";
// import axios from "axios";

export default function Home() {
  const [username, setUsername] = useState("");
  const [joinedChat, setJoinedChat] = useState(false);
  const [connectState, setConnectState] = useState<string>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [connectedTo, setConnectedTo] = useState<ConnectedUser | null>(null);
  const [skipConfirm, setSkipConfirm] = useState(false);
  
  function handleStart() {
    if (username.trim()) {
      const existingSocket = getSocket();
      if (existingSocket) {
        existingSocket.removeAllListeners();
        disconnectSocket();
      }
      setJoinedChat(true);
      newChat();
    }
  }


  function newChat() {
    const socket = connectSocket();
    socket.removeAllListeners();
    socket.emit("addUser", { name: username });

    socket.on("waiting for user", () => {
      setConnectState("waiting");
    });

    socket.on("connected:user", (user) => {
      setConnectState("connected");
      setConnectedTo(user);
    });

    socket.on("disconnected:user", () => {
      setConnectState("idle");
      setMessages([]);
      setConnectedTo(null);
      setJoinedChat(false);
    });

    socket.on("message", (message: Message) => {
      const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setMessages((prev) => [...prev, {...message,timestamp:formattedTime}]);
    });
  }

  function handleSkip() {
    if (skipConfirm) {
      disconnectSocket();
      setMessages([]);
      setConnectedTo(null);
      handleStart();
      setSkipConfirm(false);
    } else {
      setSkipConfirm(true);
    }
  }

  function stopChat() {
    const socket = getSocket();
    if (socket) {
      disconnectSocket();
      setConnectState("idle");
      setMessages([]);
      setConnectedTo(null);
      setJoinedChat(false)
    }
  }

  function sendMessage() {
    const socket = getSocket();
    if (socket && currentMessage.trim()) {
      socket.emit("send:message", { content: currentMessage, timestamp: new Date() });
      setCurrentMessage("");
    }
  }

  useEffect(() => {
    return () => {
      if (joinedChat) {
        disconnectSocket();
        setConnectState("idle");
        setMessages([]);
        setConnectedTo(null);
        setJoinedChat(false);
        setUsername("");
      }
    };
  }, []);

  // Show landing page if not joined
  if (!joinedChat) {
    return (
      <LandingPage
        username={username}
        setUsername={setUsername}
        onStart={handleStart}
      />
    );
  }

  // Show loading screen while waiting for connection
  if (connectState === "waiting") {
    return <Loading />;
  }

  // Show chat room when connected
  if (connectState === "connected") {
    return (
      <ChatRoom
        connectedTo={connectedTo}
        message={currentMessage}
        setMessage={setCurrentMessage}
        skipConfirm={skipConfirm}
        onSkip={handleSkip}
        onStop={stopChat}
        messages={messages}
        onSendMessage={sendMessage}
      />
    );
  }

  // Default to loading screen
  return <Loading />;
}