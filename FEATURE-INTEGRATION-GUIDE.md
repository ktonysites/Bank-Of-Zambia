# Banking Application - Feature Integration Guide
## Implementation Instructions for Developers

---

## 📋 OVERVIEW

This guide provides step-by-step instructions for integrating advanced banking features into the Bank of Zambia application. All JavaScript classes and methods are available in `banking-features.js`.

---

## 🚀 QUICK START

### Step 1: Include the Banking Features File
Add this to the `<head>` section of any HTML page:
```html
<script src="banking-features.js"></script>
```

### Step 2: Initialize Managers
```javascript
const transactionManager = new TransactionManager();
const beneficiaryManager = new BeneficiaryManager();
const billManager = new BillPaymentManager();
const securityManager = new SecurityManager();
const accountManager = new AccountManager();
```

### Step 3: Use the Features
```javascript
// Get filtered transactions
const filtered = transactionManager.applyFilters();

// Add beneficiary
beneficiaryManager.addBeneficiary(name, account, bank, code);

// Schedule payment
billManager.schedulePayment(billerId, amount, account, dueDate);
```

---

## 📊 FEATURE 1: TRANSACTION FILTERING & SEARCH

### Use Cases:
- Filter transactions by date range
- Search by description or category
- Filter by amount range
- Export to CSV or PDF
- Calculate spending statistics

### Implementation Example:

**HTML Form:**
```html
<div class="filter-panel">
    <input type="date" id="dateFrom" placeholder="From Date">
    <input type="date" id="dateTo" placeholder="To Date">
    <input type="text" id="searchTerm" placeholder="Search transactions...">
    <select id="categoryFilter">
        <option value="">All Categories</option>
        <option value="Shopping">Shopping</option>
        <option value="Transport">Transport</option>
        <option value="Utilities">Utilities</option>
    </select>
    <button onclick="applyTransactionFilters()">Filter</button>
    <button onclick="exportTransactions()">Export CSV</button>
</div>
<div id="transactionList"></div>
```

**JavaScript:**
```javascript
const tm = new TransactionManager();

function applyTransactionFilters() {
    tm.filters.dateFrom = document.getElementById('dateFrom').value;
    tm.filters.dateTo = document.getElementById('dateTo').value;
    tm.filters.searchTerm = document.getElementById('searchTerm').value;
    tm.filters.category = document.getElementById('categoryFilter').value;

    const filtered = tm.applyFilters();
    displayTransactions(filtered);
}

function displayTransactions(transactions) {
    const listEl = document.getElementById('transactionList');
    listEl.innerHTML = transactions.map(t => `
        <div class="transaction-item">
            <div class="flex items-center gap-3">
                <i class="ph ${t.icon} text-2xl text-${t.color}-500"></i>
                <div>
                    <p class="font-semibold">${t.description}</p>
                    <p class="text-sm text-slate-500">${t.date.toLocaleDateString()}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-bold">${t.amount > 0 ? '+' : ''}ZMW ${t.amount.toFixed(2)}</p>
                <p class="text-xs text-${t.status === 'Completed' ? 'green' : 'yellow'}-600">${t.status}</p>
            </div>
        </div>
    `).join('');
}

function exportTransactions() {
    const filtered = tm.applyFilters();
    tm.exportToCSV(filtered);
}
```

### Key Methods:
- `filterByDate(fromDate, toDate)` - Filter by date range
- `filterByAmount(minAmount, maxAmount)` - Filter by amount
- `searchTransactions(searchTerm)` - Search in description
- `filterByCategory(category)` - Filter by category
- `applyFilters()` - Apply all active filters
- `exportToCSV()` - Export to CSV file
- `getStatistics()` - Get spending analytics

---

## 👥 FEATURE 2: BENEFICIARY MANAGEMENT

