import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";

export default function App() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleKeyDown = (e) => {
    const pairs = {
      "(": ")",
      "[": "]",
      "{": "}",
      '"': '"',
      "'": "'",
      "`": "`",
    };

    if (pairs[e.key]) {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const closingChar = pairs[e.key];

      const newCode =
        code.substring(0, selectionStart) +
        e.key +
        closingChar +
        code.substring(selectionEnd);

      setCode(newCode);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
      }, 0);
    }
  };

  const handleReview = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setReview("Analyzing your code... ✨");

    try {
      const res = await axios.post(`${API_URL}/ai/get-Review`, { code });
      const feedback = res.data.review || res.data;
      setReview(
        typeof feedback === "string"
          ? feedback
          : JSON.stringify(feedback, null, 2)
      );
    } catch (err) {
      setReview("Error: Unable to connect to backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!review) return;
    navigator.clipboard.writeText(review);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container">
      <div className="left">
        <h1 className="left-heading">Code Input</h1>
        <div className="editor-container">
          <textarea
            className="editor-textarea"
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
          />
          <button
            className="magic-button"
            onClick={handleReview}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Review Code"}
          </button>
        </div>
      </div>

      <div className="right">
        <div className="review-header">
          <h1 className="review-heading">AI Review</h1>
          {review && (
            <button className="copy-button" onClick={copyToClipboard}>
              {copied ? "Copied! ✅" : "Copy Feedback"}
            </button>
          )}
        </div>
        <div className="review-box">
          <div className="markdown-content">
            {review ? (
              <ReactMarkdown>{review}</ReactMarkdown>
            ) : (
              <p style={{ color: "#666" }}>Your feedback will appear here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 