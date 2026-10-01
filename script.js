function register() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    if (!name || !email || !password) {
        alert("Please fill all fields.");
        return;
    }

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    alert("Account created successfully!");

    showLogin();

    document.getElementById("email").value = email;
    document.getElementById("password").value = "";
}


function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");

    if (!savedEmail || !savedPassword) {
        alert("Please register first.");
        return;
    }

    if (
        email.toLowerCase() === savedEmail.toLowerCase() &&
        password === savedPassword
    ) {
        sessionStorage.setItem("loggedIn", "true");
        openApp();
    } else {
        alert("Invalid email or password.");
    }
}


function openApp() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("registerPage").classList.add("hidden");
    document.getElementById("appPage").classList.remove("hidden");

    const name = localStorage.getItem("userName") || "User";
    const email = localStorage.getItem("userEmail") || "";

    document.getElementById("userName").textContent = name;

    if (document.getElementById("profileName")) {
        document.getElementById("profileName").textContent = name;
    }

    if (document.getElementById("profileEmail")) {
        document.getElementById("profileEmail").textContent = email;
    }

    loadHistory();
}


function showLogin() {
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("registerPage").classList.add("hidden");
    document.getElementById("appPage").classList.add("hidden");
}


function showRegister() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("registerPage").classList.remove("hidden");
    document.getElementById("appPage").classList.add("hidden");
}


function logout() {
    sessionStorage.removeItem("loggedIn");
    showLogin();
}


