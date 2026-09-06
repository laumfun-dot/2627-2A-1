// ⚠️ Firebase Realtime Database 網址 (已移除結尾斜線以確保連線穩定)
const DB_URL = "https://a-77436-default-rtdb.asia-southeast1.firebasedatabase.app/";

// 來自 活頁簿1.xlsx 的全班 52 位使用者資料預設集
const initialUsers = {
  "2A01": { Password: "26272a01", Permission: "1-user" },
  "2A02": { Password: "26272a02", Permission: "1-user" },
  "2A03": { Password: "26272a03", Permission: "1-user" },
  "2A04": { Password: "26272a04", Permission: "1-user" },
  "2A05": { Password: "26272a05", Permission: "99-owner" },
  "2A06": { Password: "26272a06", Permission: "1-user" },
  "2A07": { Password: "26272a07", Permission: "1-user" },
  "2A08": { Password: "26272a08", Permission: "1-user" },
  "2A09": { Password: "26272a09", Permission: "1-user" },
  "2A10": { Password: "26272a10", Permission: "1-user" },
  "2A11": { Password: "26272a11", Permission: "1-user" },
  "2A12": { Password: "26272a12", Permission: "1-user" },
  "2A13": { Password: "26272a13", Permission: "1-user" },
  "2A14": { Password: "26272a14", Permission: "1-user" },
  "2A15": { Password: "26272a15", Permission: "1-user" },
  "2A16": { Password: "26272a16", Permission: "1-user" },
  "2A17": { Password: "26272a17", Permission: "70-Monitress" },
  "2A18": { Password: "26272a18", Permission: "1-user" },
  "2A19": { Password: "26272a19", Permission: "1-user" },
  "2A20": { Password: "26272a20", Permission: "1-user" },
  "2A21": { Password: "26272a21", Permission: "1-user" },
  "2A22": { Password: "26272a22", Permission: "1-user" },
  "2A23": { Password: "26272a23", Permission: "1-user" },
  "2A24": { Password: "26272a24", Permission: "68-Vice ChairPerson of Class Union" },
  "2A25": { Password: "26272a25", Permission: "1-user" },
  "2A26": { Password: "26272a26", Permission: "1-user" },
  "2A27": { Password: "26272a27", Permission: "1-user" },
  "2A28": { Password: "26272a28", Permission: "69-ChairPerson of Class Union" },
  "2A29": { Password: "26272a29", Permission: "1-user" },
  "2A30": { Password: "26272a30", Permission: "1-user" },
  "2A31": { Password: "26272a31", Permission: "1-user" },
  "2A32": { Password: "26272a32", Permission: "1-user" },
  "2A33": { Password: "26272a33", Permission: "1-user" },
  "2A34": { Password: "26272a34", Permission: "1-user" },
  "2A35": { Password: "26272a35", Permission: "1-user" },
  "CKK": { Password: "ckk@2a", Permission: "2-Teacher" },
  "CTK": { Password: "ctk@2a", Permission: "2-Teacher" },
  "JOR": { Password: "jor@2a", Permission: "2-Teacher" },
  "LKK": { Password: "lkk@2a", Permission: "2-Teacher" },
  "LNF": { Password: "lnf@2a", Permission: "2-Teacher" },
  "LOK": { Password: "lok@2a", Permission: "2-Teacher" },
  "LYT": { Password: "lyt@2a", Permission: "2-Teacher" },
  "MKY": { Password: "mky@2a", Permission: "2-Teacher" },
  "NSH": { Password: "nsh@2a", Permission: "2-Teacher" },
  "RAY": { Password: "ray@2a", Permission: "2-Teacher" },
  "SYI": { Password: "syi@2a", Permission: "2-Teacher" },
  "SYW": { Password: "syw@2a", Permission: "2-Teacher" },
  "TKH": { Password: "tkh@2a", Permission: "2-Teacher" },
  "TMY": { Password: "tmy@2a", Permission: "2-Teacher" },
  "TTC": { Password: "ttc@2a", Permission: "2-Teacher" },
  "TTH": { Password: "tth@2a", Permission: "2-Teacher" },
  "WHY": { Password: "why@2a", Permission: "2-Teacher" },
  "Test01": { Password: "test@2a", Permission: "3-test" },
  "Test02": { Password: "test@2a", Permission: "3-test" }
};

let currentUser = null;

