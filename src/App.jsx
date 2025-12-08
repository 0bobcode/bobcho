import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

// --- STATIC DATA FOR CHILDREN AND COURSES (Updated with Verification Status) ---
const CHILDREN_DATA = [
  { name: "Bob", age: 9, id: "bob", parent: "Mr. Chopra", verified: true, courses: [{ title: "AWS Certified Cloud Practitioner", progress: 60, link: "https://meet.google.com/hnn-iwpe-zbg" }] },
  { name: "Max", age: 10, id: "max", parent: "Mrs. Davis", verified: false, courses: [{ title: "MIT Intro to Python", progress: 40, link: "https://meet.google.com/xyz-abc-123" }] },
  { name: "Lilly", age: 7, id: "lilly", parent: "Mrs. Davis", verified: true, courses: [{ title: "Yoga & Mindfulness", progress: 100, link: "https://meet.google.com/lmn-opq-789" }] },
  { name: "Zak", age: 12, id: "zak", parent: "Mr. Lee", verified: false, courses: [{ title: "Full Stack Development with MERN", progress: 10, link: "https://meet.google.com/rst-uvw-456" }] },
];

// Deduce unique parent list from children data
const PARENT_DATA = Array.from(new Set(CHILDREN_DATA.map(c => c.parent))).map(name => ({
  name: name,
  email: name.replace(/[^a-zA-Z]/g, '').toLowerCase() + '@ivyschool.ai',
  childrenCount: CHILDREN_DATA.filter(c => c.parent === name).length
}));
// -----------------------------------------------------------