function showSection(sectionId, button) {

    document.querySelectorAll(".content-section").forEach(section => {
        section.classList.add("hidden");
    });

    const selected = document.getElementById(sectionId);

    if (selected) {
        selected.classList.remove("hidden");
    }

    document.querySelectorAll(".menu-item").forEach(item => {
        item.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    const titles = {
        dashboardSection: "Dashboard",
        generatorSection: "AI Generator",
        historySection: "History",
        favoritesSection: "Favorites",
        seoSection: "SEO Keywords",
        marketingSection: "Marketing",
        profileSection: "Profile"
    };

    const pageTitle = document.getElementById("pageTitle");

    if (pageTitle) {
        pageTitle.textContent = titles[sectionId] || "Dashboard";
    }

    if (sectionId === "historySection") {
        loadHistory();
    }

    if (sectionId === "favoritesSection") {
        loadFavorites();
    }
}


function generateDescription() {

    const product =
        document.getElementById("productName").value.trim();

    const details =
        document.getElementById("productDetails").value.trim();

    const audience =
        document.getElementById("audience").value.trim();

    const tone =
        document.getElementById("tone").value;

    const language =
        document.getElementById("language").value;

    if (!product || !details) {
        alert("Please enter Product Name and Product Details.");
        return;
    }

    let description = "";

    if (language === "English") {

        description =
            `${product} is a ${tone.toLowerCase()} product designed for ` +
            `${audience || "modern users"}. It offers ${details}. ` +
            `With its useful features, reliable performance and attractive design, ` +
            `${product} is a practical choice for everyday use.`;

    } else if (language === "Hindi") {

        description =
            `${product} एक ${tone.toLowerCase()} उत्पाद है जो ` +
            `${audience || "आधुनिक उपयोगकर्ताओं"} के लिए बनाया गया है। ` +
            `इसमें ${details} जैसी उपयोगी सुविधाएँ हैं। ` +
            `${product} रोजमर्रा के उपयोग के लिए एक अच्छा विकल्प है।`;

    } else {

        description =
            `${product} हे ${audience || "आधुनिक वापरकर्त्यांसाठी"} तयार केलेले ` +
            `${tone.toLowerCase()} उत्पादन आहे. यामध्ये ${details} ` +
            `यांसारखी उपयुक्त वैशिष्ट्ये आहेत. ${product} हे दैनंदिन ` +
            `वापरासाठी उपयुक्त उत्पादन आहे.`;
    }

    document.getElementById("description").textContent = description;

    document.getElementById("result").classList.remove("hidden");

    saveHistory(product, description);
}


function saveHistory(product, description) {

    let history =
        JSON.parse(localStorage.getItem("descriptionHistory") || "[]");

    history.unshift({
        product: product,
        description: description,
        date: new Date().toLocaleString()
    });

    history = history.slice(0, 20);

    localStorage.setItem(
        "descriptionHistory",
        JSON.stringify(history)
    );
}


function loadHistory() {

    const list = document.getElementById("historyList");

    if (!list) return;

    const history =
        JSON.parse(localStorage.getItem("descriptionHistory") || "[]");

    if (history.length === 0) {

        list.innerHTML = `
            <div class="empty-history">
                <div>📄</div>
                <h3>No History Yet</h3>
                <p>Generated descriptions will appear here.</p>
            </div>
        `;

        return;
    }

    list.innerHTML = "";

    history.forEach(item => {

        const card = document.createElement("div");

        card.className = "info-card";

        card.innerHTML = `
            <h3>${item.product}</h3>
            <p>${item.description}</p>
            <small>${item.date}</small>
        `;

        list.appendChild(card);
    });
}


function copyDescription() {

    const text =
        document.getElementById("description").textContent;

    navigator.clipboard.writeText(text);

    alert("Description copied!");
}


function downloadDescription() {

    const product =
        document.getElementById("productName").value || "product";

    const text =
        document.getElementById("description").textContent;

    const blob =
        new Blob([text], { type: "text/plain" });

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        product.replace(/\s+/g, "_") +
        "_description.txt";

    link.click();

    URL.revokeObjectURL(url);
}


function saveFavorite() {

    const product =
        document.getElementById("productName").value.trim();

    const description =
        document.getElementById("description").textContent;

    if (!product || !description) {
        return;
    }

    let favorites =
        JSON.parse(localStorage.getItem("favorites") || "[]");

    favorites.unshift({
        product: product,
        description: description,
        date: new Date().toLocaleString()
    });

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    alert("Added to Favorites ❤️");

    loadFavorites();
}


function loadFavorites() {

    const list =
        document.getElementById("favoritesList");

    if (!list) return;

    const favorites =
        JSON.parse(localStorage.getItem("favorites") || "[]");

    if (favorites.length === 0) {

        list.innerHTML = `
            <div class="empty-history">
                <div>❤️</div>
                <h3>No Favorites Yet</h3>
                <p>Save descriptions to see them here.</p>
            </div>
        `;

        return;
    }

    list.innerHTML = "";

    favorites.forEach(item => {

        const card =
            document.createElement("div");

        card.className = "info-card";

        card.innerHTML = `
            <h3>❤️ ${item.product}</h3>
            <p>${item.description}</p>
            <small>${item.date}</small>
        `;

        list.appendChild(card);
    });
}


function generateSEO() {

    const product =
        document.getElementById("seoProduct").value.trim();

    const category =
        document.getElementById("seoCategory").value.trim();

    if (!product || !category) {
        alert("Please enter Product Name and Category.");
        return;
    }

    const keywords = [
        product,
        category,
        `${product} ${category}`,
        `best ${product}`,
        `buy ${product}`,
        `${product} online`,
        `${product} price`,
        `${product} offers`,
        `${product} for sale`,
        `latest ${product}`
    ];

    document.getElementById("seoText").textContent =
        keywords.join(", ");

    document.getElementById("seoResult").classList.remove("hidden");
}


function generateMarketing() {

    const product =
        document.getElementById("marketingProduct").value.trim();

    const feature =
        document.getElementById("marketingFeature").value.trim();

    if (!product || !feature) {
        alert("Please enter Product Name and Main Feature.");
        return;
    }

    const caption =
        `✨ Discover the ${product}! ` +
        `Experience ${feature} and make every moment better. ` +
        `Upgrade your everyday experience with ${product}. ` +
        `Shop now and enjoy quality, convenience and style! 🛍️`;

    document.getElementById("marketingText").textContent =
        caption;

    document.getElementById("marketingResult")
        .classList.remove("hidden");
}


function copyMarketing() {

    const text =
        document.getElementById("marketingText").textContent;

    navigator.clipboard.writeText(text);

    alert("Marketing caption copied!");
}


function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    const isDark =
        document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "darkMode",
        isDark ? "true" : "false"
    );
}


window.addEventListener("DOMContentLoaded", function () {

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    if (sessionStorage.getItem("loggedIn") === "true") {
        openApp();
    } else {
        showLogin();
    }

});
