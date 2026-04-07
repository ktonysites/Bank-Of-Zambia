/**
 * Banking Utilities & Features
 * Multi-currency, Calendar, Service Channels, and Banking Essentials
 */

// ============== MULTI-CURRENCY SYSTEM ==============
class CurrencyManager {
    constructor() {
        this.exchangeRates = {
            'USD': 1.00,
            'EUR': 0.92,
            'GBP': 0.79,
            'JPY': 149.50,
            'AUD': 1.53,
            'CAD': 1.36,
            'CHF': 0.88,
            'CNY': 7.24,
            'INR': 83.12,
            'MXN': 17.05,
            'BRL': 4.97,
            'ZAR': 18.50,
            'NGN': 759.40,
            'KES': 155.20
        };
        this.defaultCurrency = localStorage.getItem('defaultCurrency') || 'USD';
        this.supportedCurrencies = Object.keys(this.exchangeRates);
    }

    convertCurrency(amount, fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return amount;
        const amountInUSD = amount / this.exchangeRates[fromCurrency];
        return (amountInUSD * this.exchangeRates[toCurrency]).toFixed(2);
    }

    formatCurrency(amount, currency = this.defaultCurrency) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return formatter.format(amount);
    }

    setDefaultCurrency(currency) {
        if (this.supportedCurrencies.includes(currency)) {
            this.defaultCurrency = currency;
            localStorage.setItem('defaultCurrency', currency);
            return true;
        }
        return false;
    }

    getExchangeRate(fromCurrency = 'USD') {
        return this.exchangeRates[fromCurrency] / this.exchangeRates['USD'];
    }
}

// ============== CALENDAR SYSTEM ==============
class BankingCalendar {
    constructor() {
        this.events = this.loadEvents();
        this.holidays = this.getPublicHolidays();
        this.currentMonth = new Date();
    }

    loadEvents() {
        const saved = localStorage.getItem('bankingEvents');
        if (saved) return JSON.parse(saved);
        return [];
    }

    saveEvents() {
        localStorage.setItem('bankingEvents', JSON.stringify(this.events));
    }

    addEvent(title, date, type = 'reminder', description = '', color = '#3b82f6') {
        const event = {
            id: Date.now(),
            title,
            date: new Date(date).toISOString(),
            type, // 'reminder', 'maintenance', 'holiday', 'announcement'
            description,
            color,
            createdAt: new Date().toISOString()
        };
        this.events.push(event);
        this.saveEvents();
        return event;
    }

    removeEvent(id) {
        this.events = this.events.filter(e => e.id !== id);
        this.saveEvents();
    }

    getEventsForDate(date) {
        const dateStr = new Date(date).toDateString();
        return this.events.filter(e => new Date(e.date).toDateString() === dateStr);
    }

