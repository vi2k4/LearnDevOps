import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { authStorage, websocketConfig } from "../services/backendApi";

export function useConversationSocket(conversationId, onMessage) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const { token } = authStorage.load();

    if (!conversationId || !token) {
      setConnected(false);
      return undefined;
    }

    const socketUrl = `${websocketConfig.socketUrl}?token=${encodeURIComponent(token)}`;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(socketUrl, undefined, {
          transports: ["websocket"],
        }),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);

        client.subscribe(
          websocketConfig.conversationTopic(conversationId),
          (frame) => {
            try {
              const parsed = JSON.parse(frame.body);
              onMessageRef.current?.(parsed);
            } catch (error) {
              console.error(
                "Failed to parse conversation websocket message",
                error,
                frame.body,
              );
            }
          },
        );
      },
      onWebSocketClose: () => {
        setConnected(false);
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame.headers["message"], frame.body);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      clientRef.current = null;
      setConnected(false);
      client.deactivate();
    };
  }, [conversationId]);

  const sendMessage = useCallback((payload) => {
    const client = clientRef.current;

    if (!client?.connected) {
      return false;
    }

    client.publish({
      destination: websocketConfig.sendDestination,
      body: JSON.stringify(payload),
    });

    return true;
  }, []);

  return {
    connected,
    sendMessage,
  };
}
