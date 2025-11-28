import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

// ----------------------------------------------------------
// LOGIN PAGE
// ----------------------------------------------------------
function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");

  function login(e) {
    e.preventDefault();
    if (role === "student") return onLogin("student");
    if (password === "iLOVEyou123123?") return onLogin(role);
    alert("Incorrect password");
  }

  return (
    <div className="login-screen">
      <h1 className="logo" style={{ textAlign: "center" }}>IvySchool.ai</h1>
      <form className="login-box" onSubmit={login}>
        <h2>Login</h2>
        <label>Choose Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">👨‍🎓 Student</option>
          <option value="parent">👨‍👩‍👧 Parent</option>
          <option value="coach">👩‍🏫 Coach</option>
          <option value="admin">🧑‍💼 Admin</option>
        </select>
        {role !== "student" && (
          <>
            <label>Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}
        <button className="join-btn" type="submit">Enter →</button>
      </form>
    </div>
  );
}

// ----------------------------------------------------------
// MAIN APP
// ----------------------------------------------------------
export default function App() {
  const [role, setRole] = useState(null);
  const [dark, setDark] = useState(false);
  const [pfp, setPfp] = useState(() => localStorage.getItem("ivyschool_pfp") || null);

  if (!role) return <LoginPage onLogin={(r) => setRole(r)} />;

  return (
    <BrowserRouter>
      <div className={dark ? "layout dark" : "layout"}>
        <aside className="sidebar">
          {pfp && <img src={pfp} className="sidebar-pfp" alt="pfp" />}
          <h2 className="logo">IvySchool.ai</h2>

          <nav className="nav">
            <Link to="/" className="nav-item">🏠 Dashboard</Link>
            <Link to="/courses" className="nav-item">📘 My Courses</Link>
            <Link to="/messages" className="nav-item">💬 Messages</Link>
            <Link to="/settings" className="nav-item">⚙️ Settings</Link>
          </nav>

          <div style={{ marginTop: 40, opacity: 0.7, fontSize: 14 }}>
            Logged in as: <b>{role.toUpperCase()}</b>
          </div>

          <button className="join-btn" style={{ marginTop: 20 }} onClick={() => setRole(null)}>
            Logout
          </button>
        </aside>

        <main className="main">
          <Header pfp={pfp} />
          <div className="content">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/courses" element={<MyCoursesPage />} />
              <Route path="/messages" element={<MessagesPage role={role} />} />
              <Route path="/settings" element={<SettingsPage dark={dark} setDark={setDark} pfp={pfp} setPfp={setPfp} />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

// ----------------------------------------------------------
// HEADER
// ----------------------------------------------------------
function Header({ pfp }) {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div></div>
      <div className="header-icons">
        <span onClick={() => navigate("/messages")} style={{ cursor: "pointer" }}>🔔</span>
        {pfp ? <img src={pfp} className="header-pfp" alt="pfp" /> : <span>👤</span>}
      </div>
    </header>
  );
}

// ----------------------------------------------------------
// DASHBOARD PAGE (COURSES + PROGRESS + PROJECTS)
// ----------------------------------------------------------
function DashboardPage() {
  const [courses, setCourses] = useState(() =>
    JSON.parse(localStorage.getItem("ivyschool_progress")) || [
      { title: "AWS Certified Cloud Practitioner", link: "https://meet.google.com/hnn-iwpe-zbg", progress: 0 },
      { title: "MIT Intro to Python", link: "https://meet.google.com/hnn-iwpe-zbg", progress: 0 }
    ]
  );

  const [projects, setProjects] = useState(
    () => JSON.parse(localStorage.getItem("ivyschool_projects") || "[]")
  );

  const [newProject, setNewProject] = useState("");

  function saveProgress(u) {
    localStorage.setItem("ivyschool_progress", JSON.stringify(u));
  }

  function saveProjects(u) {
    localStorage.setItem("ivyschool_projects", JSON.stringify(u));
  }

  function openMeet(i, link) {
    window.open(link, "_blank", "noopener,noreferrer");
    setCourses(prev => {
      const u = [...prev];
      u[i].progress = Math.min(100, u[i].progress + 5);
      saveProgress(u);
      return u;
    });
  }

  function addProject() {
    const t = newProject.trim();
    if (!t) return;
    const u = [...projects, { title: t }];
    setProjects(u);
    saveProjects(u);
    setNewProject("");
  }

  function removeProject(i) {
    const u = projects.filter((_, x) => x !== i);
    setProjects(u);
    saveProjects(u);
  }

  return (
    <>
      <h1 className="welcome">Welcome back, Bob Chopra 👋</h1>
      <p className="age">Age: 9</p>

      <h2 className="section-title">Your Upcoming Course</h2>
      <div className="course-card">
        <h3>Full Stack Development with MERN – MITx PRO</h3>
        <p>Prepare yourself for the next exciting module!</p>
      </div>

      <h2 className="section-title">Your Courses</h2>
      {courses.map((c, i) => (
        <div className="course-card" key={i}>
          <h3>{c.title}</h3>
          <p>Progress: {c.progress}%</p>
          <button className="join-btn" onClick={() => openMeet(i, c.link)}>Join Class →</button>
        </div>
      ))}

      <h2 className="section-title">Your Projects</h2>
      <div className="course-card">
        <h3>Add New Project</h3>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <input
            type="text"
            value={newProject}
            placeholder="Project name..."
            onChange={(e) => setNewProject(e.target.value)}
            style={{ flex: 1, padding: 8, borderRadius: 7, border: "1px solid #ccc" }}
          />
          <button className="join-btn" onClick={addProject}>Add</button>
        </div>
      </div>

      {projects.map((p, i) => (
        <div className="course-card" key={i}>
          <h3>{p.title}</h3>
          <button
            className="join-btn"
            style={{ background: "#b91c1c", marginTop: 8 }}
            onClick={() => removeProject(i)}
          >
            Remove
          </button>
        </div>
      ))}

      <p className="quote">“The future belongs to those who learn faster.” — IvySchool.ai</p>
    </>
  );
}

// ----------------------------------------------------------
// MY COURSES PAGE
// ----------------------------------------------------------
function MyCoursesPage() {
  const [courses] = useState(
    () => JSON.parse(localStorage.getItem("ivyschool_progress")) || []
  );

  return (
    <>
      <h1 className="welcome">📘 My Courses</h1>
      {courses.map((c, i) => (
        <div className="course-card" key={i}>
          <h3>{c.title}</h3>
          <p>Progress: {c.progress}%</p>
        </div>
      ))}
    </>
  );
}

// ----------------------------------------------------------
// MESSAGES PAGE (PRIVATE + PUBLIC + TEXT + IMAGE + AUDIO + PREVIEW)
// ----------------------------------------------------------
function MessagesPage({ role }) {
  const [messages, setMessages] = useState(
    () => JSON.parse(localStorage.getItem("ivyschool_messages") || "[]")
  );
  const [filter, setFilter] = useState("all");
  const [sendTo, setSendTo] = useState("everyone");
  const [text, setText] = useState("");
  const [fileData, setFileData] = useState(null);
  const [recording, setRecording] = useState(false);

  const messagesRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, filter]);

  function save(u) {
    localStorage.setItem("ivyschool_messages", JSON.stringify(u));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setFileData({ type: "image", data: r.result });
    r.readAsDataURL(file);
  }

  async function toggleRecording() {
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const rec = new MediaRecorder(stream);
        recorderRef.current = rec;
        chunksRef.current = [];

        rec.ondataavailable = (e) => chunksRef.current.push(e.data);
        rec.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const r = new FileReader();
          r.onload = () => setFileData({ type: "audio", data: r.result });
          r.readAsDataURL(blob);
          stream.getTracks().forEach((t) => t.stop());
        };

        rec.start();
        setRecording(true);
        setTimeout(() => {
          if (rec.state !== "inactive") rec.stop();
          setRecording(false);
        }, 4000);
      } catch {
        alert("Microphone access blocked");
      }
    } else {
      recorderRef.current.stop();
      setRecording(false);
    }
  }

  function sendMsg(e) {
    e.preventDefault();
    if (!text.trim() && !fileData) return;

    const msg = {
      from: role,
      to: sendTo,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: fileData ? fileData.type : "text",
      content: fileData ? fileData.data : text.trim(),
      caption: fileData && text.trim() ? text.trim() : null
    };

    const u = [...messages, msg];
    setMessages(u);
    save(u);
    setText("");
    setFileData(null);
  }

  const visibleMessages = messages.filter((m) => {
    if (m.to === "everyone") return true;
    if (m.from === role) return true;
    if (m.to === role) return true;
    return false;
  });

  let filtered;
  if (filter === "all") {
    filtered = visibleMessages.filter((m) => m.to === "everyone");
  } else {
    filtered = visibleMessages.filter(
      (m) =>
        (m.from === filter && m.to === role) ||
        (m.to === filter && m.from === role)
    );
  }

  return (
    <div className="messages-wrapper">
      <div className="messages-header">
        <h1>IvySchool.ai Messages</h1>
        <div style={{ fontSize: 13, opacity: 0.8 }}>
          Logged in as <b>{role.toUpperCase()}</b>
        </div>
      </div>

      <div className="filter-bar">
        {["all", "student", "parent", "coach", "admin"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ margin: "10px 16px", fontSize: 14 }}>
        Send to:
        <select value={sendTo} onChange={(e) => setSendTo(e.target.value)} className="role-select">
          <option value="everyone">Everyone (Public)</option>
          <option value="student">Student (Private)</option>
          <option value="parent">Parent (Private)</option>
          <option value="coach">Coach (Private)</option>
          <option value="admin">Admin (Private)</option>
        </select>
      </div>

      {fileData && (
        <div style={{
          padding: "10px 15px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          gap: 12,
          alignItems: "center"
        }}>
          {fileData.type === "image" && (
            <img src={fileData.data} alt="preview" style={{ maxWidth: 120, borderRadius: 8 }} />
          )}
          {fileData.type === "audio" && (
            <audio controls src={fileData.data} style={{ width: 200 }} />
          )}
          <button
            type="button"
            onClick={() => setFileData(null)}
            style={{
              background: "#b91c1c",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            ✖
          </button>
        </div>
      )}

      <div id="messages" ref={messagesRef}>
        {filtered.map((m, i) => (
          <div className={`message ${m.from}`} key={i}>
            {m.type === "text" && <p>{m.content}</p>}
            {m.type === "image" && (
              <>
                <img src={m.content} alt="sent" style={{ maxWidth: 220, borderRadius: 8 }} />
                {m.caption && <p style={{ marginTop: 6 }}>{m.caption}</p>}
              </>
            )}
            {m.type === "audio" && (
              <>
                <audio controls src={m.content} style={{ width: 220 }} />
                {m.caption && <p style={{ marginTop: 6 }}>{m.caption}</p>}
              </>
            )}
            <div className="meta">
              {m.from.toUpperCase()} → {m.to === "everyone" ? "EVERYONE" : m.to.toUpperCase()} | {m.time}
            </div>
          </div>
        ))}
      </div>

      <form className="chat-form" onSubmit={sendMsg}>
        <input
          type="text"
          value={text}
          placeholder={`Send a message as ${role}…`}
          onChange={(e) => setText(e.target.value)}
        />
        <label className="file-btn">
          📷
          <input type="file" accept="image/*" onChange={handleImage} hidden />
        </label>
        <button type="button" className="mic-btn" onClick={toggleRecording}>
          {recording ? "⏺" : "🎤"}
        </button>
        <button type="submit">Send ➤</button>
      </form>
    </div>
  );
}

// ----------------------------------------------------------
// SETTINGS PAGE
// ----------------------------------------------------------
function SettingsPage({ dark, setDark, pfp, setPfp }) {
  function updatePfp(e) {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      localStorage.setItem("ivyschool_pfp", r.result);
      setPfp(r.result);
    };
    r.readAsDataURL(file);
  }

  return (
    <>
      <h1 className="welcome">⚙️ Settings</h1>

      <div className="course-card">
        <h3>Appearance</h3>
        <label>
          <input
            type="checkbox"
            checked={dark}
            onChange={() => setDark(!dark)}
            style={{ marginRight: 10 }}
          />
          Dark Mode
        </label>
      </div>

      <div className="course-card">
        <h3>Profile Picture</h3>
        {pfp && (
          <img
            src={pfp}
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 10
            }}
            alt="pfp"
          />
        )}
        <input type="file" accept="image/*" onChange={updatePfp} />
      </div>
    </>
  );
}
