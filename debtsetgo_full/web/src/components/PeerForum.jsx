import { useEffect, useRef, useState } from "react";
import { getForumMessages, sendForumMessage } from "../api";

export default function PeerForum({ userId, userName }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  // 初次加载所有消息
  useEffect(() => {
    async function load() {
      setError("");
      try {
        const data = await getForumMessages();
        setMessages(data);
        // 滚动到底部
        setTimeout(() => {
          if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 0);
      } catch (err) {
        console.error(err);
        setError("Failed to load forum messages.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 可选：简单轮询刷新（每 10 秒）
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const data = await getForumMessages();
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    if (!userId) {
      setError("You must be logged in to send messages.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const msg = await sendForumMessage({
        userId,
        content: newMsg,
      });
      setMessages((prev) => [...prev, msg]);
      setNewMsg("");
      setTimeout(() => {
        if (bottomRef.current) {
          bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    } catch (err) {
      console.error(err);
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="forum-wrapper">
      <h2>Peer Forum</h2>
      <p className="section-subtitle">
        Simple community chat space. All messages are visible to logged-in students.
      </p>

      <div className="forum-box">
        <div className="forum-messages">
          {loading && <p>Loading messages...</p>}
          {error && <p className="error-message">{error}</p>}

          {!loading && messages.length === 0 && (
            <p className="forum-empty">No messages yet. Start the conversation!</p>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={
                "forum-message" +
                (m.user_id === Number(userId) ? " mine" : "")
              }
            >
              <div className="forum-message-header">
                <span className="forum-username">{m.userName}</span>
                <span className="forum-time">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
              <div className="forum-message-body">{m.content}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="forum-input">
          <textarea
            className="forum-textarea"
            placeholder={
              userId
                ? "Type your message here... (Press Enter to send, Shift+Enter for new line)"
                : "Please log in to send messages."
            }
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!userId || sending}
          />
          <button
            className="primary-btn forum-send-btn"
            onClick={handleSend}
            disabled={!userId || sending || !newMsg.trim()}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>

      </div>
    </div>
  );
}