### Use Cases:
- Add/Edit/Delete beneficiaries
- Organize by category (Personal, Business)
- Quick-pay to frequent beneficiaries
- Verify beneficiary accounts
- View beneficiary history

### Implementation Example:

**Add Beneficiary:**
```html
<form id="addBeneficiaryForm">
    <input type="text" id="benefName" placeholder="Beneficiary Name" required>
    <input type="text" id="benefAccount" placeholder="Account Number" required>
    <input type="text" id="benefBank" placeholder="Bank Name" required>
    <select id="benefCategory">
        <option value="Personal">Personal</option>
        <option value="Business">Business</option>
        <option value="Frequent">Frequent</option>
    </select>
    <button type="submit">Add Beneficiary</button>
</form>

<div id="beneficiaryList"></div>
```

**JavaScript:**
```javascript
const bm = new BeneficiaryManager();

document.getElementById('addBeneficiaryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const beneficiary = bm.addBeneficiary(
        document.getElementById('benefName').value,
        document.getElementById('benefAccount').value,
        document.getElementById('benefBank').value,
        'BOZ',
        document.getElementById('benefCategory').value
    );
    
    alert('Beneficiary added! Awaiting verification.');
    displayBeneficiaries();
});

function displayBeneficiaries() {
    const listEl = document.getElementById('beneficiaryList');
    listEl.innerHTML = bm.beneficiaries.map(b => `
        <div class="beneficiary-card">
            <div class="p-4 border border-slate-200 rounded-lg">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-bold text-lg">${b.name}</p>
                        <p class="text-sm text-slate-500">${b.accountNumber}</p>
                        <p class="text-xs text-slate-400">${b.bankName}</p>
                    </div>
                    <span class="text-xs px-2 py-1 rounded 
                        ${b.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                        ${b.status}
                    </span>
                </div>
                <div class="mt-3 flex gap-2">
                    <button onclick="quickPayBeneficiary(${b.id})" class="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm">
                        Quick Pay
                    </button>
                    <button onclick="verifyBeneficiary(${b.id})" class="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm">
                        Verify
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function quickPayBeneficiary(benefId) {
    bm.updateLastUsed(benefId);
    alert('Opening transfer form for this beneficiary...');
}

function verifyBeneficiary(benefId) {
    bm.verifyBeneficiary(benefId);
    alert('Beneficiary verified!');
    displayBeneficiaries();
}

// Display on load
displayBeneficiaries();
```

### Key Methods:
- `addBeneficiary(name, account, bank, code, category)` - Add new beneficiary
- `editBeneficiary(id, updates)` - Edit beneficiary details
- `deleteBeneficiary(id)` - Remove beneficiary
- `getBeneficiariesByCategory(category)` - Filter by category
- `getFrequentBeneficiaries(limit)` - Get most used beneficiaries
- `verifyBeneficiary(id)` - Verify beneficiary account
- `updateLastUsed(id)` - Track last usage

---

## 💰 FEATURE 3: BILL PAYMENT MANAGEMENT

### Use Cases:
- Pay utility bills (ZESCO, NWSC, Telecom)
- Schedule recurring payments
- Track bill payment history
- Get payment reminders
- View upcoming bills

### Implementation Example:

**Bill Payment Form:**
```html
<div class="bill-payment-section">
    <h3>Pay a Bill</h3>
    
    <div class="mb-4">
        <label>Select Biller:</label>
        <select id="billerSelect" onchange="loadBillerDetails()">
            <option value="">Choose a biller...</option>
        </select>
    </div>
    
    <div id="billerDetailsDiv" class="hidden mb-4">
        <input type="text" id="accountNumber" placeholder="Your Account Number" required>
        <input type="number" id="billAmount" placeholder="Amount" required>
        <label class="flex items-center gap-2 mt-2">
            <input type="checkbox" id="isRecurring"> Make this a recurring payment
        </label>
        <select id="frequency" class="hidden">
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annually">Annually</option>
        </select>
        <button onclick="processBillPayment()">Pay Now</button>
    </div>
</div>

<h4>Upcoming Bills</h4>
<div id="upcomingBillsList"></div>

<h4>Scheduled Payments</h4>
<div id="scheduledPaymentsList"></div>
```

**JavaScript:**
```javascript
const bm = new BillPaymentManager();

// Load billers on page load
function initializeBillers() {
    const select = document.getElementById('billerSelect');
    select.innerHTML = '<option value="">Choose a biller...</option>' + 
        bm.billers.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
    
    displayUpcomingBills();
    displayScheduledPayments();
}

function loadBillerDetails() {
    const billerId = document.getElementById('billerSelect').value;
    if (billerId) {
        document.getElementById('billerDetailsDiv').classList.remove('hidden');
    }
}

function processBillPayment() {
    const billerId = parseInt(document.getElementById('billerSelect').value);
    const amount = parseFloat(document.getElementById('billAmount').value);
    const account = document.getElementById('accountNumber').value;
    const isRecurring = document.getElementById('isRecurring').checked;
    const frequency = document.getElementById('frequency').value;
    
    if (isRecurring) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7); // Due in 7 days
        bm.schedulePayment(billerId, amount, account, dueDate.toISOString(), true, frequency);
        alert('Recurring payment scheduled!');
    } else {
        const payment = bm.createPayment(billerId, amount, account, 'REF' + Date.now());
        alert('Payment processed! Reference: ' + payment.id);
    }
    
    displayScheduledPayments();
}

