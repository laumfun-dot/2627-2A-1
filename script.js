// 帳號資料庫（來自 Excel 活頁簿1.xlsx）
const initialData = [
  {Username: "2A01", Password: "25262a01", Permission: "1-user"},
  {Username: "2A02", Password: "25262a02", Permission: "1-user"},
  {Username: "2A03", Password: "25262a03", Permission: "1-user"},
  {Username: "2A04", Password: "25262a04", Permission: "1-user"},
  {Username: "2A05", Password: "25262a05", Permission: "99-owner"},
  {Username: "2A06", Password: "25262a06", Permission: "1-user"},
  {Username: "2A07", Password: "25262a07", Permission: "1-user"},
  {Username: "2A08", Password: "25262a08", Permission: "1-user"},
  {Username: "2A09", Password: "25262a09", Permission: "1-user"},
  {Username: "2A10", Password: "25262a10", Permission: "1-user"},
  {Username: "2A11", Password: "25262a11", Permission: "1-user"},
  {Username: "2A12", Password: "25262a12", Permission: "1-user"},
  {Username: "2A13", Password: "25262a13", Permission: "1-user"},
  {Username: "2A14", Password: "25262a14", Permission: "1-user"},
  {Username: "2A15", Password: "25262a15", Permission: "1-user"},
  {Username: "2A16", Password: "25262a16", Permission: "1-user"},
  {Username: "2A17", Password: "25262a17", Permission: "70-Monitress"},
  {Username: "2A18", Password: "25262a18", Permission: "1-user"},
  {Username: "2A19", Password: "25262a19", Permission: "1-user"},
  {Username: "2A20", Password: "25262a20", Permission: "1-user"},
  {Username: "2A21", Password: "25262a21", Permission: "1-user"},
  {Username: "2A22", Password: "25262a22", Permission: "1-user"},
  {Username: "2A23", Password: "25262a23", Permission: "1-user"},
  {Username: "2A24", Password: "25262a24", Permission: "68-Vice ChairPerson of Class Union"},
  {Username: "2A25", Password: "25262a25", Permission: "1-user"},
  {Username: "2A26", Password: "25262a26", Permission: "1-user"},
  {Username: "2A27", Password: "25262a27", Permission: "1-user"},
  {Username: "2A28", Password: "25262a28", Permission: "69-ChairPerson of Class Union"},
  {Username: "2A29", Password: "25262a29", Permission: "1-user"},
  {Username: "2A30", Password: "25262a30", Permission: "1-user"},
  {Username: "2A31", Password: "25262a31", Permission: "1-user"},
  {Username: "2A32", Password: "25262a32", Permission: "1-user"},
  {Username: "2A33", Password: "25262a33", Permission: "1-user"},
  {Username: "2A34", Password: "25262a34", Permission: "1-user"},
  {Username: "2A35", Password: "25262a35", Permission: "1-user"},
  {Username: "CKK", Password: "ckk@2a", Permission: "2-Teacher"},
  {Username: "CTK", Password: "ctk@2a", Permission: "2-Teacher"},
  {Username: "JOR", Password: "jor@2a", Permission: "2-Teacher"},
  {Username: "LKK", Password: "lkk@2a", Permission: "2-Teacher"},
  {Username: "LNF", Password: "lnf@2a", Permission: "2-Teacher"},
  {Username: "LOK", Password: "lok@2a", Permission: "2-Teacher"},
  {Username: "LYT", Password: "lyt@2a", Permission: "2-Teacher"},
  {Username: "MKY", Password: "mky@2a", Permission: "2-Teacher"},
  {Username: "NSH", Password: "nsh@2a", Permission: "2-Teacher"},
  {Username: "RAY", Password: "ray@2a", Permission: "2-Teacher"},
  {Username: "SYI", Password: "syi@2a", Permission: "2-Teacher"},
  {Username: "SYW", Password: "syw@2a", Permission: "2-Teacher"},
  {Username: "TKH", Password: "tkh@2a", Permission: "2-Teacher"},
  {Username: "TMY", Password: "tmy@2a", Permission: "2-Teacher"},
  {Username: "TTC", Password: "ttc@2a", Permission: "2-Teacher"},
  {Username: "TTH", Password: "tth@2a", Permission: "2-Teacher"},
  {Username: "WHY", Password: "why@2a", Permission: "2-Teacher"}
];

