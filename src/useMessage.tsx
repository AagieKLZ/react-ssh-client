import { useCallback, useState } from "react";

export function useMessage(): [string[], (message: string) => void, () => void]{
    const [messages, setMessages] = useState<string[]>([])
    const addMessage = useCallback(
      (message: string) => {
        setMessages(t => [...t, message]) 
      },
      [],
    )

    const clearMessages = useCallback(
        () => {
            setMessages(t => [])
        },
        [],
    )
    
    return [messages, addMessage, clearMessages]
}