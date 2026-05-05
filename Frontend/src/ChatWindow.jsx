import "./ChatWindow.css";
import SignupForm from "./SignupForm.jsx";
import Chat from "./Chat.jsx";
import LoginForm from "./LoginForm.jsx"
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    setAllThreads,
  } = useContext(MyContext);
  
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setNewChat(false);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("http://localhost:8080/api/chat", options);
      const res = await response.json();
      setReply(res.reply);

      const threadsRes = await fetch("http://localhost:8080/api/thread", { credentials: "include" });
      const threads = await threadsRes.json();
      setAllThreads(threads.map((t) => ({ threadId: t.threadId, title: t.title })));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Append new chat to previous chats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });
      setLoggedInUser(null);
      setIsOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          SigmaGPT <i className="fa-solid fa-chevron-down"></i>
        </span>

        <div className="navbarRight">
          {!loggedInUser ? (
            <div className="authLinks">
              <span onClick={ () => {setShowLogin(true)}}>
                <i className="fa-solid fa-arrow-right-to-bracket"></i> LogIn
              </span>
              <span onClick={ () => {setShowSignup(true)}}>
                <i className="fa-solid fa-user-check"></i> SignUp
              </span>
            </div>
          ) : (
            <span className="usernameDisplay">{loggedInUser.username}</span>
          )}

          <div className="userIconDiv" onClick={handleProfileClick}>
            <span className="userIcon">
              <i className="fa-solid fa-user"></i>
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="dropDown">
            <div className="dropDownItem">
              <i className="fa-solid fa-gear"></i> Settings
            </div>
            <div className="dropDownItem">
              <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
            </div>
            <div className="dropDownItem" onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
            </div>
          </div>
        )}
      </div>
      
        {showLogin && <LoginForm setShowLogin={setShowLogin} setLoggedInUser={setLoggedInUser} />}
        {showSignup && <SignupForm setShowSignup={setShowSignup} setLoggedInUser={setLoggedInUser} />}
        
      <Chat />

      <ScaleLoader color="#fff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : null)}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          SigmaGPT can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;