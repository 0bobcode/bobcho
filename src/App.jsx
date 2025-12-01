import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

/* ---------------------- LOGIN ---------------------- */
function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");

  function login(e) {
    e.preventDefault();
    if (role === "student") return onLogin("student");
    if (password === "12345") onLogin(role);
    else alert("Incorrect password.");
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
          <option value="deep">🧑 Deep</option>
        </select>
        {role !== "student" && (
          <>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}
        <button className="join-btn" type="submit">Enter →</button>
      </form>
    </div>
  );
}

/* ---------------------- MAIN APP ---------------------- */
export default function App() {
  const [role, setRole] = useState(null);
  const [dark, setDark] = useState(false);
  const [pfp, setPfp] = useState(() => localStorage.getItem("ivyschool_pfp") || null);

  if (!role) return <LoginPage onLogin={(r) => setRole(r)} />;

  return (
    <BrowserRouter>
      <div className={dark ? "layout dark" : "layout"}>
        <aside className="sidebar">
          {pfp && <img src={pfp} alt="pfp" className="sidebar-pfp" />}
          <h2 className="logo">IvySchool.ai</h2>

          <nav className="nav">
            <Link to="/" className="nav-item">🏠 Dashboard</Link>
            <Link to="/courses" className="nav-item">📘 My Courses</Link>
            <Link to="/messages" className="nav-item">💬 Messages</Link>
            <Link to="/yoga" className="nav-item">🧘 Yoga</Link>
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
              <Route path="/yoga" element={<YogaPage role={role} />} />
              <Route path="/settings" element={<SettingsPage dark={dark} setDark={setDark} pfp={pfp} setPfp={setPfp} />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

/* ---------------------- HEADER ---------------------- */
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

/* ---------------------- DASHBOARD ---------------------- */
function DashboardPage() {
  const [courses, setCourses] = useState(() =>
    JSON.parse(localStorage.getItem("ivyschool_progress")) || [
      { title: "AWS Certified Cloud Practitioner", link: "https://meet.google.com/hnn-iwpe-zbg", progress: 0 },
      { title: "MIT Intro to Python", link: "https://meet.google.com/hnn-iwpe-zbg", progress: 0 },
      
    ]
  );

  const [projects, setProjects] = useState(() =>
    JSON.parse(localStorage.getItem("ivyschool_projects") || "[]")
  );

  const [newProject, setNewProject] = useState({ title: "", desc: "", git: "" });

  function saveProg(x) {
    localStorage.setItem("ivyschool_progress", JSON.stringify(x));
  }

  function saveProjects(x) {
    localStorage.setItem("ivyschool_projects", JSON.stringify(x));
  }

  function join(i, link) {
    window.open(link, "_blank", "noopener,noreferrer");
    const updated = [...courses];
    updated[i].progress = Math.min(100, updated[i].progress + 5);
    setCourses(updated);
    saveProg(updated);
  }

  function addProject() {
    if (!newProject.title.trim()) return;
    const updated = [...projects, newProject];
    setProjects(updated);
    saveProjects(updated);
    setNewProject({ title: "", desc: "", git: "" });
  }

  function removeProject(i) {
    const updated = projects.filter((_, idx) => idx !== i);
    setProjects(updated);
    saveProjects(updated);
  }

  return (
    <>
      <h1 className="welcome">Welcome back, Bob 👋</h1>
      <p className="age">Age: 9</p>

      <h2 className="section-title">Upcoming Course</h2>
      <div className="course-card">
        <h3>Full Stack Development with MERN – MITX PRO</h3>
        <p>Prepare yourself for the next exciting module!</p>
      </div>

      <h2 className="section-title">Your Courses</h2>
      {courses.map((c, i) => (
        <div className="course-card" key={i}>
          <h3>{c.title}</h3>
          <p>Progress: {c.progress}%</p>
          <button className="join-btn" onClick={() => join(i, c.link)}>Join Class →</button>
        </div>
      ))}

      <h2 className="section-title">Your Projects</h2>
      <div className="course-card">
        <h3>Add New Project</h3>
        <input placeholder="Project title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
        <input placeholder="Description" value={newProject.desc} onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })} />
        <input placeholder="GitHub URL" value={newProject.git} onChange={(e) => setNewProject({ ...newProject, git: e.target.value })} />
        <button className="join-btn" onClick={addProject}>Submit</button>
      </div>

      {projects.map((p, i) => (
        <div className="course-card" key={i}>
          <h3>{p.title}</h3>
          <p>{p.desc}</p>
          {p.git && <a href={p.git} target="_blank" rel="noreferrer" className="git">GitHub ↗</a>}
          <button className="join-btn" style={{ background: "#b91c1c", marginTop: 10 }} onClick={() => removeProject(i)}>
            Remove
          </button>
        </div>
      ))}

      <p className="quote">“The future belongs to those who learn faster.” — IvySchool.ai</p>
    </>
  );
}