function displayUpcomingBills() {
    const list = document.getElementById('upcomingBillsList');
    const upcoming = bm.getUpcomingPayments(7);
    list.innerHTML = upcoming.map(p => {
        const biller = bm.billers.find(b => b.id === p.billerId);
        return `
            <div class="p-3 border border-slate-200 rounded-lg mb-2">
                <p class="font-semibold">${biller.name}</p>
                <p class="text-sm">Due: ${new Date(p.nextDueDate).toLocaleDateString()}</p>
                <p class="text-lg font-bold">ZMW ${p.amount.toFixed(2)}</p>
            </div>
        `;
    }).join('');
}

function displayScheduledPayments() {
    const list = document.getElementById('scheduledPaymentsList');
    list.innerHTML = bm.scheduledPayments.map(p => {
        const biller = bm.billers.find(b => b.id === p.billerId);
        return `
            <div class="p-3 border border-slate-200 rounded-lg mb-2">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-semibold">${biller.name}</p>
                        <p class="text-sm">Frequency: ${p.frequency}</p>
                    </div>
                    <button onclick="removeScheduledPayment(${p.id})" class="text-red-600 text-sm">
                        Cancel
                    </button>
                </div>
                <p class="text-lg font-bold mt-2">ZMW ${p.amount.toFixed(2)}</p>
            </div>
        `;
    }).join('');
}

function removeScheduledPayment(id) {
    if (confirm('Are you sure you want to cancel this payment?')) {
        bm.deleteScheduledPayment(id);
        displayScheduledPayments();
    }
}

