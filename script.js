const sidebar =
  document.getElementById("sidebar");

const overlay =
  document.getElementById("overlay");

const openSidebar =
  document.getElementById("openSidebar");

const closeSidebar =
  document.getElementById("closeSidebar");

const newChat =
  document.getElementById("newChat");

const clearChats =
  document.getElementById("clearChats");

const settingsBtn =
  document.getElementById("settingsBtn");

const settingsModal =
  document.getElementById("settingsModal");

const closeSettings =
  document.getElementById("closeSettings");

const themeToggle =
  document.getElementById("themeToggle");

const composer =
  document.getElementById("composer");

const input =
  document.getElementById("messageInput");

const sendBtn =
  document.getElementById("sendBtn");

const messages =
  document.getElementById("messages");

const welcome =
  document.getElementById("welcome");

const chatArea =
  document.getElementById("chatArea");

const chatHistory =
  document.getElementById("chatHistory");


/*
  CHAT STORAGE
*/

let chats =
  JSON.parse(
    localStorage.getItem("aceAiChats") || "[]"
  );

let currentChatId = null;


/*
  SAVE CHATS
*/

function saveChats() {

  localStorage.setItem(
    "aceAiChats",
    JSON.stringify(chats)
  );

}


/*
  CREATE NEW CHAT
*/

function createChat() {

  const chat = {

    id: Date.now().toString(),

    title: "New chat",

    messages: []

  };


  chats.unshift(chat);

  currentChatId =
    chat.id;


  saveChats();

  renderHistory();

  renderMessages();

}


/*
  CURRENT CHAT
*/

function getCurrentChat() {

  return chats.find(
    chat =>
      chat.id === currentChatId
  );

}


/*
  CHAT HISTORY
*/

function renderHistory() {

  chatHistory.innerHTML = "";


  chats.forEach(chat => {

    const button =
      document.createElement("button");


    button.className =
      "history-item";


    if (
      chat.id === currentChatId
    ) {

      button.classList.add("active");

    }


    button.textContent =
      chat.title || "New chat";


    button.title =
      chat.title || "New chat";


    button.onclick = () => {

      currentChatId =
        chat.id;

      renderHistory();

      renderMessages();

      closeMobileSidebar();

    };


    chatHistory.appendChild(button);

  });

}


/*
  RENDER MESSAGES
*/

function renderMessages() {

  messages.innerHTML = "";


  const chat =
    getCurrentChat();


  if (
    !chat ||
    chat.messages.length === 0
  ) {

    welcome.style.display =
      "flex";

    return;

  }


  welcome.style.display =
    "none";


  chat.messages.forEach(message => {

    addMessageToDOM(
      message.role,
      message.content
    );

  });


  scrollToBottom();

}


/*
  ADD MESSAGE TO UI
*/

function addMessageToDOM(
  role,
  content
) {

  const wrapper =
    document.createElement("div");


  wrapper.className =
    `message ${role}`;


  const avatar =
    document.createElement("div");


  avatar.className =
    "avatar";


  avatar.textContent =
    role === "user"
      ? "Y"
      : "A";


  const body =
    document.createElement("div");


  body.className =
    "message-content";


  const roleLabel =
    document.createElement("div");


  roleLabel.className =
    "message-role";


  roleLabel.textContent =
    role === "user"
      ? "You"
      : "Ace-Ai";


  const text =
    document.createElement("div");


  text.textContent =
    content;


  body.append(
    roleLabel,
    text
  );


  wrapper.append(
    avatar,
    body
  );


  messages.appendChild(
    wrapper
  );

}


/*
  ADD MESSAGE
*/

function addMessage(
  role,
  content
) {

  if (!currentChatId) {

    createChat();

  }


  const chat =
    getCurrentChat();


  chat.messages.push({

    role: role,

    content: content

  });


  if (
    role === "user" &&
    chat.title === "New chat"
  ) {

    chat.title =
      content
        .trim()
        .slice(0, 36);

  }


  saveChats();

  addMessageToDOM(
    role,
    content
  );

  renderHistory();

  scrollToBottom();

}


/*
  SCROLL
*/

function scrollToBottom() {

  requestAnimationFrame(() => {

    chatArea.scrollTop =
      chatArea.scrollHeight;

  });

}


/*
  DEMO AI RESPONSE
  --------------------------------
  Replace this function later with
  your real Ace-Ai API/backend.
*/