let currentUser = null;

function getUsers() {
  return JSON.parse(localStorage.getItem('2a_users')) || initialData;
}
function saveUsers(u) { localStorage.setItem('2a_users', JSON.stringify(u)); }

function getSurveys() { return JSON.parse(localStorage.getItem('2a_surveys')) || []; }
function saveSurveys(s) { localStorage.setItem('2a_surveys', JSON.stringify(s)); }

function getECards() { return JSON.parse(localStorage.getItem('2a_ecards')) || []; }
function saveECards(c) { localStorage.setItem('2a_ecards', JSON.stringify(c)); }

// 登入 / Login
function handleLogin() {
  const uInput = document.getElementById('login-username').value.trim();
  const pInput = document.getElementById('login-password').value.trim();
  const users = getUsers();
  const user = users.find(u => u.Username.toLowerCase() === uInput.toLowerCase() && u.Password === pInput);

  if (user) {
    currentUser = user;
    document.getElementById('login-card').classList.add('hidden');
    document.getElementById('main-card').classList.remove('hidden');
    document.getElementById('current-user-display').innerText = user.Username;
    document.getElementById('current-role-display').innerText = user.Permission;

    const isOwner = user.Permission.includes('99-owner');
    document.getElementById('admin-tab-btn').classList.toggle('hidden', !isOwner);
    document.getElementById('owner-create-survey').classList.toggle('hidden', !isOwner);

    populateECardReceivers();
    renderSurveys();
    renderECards();
    if (isOwner) renderAdminTable();
  } else {
    alert("用戶名或密碼不正確！ Invalid Username or Password!");
  }
}

// 登出 / Logout
function handleLogout() {
  currentUser = null;
  document.getElementById('login-card').classList.remove('hidden');
  document.getElementById('main-card').classList.add('hidden');
}

// 切換頁籤 / Switch Tabs
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.remove('hidden');
  event.target.classList.add('active');
}

// --- 📊 問卷調查模組 / Survey Module ---
function createSurvey() {
  const title = document.getElementById('survey-title').value.trim();
  const optionsRaw = document.getElementById('survey-options').value.trim();
  if (!title || !optionsRaw) return alert("請輸入完整問卷資料！ Please complete all survey fields!");

  const options = optionsRaw.split(',').map(o => o.trim()).filter(o => o);
  const surveys = getSurveys();
  surveys.push({ id: Date.now(), title, options, votes: {}, votedUsers: [] });
  saveSurveys(surveys);

  document.getElementById('survey-title').value = '';
  document.getElementById('survey-options').value = '';
  renderSurveys();
}

function voteSurvey(surveyId, optionIndex) {
  let surveys = getSurveys();
  let survey = surveys.find(s => s.id === surveyId);
  if (!survey) return;

  if (survey.votedUsers.includes(currentUser.Username)) {
    return alert("你已經參加過這項投票了！ You have already voted!");
  }

  survey.votes[optionIndex] = (survey.votes[optionIndex] || 0) + 1;
  survey.votedUsers.push(currentUser.Username);
  saveSurveys(surveys);
  renderSurveys();
}

