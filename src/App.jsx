import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

// ----------------------------------------------------------
// LOGIN PAGE COMPONENT
// ----------------------------------------------------------
function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");

  function login(e) {
    e.preventDefault();

    // Student does NOT require a password
    if (role === "student") {
      onLogin("student");
      return;
    }

    // Parent, Coach, Admin require password 12345
    if (password === "12345") {
      onLogin(role);
    } else {
      alert("Incorrect password.");
    }
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

// ----------------------------------------------------------
// MAIN APP
// ----------------------------------------------------------
export default function App() {
  const [role, setRole] = useState(null);
  const [dark, setDark] = useState(false);

  if (!role) return <LoginPage onLogin={(r) => setRole(r)} />;

  return (
    <BrowserRouter>
      <div className={dark ? "layout dark" : "layout"}>

        {/* SIDEBAR */}
        <aside className="sidebar">
          <h2 className="logo">IvySchool.ai</h2>

          <nav className="nav">
            <Link to="/" className="nav-item">🏠 Dashboard</Link>
            <Link to="/courses" className="nav-item">📘 My Courses</Link>
            <Link to="/messages" className="nav-item">💬 Messages</Link>
            <Link to="/settings" className="nav-item">⚙️ Settings</Link>
          </nav>

          <div style={{ marginTop: "40px", opacity: 0.7, fontSize: "14px" }}>
            Logged in as: <b>{role.toUpperCase()}</b>
          </div>

          <button className="join-btn" style={{ marginTop: "20px" }} onClick={() => setRole(null)}>
            Logout
          </button>
        </aside>

        {/* MAIN AREA */}
        <main className="main">
          <Header />

          <div className="content">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/courses" element={<MyCoursesPage />} />
              <Route path="/messages" element={<MessagesPage role={role} />} />
              <Route path="/settings" element={<SettingsPage dark={dark} setDark={setDark} />} />
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
function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div></div>
      <div className="header-icons">
        <span onClick={() => navigate("/messages")} style={{ cursor: "pointer" }}>🔔</span>
        <span>👤</span>
      </div>
    </header>
  );
}

// ----------------------------------------------------------
// DASHBOARD PAGE WITH PROGRESS LOGIC
// ----------------------------------------------------------
function DashboardPage() {
  const [courses, setCourses] = useState(() => {
    return JSON.parse(localStorage.getItem("ivyschool_progress")) || [
      {
        title: "AWS Certified Cloud Practitioner",
        link: "https://meet.google.com/hnn-iwpe-zbg",
        progress: 0
      },
      {
        title: "MIT Intro to Python",
        link: "https://meet.google.com/hnn-iwpe-zbg",
        progress: 0
      }
    ];
  });

  function saveProgress(updated) {
    localStorage.setItem("ivyschool_progress", JSON.stringify(updated));
  }

  function openMeet(index, link) {
    window.open(link, "_blank", "noopener,noreferrer");

    setCourses(prev => {
      const updated = [...prev];
      updated[index].progress = Math.min(100, updated[index].progress + 5);
      saveProgress(updated);
      return updated;
    });
  }

  const student = {
    name: "Bob Chopra",
    age: 9,
    upcomingCourse: {
      title: "Full Stack Development with MERN - MITX PRO",
      desc: "Prepare yourself for the next exciting module!",
    }
  };

  return (
    <>
      <h1 className="welcome">Welcome back, {student.name} 👋</h1>
      <p className="age">Age: {student.age}</p>

      <h2 className="section-title">Your Upcoming Course</h2>
      <div className="course-card">
        <h3>{student.upcomingCourse.title}</h3>
        <p>{student.upcomingCourse.desc}</p>
      </div>

      <h2 className="section-title">Your Courses</h2>

      {courses.map((c, i) => (
        <div className="course-card" key={i}>
          <h3>{c.title}</h3>
          <p>Progress: {c.progress}%</p>
          <button className="join-btn" onClick={() => openMeet(i, c.link)}>
            Join Class →
          </button>
        </div>
      ))}

      <p className="quote">
        “The future belongs to those who learn faster.” — IvySchool.ai
      </p>
    </>
  );
}

// ----------------------------------------------------------
// MY COURSES PAGE (READS PROGRESS)
// ----------------------------------------------------------
function MyCoursesPage() {
  const [courses] = useState(() => {
    return JSON.parse(localStorage.getItem("ivyschool_progress")) || [];
  });

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
// MESSAGES PAGE
// ----------------------------------------------------------
function MessagesPage({ role }) {
  const [messages, setMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("ivyschool_messages") || "[]");
  });
  const [filter, setFilter] = useState("all");
  const [text, setText] = useState("");

  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, filter]);

  function save(msgs) {
    localStorage.setItem("ivyschool_messages", JSON.stringify(msgs));
  }

  function sendMsg(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const msg = {
      role,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updated = [...messages, msg];
    setMessages(updated);
    save(updated);
    setText("");
  }

  const filtered = filter === "all"
    ? messages
    : messages.filter((m) => m.role === filter);

  return (
    <div className="messages-wrapper">
      <div className="messages-header">
        <h1>IvySchool.ai Messages</h1>
        <select value={role} disabled className="role-select">
          <option>{role}</option>
        </select>
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

      <div id="messages" ref={messagesRef}>
        {filtered.map((m, i) => (
          <div className={`message ${m.role}`} key={i}>
            <p>{m.text}</p>
            <div className="meta">
              {m.role.toUpperCase()} | {m.time}
            </div>
          </div>
        ))}
      </div>

      <form className="chat-form" onSubmit={sendMsg}>
        <input
          type="text"
          placeholder={`Send a message as ${role}...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button type="submit">Send ➤</button>
      </form>
    </div>
  );
}

// ----------------------------------------------------------
// SETTINGS PAGE
// ----------------------------------------------------------
function SettingsPage({ dark, setDark }) {
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
            style={{ marginRight: "10px" }}
          />
          Dark Mode
        </label>
      </div>
    </>
  );
}
