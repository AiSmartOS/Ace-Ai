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


/* ==========================================
   CHAT STORAGE
========================================== */

let chats =
  JSON.parse(
    localStorage.getItem(
      "aceAiChats"
    ) || "[]"
  );

let currentChatId = null;


/* ==========================================
   SAVE CHATS
========================================== */

function saveChats() {

  localStorage.setItem(
    "aceAiChats",
    JSON.stringify(chats)
  );

}


/* ==========================================
   CREATE CHAT
========================================== */

function createChat() {

  const chat = {

    id:
      Date.now().toString(),

    title:
      "New chat",

    messages:
      []

  };


  chats.unshift(chat);

  currentChatId =
    chat.id;


  saveChats();

  renderHistory();

  renderMessages();

}


/* ==========================================
   GET CURRENT CHAT
========================================== */

function getCurrentChat() {

  return chats.find(
    chat =>
      chat.id ===
      currentChatId
  );

}


/* ==========================================
   RENDER HISTORY
========================================== */

function renderHistory() {

  chatHistory.innerHTML = "";


  chats.forEach(
    chat => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "history-item";


      if (
        chat.id ===
        currentChatId
      ) {

        button.classList.add(
          "active"
        );

      }


      button.textContent =
        chat.title ||
        "New chat";


      button.title =
        chat.title ||
        "New chat";


      button.onclick =
        () => {

          currentChatId =
            chat.id;

          renderHistory();

          renderMessages();

          closeMobileSidebar();

        };


      chatHistory.appendChild(
        button
      );

    }
  );

}


/* ==========================================
   RENDER MESSAGES
========================================== */

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


  chat.messages.forEach(
    message => {

      addMessageToDOM(
        message.role,
        message.content
      );

    }
  );


  scrollToBottom();

}


/* ==========================================
   ADD MESSAGE TO DOM
========================================== */

function addMessageToDOM(
  role,
  content
) {

  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.className =
    `message ${role}`;


  const avatar =
    document.createElement(
      "div"
    );


  avatar.className =
    "avatar";


  avatar.textContent =
    role === "user"
      ? "Y"
      : "A";


  const body =
    document.createElement(
      "div"
    );


  body.className =
    "message-content";


  const roleLabel =
    document.createElement(
      "div"
    );


  roleLabel.className =
    "message-role";


  roleLabel.textContent =
    role === "user"
      ? "You"
      : "Ace-Ai";


  const text =
    document.createElement(
      "div"
    );


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


/* ==========================================
   ADD MESSAGE
========================================== */

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

    role:
      role,

    content:
      content

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


/* ==========================================
   SCROLL TO BOTTOM
========================================== */

function scrollToBottom() {

  requestAnimationFrame(
    () => {

      chatArea.scrollTop =
        chatArea.scrollHeight;

    }
  );

}


/* ==========================================
   REAL ACE-AI BACKEND
========================================== */

async function getAIResponse(
  text
) {

  try {

    const response =
      await fetch(
        "/api/chat",
        {
          method:
            "POST",

          headers:
            {
              "Content-Type":
                "application/json"
            },

          body:
            JSON.stringify({
              message:
                text
            })
        }
      );


    let data;

    try {

      data =
        await response.json();

    } catch (jsonError) {

      throw new Error(
        "The Ace-Ai backend returned an invalid response."
      );

    }


    if (!response.ok) {

      throw new Error(
        data?.error ||
        "Ace-Ai backend request failed."
      );

    }


    if (
      !data.reply
    ) {

      throw new Error(
        "Ace-Ai returned an empty response."
      );

    }


    return data.reply;

  } catch (error) {

    console.error(
      "Ace-Ai API Error:",
      error
    );


    return `
Sorry, I couldn't connect to the Ace-Ai AI backend right now.

Please try again in a moment.

Error: ${error.message}
`.trim();

  }

}


/* ==========================================
   SEND MESSAGE
========================================== */

async function sendMessage() {

  const text =
    input.value.trim();


  if (!text)
    return;


  if (!currentChatId) {

    createChat();

  }


  input.value = "";

  autoResize();

  sendBtn.disabled =
    true;


  addMessage(
    "user",
    text
  );


  /*
     Ask the real Ace-Ai backend
  */

  const response =
    await getAIResponse(
      text
    );


  addMessage(
    "assistant",
    response
  );


  sendBtn.disabled =
    false;


  input.focus();

}


/* ==========================================
   TEXTAREA RESIZE
========================================== */

function autoResize() {

  input.style.height =
    "auto";


  input.style.height =
    Math.min(
      input.scrollHeight,
      180
    ) + "px";

}


/* ==========================================
   MOBILE SIDEBAR
========================================== */

function closeMobileSidebar() {

  sidebar.classList.remove(
    "open"
  );

  overlay.classList.remove(
    "show"
  );

}


openSidebar.onclick =
  () => {

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


/* ==========================================
   NEW CHAT
========================================== */

newChat.onclick =
  () => {

    createChat();

    closeMobileSidebar();

    input.focus();

  };


/* ==========================================
   CLEAR CHATS
========================================== */

clearChats.onclick =
  () => {

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


/* ==========================================
   SETTINGS
========================================== */

settingsBtn.onclick =
  () => {

    settingsModal.classList.remove(
      "hidden"
    );

    closeMobileSidebar();

  };


closeSettings.onclick =
  () => {

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


/* ==========================================
   DARK MODE
========================================== */

themeToggle.onchange =
  () => {

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


/* ==========================================
   SUGGESTION BUTTONS
========================================== */

document
  .querySelectorAll(
    ".suggestion"
  )
  .forEach(
    button => {

      button.onclick =
        () => {

          input.value =
            button.dataset.prompt;

          autoResize();

          input.focus();

        };

    }
  );


/* ==========================================
   FORM SUBMIT
========================================== */

composer.onsubmit =
  event => {

    event.preventDefault();

    sendMessage();

  };


/* ==========================================
   INPUT
========================================== */

input.oninput =
  () => {

    autoResize();

    sendBtn.disabled =
      !input.value.trim();

  };


/* ==========================================
   ENTER TO SEND

   ENTER = SEND
   SHIFT + ENTER = NEW LINE
========================================== */

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


/* ==========================================
   LOAD DARK MODE
========================================== */

const savedDarkMode =
  localStorage.getItem(
    "aceAiDarkMode"
  );


if (
  savedDarkMode === "0"
) {

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


/* ==========================================
   LOAD CHATS
========================================== */

if (chats.length) {

  currentChatId =
    chats[0].id;

}


renderHistory();

renderMessages();

autoResize();

sendBtn.disabled =
  !input.value.trim();