function renderSurveys() {
  const surveys = getSurveys();
  const container = document.getElementById('survey-list');
  container.innerHTML = surveys.length ? '' : '<p style="color:#777;">目前沒有進行中的問卷。 No active surveys available.</p>';

  surveys.forEach(s => {
    const totalVotes = s.votedUsers.length;
    const hasVoted = s.votedUsers.includes(currentUser.Username);

    let optionsHTML = '';
    s.options.forEach((opt, idx) => {
      const count = s.votes[idx] || 0;
      const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
      optionsHTML += `
        <div style="margin: 10px 0;">
          <div style="display:flex; justify-content:space-between;">
            <span>${opt}</span>
            <small>${count} 票 Votes (${percent}%)</small>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width: ${percent}%;"></div></div>
          ${!hasVoted ? `<button onclick="voteSurvey(${s.id}, ${idx})" style="padding:4px; margin-top:4px;">投票 Vote</button>` : ''}
        </div>
      `;
    });

    const card = document.createElement('div');
    card.className = 'card';
    card.style.background = '#fafafa';
    card.innerHTML = `<h4>📌 ${s.title}</h4>${optionsHTML}<small style="color:#666;">總投票人數 Total Votes: ${totalVotes} ${hasVoted ? '(已完成投票 You have voted)' : ''}</small>`;
    container.appendChild(card);
  });
}

// --- 💌 電子心意卡模組 / E-Card Module ---
function populateECardReceivers() {
  const select = document.getElementById('ecard-receiver');
  select.innerHTML = '<option value="">選擇接收對象 Select Receiver...</option>';
  getUsers().forEach(u => {
    if (u.Username !== currentUser.Username) {
      select.innerHTML += `<option value="${u.Username}">${u.Username} (${u.Permission})</option>`;
    }
  });
}

function sendECard() {
  const receiver = document.getElementById('ecard-receiver').value;
  const message = document.getElementById('ecard-message').value.trim();
  if (!receiver || !message) return alert("請選擇接收對象並填寫心意字句！ Please select a receiver and write a message!");

  const cards = getECards();
  cards.push({ id: Date.now(), sender: currentUser.Username, receiver, message, date: new Date().toLocaleDateString() });
  saveECards(cards);

  document.getElementById('ecard-message').value = '';
  alert("心意卡已成功送出！ Card sent successfully!");
  renderECards();
}

function renderECards() {
  const cards = getECards();
  const myCards = cards.filter(c => c.receiver === currentUser.Username);
  const container = document.getElementById('my-ecards-list');
  container.innerHTML = myCards.length ? '' : '<p style="color:#777;">目前尚未收到心意卡。 No received cards yet.</p>';

  myCards.forEach(c => {
    const card = document.createElement('div');
    card.className = 'ecard-item';
    card.innerHTML = `<p><strong>來自 From: ${c.sender}</strong> <small style="float:right; color:#888;">${c.date}</small></p><p style="white-space: pre-line;">${c.message}</p>`;
    container.appendChild(card);
  });
}

// --- 🔑 個人設定模組 / Settings Module ---
function changeSelfPassword() {
  const newPwd = document.getElementById('self-new-password').value.trim();
  if (!newPwd) return alert("請輸入新密碼！ Please enter a new password!");

  let users = getUsers();
  let user = users.find(u => u.Username === currentUser.Username);
  if (user) {
    user.Password = newPwd;
    saveUsers(users);
    alert("密碼修改成功！ Password updated successfully!");
    document.getElementById('self-new-password').value = '';
  }
}

// --- 👑 Owner 管理員模組 / Admin Module ---
function renderAdminTable() {
  const tbody = document.getElementById('user-table-body');
  tbody.innerHTML = '';
  getUsers().forEach((u, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${u.Username}</strong></td>
      <td><input type="text" value="${u.Permission}" id="perm-${index}" style="margin:0; padding:4px;"></td>
      <td>
        <input type="text" placeholder="改密碼 Password" id="pwd-${index}" style="width:110px; margin:0; padding:4px;">
        <button onclick="adminSave(${index})" style="width:auto; padding:4px 8px; margin:0;">儲存 Save</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function adminSave(index) {
  let users = getUsers();
  const newPerm = document.getElementById(`perm-${index}`).value.trim();
  const newPwd = document.getElementById(`pwd-${index}`).value.trim();

  if (newPerm) users[index].Permission = newPerm;
  if (newPwd) users[index].Password = newPwd;

  saveUsers(users);
  alert(`已更新 Updated: ${users[index].Username}`);
  renderAdminTable();
}