    getUpcomingEvents(days = 7) {
        const today = new Date();
        const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
        return this.events.filter(e => {
            const eventDate = new Date(e.date);
            return eventDate >= today && eventDate <= futureDate;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    getPublicHolidays() {
        const year = new Date().getFullYear();
        return [
            { date: `${year}-01-01`, name: 'New Year', type: 'holiday' },
            { date: `${year}-02-14`, name: 'Valentine\'s Day', type: 'holiday' },
            { date: `${year}-03-17`, name: 'St. Patrick\'s Day', type: 'holiday' },
            { date: `${year}-07-04`, name: 'Independence Day', type: 'holiday' },
            { date: `${year}-12-25`, name: 'Christmas', type: 'holiday' },
            { date: `${year}-12-31`, name: 'New Year\'s Eve', type: 'holiday' }
        ];
    }

    isHoliday(date) {
        const dateStr = new Date(date).toISOString().split('T')[0];
        return this.holidays.some(h => h.date === dateStr);
    }

    isBankingDay(date) {
        const day = new Date(date).getDay();
        return day !== 0 && day !== 6 && !this.isHoliday(date);
    }
}

// ============== SERVICE CHANNEL MANAGEMENT ==============
class ServiceChannelManager {
    constructor() {
        this.channels = this.loadChannels();
    }

    loadChannels() {
        const saved = localStorage.getItem('serviceChannels');
        if (saved) return JSON.parse(saved);
        return this.getDefaultChannels();
    }

    saveChannels() {
        localStorage.setItem('serviceChannels', JSON.stringify(this.channels));
    }

    getDefaultChannels() {
        return [
            {
                id: 'mobile',
                name: 'Mobile App',
                icon: 'ph-phone',
                enabled: true,
                features: ['transfers', 'payments', 'balance_check', 'investments'],
                maintenanceWindow: null
            },
            {
                id: 'web',
                name: 'Web Banking',
                icon: 'ph-globe',
                enabled: true,
                features: ['transfers', 'payments', 'balance_check', 'investments', 'loans', 'cards'],
                maintenanceWindow: null
            },
            {
                id: 'atm',
                name: 'ATM Network',
                icon: 'ph-bank',
                enabled: true,
                features: ['withdrawal', 'balance_check', 'pin_change'],
                maintenanceWindow: null
            },
            {
                id: 'phone',
                name: 'Phone Banking',
                icon: 'ph-phone-call',
                enabled: true,
                features: ['balance_check', 'transactions', 'support'],
                maintenanceWindow: null
            },
            {
                id: 'branch',
                name: 'Branch',
                icon: 'ph-building',
                enabled: true,
                features: ['all'],
                maintenanceWindow: null
            },
            {
                id: 'api',
                name: 'API/Integration',
                icon: 'ph-code',
                enabled: false,
                features: ['transfers', 'payments', 'data_access'],
                maintenanceWindow: null
            }
        ];
    }

    toggleChannel(channelId, enabled) {
        const channel = this.channels.find(c => c.id === channelId);
        if (channel) {
            channel.enabled = enabled;
            this.saveChannels();
            return true;
        }
        return false;
    }

    setMaintenance(channelId, startTime, endTime) {
        const channel = this.channels.find(c => c.id === channelId);
        if (channel) {
            channel.maintenanceWindow = { startTime, endTime };
            channel.enabled = false;
            this.saveChannels();
            return true;
        }
        return false;
    }

    clearMaintenance(channelId) {
        const channel = this.channels.find(c => c.id === channelId);
        if (channel) {
            channel.maintenanceWindow = null;
            channel.enabled = true;
            this.saveChannels();
            return true;
        }
        return false;
    }

    getEnabledChannels() {
        return this.channels.filter(c => c.enabled);
    }

    isChannelAvailable(channelId) {
        const channel = this.channels.find(c => c.id === channelId);
        if (!channel) return false;
        
        if (channel.maintenanceWindow) {
            const now = new Date();
            const start = new Date(channel.maintenanceWindow.startTime);
            const end = new Date(channel.maintenanceWindow.endTime);
            if (now >= start && now <= end) return false;
        }
        
        return channel.enabled;
    }

    hasFeature(channelId, feature) {
        const channel = this.channels.find(c => c.id === channelId);
        if (!channel || !channel.enabled) return false;
        return channel.features.includes('all') || channel.features.includes(feature);
    }
}

// ============== TRANSACTION LIMITS ==============
class TransactionLimits {
    constructor() {
        this.limits = this.loadLimits();
    }

    loadLimits() {
        const saved = localStorage.getItem('transactionLimits');
        if (saved) return JSON.parse(saved);
        return this.getDefaultLimits();
    }

    saveLimits() {
        localStorage.setItem('transactionLimits', JSON.stringify(this.limits));
    }

    getDefaultLimits() {
        return {
            daily_transfer: 50000,
            daily_withdrawal: 30000,
            daily_payments: 25000,
            single_transaction: 100000,
            international_transfer: 500000,
            monthly_transfer: 500000
        };
    }

    updateLimit(limitType, amount) {
        if (this.limits.hasOwnProperty(limitType)) {
            this.limits[limitType] = amount;
            this.saveLimits();
            return true;
        }
        return false;
    }

    canPerformTransaction(type, amount) {
        const limitKey = `daily_${type}`;
        if (this.limits.hasOwnProperty(limitKey)) {
            return amount <= this.limits[limitKey];
        }
        return true;
    }

    getLimit(type) {
        return this.limits[type] || null;
    }
}

// ============== NOTIFICATIONS & ALERTS ==============
class NotificationManager {
    constructor() {
        this.notifications = this.loadNotifications();
        this.preferences = this.loadPreferences();
    }

    loadNotifications() {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : [];
    }

    loadPreferences() {
        const saved = localStorage.getItem('notificationPreferences');
        if (saved) return JSON.parse(saved);
        return {
            email: true,
            sms: true,
            push: true,
            inApp: true,
            transactions: true,
            security: true,
            promotions: false,
            systemUpdates: true
        };
    }

    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    savePreferences() {
        localStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));
    }

    addNotification(title, message, type = 'info', icon = 'ph-info') {
        const notification = {
            id: Date.now(),
            title,
            message,
            type, // 'info', 'success', 'warning', 'error', 'security'
            icon,
            read: false,
            createdAt: new Date().toISOString(),
            actionUrl: null
        };
        this.notifications.unshift(notification);
        if (this.notifications.length > 100) this.notifications.pop();
        this.saveNotifications();
        return notification;
    }

    markAsRead(id) {
        const notif = this.notifications.find(n => n.id === id);
        if (notif) {
            notif.read = true;
            this.saveNotifications();
        }
    }

    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    updatePreference(key, value) {
        if (this.preferences.hasOwnProperty(key)) {
            this.preferences[key] = value;
            this.savePreferences();
            return true;
        }
        return false;
    }

    getRecentNotifications(limit = 10) {
        return this.notifications.slice(0, limit);
    }
}

// ============== SECURITY SETTINGS ==============
class SecuritySettings {
    constructor() {
        this.settings = this.loadSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('securitySettings');
        if (saved) return JSON.parse(saved);
        return {
            twoFactorEnabled: false,
            biometricEnabled: false,
            sessionTimeout: 30, // minutes
            passwordExpiry: 90, // days
            ipRestriction: false,
            trustedDevices: [],
            loginAlerts: true,
            unusualActivityAlert: true,
            deviceFingerprint: null
        };
    }

