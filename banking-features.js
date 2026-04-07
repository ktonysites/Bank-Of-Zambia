/**
 * BANKING FEATURES ENHANCEMENT GUIDE
 * Implementation patterns and code snippets for real banking functionality
 * 
 * This file contains ready-to-use JavaScript code for enhancing the banking
 * application with real banking features including:
 * - Advanced transaction filtering
 * - Beneficiary management
 * - Bill payment functionality
 * - Security controls
 * - Account management
 */

// ============== TRANSACTION FILTERING & SEARCH ==============
class TransactionManager {
    constructor() {
        this.transactions = this.loadTransactions();
        this.filters = {
            dateFrom: null,
            dateTo: null,
            minAmount: null,
            maxAmount: null,
            category: null,
            status: null,
            searchTerm: null
        };
    }

    loadTransactions() {
        const saved = localStorage.getItem('transactions');
        if (saved) return JSON.parse(saved);
        return [
            {
                id: 1,
                date: new Date('2026-04-01'),
                description: 'Online Shopping - Amazon',
                amount: -850.00,
                currency: 'ZMW',
                category: 'Shopping',
                status: 'Completed',
                reference: 'TXN001234',
                icon: 'ph-shopping-cart',
                color: 'blue'
            },
            {
                id: 2,
                date: new Date('2026-03-31'),
                description: 'Salary Deposit - BOZ Ltd',
                amount: 45000.00,
                currency: 'ZMW',
                category: 'Income',
                status: 'Completed',
                reference: 'SAL031226',
                icon: 'ph-money',
                color: 'green'
            },
            {
                id: 3,
                date: new Date('2026-03-30'),
                description: 'Fuel Purchase - Puma Energy',
                amount: -1200.00,
                currency: 'ZMW',
                category: 'Transport',
                status: 'Completed',
                reference: 'FUL030326',
                icon: 'ph-gas-pump',
                color: 'purple'
            }
        ];
    }

    // Filter transactions by date range
    filterByDate(fromDate, toDate) {
        return this.transactions.filter(t => 
            t.date >= new Date(fromDate) && t.date <= new Date(toDate)
        );
    }

    // Filter transactions by amount range
    filterByAmount(minAmount, maxAmount) {
        return this.transactions.filter(t => 
            Math.abs(t.amount) >= minAmount && Math.abs(t.amount) <= maxAmount
        );
    }

    // Search transactions by description
    searchTransactions(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.transactions.filter(t =>
            t.description.toLowerCase().includes(term) ||
            t.category.toLowerCase().includes(term) ||
            t.reference.toLowerCase().includes(term)
        );
    }

    // Filter transactions by category
    filterByCategory(category) {
        return this.transactions.filter(t => t.category === category);
    }

    // Filter transactions by status
    filterByStatus(status) {
        return this.transactions.filter(t => t.status === status);
    }

    // Apply combined filters
    applyFilters() {
        let results = [...this.transactions];

        if (this.filters.dateFrom && this.filters.dateTo) {
            results = results.filter(t =>
                t.date >= new Date(this.filters.dateFrom) &&
                t.date <= new Date(this.filters.dateTo)
            );
        }

        if (this.filters.minAmount && this.filters.maxAmount) {
            results = results.filter(t =>
                Math.abs(t.amount) >= this.filters.minAmount &&
                Math.abs(t.amount) <= this.filters.maxAmount
            );
        }

        if (this.filters.category) {
            results = results.filter(t => t.category === this.filters.category);
        }

        if (this.filters.status) {
            results = results.filter(t => t.status === this.filters.status);
        }

        if (this.filters.searchTerm) {
            const term = this.filters.searchTerm.toLowerCase();
            results = results.filter(t =>
                t.description.toLowerCase().includes(term) ||
                t.reference.toLowerCase().includes(term)
            );
        }

        return results;
    }

    // Export transactions to CSV
    exportToCSV(transactions = this.transactions) {
        const headers = ['Date', 'Description', 'Amount', 'Category', 'Status', 'Reference'];
        const rows = transactions.map(t => [
            t.date.toLocaleDateString(),
            t.description,
            t.amount,
            t.category,
            t.status,
            t.reference
        ]);

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }

    // Export transactions to PDF
    exportToPDF(transactions = this.transactions) {
        // Requires jsPDF library: <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
        console.log('PDF export would be implemented with jsPDF library');
        // Example implementation would create a PDF with transaction table
    }

