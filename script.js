let projectsData = [];

async function loadProjects() {
  try {
    const response = await fetch("projects.json");
    projectsData = await response.json();

    renderProjects(projectsData);
    updateProjectCount(projectsData);
    initAnimations();
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

function renderProjects(projects) {
  const projectGrid = document.getElementById("projectGrid");
  projectGrid.innerHTML = "";

  projects.forEach(project => {
    const card = document.createElement("div");
    card.className = project.highlight ? "project-card highlight" : "project-card";

    const tags = project.tags.map(tag => `<span>${tag}</span>`).join("");

    card.innerHTML = `
      <div class="project-icon">${project.icon}</div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tags">${tags}</div>
      <div class="links">
        <a href="${project.live}" target="_blank">Live Demo</a>
        <a href="${project.github}" target="_blank">GitHub</a>
      </div>
    `;

    projectGrid.appendChild(card);
  });
}

function updateProjectCount(projects) {
  const projectCount = document.getElementById("projectCount");
  if (projectCount) {
    projectCount.textContent = projects.length;
  }
}

function initAnimations() {
  const cards = document.querySelectorAll(".project-card, .summary-card, .skills-grid div");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.15 }
  );

  cards.forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(28px)";
    card.style.transition = "0.6s ease";
    observer.observe(card);
  });
}

// Chatbot
const chatToggle = document.getElementById("chatToggle");
const chatWindow = document.getElementById("chatWindow");
const closeChat = document.getElementById("closeChat");
const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");
const quickButtons = document.querySelectorAll(".quick-prompts button");

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type === "user" ? "user-message" : "bot-message";
  div.innerText = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping() {
  const typing = document.createElement("div");
  typing.className = "typing";
  typing.id = "typing";
  typing.innerHTML = "<span></span><span></span><span></span>";
  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

function findProjectResponse(query) {
  const q = query.toLowerCase();

  for (const project of projectsData) {
    const titleMatch = project.title.toLowerCase().includes(q);

    const keywordMatch = project.keywords.some(keyword =>
      q.includes(keyword.toLowerCase())
    );

    if (titleMatch || keywordMatch) {
      return project.chatbotAnswer;
    }
  }

  return null;
}

function findResponse(input) {
  const q = input.toLowerCase();

  const projectResponse = findProjectResponse(q);
  if (projectResponse) return projectResponse;

  if (
    q.includes("strongest") ||
    q.includes("best") ||
    q.includes("flagship") ||
    q.includes("impressive")
  ) {
    const flagship = projectsData.find(project =>
      project.title.toLowerCase().includes("maritime")
    );

    return flagship
      ? `The strongest flagship project is ${flagship.title}. ${flagship.chatbotAnswer}`
      : "The strongest systems are the Maritime Surveillance platform and the Landslide Terrain Intelligence platform because they use operational command-center design, GIS intelligence, simulation, and AI prediction.";
  }

  if (
    q.includes("cdrd") ||
    q.includes("cdrrd") ||
    q.includes("internship") ||
    q.includes("fit") ||
    q.includes("defence") ||
    q.includes("defense")
  ) {
    return "This portfolio aligns strongly with CDRD IT & GIS work because it focuses on geospatial monitoring, AI-assisted decision support, environmental intelligence, surveillance analytics, operational dashboards, and Sri Lanka-specific intelligence systems.";
  }

  if (
    q.includes("technology") ||
    q.includes("technologies") ||
    q.includes("tools") ||
    q.includes("stack") ||
    q.includes("skills")
  ) {
    return "Core technologies used across this portfolio include Python, Pandas, Machine Learning, Scikit-learn, Streamlit, Plotly, Folium, PyDeck, GIS analytics, operational dashboard design, GitHub, and Streamlit Cloud deployment.";
  }

  if (
    q.includes("projects") ||
    q.includes("portfolio") ||
    q.includes("systems")
  ) {
    const projectTitles = projectsData.map(project => project.title).join(", ");
    return `Sanjula has built ${projectsData.length} deployed Sri Lanka-focused AI & GIS systems: ${projectTitles}.`;
  }

  if (
    q.includes("unique") ||
    q.includes("special") ||
    q.includes("different")
  ) {
    return "This portfolio is unique because it avoids generic datasets and focuses on Sri Lankan national-scale problems. The projects are AI-powered GIS intelligence systems with operational dashboards, monitoring, simulation, risk prediction, and decision-support workflows.";
  }

  if (
    q.includes("contact") ||
    q.includes("email") ||
    q.includes("hire") ||
    q.includes("connect")
  ) {
    return "You can contact Sanjula through email: sanjulabandara1113@gmail.com, LinkedIn: linkedin.com/in/danushasanjula, or GitHub: github.com/Sanjula2003.";
  }

  if (q.includes("github")) {
    return "GitHub profile: github.com/Sanjula2003. Each deployed project also includes its own GitHub repository linked inside the project cards.";
  }

  if (q.includes("linkedin")) {
    return "LinkedIn profile: linkedin.com/in/danushasanjula";
  }

  return "I can explain Sanjula’s AI & GIS projects, strongest systems, technical skills, CDRD internship alignment, live demos, GitHub links, LinkedIn profile, and contact details.";
}

function sendMessage(text) {
  if (!text.trim()) return;

  addMessage(text, "user");
  showTyping();

  setTimeout(() => {
    removeTyping();
    addMessage(findResponse(text), "bot");
  }, 850);

  chatInput.value = "";
}

chatToggle.addEventListener("click", () => {
  chatWindow.classList.toggle("active");
});

closeChat.addEventListener("click", () => {
  chatWindow.classList.remove("active");
});

sendChat.addEventListener("click", () => {
  sendMessage(chatInput.value);
});

chatInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    sendMessage(chatInput.value);
  }
});

quickButtons.forEach(button => {
  button.addEventListener("click", () => {
    sendMessage(button.dataset.question);
  });
});

loadProjects();