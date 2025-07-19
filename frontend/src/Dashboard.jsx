import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";

const socket = io("http://localhost:8000");

const Dashboard = () => {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// start code here");
  const [copySuccess, setCopySuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    socket.on("userJoined", (users) => {
      setUsers(users);
    });

    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    socket.on("userTyping", (user) => {
      setTyping(`${user.slice(0, 10)} is Typing`);
      setTimeout(() => setTyping(""), 2000);
    });

    socket.on("languageUpdate", (newLanguage) => {
      setLanguage(newLanguage);
    });

    return () => {
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      socket.emit("leaveRoom");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const joinRoom = () => {
    if (roomId && userName) {
      socket.emit("join", { roomId, userName });
      setJoined(true);
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setRoomId("");
    setUserName("");
    setCode("// start code here");
    setLanguage("javascript");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
    socket.emit("typing", { roomId, userName });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("languageChange", { roomId, language: newLanguage });
  };

  if (!joined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Join Code Room
          </h1>
          <input
            type="text"
            placeholder="Room Id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={joinRoom}
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-6 shadow-md">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Code Room:</h2>
          <p className="text-sm text-gray-300 break-words">{roomId}</p>
          <button
            onClick={copyRoomId}
            className="bg-blue-500 hover:bg-blue-600 w-full py-2 rounded-md transition text-sm font-medium"
          >
            Copy Id
          </button>
          {copySuccess && (
            <span className="text-green-400 text-sm">{copySuccess}</span>
          )}
        </div>

        <div>
          <h3 className="text-md font-medium mb-2">Users in Room:</h3>
          <ul className="space-y-1">
            {users.map((user, index) => (
              <li
                key={index}
                className="border-1 my-2 border-amber-300 text-green-600 font-bold py-1 px-2 rounded text-md truncate"
              >
                {user.slice(0, 10)}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-lg text-red-600 font-bold">
          {typing}
        </p>

        <select
          className="mt-auto bg-gray-700 text-white p-2 rounded-md focus:outline-none"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>

        <button
          className="bg-red-600 hover:bg-red-700 w-full py-2 rounded-md transition text-sm font-medium"
          onClick={leaveRoom}
        >
          Leave Room
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-grow">
        <Editor
          height="100vh"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;         