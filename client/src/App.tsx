import React, { useEffect, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      await fetchEventSource(`http://localhost:4000/sse`, {
        signal: controller.signal,
        async onopen(e) {
          console.log('onopen', e);
        },
        async onmessage(event) {
          const messageData = JSON.parse(event.data);
          setMessages((prev) => [...prev, messageData.message]);
        },
        async onclose() {
          console.log('onclose');
        },
        onerror(e) {
          console.log('onerror', e);
        },
      });
    };

    fetchData();
    return () => controller.abort();
  }, []);

  const sendMessage = () => {
    // Отправляем сообщение на сервер
    fetch('http://localhost:4000/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: messageInput }),
    });

    // Очищаем поле ввода
    setMessageInput('');
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <div>
        <textarea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
}

export default App;