    // Get transaction statistics
    getStatistics(transactions = this.transactions) {
        const stats = {
            totalIncome: 0,
            totalExpenses: 0,
            transactionCount: transactions.length,
            averageTransaction: 0,
            largestIncome: 0,
            largestExpense: 0,
            categories: {}
        };

        transactions.forEach(t => {
            if (t.amount > 0) {
                stats.totalIncome += t.amount;
                stats.largestIncome = Math.max(stats.largestIncome, t.amount);
            } else {
                stats.totalExpenses += Math.abs(t.amount);
                stats.largestExpense = Math.max(stats.largestExpense, Math.abs(t.amount));
            }

            // Categorize
            if (!stats.categories[t.category]) {
                stats.categories[t.category] = { count: 0, total: 0 };
            }
            stats.categories[t.category].count += 1;
            stats.categories[t.category].total += Math.abs(t.amount);
        });

        stats.averageTransaction = (stats.totalIncome + stats.totalExpenses) / transactions.length;
        return stats;
    }
}

// ============== BENEFICIARY MANAGEMENT ==============
class BeneficiaryManager {
    constructor() {
        this.beneficiaries = this.loadBeneficiaries();
    }

    loadBeneficiaries() {
        const saved = localStorage.getItem('beneficiaries');
        if (saved) return JSON.parse(saved);
        return [
            {
                id: 1,
                name: 'Mom - Home',
                accountNumber: 'BOZ0001234567',
                bankName: 'Bank of Zambia',
                bankCode: 'BOZ',
                category: 'Personal',
                status: 'Verified',
                lastUsed: new Date('2026-03-28'),
                frequency: 'Monthly'
            },
            {
                id: 2,
                name: 'Salary Account',
                accountNumber: 'BOZ7654321098',
                bankName: 'Bank of Zambia',
                bankCode: 'BOZ',
                category: 'Business',
                status: 'Verified',
                lastUsed: new Date('2026-03-31'),
                frequency: 'Weekly'
            }
        ];
    }

    saveBeneficiaries() {
        localStorage.setItem('beneficiaries', JSON.stringify(this.beneficiaries));
    }

    addBeneficiary(name, accountNumber, bankName, bankCode, category = 'Personal') {
        const beneficiary = {
            id: Date.now(),
            name,
            accountNumber,
            bankName,
            bankCode,
            category,
            status: 'Pending',
            lastUsed: null,
            frequency: 'None',
            createdAt: new Date().toISOString()
        };
        this.beneficiaries.push(beneficiary);
        this.saveBeneficiaries();
        return beneficiary;
    }

    editBeneficiary(id, updates) {
        const beneficiary = this.beneficiaries.find(b => b.id === id);
        if (beneficiary) {
            Object.assign(beneficiary, updates);
            this.saveBeneficiaries();
            return beneficiary;
        }
        return null;
    }

    deleteBeneficiary(id) {
        this.beneficiaries = this.beneficiaries.filter(b => b.id !== id);
        this.saveBeneficiaries();
    }

    getBeneficiariesByCategory(category) {
        return this.beneficiaries.filter(b => b.category === category);
    }

    getFrequentBeneficiaries(limit = 5) {
        return [...this.beneficiaries]
            .sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed))
            .slice(0, limit);
    }

    verifyBeneficiary(id) {
        const beneficiary = this.beneficiaries.find(b => b.id === id);
        if (beneficiary) {
            beneficiary.status = 'Verified';
            this.saveBeneficiaries();
            return true;
        }
        return false;
    }

    updateLastUsed(id) {
        const beneficiary = this.beneficiaries.find(b => b.id === id);
        if (beneficiary) {
            beneficiary.lastUsed = new Date().toISOString();
            this.saveBeneficiaries();
        }
    }
}

// ============== BILL PAYMENT MANAGEMENT ==============
class BillPaymentManager {
    constructor() {
        this.billers = this.loadBillers();
        this.scheduledPayments = this.loadScheduledPayments();
    }