/* ---------------------- MY COURSES ---------------------- */
function MyCoursesPage() {
  const [courses] = useState(() =>
    JSON.parse(localStorage.getItem("ivyschool_progress")) || []
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
/* ---------------------- MESSAGES (Version C) ---------------------- */
function MessagesPage({ role }) {
  const [messages, setMessages] = useState(() =>
    JSON.parse(localStorage.getItem("ivyschool_messages") || "[]")
  );
  const [sendTo, setSendTo] = useState("everyone");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const preview = file !== null;
  const box = useRef();

  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [messages]);

  function save(x) {
    localStorage.setItem("ivyschool_messages", JSON.stringify(x));
  }

  function handlePic(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setFile({ type: "image", data: r.result });
    r.readAsDataURL(f);
  }

  async function mic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      let chunks = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const r = new FileReader();
        r.onload = () => setFile({ type: "audio", data: r.result });
        r.readAsDataURL(blob);
      };
      rec.start();
      setTimeout(() => rec.stop(), 4000);
    } catch {
      alert("Microphone blocked.");
    }
  }

  function send(e) {
    e.preventDefault();
    if (!text.trim() && !file) return;
    const msg = {
      from: role,
      to: sendTo,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: file ? file.type : "text",
      content: file ? file.data : text.trim(),
    };
    const updated = [...messages, msg];
    setMessages(updated);
    save(updated);
    setText("");
    setFile(null);
  }

  const visible = messages.filter(
    (m) => m.to === "everyone" || m.from === role || m.to === role
  );

  return (
    <div className="messages-wrapper">
      <div className="messages-header">
        <h1>IvySchool.ai Messages</h1>
        <div style={{ fontSize: 13, opacity: 0.8 }}>
          Logged in as <b>{role.toUpperCase()}</b>
        </div>
      </div>

      <div style={{ margin: "10px 16px", fontSize: 14 }}>
        <label>
          Send to:{" "}
          <select
            value={sendTo}
            onChange={(e) => setSendTo(e.target.value)}
            className="role-select"
          >
            <option value="everyone">Everyone (Public)</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="coach">Coach</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>

      <div id="messages" ref={box}>
        {visible.map((m, i) => (
          <div className={`message ${m.from}`} key={i}>
            {m.type === "text" && <p>{m.content}</p>}
            {m.type === "image" && (
              <img
                src={m.content}
                style={{ maxWidth: 200, borderRadius: 8 }}
                alt="uploaded"
              />
            )}
            {m.type === "audio" && <audio controls src={m.content} />}
            <div className="meta">
              {m.from.toUpperCase()} →{" "}
              {m.to === "everyone" ? "EVERYONE" : m.to.toUpperCase()} | {m.time}
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <div className="preview">
          <span className="x" onClick={() => setFile(null)}>
            ✖
          </span>
          {file.type === "image" && (
            <img src={file.data} style={{ maxWidth: 120 }} alt="preview" />
          )}
          {file.type === "audio" && <audio controls src={file.data} />}
        </div>
      )}

      <form className="chat-form" onSubmit={send}>
        <input
          placeholder={`Send a message as ${role}...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <label className="file-btn">
          📷
          <input type="file" hidden accept="image/*" onChange={handlePic} />
        </label>
        <button type="button" className="mic-btn" onClick={mic}>
          🎤
        </button>
        <button type="submit">Send ➤</button>
      </form>
    </div>
  );
}

/* ---------------------- YOGA PAGE ---------------------- */
/* ---------------------- YOGA PAGE (UPGRADED) ---------------------- */
function YogaPage({ role }) {
  const navigate = useNavigate();
  const yogaCourse = {
    title: "IIY Introduction. yoga",
    link: "https://www.ivyschool.ai",
  };

  return (
    <div>
      <h1 className="welcome">🧘 Yoga Dashboard</h1>

      <div className="yoga-card">
        <h2>{yogaCourse.title}</h2>
        <p style={{ marginBottom: 12 }}>
          A calm mind is a sharp mind — let's strengthen both.
        </p>

        <button
          className="join-btn"
          onClick={() => window.open(yogaCourse.link, "_blank", "noopener,noreferrer")}
        >
          Start Practice →
        </button>

    
      </div>

      <h2 className="section-title">Message Your Coaches</h2>

      <button
        className="join-btn"
        onClick={() => navigate("/messages", { state: { target: "coach" } })}
      >
        Message Deep 💬
      </button>

      <button
        className="join-btn"
        style={{ marginTop: 10 }}
        onClick={() => navigate("/messages", { state: { target: "student" } })}
      >
        Message Bob 💬
      </button>
      <div className="yoga-video-card">
        <h3>Welcome to Yoga 🧘‍♂️</h3>
        <p style={{ marginBottom: "14px" }}>
          Start your yoga journey with this short intro from Deep.
        </p>

        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "16px" }} id="video-container">
          <iframe
            src="https://www.youtube.com/embed/Uxy8Sgzlts4"
            title="Yoga Intro"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "16px"
            }}
          ></iframe>
        </div>
      </div>
    </div>
  );
}


/* ---------------------- SETTINGS ---------------------- */
function SettingsPage({ dark, setDark, pfp, setPfp }) {
  function updatePic(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      localStorage.setItem("ivyschool_pfp", r.result);
      setPfp(r.result);
    };
    r.readAsDataURL(f);
  }

  return (
    <div>
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
            alt="pfp"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 10,
            }}
          />
        )}
        <input type="file" accept="image/*" onChange={updatePic} />
      </div>
    </div>
  );
}
