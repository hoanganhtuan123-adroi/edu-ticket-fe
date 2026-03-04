"use client";

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseSocketReturn {
  connected: boolean;
  socketId: string | null;
  joinEvent: (eventId: string) => void;
  leaveEvent: (eventId: string) => void;
  onTicketUpdated: (callback: (data: unknown) => void) => () => void;
  onEventStatusChanged: (callback: (data: unknown) => void) => () => void;
  onNotification: (callback: (data: unknown) => void) => () => void;
  onUnreadCountUpdated: (callback: (data: { count: number }) => void) => () => void;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useSocket = (): UseSocketReturn => {
  const socketRef = useRef<{ emit: (event: string, data: unknown) => void } | null>(null);
  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const listenersRef = useRef<Map<string, Set<(data: unknown) => void>>>(new Map());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const io = require('socket.io-client').io;
    
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      setConnected(true);
      setSocketId(socket.id || null);
    });

    socket.on('disconnect', () => {
      setConnected(false);
      setSocketId(null);
    });

    socket.on('ticketUpdated', (data: unknown) => {
      listenersRef.current.get('ticketUpdated')?.forEach(cb => cb(data));
    });

    socket.on('eventStatusChanged', (data: unknown) => {
      listenersRef.current.get('eventStatusChanged')?.forEach(cb => cb(data));
    });

    socket.on('notification', (data: unknown) => {
      listenersRef.current.get('notification')?.forEach(cb => cb(data));
    });

    socket.on('unreadCountUpdated', (data: unknown) => {
      listenersRef.current.get('unreadCountUpdated')?.forEach(cb => cb(data));
    });

    socket.on('userConnected', (data: unknown) => {
      listenersRef.current.get('userConnected')?.forEach(cb => cb(data));
    });

    socket.on('userDisconnected', (data: unknown) => {
      listenersRef.current.get('userDisconnected')?.forEach(cb => cb(data));
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinEvent = useCallback((eventId: string) => {
    socketRef.current?.emit('joinEvent', eventId);
  }, []);

  const leaveEvent = useCallback((eventId: string) => {
    socketRef.current?.emit('leaveEvent', eventId);
  }, []);

  const addListener = useCallback((event: string, callback: (data: unknown) => void) => {
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event)?.add(callback);
    
    return () => {
      listenersRef.current.get(event)?.delete(callback);
    };
  }, []);

  const onTicketUpdated = useCallback((callback: (data: unknown) => void) => {
    return addListener('ticketUpdated', callback);
  }, [addListener]);

  const onEventStatusChanged = useCallback((callback: (data: unknown) => void) => {
    return addListener('eventStatusChanged', callback);
  }, [addListener]);

  const onNotification = useCallback((callback: (data: unknown) => void) => {
    return addListener('notification', callback);
  }, [addListener]);

  const onUnreadCountUpdated = useCallback((callback: (data: { count: number }) => void) => {
    return addListener('unreadCountUpdated', callback as (data: unknown) => void);
  }, [addListener]);

  return {
    connected,
    socketId,
    joinEvent,
    leaveEvent,
    onTicketUpdated,
    onEventStatusChanged,
    onNotification,
    onUnreadCountUpdated,
  };
};