function getDemoResponse(text) {

  const lower =
    text.toLowerCase();


  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey")
  ) {

    return `
Hey! 👋

I'm Ace-Ai, powered by AiSmartOS.

How can I help you today?
`.trim();

  }


  if (
    lower.includes("who are you") ||
    lower.includes("what are you")
  ) {

    return `
I'm Ace-Ai — an AI assistant powered by AiSmartOS.

This GitHub version currently uses a demo response engine. A real AI backend can be connected later.
`.trim();

  }


  if (
    lower.includes("code") ||
    lower.includes("html") ||
    lower.includes("javascript")
  ) {

    return `
Absolutely! 💻

Tell me what you want to build and I can help you plan the structure, write the code, and explain how it works.
`.trim();

  }


  if (
    lower.includes("thank")
  ) {

    return `
You're welcome! ✦
`.trim();

  }


  return `
That's a great question.

The Ace-Ai interface is ready, but this GitHub version is currently running a local demo response engine.

Connect your real Ace-Ai backend to enable live AI responses.
`.trim();

}


/*
  SEND MESSAGE
*/

async function sendMessage() {

  const text =
    input.value.trim();


  if (!text) return;


  if (!currentChatId) {

    createChat();

  }


  input.value = "";

  autoResize();

  sendBtn.disabled = true;


  addMessage(
    "user",
    text
  );


  /*
    DEMO DELAY
  */

  await new Promise(
    resolve =>
      setTimeout(resolve, 650)
  );


  const response =
    getDemoResponse(text);


  addMessage(
    "assistant",
    response
  );


  sendBtn.disabled = false;

  input.focus();

}


/*
  TEXTAREA AUTO RESIZE
*/

function autoResize() {

  input.style.height =
    "auto";


  input.style.height =
    Math.min(
      input.scrollHeight,
      180
    ) + "px";

}


/*
  MOBILE SIDEBAR
*/

function closeMobileSidebar() {

  sidebar.classList.remove(
    "open"
  );

  overlay.classList.remove(
    "show"
  );

}


openSidebar.onclick = () => {

  sidebar.classList.add(
    "open"
  );

  overlay.classList.add(
    "show"
  );

};


closeSidebar.onclick =
  closeMobileSidebar;


overlay.onclick =
  closeMobileSidebar;


/*
  NEW CHAT
*/

newChat.onclick = () => {

  createChat();

  closeMobileSidebar();

  input.focus();

};


/*
  CLEAR CHATS
*/

clearChats.onclick = () => {

  if (!chats.length)
    return;


  const confirmed =
    confirm(
      "Clear all Ace-Ai chats?"
    );


  if (!confirmed)
    return;


  chats = [];

  currentChatId =
    null;


  saveChats();

  renderHistory();

  renderMessages();

};


/*
  SETTINGS
*/

settingsBtn.onclick = () => {

  settingsModal.classList.remove(
    "hidden"
  );

  closeMobileSidebar();

};


closeSettings.onclick = () => {

  settingsModal.classList.add(
    "hidden"
  );

};


settingsModal.onclick =
  event => {

    if (
      event.target ===
      settingsModal
    ) {

      settingsModal.classList.add(
        "hidden"
      );

    }

  };


/*
  DARK MODE
*/

themeToggle.onchange = () => {

  document.body.classList.toggle(
    "dark",
    themeToggle.checked
  );


  localStorage.setItem(
    "aceAiDarkMode",
    themeToggle.checked
      ? "1"
      : "0"
  );

};


/*
  SUGGESTIONS
*/

document
  .querySelectorAll(".suggestion")
  .forEach(button => {

    button.onclick = () => {

      input.value =
        button.dataset.prompt;

      autoResize();

      input.focus();

    };

  });


/*
  FORM
*/

composer.onsubmit =
  event => {

    event.preventDefault();

    sendMessage();

  };


/*
  INPUT
*/

input.oninput = () => {

  autoResize();

  sendBtn.disabled =
    !input.value.trim();

};


/*
  ENTER TO SEND

  Shift + Enter
  = New line
*/

input.onkeydown =
  event => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      if (
        input.value.trim()
      ) {

        sendMessage();

      }

    }

  };


/*
  LOAD THEME
*/

const savedDarkMode =
  localStorage.getItem(
    "aceAiDarkMode"
  );


if (savedDarkMode === "0") {

  themeToggle.checked =
    false;

  document.body.classList.remove(
    "dark"
  );

} else {

  themeToggle.checked =
    true;

  document.body.classList.add(
    "dark"
  );

}


/*
  LOAD EXISTING CHATS
*/

if (chats.length) {

  currentChatId =
    chats[0].id;

}


renderHistory();

renderMessages();

autoResize();

sendBtn.disabled = true;
