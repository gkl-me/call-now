'use client'

import { useState } from "react"
import Room from "../components/Room"

export default function Home(){

  const [joined,setJoined] = useState(false)
  const [name,setName] = useState('')

  return (
    !joined ?

    <div>
      <h1>Home page</h1>
      <label htmlFor="">Name</label>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      <button onClick={() => setJoined(true)}>Chat</button>
    </div>:
    <Room name={name} />
  )
}