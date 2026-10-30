// =========================================
// ExpenseFlow - Main JavaScript
// =========================================

// Supabase Configuration
const SUPABASE_URL = 'https://uxyudkzwwwtaklfizylv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4eXVka3p3d3d0YWtsZml6eWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNTMwMDEsImV4cCI6MjA4MTYyOTAwMX0.UWsBdY4duaFg_EoweEbC7o6jhUm2HbuciQsjl5i9bZs';

// Initialize Supabase Client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');

// Auth Elements
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');
const signupSuccess = document.getElementById('signup-success');
const logoutBtn = document.getElementById('logout-btn');
const userEmailDisplay = document.getElementById('user-email');

// Expense Elements
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const weeklyTotal = document.getElementById('weekly-total');
const monthlyTotal = document.getElementById('monthly-total');
const allTimeTotal = document.getElementById('all-time-total');

// Category Icons
const categoryIcons = {
    'Food': `<svg class="icon icon-cat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>`,
    'Transport': `<svg class="icon icon-cat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>`,
    'Shopping': `<svg class="icon icon-cat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>`,
    'Entertainment': `<svg class="icon icon-cat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/></svg>`,
    'Bills': `<svg class="icon icon-cat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5M8 13h8M8 17h8M8 9h2"/></svg>`,
    'Other': `<svg class="icon icon-cat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>`
};
const trashIcon = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;

// =========================================
// AUTH FUNCTIONS
// =========================================

// Switch Auth Tabs
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        if (targetTab === 'login') {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }

        // Clear errors
        loginError.textContent = '';
        signupError.textContent = '';
        signupSuccess.textContent = '';
    });
});

// Sign Up
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    signupError.textContent = '';
    signupSuccess.textContent = '';

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password
    });

    if (error) {
        signupError.textContent = error.message;
    } else {
        signupSuccess.textContent = 'Account created! Check your email for verification, or login directly.';
        signupForm.reset();
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        loginError.textContent = error.message;
    }
    // Auth state change listener will handle the UI switch
});

// Logout
logoutBtn.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
});

// Auth State Change Listener
supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session) {
        // User is logged in
        authSection.classList.add('hidden');
        appSection.classList.remove('hidden');
        userEmailDisplay.textContent = session.user.email;
        loadExpenses();
    } else {
        // User is logged out
        authSection.classList.remove('hidden');
        appSection.classList.add('hidden');
        userEmailDisplay.textContent = '';
    }
});

// =========================================
// EXPENSE FUNCTIONS
// =========================================

// Add Expense
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const description = document.getElementById('expense-desc').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;

    if (!description || isNaN(amount) || amount <= 0) return;

    const { data: { user } } = await supabaseClient.auth.getUser();

    const { data, error } = await supabaseClient
        .from('expenses')
        .insert([{
            user_id: user.id,
            description,
            amount,
            category
        }])
        .select();

    if (error) {
        console.error('Error adding expense:', error);
        alert('Failed to add expense. Make sure the database table is set up correctly.');
        return;
    }

    expenseForm.reset();
    loadExpenses();
});

// Load Expenses
async function loadExpenses() {
    const { data: expenses, error } = await supabaseClient
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading expenses:', error);
        expenseList.innerHTML = '<p class="empty-state">Error loading expenses. Check database setup.</p>';
        return;
    }

    renderExpenses(expenses);
    calculateTotals(expenses);
}

// Render Expenses
function renderExpenses(expenses) {
    if (!expenses || expenses.length === 0) {
        expenseList.innerHTML = '<p class="empty-state">No expenses yet. Start tracking!</p>';
        return;
    }

    expenseList.innerHTML = expenses.map(expense => `
        <div class="expense-item" data-id="${escapeHtml(String(expense.id))}">
            <div class="expense-info">
                <div class="expense-category-icon">${categoryIcons[expense.category] || categoryIcons.Other}</div>
                <div class="expense-details">
                    <h4>${escapeHtml(expense.description)}</h4>
                    <span class="expense-date">${formatDate(expense.created_at)}</span>
                </div>
            </div>
            <div class="expense-amount">-₹${parseFloat(expense.amount).toFixed(2)}</div>
            <div class="expense-actions">
                <button class="btn-delete" data-id="${escapeHtml(String(expense.id))}" title="Delete" aria-label="Delete expense">${trashIcon}</button>
            </div>
        </div>
    `).join('');
}

// Delete Expense (one listener instead of inline onclick, so data never becomes code)
expenseList.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-delete');
    if (btn) deleteExpense(btn.dataset.id);
});

async function deleteExpense(id) {
    const { error } = await supabaseClient
        .from('expenses')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting expense:', error);
        return;
    }

    loadExpenses();
}

// Calculate Totals
function calculateTotals(expenses) {
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let weekly = 0;
    let monthly = 0;
    let allTime = 0;

    expenses.forEach(expense => {
        const expenseDate = new Date(expense.created_at);
        const amount = parseFloat(expense.amount);

        allTime += amount;

        if (expenseDate >= startOfMonth) {
            monthly += amount;
        }

        if (expenseDate >= startOfWeek) {
            weekly += amount;
        }
    });

    weeklyTotal.textContent = `₹${weekly.toFixed(2)}`;
    monthlyTotal.textContent = `₹${monthly.toFixed(2)}`;
    allTimeTotal.textContent = `₹${allTime.toFixed(2)}`;
}

// =========================================
// UTILITY FUNCTIONS
// =========================================

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    return new Date(d.setDate(diff));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize: Check session on page load
(async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        authSection.classList.add('hidden');
        appSection.classList.remove('hidden');
        userEmailDisplay.textContent = session.user.email;
        loadExpenses();
    }
})();