// Initialize on page load
initializeBillers();
```

### Key Methods:
- `getBillersByCategory(category)` - Get billers by category
- `createPayment(billerId, amount, account, reference)` - Create one-time payment
- `schedulePayment(billerId, amount, account, dueDate, isRecurring, frequency)` - Schedule payment
- `updateScheduledPayment(id, updates)` - Modify scheduled payment
- `deleteScheduledPayment(id)` - Cancel scheduled payment
- `getUpcomingPayments(days)` - Get bills due within N days

---

## 🔒 FEATURE 4: SECURITY & LIMITS

### Use Cases:
- Configure transaction limits (ATM, Online, Contactless)
- Enable/disable 2FA and biometric
- View login history
- Manage trusted devices
- Get security alerts

### Implementation Example:

```html
<div class="security-settings">
    <h3>Transaction Limits</h3>
    
    <div class="setting-item">
        <label>Daily Limit (ZMW):</label>
        <input type="number" id="dailyLimit" value="100000">
        <button onclick="updateLimit('daily')">Update</button>
    </div>
    
    <div class="setting-item">
        <label>Online Payment Limit (ZMW):</label>
        <input type="number" id="onlineLimit" value="50000">
        <button onclick="updateLimit('online')">Update</button>
    </div>
    
    <div class="setting-item">
        <label>ATM Withdrawal Limit (ZMW):</label>
        <input type="number" id="atmLimit" value="10000">
        <button onclick="updateLimit('atm')">Update</button>
    </div>

    <hr class="my-6">

    <h3>Security Features</h3>
    
    <div class="setting-item flex items-center justify-between">
        <span>Two-Factor Authentication</span>
        <label class="toggle-switch">
            <input type="checkbox" ${sm.settings.twoFactorEnabled ? 'checked' : ''} onchange="toggleFeature('2fa')">
            <span class="toggle-slider"></span>
        </label>
    </div>
    
    <div class="setting-item flex items-center justify-between">
        <span>Biometric Login</span>
        <label class="toggle-switch">
            <input type="checkbox" ${sm.settings.biometricEnabled ? 'checked' : ''} onchange="toggleFeature('biometric')">
            <span class="toggle-slider"></span>
        </label>
    </div>

    <hr class="my-6">

    <h3>Login History</h3>
    <div id="loginHistoryList"></div>

    <h3>Trusted Devices</h3>
    <div id="trustedDevicesList"></div>
</div>
```

**JavaScript:**
```javascript
const sm = new SecurityManager();

function updateLimit(type) {
    const mapType = {
        'daily': 'dailyLimit',
        'online': 'onlineLimit',
        'atm': 'atmLimit'
    };
    
    const newLimit = parseInt(document.getElementById(`${type}Limit`).value);
    sm.updateTransactionLimit(type, newLimit);
    alert('Limit updated successfully!');
}

function toggleFeature(feature) {
    if (feature === '2fa') {
        sm.toggle2FA(!sm.settings.twoFactorEnabled);
    } else if (feature === 'biometric') {
        sm.toggleBiometric(!sm.settings.biometricEnabled);
    }
    alert('Security setting updated!');
}

function displayLoginHistory() {
    const list = document.getElementById('loginHistoryList');
    list.innerHTML = sm.loginHistory.slice(0, 5).map(entry => `
        <div class="p-3 border border-slate-200 rounded-lg mb-2">
            <p class="font-semibold">${entry.device}</p>
            <p class="text-sm text-slate-500">${new Date(entry.timestamp).toLocaleString()}</p>
            <p class="text-xs">IP: ${entry.ip}</p>
        </div>
    `).join('');
}

function displayTrustedDevices() {
    const list = document.getElementById('trustedDevicesList');
    list.innerHTML = sm.trustedDevices.map(device => `
        <div class="p-3 border border-slate-200 rounded-lg mb-2">
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-semibold">${device.name}</p>
                    <p class="text-xs text-slate-500">Added: ${new Date(device.addedAt).toLocaleDateString()}</p>
                </div>
                <button onclick="removeTrustedDevice(${device.id})" class="text-red-600 text-sm">Remove</button>
            </div>
        </div>
    `).join('');
}

function removeTrustedDevice(id) {
    sm.removeTrustedDevice(id);
    displayTrustedDevices();
}

