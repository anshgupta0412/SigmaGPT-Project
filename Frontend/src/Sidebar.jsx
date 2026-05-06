import "./Sidebar.css";
import blacklogo from "./assets/blacklogo.png";
import { useEffect, useContext } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        setPrompt,
        setReply,
        setNewChat,
        setCurrThreadId,
        setPrevChats,
        currThreadId
    } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("https://sigmagpt-mern.onrender.com/api/thread", { credentials: "include" });
            const res = await response.json();

            const filteredData = res.map((thread) => ({
                threadId: thread.threadId,
                title: thread.title
            }));

            setAllThreads(filteredData);
        } catch (err) {
            console.log("Failed to fetch threads:", err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, []);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`https://sigmagpt-mern.onrender.com/api/thread/${threadId}`, {
                method: "DELETE",
                credentials: "include"
            });

            const res = await response.json();

            if (!response.ok) {
                alert(res.error || "Failed to delete thread");
                return;
            }

            setAllThreads((prev) => prev.filter((thread) => thread.threadId !== threadId));
            if(threadId === currThreadId){
                createNewChat();
            }
        } catch (err) {
            console.log("Failed to delete thread:", err);
        }
    };

    const changeThread = async (newThreadID) => {
        setCurrThreadId(newThreadID);
        setNewChat(false);

        try {
            const response = await fetch(`https://sigmagpt-mern.onrender.com/api/thread/${newThreadID}`, { credentials: "include" });
            const res = await response.json();

            console.log(res);

            setPrevChats(res);
            setReply(null);
        } catch (err) {
            console.log("Failed to fetch thread:", err);
        }
    };

    return (
        <section className="sidebar">
            {/* Logo + New Chat */}
            <button onClick={createNewChat}>
                <img src={blacklogo} alt="gpt logo" className="logo" />
                <span>Start New Chat</span>
                <i className="fa-solid fa-pen-to-square"></i>
            </button>

            {/* Chat History */}
            <ul className="history">
                {allThreads?.map((thread) => (
                    <li
                        key={thread.threadId}
                        onClick={() => changeThread(thread.threadId)}
                    >
                        {thread.title}
                        <i
                            className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>

            {/* Footer */}
            <div className="sign">
                <p>By Ansh &hearts;</p>
            </div>
        </section>
    );
}

export default Sidebar;