    loadBillers() {
        const saved = localStorage.getItem('billers');
        if (saved) return JSON.parse(saved);
        return [
            {
                id: 1,
                name: 'ZESCO (Electricity)',
                category: 'Utilities',
                code: 'ZESCO',
                icon: 'ph-lightning-bolt',
                color: 'yellow'
            },
            {
                id: 2,
                name: 'NWSC (Water)',
                category: 'Utilities',
                code: 'NWSC',
                icon: 'ph-water',
                color: 'blue'
            },
            {
                id: 3,
                name: 'MTN Zambia',
                category: 'Telecom',
                code: 'MTN',
                icon: 'ph-phone',
                color: 'yellow'
            }
        ];
    }

    loadScheduledPayments() {
        const saved = localStorage.getItem('scheduledPayments');
        if (saved) return JSON.parse(saved);
        return [];
    }

    saveBillers() {
        localStorage.setItem('billers', JSON.stringify(this.billers));
    }

    saveScheduledPayments() {
        localStorage.setItem('scheduledPayments', JSON.stringify(this.scheduledPayments));
    }

    getBillersByCategory(category) {
        return this.billers.filter(b => b.category === category);
    }

    createPayment(billerId, amount, accountNumber, referenceNumber) {
        const payment = {
            id: Date.now(),
            billerId,
            amount,
            accountNumber,
            referenceNumber,
            status: 'Pending',
            date: new Date().toISOString(),
            receipt: null
        };
        return payment;
    }

    schedulePayment(billerId, amount, accountNumber, dueDate, isRecurring = false, frequency = 'Monthly') {
        const payment = {
            id: Date.now(),
            billerId,
            amount,
            accountNumber,
            dueDate,
            isRecurring,
            frequency,
            status: 'Active',
            lastPaid: null,
            nextDueDate: dueDate,
            createdAt: new Date().toISOString()
        };
        this.scheduledPayments.push(payment);
        this.saveScheduledPayments();
        return payment;
    }

    updateScheduledPayment(id, updates) {
        const payment = this.scheduledPayments.find(p => p.id === id);
        if (payment) {
            Object.assign(payment, updates);
            this.saveScheduledPayments();
            return payment;
        }
        return null;
    }

    deleteScheduledPayment(id) {
        this.scheduledPayments = this.scheduledPayments.filter(p => p.id !== id);
        this.saveScheduledPayments();
    }

    getUpcomingPayments(days = 7) {
        const now = new Date();
        const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        return this.scheduledPayments.filter(p => 
            new Date(p.nextDueDate) >= now && 
            new Date(p.nextDueDate) <= futureDate
        );
    }
}

// ============== SECURITY & ACCOUNT SETTINGS ==============
class SecurityManager {
    constructor() {
        this.settings = this.loadSettings();
        this.loginHistory = this.loadLoginHistory();
        this.trustedDevices = this.loadTrustedDevices();
    }

    loadSettings() {
        const saved = localStorage.getItem('securitySettings');
        return saved ? JSON.parse(saved) : {
            twoFactorEnabled: false,
            biometricEnabled: false,
            contactlessLimit: 500,
            onlineLimit: 50000,
            atmLimit: 10000,
            dailyLimit: 100000,
            sessionTimeout: 15, // minutes
            loginAlertsEnabled: true,
            transactionAlertsEnabled: true
        };
    }

    loadLoginHistory() {
        const saved = localStorage.getItem('loginHistory');
        return saved ? JSON.parse(saved) : [];
    }

    loadTrustedDevices() {
        const saved = localStorage.getItem('trustedDevices');
        return saved ? JSON.parse(saved) : [];
    }

    saveSettings() {
        localStorage.setItem('securitySettings', JSON.stringify(this.settings));
    }

    saveLoginHistory() {
        localStorage.setItem('loginHistory', JSON.stringify(this.loginHistory));
    }

    saveTrustedDevices() {
        localStorage.setItem('trustedDevices', JSON.stringify(this.trustedDevices));
    }

    // Update transaction limits
    updateTransactionLimit(type, newLimit) {
        const key = `${type}Limit`;
        if (this.settings.hasOwnProperty(key)) {
            this.settings[key] = newLimit;
            this.saveSettings();
            return true;
        }
        return false;
    }

    // Enable/disable 2FA
    toggle2FA(enabled) {
        this.settings.twoFactorEnabled = enabled;
        this.saveSettings();
    }

    // Enable/disable biometric
    toggleBiometric(enabled) {
        this.settings.biometricEnabled = enabled;
        this.saveSettings();
    }

