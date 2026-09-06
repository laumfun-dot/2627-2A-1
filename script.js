// ⚠️ 請將下方網址替換為你在 Firebase 申請到的 Realtime Database 網址
const DB_URL = "https://a-77436-default-rtdb.asia-southeast1.firebasedatabase.app/";

// 初始預設資料（若資料庫為空時自動寫入）
const initialUsers = {
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
  // 提示：正式使用時可將全部 52 位帳號完整寫入
};

let currentUser = null;

// 從雲端讀取所有使用者資料
async function fetchUsersFromCloud() {
  try {
    let res = await fetch(`${DB_URL}/users.json`);
    let data = await res.json();
    if (!data) {
      // 資料庫初始為空，自動寫入預設資料
      await fetch(`${DB_URL}/users.json`, {
        method: 'PUT',
        body: JSON.stringify(initialUsers)
      });
      return initialUsers;
    }
    return data;
  } catch (e) {
    console.error("雲端連線失敗:", e);
    return null;
  }
}

// 登入處理 (非同步雲端驗證)
async function handleLogin() {
  const uInput = document.getElementById('login-username').value.trim().toUpperCase();
  const pInput = document.getElementById('login-password').value.trim();

  if (!uInput || !pInput) return alert("請輸入帳號與密碼！");

  const users = await fetchUsersFromCloud();
  if (!users) return alert("無法連線至雲端資料庫，請檢查網路連線！");

  const user = users[uInput];

  if (user && user.Password === pInput) {
    currentUser = { Username: uInput, ...user };
    
    document.getElementById('login-card').classList.add('hidden');
    document.getElementById('main-card').classList.remove('hidden');
    document.getElementById('current-user-display').innerText = currentUser.Username;
    document.getElementById('current-role-display').innerText = currentUser.Permission;

    const isOwner = currentUser.Permission.includes('99-owner');
    document.getElementById('admin-tab-btn').classList.toggle('hidden', !isOwner);
    document.getElementById('owner-create-survey').classList.toggle('hidden', !isOwner);
  } else {
    alert("用戶名或密碼不正確！ Invalid Username or Password!");
  }
}

// 🔑 個人修改密碼（即時同步更新至雲端）
async function changeSelfPassword() {
  const newPwd = document.getElementById('self-new-password').value.trim();
  if (!newPwd) return alert("請輸入新密碼！");

  try {
    // 直連 Firebase API 更新該用戶密碼
    await fetch(`${DB_URL}/users/${currentUser.Username}/Password.json`, {
      method: 'PUT',
      body: JSON.stringify(newPwd)
    });
    
    currentUser.Password = newPwd;
    alert("密碼已成功更新至雲端！現在可以在任何裝置使用新密碼登入。");
    document.getElementById('self-new-password').value = '';
  } catch (e) {
    alert("密碼更新失敗，請再試一次。");
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
