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
    if (role === "student") {
      onLogin(role);
      return;
    }
    if (password === "12345") {
      onLogin(role);
    } else {
      alert("Incorrect password");
    }
  }

  return (
    <div className="login-screen">
      <form className="login-box" onSubmit={login}>
        <h2>IvySchool.ai</h2>

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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        <button className="join-btn" type="submit">
          Enter →
        </button>
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

  if (!role) {
    return <LoginPage onLogin={setRole} />;
  }

  return (
    <BrowserRouter>
      <div className={dark ? "layout dark" : "layout"}>
        {/* SIDEBAR */}
        <aside className="sidebar">
          {pfp && <img src={pfp} alt="Profile" className="sidebar-pfp" />}

          <img id="slam" src="https://www.ivyschool.ai/logo.png" alt="IvySchool Logo" className="sidebar-logo" />

          <nav className="nav">
            <Link to="/" className="nav-item">
              🏠 Dashboard
            </Link>
            <Link to="/courses" className="nav-item">
              📘 My Courses
            </Link>
            <Link to="/messages" className="nav-item">
              💬 Messages
            </Link>
            <Link to="/yoga" className="nav-item">
              🧘 Yoga
            </Link>
            <Link to="/settings" className="nav-item">
              ⚙️ Settings
            </Link>
          </nav>

          <div style={{ marginTop: "30px", fontSize: "13px", opacity: 0.85 }}>
            Logged in as: <b>{role.toUpperCase()}</b>
          </div>

          <button className="join-btn" onClick={() => setRole(null)}>
            Logout
          </button>
        </aside>

        {/* MAIN AREA */}
        <main className="main">
          <Header pfp={pfp} />

          <div className="content">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/courses" element={<MyCoursesPage />} />
              <Route path="/messages" element={<MessagesPage role={role} />} />
              <Route path="/yoga" element={<YogaPage />} />
              <Route
                path="/settings"
                element={
                  <SettingsPage
                    dark={dark}
                    setDark={setDark}
                    pfp={pfp}
                    setPfp={setPfp}
                  />
                }
              />
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
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/messages")}>
          🔔
        </span>
        {pfp ? (
          <img src={pfp} alt="pfp" className="header-pfp" />
        ) : (
          <span>👤</span>
        )}
      </div>
    </header>
  );
}