    // Record login
    recordLogin(device, location, ip) {
        const entry = {
            id: Date.now(),
            device,
            location,
            ip,
            timestamp: new Date().toISOString(),
            status: 'Success'
        };
        this.loginHistory.unshift(entry);
        if (this.loginHistory.length > 50) {
            this.loginHistory.pop(); // Keep last 50
        }
        this.saveLoginHistory();
        return entry;
    }

    // Add trusted device
    addTrustedDevice(deviceName, deviceFingerprint) {
        const device = {
            id: Date.now(),
            name: deviceName,
            fingerprint: deviceFingerprint,
            addedAt: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            trusted: true
        };
        this.trustedDevices.push(device);
        this.saveTrustedDevices();
        return device;
    }

    // Remove trusted device
    removeTrustedDevice(id) {
        this.trustedDevices = this.trustedDevices.filter(d => d.id !== id);
        this.saveTrustedDevices();
    }

    // Get last login
    getLastLogin() {
        return this.loginHistory.length > 0 ? this.loginHistory[0] : null;
    }

    // Get login alerts
    getLoginAlerts(days = 7) {
        const now = new Date();
        const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        return this.loginHistory.filter(entry => 
            new Date(entry.timestamp) >= pastDate
        );
    }
}

// ============== ACCOUNT MANAGEMENT ==============
class AccountManager {
    constructor() {
        this.accounts = this.loadAccounts();
    }

    loadAccounts() {
        const saved = localStorage.getItem('bankAccounts');
        if (saved) return JSON.parse(saved);
        return [
            {
                id: 1,
                type: 'Savings',
                name: 'Main Savings Account',
                accountNumber: 'BOZ1234567890',
                balance: 125450.00,
                currency: 'ZMW',
                status: 'Active',
                primary: true,
                createdAt: '2024-01-15'
            },
            {
                id: 2,
                type: 'Checking',
                name: 'Current Account',
                accountNumber: 'BOZ0987654321',
                balance: 45200.50,
                currency: 'ZMW',
                status: 'Active',
                primary: false,
                createdAt: '2024-03-20'
            }
        ];
    }

    saveAccounts() {
        localStorage.setItem('bankAccounts', JSON.stringify(this.accounts));
    }

    getAccountById(id) {
        return this.accounts.find(a => a.id === id);
    }

    getPrimaryAccount() {
        return this.accounts.find(a => a.primary) || this.accounts[0];
    }

    getTotalBalance() {
        return this.accounts.reduce((sum, a) => sum + a.balance, 0);
    }

    updateBalance(id, newBalance) {
        const account = this.getAccountById(id);
        if (account) {
            account.balance = newBalance;
            this.saveAccounts();
            return true;
        }
        return false;
    }

    getAccountStatements(id, limit = 10) {
        // Would fetch from backend in real scenario
        const account = this.getAccountById(id);
        if (account) {
            return {
                account: account,
                period: 'Last 30 days',
                statementDate: new Date().toISOString()
            };
        }
        return null;
    }
}

// ============== USAGE EXAMPLES ==============

// Initialize managers
const transactionManager = new TransactionManager();
const beneficiaryManager = new BeneficiaryManager();
const billManager = new BillPaymentManager();
const securityManager = new SecurityManager();
const accountManager = new AccountManager();

// Example: Filter transactions
function getFilteredTransactions() {
    transactionManager.filters.category = 'Shopping';
    transactionManager.filters.minAmount = 0;
    transactionManager.filters.maxAmount = 2000;
    return transactionManager.applyFilters();
}

// Example: Add beneficiary
function addNewBeneficiary() {
    return beneficiaryManager.addBeneficiary(
        'Jane - Work',
        'BOZ9876543210',
        'Bank of Zambia',
        'BOZ',
        'Business'
    );
}

// Example: Schedule bill payment
function scheduleBillPayment() {
    return billManager.schedulePayment(
        1, // ZESCO
        2500,
        'ACC123456',
        new Date('2026-04-15'),
        true,
        'Monthly'
    );
}

// Example: Update transaction limits
function updateSecurityLimit() {
    return securityManager.updateTransactionLimit('online', 100000);
}

// Export for use in HTML files
window.TransactionManager = TransactionManager;
window.BeneficiaryManager = BeneficiaryManager;
window.BillPaymentManager = BillPaymentManager;
window.SecurityManager = SecurityManager;
window.AccountManager = AccountManager;
