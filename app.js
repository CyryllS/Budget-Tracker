import { auth, googleProvider, db } from "./firebase-config.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Keep track of the currently logged-in user
let currentUserUid = null;

// ==========================================
// 1. DATA STATE (Your app's core data object)
// ==========================================
// Modify this structure to match what your tracker uses (needs, wants, savings, accounts, transactions, etc.)
let currentBudgetData = {
  transactions: [],
  allocations: { needs: 60, wants: 20, savings: 30 },
  banks: { mariBank: 0, maya: 0, gcash: 0 }
};


// ==========================================
// 2. AUTHENTICATION EVENT LISTENERS
// ==========================================

// When user clicks "Sign in with Gmail"
const loginBtn = document.getElementById("google-login-btn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  });
}

// When user clicks "Log Out"
const logoutBtn = document.getElementById("google-logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.reload(); // Refresh page to clear sensitive UI states
  });
}

// Automatically detect when user signs in or out
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is logged in via Gmail
    currentUserUid = user.uid;
    console.log("Logged in as:", user.email);

    // Update UI visibility for buttons & email display
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    
    const emailDisplay = document.getElementById("user-email-display");
    if (emailDisplay) emailDisplay.innerText = `Connected: ${user.email}`;

    // Download their data from Firestore Cloud Database
    await loadDataFromCloud(currentUserUid);

  } else {
    // User is logged out
    currentUserUid = null;
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    
    const emailDisplay = document.getElementById("user-email-display");
    if (emailDisplay) emailDisplay.innerText = "";
    
    console.log("User logged out. App is using local state.");
  }
});


// ==========================================
// 3. CLOUD SYNC FUNCTIONS (Firestore)
// ==========================================

// Call this function EVERY TIME you add/edit an expense or change budget settings
export async function saveUserData() {
  if (!currentUserUid) {
    // If not logged in, data won't sync to cloud (optional: save to localStorage as backup)
    localStorage.setItem("budget_fallback_data", JSON.stringify(currentBudgetData));
    return;
  }

  try {
    // Saves/overwrites the user document in the "users_budgets" collection
    await setDoc(doc(db, "users_budgets", currentUserUid), currentBudgetData);
    console.log("Data successfully synced to cloud!");
  } catch (e) {
    console.error("Error writing data to cloud:", e);
  }
}

// Fetches data from Firestore when opening the app on laptop or phone
async function loadDataFromCloud(uid) {
  try {
    const docRef = doc(db, "users_budgets", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Cloud data found! Overwrite local state with cloud data
      currentBudgetData = docSnap.data();
      console.log("Loaded cloud data successfully:", currentBudgetData);

      // IMPORTANT: Refresh your web page UI with this downloaded data
      refreshAppUI();
    } else {
      console.log("No cloud data found yet. Saving current default state to cloud...");
      await saveUserData(); // Push initial state
    }
  } catch (e) {
    console.error("Error loading data from cloud:", e);
  }
}


// ==========================================
// 4. UI REFRESH HOOK
// ==========================================
function refreshAppUI() {
  // TODO: Put your existing rendering functions here. 
  // Example: 
  // renderTransactionsTable(currentBudgetData.transactions);
  // updateBankBalances(currentBudgetData.banks);
  // updateBudgetSummary();
  console.log("UI refreshed with synced data.");
}