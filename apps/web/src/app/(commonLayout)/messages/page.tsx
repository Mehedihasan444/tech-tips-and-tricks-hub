"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Badge, Button, Card, CardBody, Input, Spinner } from "@heroui/react";
import { MessageSquareText, Search, Send, Users } from "lucide-react";
import { useSocket, ChatMessage } from "@/context/socket.provider";
import { useUser } from "@/context/user.provider";
import { getFriends } from "@/services/FriendsService";
import { getSuggestedUsers } from "@/services/UserService";
import EmptyState from "@/components/ui/EmptyState";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  _id: string;
  name: string;
  profilePhoto: string;
  nickName?: string;
  online: boolean;
}

export default function MessagesPage() {
  const { user } = useUser();
  const { socket, sendChatMessage, onlineUsers, isConnected } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [draft, setDraft] = useState("");
  const [typingName, setTypingName] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = useMemo(
    () => conversations.find((c) => c._id === activeId) ?? null,
    [conversations, activeId],
  );

  // Load conversation list: friends first, then suggested users for online IDs.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoadingList(true);
        const [friendsRes, suggestedRes] = await Promise.allSettled([
          getFriends(),
          getSuggestedUsers(12),
        ]);
        const byId = new Map<string, Conversation>();
        if (friendsRes.status === "fulfilled") {
          const list = friendsRes.value?.data ?? friendsRes.value ?? [];
          (Array.isArray(list) ? list : []).forEach((f: Record<string, unknown>) => {
            const id = String(f._id ?? f.id ?? "");
            if (!id) return;
            byId.set(id, {
              _id: id,
              name: String(f.name ?? f.nickName ?? "Unknown"),
              profilePhoto: String(f.profilePhoto ?? f.avatar ?? ""),
              nickName: typeof f.nickName === "string" ? f.nickName : undefined,
              online: false,
            });
          });
        }
        if (suggestedRes.status === "fulfilled") {
          const list = suggestedRes.value?.data?.data ?? suggestedRes.value?.data ?? [];
          (Array.isArray(list) ? list : []).forEach((u: Record<string, unknown>) => {
            const id = String(u._id ?? "");
            if (!id || byId.has(id)) return;
            byId.set(id, {
              _id: id,
              name: String(u.name ?? u.nickName ?? "Unknown"),
              profilePhoto: String(u.profilePhoto ?? ""),
              nickName: typeof u.nickName === "string" ? u.nickName : undefined,
              online: false,
            });
          });
        }
        if (!cancelled) {
          setConversations(Array.from(byId.values()));
          setActiveId((prev) => prev ?? Array.from(byId.keys())[0] ?? null);
        }
      } catch {
        if (!cancelled) setConversations([]);
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Merge live presence.
  useEffect(() => {
    setConversations((prev) => prev.map((c) => ({ ...c, online: onlineUsers.includes(c._id) })));
    // Surface online-only users not yet in the list.
    setConversations((prev) => {
      const known = new Set(prev.map((c) => c._id));
      const missing = onlineUsers
        .filter((id) => !known.has(id) && id !== user?._id)
        .map((id) => ({
          _id: id,
          name: `User ${id.slice(-4)}`,
          profilePhoto: "",
          online: true as boolean,
        }));
      return missing.length ? [...missing, ...prev] : prev;
    });
  }, [onlineUsers, user?._id]);

  // Subscribe to chat events for the active conversation.
  useEffect(() => {
    if (!socket || !user || !activeId) return;
    setLoadingChat(true);
    socket.emit("get-chat-history", { senderId: user._id, receiverId: activeId });

    const onHistory = (history: ChatMessage[]) => {
      setMessages(Array.isArray(history) ? history : []);
      setLoadingChat(false);
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
    };
    const onMessage = (msg: ChatMessage) => {
      if (
        (msg.senderId === activeId && msg.receiverId === user._id) ||
        (msg.senderId === user._id && msg.receiverId === activeId)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          const withoutTemp = prev.map((m) =>
            m.id.startsWith("temp-") && m.senderId === msg.senderId && m.message === msg.message
              ? msg
              : m,
          );
          return withoutTemp.some((m) => m.id === msg.id) ? withoutTemp : [...withoutTemp, msg];
        });
        requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
        if (msg.senderId === activeId) socket.emit("mark-message-read", msg.id);
      }
    };
    const onTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== activeId) return;
      setTypingName(data.isTyping ? (active?.name ?? "Someone") : null);
    };
    socket.on("chat-history", onHistory);
    socket.on("chat-message", onMessage);
    socket.on("user-typing-chat", onTyping);
    return () => {
      socket.off("chat-history", onHistory);
      socket.off("chat-message", onMessage);
      socket.off("user-typing-chat", onTyping);
    };
  }, [socket, user, activeId, active?.name]);

  useEffect(
    () => () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    },
    [],
  );

  const handleSend = () => {
    if (!draft.trim() || !user || !activeId) return;
    sendChatMessage(activeId, draft.trim());
    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: user._id,
      receiverId: activeId,
      message: draft.trim(),
      createdAt: new Date(),
      read: false,
    };
    setMessages((prev) => [...prev, optimistic]);
    setDraft("");
    socket?.emit("typing-chat-stop", { receiverId: activeId });
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  const handleTyping = (value: string) => {
    setDraft(value);
    if (!socket || !activeId) return;
    socket.emit("typing-chat-start", { receiverId: activeId });
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket.emit("typing-chat-stop", { receiverId: activeId });
    }, 2000);
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...conversations].sort(
      (a, b) => Number(b.online) - Number(a.online) || a.name.localeCompare(b.name),
    );
    if (!q) return sorted;
    return sorted.filter(
      (c) => c.name.toLowerCase().includes(q) || c.nickName?.toLowerCase().includes(q),
    );
  }, [conversations, search]);

  const formatTime = (d: Date) => {
    try {
      return formatDistanceToNow(new Date(d), { addSuffix: true });
    } catch {
      return "";
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MessageSquareText size={22} />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-sm text-default-500">
            {isConnected ? "Connected — chats update live" : "Connecting..."} ·{" "}
            {conversations.length} conversations
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Conversation list */}
        <Card className="overflow-hidden">
          <CardBody className="p-3">
            <Input
              startContent={<Search size={15} className="text-default-400" />}
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="sm"
              aria-label="Search conversations"
              className="mb-2"
            />
            {loadingList ? (
              <div className="flex items-center justify-center py-10">
                <Spinner size="md" />
              </div>
            ) : visible.length === 0 ? (
              <div className="py-6 text-center text-sm text-default-500">
                <Users size={28} className="mx-auto mb-2 opacity-50" />
                No conversations yet. Follow people from Explore to start chatting.
              </div>
            ) : (
              <ul className="max-h-[60vh] space-y-1 overflow-y-auto">
                {visible.map((c) => (
                  <li key={c._id}>
                    <button
                      onClick={() => setActiveId(c._id)}
                      className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors ${
                        c._id === activeId ? "bg-primary/10" : "hover:bg-default-100"
                      }`}
                      aria-current={c._id === activeId}
                    >
                      <Badge
                        content=""
                        color="success"
                        size="sm"
                        placement="bottom-right"
                        isInvisible={!c.online}
                      >
                        <Avatar
                          src={c.profilePhoto}
                          name={c.name?.trim() ? c.name : "?"}
                          size="md"
                        />
                      </Badge>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{c.name}</span>
                        <span
                          className={`block text-xs ${c.online ? "text-success" : "text-default-500"}`}
                        >
                          {c.online ? "Online" : "Offline"}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        {/* Active chat */}
        <Card className="flex min-h-[60vh] flex-col overflow-hidden">
          {!active ? (
            <CardBody className="flex flex-1 items-center justify-center">
              <EmptyState
                type="friends"
                title="Pick a conversation"
                description="Select someone from the list to start chatting in real time."
              />
            </CardBody>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-divider p-4">
                <Badge
                  content=""
                  color="success"
                  size="sm"
                  placement="bottom-right"
                  isInvisible={!active.online}
                >
                  <Avatar
                    src={active.profilePhoto}
                    name={active.name?.trim() ? active.name : "?"}
                  />
                </Badge>
                <div className="flex-1">
                  <p className="font-semibold">{active.name}</p>
                  <p className="text-xs text-default-500">
                    {active.online ? "Online now" : "Offline"}
                    {typingName ? ` · ${typingName} is typing...` : ""}
                  </p>
                </div>
              </div>

              <div
                role="log"
                aria-live="polite"
                aria-label={`Conversation with ${active.name}`}
                className="flex-1 space-y-3 overflow-y-auto bg-default-50 p-4"
                style={{ maxHeight: "52vh" }}
              >
                {loadingChat ? (
                  <div className="flex h-full items-center justify-center">
                    <Spinner size="md" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <MessageSquareText size={32} className="mb-2 text-default-300" />
                    <p className="text-sm text-default-500">No messages yet</p>
                    <p className="text-xs text-default-400">Say hello to {active.name}!</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const mine = m.senderId === user?._id;
                    return (
                      <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-3 py-2 ${mine ? "rounded-br-sm bg-primary text-white" : "rounded-bl-sm bg-default-200"}`}
                        >
                          <p className="break-words text-sm">{m.message}</p>
                          <p
                            className={`mt-1 text-[10px] ${mine ? "text-white/70" : "text-default-500"}`}
                          >
                            {formatTime(m.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2 border-t border-divider p-3"
              >
                <Input
                  placeholder={`Message ${active.name}...`}
                  value={draft}
                  onChange={(e) => handleTyping(e.target.value)}
                  aria-label="Type a message"
                />
                <Button
                  type="submit"
                  color="primary"
                  isIconOnly
                  isDisabled={!draft.trim() || !isConnected}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