    saveSettings() {
        localStorage.setItem('securitySettings', JSON.stringify(this.settings));
    }

    enableTwoFactor() {
        this.settings.twoFactorEnabled = true;
        this.saveSettings();
    }

    disableTwoFactor() {
        this.settings.twoFactorEnabled = false;
        this.saveSettings();
    }

    enableBiometric() {
        this.settings.biometricEnabled = true;
        this.saveSettings();
    }

    setSessionTimeout(minutes) {
        this.settings.sessionTimeout = minutes;
        this.saveSettings();
    }

    addTrustedDevice(deviceName, fingerprint) {
        this.settings.trustedDevices.push({
            name: deviceName,
            fingerprint,
            addedAt: new Date().toISOString()
        });
        this.saveSettings();
    }

    removeTrustedDevice(fingerprint) {
        this.settings.trustedDevices = this.settings.trustedDevices.filter(d => d.fingerprint !== fingerprint);
        this.saveSettings();
    }
}

// ============== ACCOUNT ANALYTICS ==============
class AccountAnalytics {
    constructor() {
        this.data = this.loadData();
    }

    loadData() {
        const saved = localStorage.getItem('accountAnalytics');
        return saved ? JSON.parse(saved) : {
            totalTransactions: 0,
            totalSpent: 0,
            averageTransaction: 0,
            lastLogin: null,
            loginCount: 0,
            devices: [],
            spending: {}
        };
    }

    saveData() {
        localStorage.setItem('accountAnalytics', JSON.stringify(this.data));
    }

    recordTransaction(amount, category = 'other') {
        this.data.totalTransactions++;
        this.data.totalSpent += amount;
        this.data.averageTransaction = this.data.totalSpent / this.data.totalTransactions;
        
        if (!this.data.spending[category]) {
            this.data.spending[category] = 0;
        }
        this.data.spending[category] += amount;
        
        this.saveData();
    }

    recordLogin(deviceInfo) {
        this.data.lastLogin = new Date().toISOString();
        this.data.loginCount++;
        
        const existingDevice = this.data.devices.find(d => d.info === deviceInfo);
        if (existingDevice) {
            existingDevice.lastLogin = new Date().toISOString();
        } else {
            this.data.devices.push({
                info: deviceInfo,
                loginCount: 1,
                lastLogin: new Date().toISOString()
            });
        }
        
        this.saveData();
    }

    getSpendingReport() {
        return this.data.spending;
    }

    getAccountSummary() {
        return {
            totalTransactions: this.data.totalTransactions,
            totalSpent: this.data.totalSpent,
            averageTransaction: this.data.averageTransaction.toFixed(2),
            lastLogin: this.data.lastLogin,
            loginCount: this.data.loginCount,
            deviceCount: this.data.devices.length
        };
    }
}

// ============== GLOBAL INSTANCES ==============
const currencyManager = new CurrencyManager();
const calendar = new BankingCalendar();
const serviceChannels = new ServiceChannelManager();
const transactionLimits = new TransactionLimits();
const notificationManager = new NotificationManager();
const securitySettings = new SecuritySettings();
const analytics = new AccountAnalytics();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CurrencyManager,
        BankingCalendar,
        ServiceChannelManager,
        TransactionLimits,
        NotificationManager,
        SecuritySettings,
        AccountAnalytics,
        currencyManager,
        calendar,
        serviceChannels,
        transactionLimits,
        notificationManager,
        securitySettings,
        analytics
    };
}
