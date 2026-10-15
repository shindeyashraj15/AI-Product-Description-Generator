import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";

/* =========================
   LOGIN
========================= */

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    localStorage.setItem("loggedIn", "true");
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="brand">✦ ProductAI</div>

        <div className="auth-content">
          <span className="small-badge">AI POWERED</span>

          <h1>
            Create descriptions
            <br />
            that <span>sell.</span>
          </h1>

          <p>
            Generate professional, engaging and
            SEO-friendly product descriptions using AI.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-icon">✦</div>

          <h2>Welcome Back</h2>

          <p className="auth-subtitle">
            Login to your ProductAI account
          </p>

          <form onSubmit={login}>
            <label>Email Address</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="login-btn" type="submit">
              Login →
            </button>
          </form>

          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/signup">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================
   SIGNUP
========================= */

function Signup() {
  const navigate = useNavigate();

  const signup = (e) => {
    e.preventDefault();

    const password = e.target.password.value;
    const confirmPassword =
      e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Account created successfully!");
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="brand">✦ ProductAI</div>

        <div className="auth-content">
          <span className="small-badge">
            JOIN PRODUCTAI
          </span>

          <h1>
            Start creating
            <br />
            <span>better content.</span>
          </h1>

          <p>
            Create professional product descriptions
            in seconds using AI.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-icon">✦</div>

          <h2>Create Account</h2>

          <p className="auth-subtitle">
            Get started with ProductAI
          </p>

          <form onSubmit={signup}>
            <label>Full Name</label>

            <input
              name="name"
              type="text"
              placeholder="Your name"
              required
            />

            <label>Email Address</label>

            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />

            <label>Password</label>

            <input
              name="password"
              type="password"
              placeholder="Create password"
              required
            />

            <label>Confirm Password</label>

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              required
            />

            <button className="login-btn" type="submit">
              Create Account →
            </button>
          </form>

          <p className="signup-text">
            Already have an account?{" "}
            <Link to="/">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard() {
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState("English");

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  const [darkMode, setDarkMode] = useState(false);

  /* =========================
     GENERATE DESCRIPTION
  ========================= */

  const generateDescription = async () => {
    if (!productName || !category || !features) {
      alert(
        "Please fill Product Name, Category and Features"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/products/generate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            productName,
            category,
            features,
            tone,
            language,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(
          data.message ||
            "Generation failed"
        );

        setLoading(false);
        return;
      }

      setDescription(data.description);

      const newItem = {
        id: Date.now(),
        productName,
        category,
        features,
        tone,
        language,
        description: data.description,
        date: new Date().toLocaleString(),
      };

      const updatedHistory = [
        newItem,
        ...history,
      ].slice(0, 20);

      setHistory(updatedHistory);

      localStorage.setItem(
        "history",
        JSON.stringify(updatedHistory)
      );
    } catch {
      alert(
        "Backend connection failed. Start backend first."
      );
    }

    setLoading(false);
  };

  /* =========================
     FAVORITE
  ========================= */

  const addFavorite = () => {
    if (!description) {
      return;
    }

    const item = {
      id: Date.now(),
      productName,
      category,
      description,
      date: new Date().toLocaleString(),
    };

    const updatedFavorites = [
      item,
      ...favorites,
    ];

    setFavorites(updatedFavorites);

    localStorage.setItem(
      "favorites",
      JSON.stringify(updatedFavorites)
    );

    alert("Added to favorites ⭐");
  };

  /* =========================
     DOWNLOAD
  ========================= */

  const downloadDescription = () => {
    if (!description) {
      return;
    }

    const blob = new Blob(
      [description],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      (productName || "product") +
      "-description.txt";

    link.click();

    URL.revokeObjectURL(url);
  };

  /* =========================
     LOAD HISTORY
  ========================= */

  const loadHistory = (item) => {
    setProductName(
      item.productName
    );

    setCategory(
      item.category
    );

    setFeatures(
      item.features || ""
    );

    setTone(
      item.tone || "Professional"
    );

    setLanguage(
      item.language || "English"
    );

    setDescription(
      item.description
    );

    window.scrollTo({
      top: 300,
      behavior: "smooth",
    });
  };

  /* =========================
     CLEAR HISTORY
  ========================= */

  const clearHistory = () => {
    setHistory([]);

    localStorage.removeItem(
      "history"
    );
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  const words = description
    ? description.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const characters = description.length;

  return (
    <div className={darkMode ? "dashboard dark" : "dashboard"}>

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-symbol">✦</div>

          <div>
            <strong>ProductAI</strong>
            <small>AI Content Studio</small>
          </div>
        </div>

        <div className="menu-title">
          MAIN MENU
        </div>

        <nav className="side-menu">

          <a href="#top" className="active">
            <span>▣</span>
            Dashboard
          </a>

          <a href="#generator">
            <span>✦</span>
            AI Generator
          </a>

          <a href="#history">
            <span>◷</span>
            History
          </a>

          <a href="#favorites">
            <span>★</span>
            Favorites
          </a>

        </nav>

        <div className="menu-title settings-title">
          SETTINGS
        </div>

        <button
          className="side-menu-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          <span>
            {darkMode ? "☀" : "☾"}
          </span>

          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <div className="sidebar-bottom">

          <div className="user-box">

            <div className="avatar">
              U
            </div>

            <div>
              <strong>User</strong>
              <small>AI Creator</small>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            ⇥ Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="main-content" id="top">

        {/* TOP BAR */}

        <header className="topbar">

          <div>
            <h2>Dashboard</h2>

            <p>
              AI Product Description Generator
            </p>
          </div>

          <div className="top-actions">

            <span className="ai-status">
              ● AI Online
            </span>

            <button
              className="theme-button"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <div className="profile">

              <div className="profile-avatar">
                U
              </div>

              <div>
                <strong>User</strong>
                <small>Free Plan</small>
              </div>

            </div>

          </div>

        </header>

        {/* WELCOME */}

        <section className="welcome-section">

          <div>

            <span className="small-badge">
              AI PRODUCT WRITER
            </span>

            <h1>
              Create descriptions
              <span> that sell.</span>
            </h1>

            <p>
              Turn your product information into
              professional marketing content with AI.
            </p>

          </div>

          <div className="welcome-icon">
            ✨
          </div>

        </section>

        {/* STATS */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon purple">
              ✦
            </div>

            <div>
              <small>Total Generations</small>
              <strong>{history.length}</strong>
              <span>AI descriptions created</span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon yellow">
              ★
            </div>

            <div>
              <small>Favorites</small>
              <strong>{favorites.length}</strong>
              <span>Saved descriptions</span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon blue">
              Aa
            </div>

            <div>
              <small>Words Generated</small>
              <strong>{words}</strong>
              <span>Current description</span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <small>AI Status</small>
              <strong>Online</strong>
              <span>Ready to generate</span>
            </div>

          </div>

        </section>

        {/* GENERATOR */}

        <section
          className="generator-layout"
          id="generator"
        >

          {/* PRODUCT INFORMATION */}

          {/* PRODUCT INFORMATION */}

          <div className="dashboard-card">

            <div className="card-heading">

              <div className="heading-icon">
                📦
              </div>

              <div>
                <h2>Product Information</h2>

                <p>
                  Enter your product details
                </p>
              </div>

            </div>

            <label>Product Name</label>

            <input
              type="text"
              value={productName}
              onChange={(e) =>
                setProductName(e.target.value)
              }
              placeholder="e.g. Premium Wireless Headphones"
            />

            <label>Category</label>

            <input
              type="text"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              placeholder="e.g. Electronics"
            />

            <label>Product Features</label>

            <textarea
              rows="6"
              value={features}
              onChange={(e) =>
                setFeatures(e.target.value)
              }
              placeholder="Enter product features, benefits and specifications..."
            />

            <div className="two-inputs">

              <div>

                <label>Tone</label>

                <select
                  value={tone}
                  onChange={(e) =>
                    setTone(e.target.value)
                  }
                >
                  <option>Professional</option>
                  <option>Creative</option>
                  <option>Friendly</option>
                  <option>Luxury</option>
                  <option>Persuasive</option>
                  <option>SEO Friendly</option>
                </select>

              </div>

              <div>

                <label>Language</label>

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value)
                  }
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                </select>

              </div>

            </div>

            <button
              className="generate-btn"
              onClick={generateDescription}
              disabled={loading}
            >
              {loading
                ? "⏳ Generating..."
                : "✨ Generate Description"}
            </button>

          </div>

          {/* AI GENERATED DESCRIPTION */}

          <div className="dashboard-card result-card">

            <div className="result-heading">

              <div>

                <h2>
                  ✨ AI Generated Description
                </h2>

                <p>
                  Your AI generated content
                </p>

              </div>

              {description && (
                <span className="generated-badge">
                  Generated
                </span>
              )}

            </div>

            {!description ? (

              <div className="empty-result">

                <div className="empty-icon">
                  ✨
                </div>

                <h3>
                  Ready to create
                </h3>

                <p>
                  Fill in the product information
                  and click Generate Description.
                </p>

              </div>

            ) : (

              <>

                <div className="description-output">
                  {description}
                </div>

                <div className="description-info">

                  <span>
                    {words} words
                  </span>

                  <span>
                    {characters} characters
                  </span>

                  <span>
                    {language}
                  </span>

                </div>

                <div className="result-actions">

                  <button
                    onClick={generateDescription}
                  >
                    🔄 Regenerate
                  </button>

                  <button
                    onClick={addFavorite}
                  >
                    ⭐ Favorite
                  </button>

                  <button
                    onClick={downloadDescription}
                  >
                    📥 Download
                  </button>

                </div>

              </>

            )}

          </div>

        </section>

        {/* HISTORY */}

        <section
          className="content-section"
          id="history"
        >

          <div className="section-header">

            <div>

              <h2>
                🕘 Recent History
              </h2>

              <p>
                Your recently generated descriptions
              </p>

            </div>

            {history.length > 0 && (

              <button
                className="clear-btn"
                onClick={clearHistory}
              >
                Clear All
              </button>

            )}

          </div>

          {history.length === 0 ? (

            <div className="empty-list">
              No generation history yet.
            </div>

          ) : (

            <div className="history-grid">

              {history
                .slice(0, 6)
                .map((item) => (

                  <div
                    className="history-card"
                    key={item.id}
                  >

                    <div className="history-icon">
                      📦
                    </div>

                    <div className="history-info">

                      <h3>
                        {item.productName}
                      </h3>

                      <p>
                        {item.category}
                      </p>

                      <small>
                        {item.date}
                      </small>

                    </div>

                    <button
                      onClick={() =>
                        loadHistory(item)
                      }
                    >
                      View
                    </button>

                  </div>

                ))}

            </div>

          )}

        </section>

        {/* FAVORITES */}

        <section
          className="content-section"
          id="favorites"
        >

          <div className="section-header">

            <div>

              <h2>
                ⭐ Favorites
              </h2>

              <p>
                Your saved descriptions
              </p>

            </div>

          </div>

          {favorites.length === 0 ? (

            <div className="empty-list">
              No favorite descriptions yet.
            </div>

          ) : (

            <div className="favorite-grid">

              {favorites
                .slice(0, 6)
                .map((item) => (

                  <div
                    className="favorite-card"
                    key={item.id}
                  >

                    <h3>
                      ⭐ {item.productName}
                    </h3>

                    <p>
                      {item.description.substring(
                        0,
                        180
                      )}

                      {item.description.length > 180
                        ? "..."
                        : ""}
                    </p>

                    <button
                      onClick={() =>
                        setDescription(
                          item.description
                        )
                      }
                    >
                      Open Description
                    </button>

                  </div>

                ))}

            </div>

          )}

        </section>

        {/* FOOTER */}

        <footer>
          © 2026 ProductAI · AI Product Description Generator
        </footer>

      </main>

    </div>
  );
}

/* APP ROUTING */

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