// 解析 Permission 字串中的數字等級 (例如 "70-Monitress" -> 70)
function getPermissionLevel(permissionStr) {
  if (!permissionStr) return 0;
  const match = permissionStr.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// 從 Firebase 雲端獲取帳號資料
async function fetchUsers() {
  try {
    let res = await fetch(`${DB_URL}/users.json`);
    let data = await res.json();
    if (!data) {
      await fetch(`${DB_URL}/users.json`, { method: 'PUT', body: JSON.stringify(initialUsers) });
      return initialUsers;
    }
    return data;
  } catch (e) {
    console.error("Firebase 連線失敗:", e);
    return null;
  }
}

// 登入驗證
async function handleLogin() {
  const uInput = document.getElementById('login-username').value.trim().toUpperCase();
  const pInput = document.getElementById('login-password').value.trim();

  if (!uInput || !pInput) return alert("請輸入帳號與密碼！");

  const users = await fetchUsers();
  if (!users) return alert("連線失敗，請檢查網路或 Firebase 網址！");

  const user = users[uInput];

  if (user && user.Password === pInput) {
    currentUser = { Username: uInput, ...user };
    
    document.getElementById('login-card').classList.add('hidden');
    document.getElementById('main-card').classList.remove('hidden');
    document.getElementById('current-user-display').innerText = currentUser.Username;
    document.getElementById('current-role-display').innerText = currentUser.Permission;

    // 計算當前登入者的權限數字等級
    const permLevel = getPermissionLevel(currentUser.Permission);

    // 只有 99-owner 可看到系統管理員頁籤
    const isOwner = permLevel === 99;
    document.getElementById('admin-tab-btn').classList.toggle('hidden', !isOwner);

    // 🌟 Rank 50+ (Level >= 50) 均可發佈新問卷
    const isRank50Plus = permLevel >= 50;
    document.getElementById('owner-create-survey').classList.toggle('hidden', !isRank50Plus);

    populateECardReceivers(users);
    renderSurveys();
    renderECards();
    if (isOwner) renderAdminTable(users);
  } else {
    alert("用戶名或密碼不正確！ Invalid Username or Password!");
  }
}

// 🔑 修改個人密碼（即時寫入 Firebase 雲端）
async function changeSelfPassword() {
  const newPwd = document.getElementById('self-new-password').value.trim();
  if (!newPwd) return alert("請輸入新密碼！");

  try {
    await fetch(`${DB_URL}/users/${currentUser.Username}/Password.json`, {
      method: 'PUT',
      body: JSON.stringify(newPwd)
    });
    
    currentUser.Password = newPwd;
    alert("密碼已成功同步至雲端！現在在任何裝置均可用新密碼登入。");
    document.getElementById('self-new-password').value = '';
  } catch (e) {
    alert("更新失敗，請重試。");
  }
}

function handleLogout() {
  currentUser = null;
  document.getElementById('login-card').classList.remove('hidden');
  document.getElementById('main-card').classList.add('hidden');
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.remove('hidden');
  event.target.classList.add('active');
}

// 📊 問卷調查雲端模組
async function renderSurveys() {
  const container = document.getElementById('survey-list');
  try {
    let res = await fetch(`${DB_URL}/surveys.json`);
    let surveysObj = await res.json() || {};
    const surveys = Object.keys(surveysObj).map(key => ({ id: key, ...surveysObj[key] }));
    
    container.innerHTML = surveys.length ? '' : '<p style="color:#777;">目前沒有進行中的問卷。</p>';

    surveys.forEach(s => {
      const votedUsers = s.votedUsers || [];
      const totalVotes = votedUsers.length;
      const hasVoted = votedUsers.includes(currentUser.Username);

      let optionsHTML = '';
      s.options.forEach((opt, idx) => {
        const count = (s.votes && s.votes[idx]) ? s.votes[idx] : 0;
        const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
        optionsHTML += `
          <div style="margin: 10px 0;">
            <div style="display:flex; justify-content:space-between;">
              <span>${opt}</span>
              <small>${count} 票 (${percent}%)</small>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width: ${percent}%;"></div></div>
            ${!hasVoted ? `<button onclick="voteSurvey('${s.id}', ${idx})" style="padding:4px; margin-top:4px;">投票 Vote</button>` : ''}
          </div>
        `;
      });

      const card = document.createElement('div');
      card.className = 'card';
      card.style.background = '#fafafa';
      card.innerHTML = `<h4>📌 ${s.title}</h4>${optionsHTML}<small style="color:#666;">總投票數: ${totalVotes} ${hasVoted ? '(已投票)' : ''}</small>`;
      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = '<p>讀取問卷失敗。</p>';
  }
}

async function createSurvey() {
  const title = document.getElementById('survey-title').value.trim();
  const optionsRaw = document.getElementById('survey-options').value.trim();
  if (!title || !optionsRaw) return alert("請填寫完整問卷資料！");

  const options = optionsRaw.split(',').map(o => o.trim()).filter(o => o);
  const newSurvey = { title, options, votes: {}, votedUsers: [] };

  await fetch(`${DB_URL}/surveys.json`, { method: 'POST', body: JSON.stringify(newSurvey) });
  document.getElementById('survey-title').value = '';
  document.getElementById('survey-options').value = '';
  renderSurveys();
}

async function voteSurvey(surveyId, optionIndex) {
  let res = await fetch(`${DB_URL}/surveys/${surveyId}.json`);
  let survey = await res.json();
  if (!survey) return;

  let votedUsers = survey.votedUsers || [];
  if (votedUsers.includes(currentUser.Username)) return alert("你已經投過票了！");

  votedUsers.push(currentUser.Username);
  let count = (survey.votes && survey.votes[optionIndex]) ? survey.votes[optionIndex] + 1 : 1;

  await fetch(`${DB_URL}/surveys/${surveyId}/votes/${optionIndex}.json`, { method: 'PUT', body: JSON.stringify(count) });
  await fetch(`${DB_URL}/surveys/${surveyId}/votedUsers.json`, { method: 'PUT', body: JSON.stringify(votedUsers) });

  renderSurveys();
}

// 💌 心意卡雲端模組
function populateECardReceivers(users) {
  const select = document.getElementById('ecard-receiver');
  select.innerHTML = '<option value="">選擇接收對象 Select Receiver...</option>';
  Object.keys(users).forEach(uKey => {
    if (uKey !== currentUser.Username) {
      select.innerHTML += `<option value="${uKey}">${uKey} (${users[uKey].Permission})</option>`;
    }
  });
}

async function sendECard() {
  const receiver = document.getElementById('ecard-receiver').value;
  const message = document.getElementById('ecard-message').value.trim();
  if (!receiver || !message) return alert("請填寫完整接收對象與訊息！");

  const card = { sender: currentUser.Username, receiver, message, date: new Date().toLocaleDateString() };
  await fetch(`${DB_URL}/ecards.json`, { method: 'POST', body: JSON.stringify(card) });

  document.getElementById('ecard-message').value = '';
  alert("心意卡已傳送！");
  renderECards();
}

async function renderECards() {
  const container = document.getElementById('my-ecards-list');
  try {
    let res = await fetch(`${DB_URL}/ecards.json`);
    let cardsObj = await res.json() || {};
    const myCards = Object.values(cardsObj).filter(c => c.receiver === currentUser.Username);

    container.innerHTML = myCards.length ? '' : '<p style="color:#777;">目前沒有收到心意卡。</p>';
    myCards.forEach(c => {
      const card = document.createElement('div');
      card.className = 'ecard-item';
      card.innerHTML = `<p><strong>來自: ${c.sender}</strong> <small style="float:right; color:#888;">${c.date}</small></p><p style="white-space: pre-line;">${c.message}</p>`;
      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = '<p>讀取心意卡失敗。</p>';
  }
}

// 👑 管理員模組
function renderAdminTable(users) {
  const tbody = document.getElementById('user-table-body');
  tbody.innerHTML = '';
  Object.keys(users).forEach(uKey => {
    const u = users[uKey];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${uKey}</strong></td>
      <td><input type="text" value="${u.Permission}" id="perm-${uKey}" style="margin:0; padding:4px;"></td>
      <td>
        <input type="text" placeholder="改密碼 Password" id="pwd-${uKey}" style="width:110px; margin:0; padding:4px;">
        <button onclick="adminSave('${uKey}')" style="width:auto; padding:4px 8px; margin:0;">儲存 Save</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function adminSave(uKey) {
  const newPerm = document.getElementById(`perm-${uKey}`).value.trim();
  const newPwd = document.getElementById(`pwd-${uKey}`).value.trim();

  if (newPerm) {
    await fetch(`${DB_URL}/users/${uKey}/Permission.json`, { method: 'PUT', body: JSON.stringify(newPerm) });
  }
  if (newPwd) {
    await fetch(`${DB_URL}/users/${uKey}/Password.json`, { method: 'PUT', body: JSON.stringify(newPwd) });
  }

  alert(`已更新 ${uKey} 資料！`);
  const updatedUsers = await fetchUsers();
  renderAdminTable(updatedUsers);
}