// Initialize security displays
displayLoginHistory();
displayTrustedDevices();
```

### Key Methods:
- `updateTransactionLimit(type, newLimit)` - Set transaction limits
- `toggle2FA(enabled)` - Enable/disable 2FA
- `toggleBiometric(enabled)` - Enable/disable biometric
- `recordLogin(device, location, ip)` - Log login attempts
- `addTrustedDevice(name, fingerprint)` - Trust a device
- `removeTrustedDevice(id)` - Remove device from trusted list
- `getLastLogin()` - Get most recent login
- `getLoginAlerts(days)` - Get recent login activity

---

## 💳 FEATURE 5: ACCOUNT MANAGEMENT

### Use Cases:
- View all accounts
- Switch primary account
- Get account balances
- Download statements
- Update account info

### Implementation Example:

```javascript
const am = new AccountManager();

// Display all accounts
function displayAccounts() {
    const accounts = am.accounts.map(acc => `
        <div class="account-card p-4 border border-slate-200 rounded-lg mb-3">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-slate-500">${acc.type}</p>
                    <p class="text-xl font-bold">${acc.name}</p>
                    <p class="text-sm text-slate-600 mt-2">ZMW ${acc.balance.toFixed(2)}</p>
                </div>
                <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                    ${acc.status}
                </span>
            </div>
            <p class="text-xs text-slate-400 mt-3 font-mono">${acc.accountNumber}</p>
        </div>
    `).join('');
    
    document.getElementById('accountsList').innerHTML = accounts;
}

// Get total balance across all accounts
function getTotalBalance() {
    return am.getTotalBalance();
}

// Switch primary account
function setPrimaryAccount(accountId) {
    am.accounts.forEach(a => a.primary = a.id === accountId);
    am.saveAccounts();
    alert('Primary account updated!');
}

displayAccounts();
```

---

## 📱 MOBILE INTEGRATION CHECKLIST

When implementing these features on mobile pages:

- [ ] Add feature file to HTML: `<script src="banking-features.js"></script>`
- [ ] Use touch-friendly button sizes (min 44px)
- [ ] Test on devices smaller than 375px width
- [ ] Ensure forms are mobile-optimized
- [ ] Add filter controls in a collapsible panel
- [ ] Use bottom sheet modals for dialogs
- [ ] Implement gesture support (swipe)
- [ ] Test with slow networks
- [ ] Verify all external links work
- [ ] Test local storage limits

---

## 🔌 API INTEGRATION NOTES

**Current Implementation**: Uses localStorage for persistence  
**For Production**: Replace localStorage calls with API calls

Example conversion:
```javascript
// Current (localStorage):
loadBeneficiaries() {
    return JSON.parse(localStorage.getItem('beneficiaries') || '[]');
}

// Production (API):
async loadBeneficiaries() {
    const response = await fetch('/api/beneficiaries');
    return response.json();
}
```

---

## 🧪 TESTING CHECKLIST

- [ ] Test on mobile (iOS Safari, Chrome)
- [ ] Test on tablet (landscape/portrait)
- [ ] Test on desktop browsers
- [ ] Test localStorage on incognito/private mode
- [ ] Test with large datasets (100+ transactions)
- [ ] Test concurrent operations
- [ ] Test data persistence after page refresh
- [ ] Test error scenarios
- [ ] Performance test on slow devices
- [ ] Test accessibility (screen readers, keyboard nav)

---

## 📚 ADDITIONAL RESOURCES

- Phosphor Icons: https://phosphoricons.com
- Tailwind CSS: https://tailwindcss.com
- localStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- FormData API: https://developer.mozilla.org/en-US/docs/Web/API/FormData

---

## 💬 SUPPORT & TROUBLESHOOTING

### Issue: Data not persisting after page refresh
**Solution**: Ensure no private/incognito mode. Check localStorage limit (5-10MB).

### Issue: Filters not working
**Solution**: Verify all filter values are set. Check browser console for errors.

### Issue: Performance issues with large datasets
**Solution**: Implement pagination or virtualization for lists with 100+ items.

### Issue: Mobile layout broken
**Solution**: Check responsive classes (md:hidden, hidden md:flex). Test all breakpoints.

---

**Last Updated**: April 3, 2026  
**Version**: 1.0  
**Maintainer**: Development Team