// ----------------------------------------------------------
// DASHBOARD PAGE
// ----------------------------------------------------------
function DashboardPage() {
  // Courses with progress
  const [courses, setCourses] = useState(() => {
    const stored = localStorage.getItem("ivyschool_progress");
    if (stored) return JSON.parse(stored);
    const initial = [
      {
        title: "AWS Certified Cloud Practitioner",
        link: "https://meet.google.com/hnn-iwpe-zbg",
        progress: 0,
      },
      {
        title: "MIT Intro to Python",
        link: "https://meet.google.com/hnn-iwpe-zbg",
        progress: 0,
      },
    ];
    localStorage.setItem("ivyschool_progress", JSON.stringify(initial));
    return initial;
  });

  // Projects
  const [projects, setProjects] = useState(() => {
    return JSON.parse(localStorage.getItem("ivyschool_projects") || "[]");
  });
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectGit, setNewProjectGit] = useState("");

  function saveCourses(updated) {
    setCourses(updated);
    localStorage.setItem("ivyschool_progress", JSON.stringify(updated));
  }

  function saveProjects(updated) {
    setProjects(updated);
    localStorage.setItem("ivyschool_projects", JSON.stringify(updated));
  }

  function handleJoinClass(index, link) {
    window.open(link, "_blank", "noopener,noreferrer");
    const updated = courses.map((c, i) =>
      i === index ? { ...c, progress: Math.min(100, c.progress + 5) } : c
    );
    saveCourses(updated);
  }

  function addProject() {
    if (!newProjectTitle.trim()) return;
    const proj = {
      title: newProjectTitle.trim(),
      desc: newProjectDesc.trim(),
      git: newProjectGit.trim(),
    };
    const updated = [...projects, proj];
    saveProjects(updated);
    setNewProjectTitle("");
    setNewProjectDesc("");
    setNewProjectGit("");
  }

  const upcomingCourse = {
    title: "Full Stack Development with MERN – MITxPro",
    desc: "Get ready for your next high-intensity Ivy module.",
  };

  return (
    <>
      <h1 className="welcome">Welcome back, Bob 👋</h1>
      <p className="age">Age: 9</p>

      {/* Upcoming course */}
      <h2 className="section-title">Your Upcoming Course</h2>
      <div className="course-card">
        <h3>{upcomingCourse.title}</h3>
        <p>{upcomingCourse.desc}</p>
      </div>

      {/* Recorded classes */}
      <h2 className="section-title">Recorded Classes</h2>
      <div className="course-card">
        <p>Watch your recorded Ivy sessions.</p>
        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noreferrer"
          className="git"
        >
          Open YouTube (add your playlist URL)
        </a>
      </div>

      {/* Courses with join + progress */}
      <h2 className="section-title">Your Courses</h2>
      {courses.map((c, i) => (
        <div className="course-card" key={i}>
          <h3>{c.title}</h3>
          <p>Progress: {c.progress}%</p>
          <button
            className="join-btn"
            style={{ marginTop: "8px" }}
            onClick={() => handleJoinClass(i, c.link)}
          >
            Join Class →
          </button>
        </div>
      ))}

      {/* Projects */}
      <h2 className="section-title">Your Projects</h2>
      <div className="course-card">
        <h3>Add a new project</h3>
        <input
          type="text"
          placeholder="Project title"
          value={newProjectTitle}
          onChange={(e) => setNewProjectTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Short description"
          value={newProjectDesc}
          onChange={(e) => setNewProjectDesc(e.target.value)}
        />
        <input
          type="text"
          placeholder="GitHub repo URL"
          value={newProjectGit}
          onChange={(e) => setNewProjectGit(e.target.value)}
        />
        <button className="join-btn" onClick={addProject}>
          Add Project
        </button>
      </div>

      {projects.map((p, i) => (
        <div className="course-card" key={i}>
          <h3>{p.title}</h3>
          {p.desc && <p>{p.desc}</p>}
          {p.git && (
            <a href={p.git} target="_blank" rel="noreferrer" className="git">
              GitHub Repo →
            </a>
          )}
        </div>
      ))}

      <p className="quote">
        “The future belongs to those who learn faster.” — IvySchool.ai
      </p>
    </>
  );
}