// ----------------------------------------------------------
// LOGIN PAGE (Unchanged)
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
// MAIN APP (Unchanged)
// ----------------------------------------------------------
export default function App() {
  const [role, setRole] = useState(null);
  const [dark, setDark] = useState(false);
  // Get initial PFP state from localStorage
  const [pfp, setPfp] = useState(() => localStorage.getItem("ivyschool_pfp") || null);

  // Effect to listen for localStorage changes (for PFP updates)
  useEffect(() => {
    function handleStorageChange(e) {
      if (e.key === "ivyschool_pfp") {
        setPfp(e.newValue);
      }
    }

    // Attach listener for the storage event
    window.addEventListener("storage", handleStorageChange);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
              <Route path="/" element={<DashboardPage role={role} />} />
              <Route path="/courses" element={<MyCoursesPage role={role} />} />
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
// HEADER (Unchanged)
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
// DASHBOARD PAGE (Updated for Coach View)
// ----------------------------------------------------------
function DashboardPage({ role }) {

  // --- STUDENT/DEFAULT LOGIC (Unchanged) ---
  const [courses, setCourses] = useState(() => {
    const stored = localStorage.getItem("ivyschool_progress");
    if (stored) return JSON.parse(stored);

    // Default initial student courses (for Bob)
    const initial = CHILDREN_DATA.find(c => c.id === 'bob').courses;
    localStorage.setItem("ivyschool_progress", JSON.stringify(initial));
    return initial;
  });

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

  // --- ADMIN RENDER LOGIC (Unchanged) ---
  if (role === 'admin') {
    return (
      <>
        <h1 className="welcome">🧑‍💼 IvySchool.ai Admin Dashboard</h1>
        <p className="age">Total Students: **{CHILDREN_DATA.length}** | Total Parents: **{PARENT_DATA.length}**</p>

        <h2 className="section-title">📊 Students Overview</h2>
        {CHILDREN_DATA.map((child) => (
          <div className="course-card" key={child.id} style={{ marginBottom: 10 }}>
            <h3>👨‍🎓 {child.name} (Age: {child.age})</h3>
            <p>Parent: **{child.parent}**</p>
            <p>Current Course: {child.courses[0].title} ({child.courses[0].progress}%)</p>
            <p style={{ fontSize: '12px', opacity: 0.7 }}>ID: {child.id}</p>
          </div>
        ))}

        <h2 className="section-title" style={{ marginTop: '30px' }}>👨‍👩‍👧 Parents Overview</h2>
        {PARENT_DATA.map((parent) => (
          <div className="course-card" key={parent.name} style={{ marginBottom: 10 }}>
            <h3>{parent.name}</h3>
            <p>Email: **{parent.email}**</p>
            <p>Children Enrolled: {parent.childrenCount}</p>
          </div>
        ))}

        <p className="quote" style={{ marginTop: '30px' }}>
          **IIT Bombay Deal Status: Completed!** Review user performance and manage accounts.
        </p>
      </>
    );
  }

  // --- COACH RENDER LOGIC (NEW) ---
  if (role === 'coach') {
    const unverifiedChildren = CHILDREN_DATA.filter(c => !c.verified);

    return (
      <>
        <h1 className="welcome">👩‍🏫 Welcome, Ivy Coach!</h1>
        <p className="age">Role: {role.toUpperCase()}</p>

        <h2 className="section-title">Children Overview</h2>
        {CHILDREN_DATA.map((child) => (
          <div className="course-card" key={child.id}>
            <h3>👦 {child.name} (Age: {child.age})</h3>

            {child.verified ? (
              <p style={{ color: '#10A37F', fontWeight: 'bold' }}>✅ Account Verified</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ color: '#FF7F50', fontWeight: 'bold' }}>⚠️ Needs Account Verification</p>
                <a
                  href="https://www.ivyschool.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="join-btn"
                  style={{ padding: '8px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                >
                  Verify Now →
                </a>
              </div>
            )}

            <p style={{ marginTop: '10px' }}>
              Current Course: **{child.courses[0].title}** ({child.courses[0].progress}% complete)
            </p>
          </div>
        ))}

        {unverifiedChildren.length > 0 && (
          <p className="quote" style={{ marginTop: '30px' }}>
            **Action Required:** {unverifiedChildren.length} student(s) require verification.
          </p>
        )}
      </>
    );
  }


  // --- PARENT RENDER LOGIC (Unchanged) ---
  if (role === 'parent') {
    return (
      <>
        <h1 className="welcome">Welcome, Ivy Parent 👋</h1>
        <p className="age">Role: {role.toUpperCase()}</p>

        {/* --- CHILDREN STATUS --- */}
        <h2 className="section-title">Your Children's Status</h2>
        {CHILDREN_DATA.map((child) => (
          <div className="course-card" key={child.id}>
            <h3>👦 {child.name} (Age: {child.age})</h3>

            <div style={{ marginTop: '10px' }}>
              <p>Current Courses:</p>
              <ul>
                {child.courses.map((c, i) => (
                  <li key={i} style={{ fontSize: '14px', marginBottom: '5px' }}>
                    **{c.title}**: {c.progress}% Progress
                    <a
                      href={c.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ marginLeft: '10px', color: '#10A37F' }}
                    >
                      (Join Live)
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <p className="quote" style={{ marginTop: '30px' }}>
          Check "My Courses" for all class recordings.
        </p>
      </>
    );
  }

  // --- STUDENT/DEFAULT RENDER LOGIC (Unchanged) ---
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
          href="https://www.youtube.com/playlist?list=PL_PLACEHOLDER_FOR_RECORDINGS"
          target="_blank"
          rel="noreferrer"
          className="git"
        >
          Open Class Recordings →
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
// MY COURSES PAGE (Unchanged)
// ----------------------------------------------------------
function MyCoursesPage({ role }) {
  const [courses] = useState(() => {
    return JSON.parse(localStorage.getItem("ivyschool_progress") || "[]");
  });

  // --- PARENT RENDER LOGIC ---
  if (role === 'parent') {
    // Collect all unique course titles from all children
    const allCourses = CHILDREN_DATA.flatMap(child =>
      child.courses.map(c => ({
        childName: child.name,
        ...c
      }))
    );

    return (
      <>
        <h1 className="welcome">📘 All Children's Courses & Recordings</h1>

        <h2 className="section-title">Recorded Classes Access</h2>
        <div className="course-card">
          <p>Access all recorded sessions for your children here.</p>
          {/* This is the placeholder for the recording portal */}
          <a
            href="https://www.youtube.com/playlist?list=PL_ALL_CHILDREN_RECORDINGS_PLACEHOLDER"
            target="_blank"
            rel="noreferrer"
            className="join-btn"
            style={{ marginTop: '10px' }}
          >
            Open All Recordings Portal 🎥
          </a>
        </div>

        <h2 className="section-title">Current Course Progress</h2>
        {allCourses.map((c, i) => (
          <div className="course-card" key={i}>
            <h3>{c.title} (Child: {c.childName})</h3>
            <p>Progress: **{c.progress}%**</p>
            <p style={{ fontSize: '12px', opacity: 0.7 }}>
              Live Class Link: <a href={c.link} target="_blank" rel="noreferrer">{c.link}</a>
            </p>
          </div>
        ))}
      </>
    );
  }

  // --- ADMIN/COACH RENDER LOGIC (No dedicated Admin/Coach Courses page yet) ---
  if (role === 'admin' || role === 'coach') {
    return (
      <div className="welcome">
        <h1>📘 {role.toUpperCase()}: Course Management</h1>
        <p>Use the Dashboard for student oversight and the Messages tab for communication.</p>
      </div>
    );
  }

  // --- STUDENT/DEFAULT RENDER LOGIC ---
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
// MESSAGES PAGE (Unchanged)
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
    // Updates both localStorage and the local state, triggering a re-render
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
      ? visibleMessages
      : visibleMessages.filter(
        (m) => m.from === filter || m.to === filter
      );


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
// YOGA PAGE (Unchanged)
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
// SETTINGS PAGE (Unchanged)
// ----------------------------------------------------------
function SettingsPage({ dark, setDark, pfp, setPfp }) {
  function handlePfp(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      localStorage.setItem("ivyschool_pfp", result);
      setPfp(result); // State is updated here for instant render

      // Manually dispatch the storage event to notify other components/tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'ivyschool_pfp',
        newValue: result,
        oldValue: pfp
      }));
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