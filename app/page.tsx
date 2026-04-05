'use client'

import { useEffect, useState} from "react"
export default function Home() {
  const [channels, setChannels] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/api/channels')
      .then(res => res.json())
      .then(data => setChannels(data));
  }, []);

  const createChannel = async () => {
    await fetch('/api/channels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
    location.reload();
    }
    return (
    <div style={{ padding: 20 }}>
      <h1>Channels Q&A Tool</h1>
      <h2>Create Channel</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Channel Name"
      />
      <button onClick={createChannel}>Create</button>
      <h2>Channels</h2>
      <ul>
        {channels.map(channel => (
          <li key={channel.id}>{channel.name}</li>
        ))}
      </ul> 
    </div>
  )
}   