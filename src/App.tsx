import { useCallback, useEffect, useRef, useState } from 'react'
import { useMessage } from './useMessage'

function App() {
  const [messages, addMessage, clearMessages] = useMessage()
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [state, setState] = useState<string>("")
  const [terminal, setTerminal] = useState<string>("powershell")
  const [ip, setIp] = useState<string>("localhost:8080")
  const msgRef = useRef<any>()

  const sendMessage = (message: string) => {
    if (socket) {
      socket.send(message)
      if (msgRef.current) {
        msgRef.current.value = ""
      }
    }
  }

  const connect = useCallback(() => {
    const socket = new WebSocket(`ws://${ip}`)
    socket.onopen = () => {
      console.log('connected')
      setSocket(socket)
      setState("Connected")
    }
    socket.onmessage = (event) => {
      console.log(event.data)
      addMessage(event.data)
    }
    socket.onclose = () => {
      console.log('disconnected')
      setSocket(null)
      setState("Disconnected")
    }
  }, [addMessage])

  useEffect(() => {
    connect()
  }, [connect])
  

  return (
    <div>
        <div className='flex flex-row items-center justify-start space-x-4 my-4 px-4'>
          <div className={`${state == "Connected" ? "text-green-500" : "text-red-500"} font-bold`}>{state}</div>
          <input value={ip} type="text" name="ip" id="ip" className='border px-2 py-1 rounded-lg text-center' />
          <select name="terminal" id="terminal" className='border px-2 py-1 rounded-lg'>
            <option value="cmd" selected={terminal == "cmd"}>cmd</option>
            <option value="powershell" selected={terminal == "powershell"}>powershell</option>
            <option value="bash" selected={terminal == "bash"}>bash</option>
          </select>
          <button className='bg-blue-600 px-3 py-1 rounded-lg text-white font-semibold' onClick={() => connect()}>Reconnect</button>
          </div>
        {(messages as string[]).map((message: string, index: number) => (
          <div className='bg-gray-900 text-white' key={index}>{message}</div>
        ))}
        <form onSubmit={(e) => e.preventDefault()} className='mt-8 w-full flex justify-center items-center'>
        <input type="text" name="msg" id="msg" ref={msgRef} className='w-4/6 border p-2 rounded-lg mr-2' />
        <button className='bg-emerald-600 w-1/6 py-2 rounded-lg font-semibold text-white' onClick={() => sendMessage(msgRef.current.value ?? "")}>Send Message</button>
        </form>
        <br></br>
        <div className='flex w-full justify-center items-center'>
          <button onClick={() => clearMessages()} className='px-4 py-2 bg-indigo-600 rounded-lg text-white font-semibold mx-ato'>Clear Messages</button>
        </div>
        
    </div>
  )
}

export default App
