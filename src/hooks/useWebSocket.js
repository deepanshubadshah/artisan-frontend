import { useEffect, useRef } from "react";

export const useWebSocket = ({ onMessage }) => {
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [onMessage]);

  return wsRef.current;
};