// ----------------------------------------------------------
// MY COURSES PAGE
// ----------------------------------------------------------
function MyCoursesPage() {
  const [courses] = useState(() => {
    return JSON.parse(localStorage.getItem("ivyschool_progress") || "[]");
  });

  return (
    <>
      <h1 className="welcome">📘 My Courses</h1>
      {courses.length === 0 && (
        <p style={{ marginTop: 10 }}>No courses yet. Join from the dashboard.</p>
      )}
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
// MESSAGES PAGE (public + private + image + audio + preview)
// ----------------------------------------------------------
function MessagesPage({ role }) {
  const [messages, setMessages] = useState(() =>
    JSON.parse(localStorage.getItem("ivyschool_messages") || "[]")
  );
  const [filter, setFilter] = useState("all"); // all / student / parent / coach / admin
  const [sendTo, setSendTo] = useState("everyone"); // everyone or a specific role
  const [text, setText] = useState("");
  const [fileData, setFileData] = useState(null); // { type: 'image' | 'audio', data: base64 }
  const [recording, setRecording] = useState(false);

  const messagesRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, filter]);

  function save(updated) {
    localStorage.setItem("ivyschool_messages", JSON.stringify(updated));
    setMessages(updated);
  }

  function handleImageFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFileData({ type: "image", data: reader.result });
    reader.readAsDataURL(file);
  }

  async function toggleRecording() {
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        recorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const reader = new FileReader();
          reader.onload = () => setFileData({ type: "audio", data: reader.result });
          reader.readAsDataURL(blob);
          stream.getTracks().forEach((t) => t.stop());
        };

        mediaRecorder.start();
        setRecording(true);

        setTimeout(() => {
          if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
          setRecording(false);
        }, 4000);
      } catch {
        alert("Microphone blocked. Allow access to send audio.");
      }
    } else {
      recorderRef.current?.stop();
      setRecording(false);
    }
  }

  function sendMsg(e) {
    e.preventDefault();
    if (!text.trim() && !fileData) return;

    const msg = {
      id: Date.now(),
      from: role,
      to: sendTo,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: fileData ? fileData.type : "text",
      content: fileData ? fileData.data : text.trim(),
    };

    const updated = [...messages, msg];
    save(updated);
    setText("");
    setFileData(null);
  }

  // ────── Visibility rules ──────
  // public → everyone can see
  // private → only sender + receiver see
  const visibleMessages = messages.filter((m) => {
    if (m.to === "everyone") return true;
    if (m.from === role) return true;
    if (m.to === role) return true;
    return false;
  });

  // ────── Filter buttons ──────
  const filtered =
    filter === "all"
      ? visibleMessages   // sender sees ALL *including* private ones
      : visibleMessages.filter((m) => m.from === filter);


  return (
    <div className="messages-wrapper">
      <div className="messages-header">
        <h1>IvySchool.ai Messages</h1>
      </div>

      {/* FILTER BAR */}
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

      {/* SEND TO DROPDOWN */}
      <div style={{ padding: "10px 18px", fontSize: "14px" }}>
        <label>
          Send to:{" "}
          <select value={sendTo} onChange={(e) => setSendTo(e.target.value)}>
            <option value="everyone">Everyone (Public)</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="coach">Coach</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>

      {/* CHAT FEED */}
      <div id="messages" ref={messagesRef}>
        {filtered.map((m) => (
          <div
            key={m.id}
            className={`message ${m.from === role ? "my-msg" : "their-msg"
              }`}
          >
            {m.type === "text" && <p>{m.content}</p>}
            {m.type === "image" && (
              <img src={m.content} alt="sent" style={{ maxWidth: "240px", borderRadius: 8 }} />
            )}
            {m.type === "audio" && (
              <audio controls src={m.content} style={{ width: "240px" }} />
            )}
            <div className="meta">
              {m.from.toUpperCase()} → {m.to === "everyone" ? "EVERYONE" : m.to.toUpperCase()} |{" "}
              {m.time}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT BAR */}
      <form className="chat-form" onSubmit={sendMsg}>
        {fileData && (
          <div className="preview">
            {fileData.type === "image" && <img src={fileData.data} alt="preview" />}
            {fileData.type === "audio" && <audio controls src={fileData.data} />}
            <div className="x" onClick={() => setFileData(null)}>
              ×
            </div>
          </div>
        )}

        <input
          type="text"
          placeholder={`Send a message as ${role}...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label className="file-btn">
          📷
          <input type="file" accept="image/*" hidden onChange={handleImageFile} />
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
// YOGA PAGE
// ----------------------------------------------------------
function YogaPage() {
  const yogaCourse = {
    title: "IIY Introduction – Yoga",
    link: "https://www.ivyschool.ai",
  };

  return (
    <>
      <h1 className="welcome">🧘 Yoga Dashboard</h1>

      <div className="yoga-box">
        <h3>{yogaCourse.title}</h3>
        <p>Start with your introductory yoga flow and breathing practice.</p>
        <a
          href={yogaCourse.link}
          target="_blank"
          rel="noreferrer"
          className="git"
        >
          Open IvySchool.ai Yoga →
        </a>
      </div>

      <div className="yoga-box">
        <h3>Yoga Intro Video</h3>
        <div id="video-container">
          <iframe
            width="100%"
            height="420px"
            src="https://www.youtube.com/embed/Uxy8Sgzlts4"
            title="Yoga Intro"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          />
        </div>
      </div>
    </>
  );
}

// ----------------------------------------------------------
// SETTINGS PAGE
// ----------------------------------------------------------
function SettingsPage({ dark, setDark, pfp, setPfp }) {
  function handlePfp(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("ivyschool_pfp", reader.result);
      setPfp(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <h1 className="welcome">⚙️ Settings</h1>

      <div className="course-card">
        <h3>Appearance</h3>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={dark}
            onChange={() => setDark(!dark)}
          />
          Dark Mode
        </label>
      </div>

      <div className="course-card">
        <h3>Profile Picture</h3>
        {pfp && (
          <img
            src={pfp}
            alt="pfp"
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 10,
            }}
          />
        )}
        <input type="file" accept="image/*" onChange={handlePfp} />
      </div>
    </>
  );
}
