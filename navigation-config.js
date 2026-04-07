/**
 * CENTRALIZED NAVIGATION CONFIGURATION
 * Handles dynamic rendering of sidebars for both Customer and Admin portals.
 */

const NAVIGATION_CONFIG = {
    // ---------------------------------------------------------
    // CUSTOMER PORTAL CONFIGURATION
    // ---------------------------------------------------------
    customer: {
        navItems: [
            { href: 'dashboard.html', icon: 'ph-squares-four', label: 'Dashboard' },
            { href: 'transfers.html', icon: 'ph-arrows-left-right', label: 'Transfers & Payments' },
            { href: 'wallet.html', icon: 'ph-wallet', label: 'Wallet & Cards' },
            { href: 'statements.html', icon: 'ph-file-text', label: 'Statements' },
            { href: 'calendar.html', icon: 'ph-calendar', label: 'Calendar' },
            { href: 'settings.html', icon: 'ph-gear', label: 'Settings' }
        ],
        footerItems: [
            { href: 'service-channels.html', icon: 'ph-sliders', label: 'Service Channels' },
            { href: 'index.html', icon: 'ph-sign-out', label: 'Sign Out', isSignOut: true }
        ]
    },
    
    // ---------------------------------------------------------
    // ADMIN PORTAL CONFIGURATION (BOZ CORE)
    // ---------------------------------------------------------
    admin: {
        navGroups: [
            {
                title: 'Dashboard',
                items: [
                    { href: 'admin-dashboard.html', icon: 'ph-squares-four', label: 'Overview' }
                ]
            },
            {
                title: 'Banking Core',
                items: [
                    { href: 'service-channels.html', icon: 'ph-sliders', label: 'Service Channels' },
                    { href: 'users.html', icon: 'ph-users', label: 'User Accounts', useFillIcon: true },
                    { href: 'loans.html', icon: 'ph-hand-coins', label: 'Loan Book' },
                    { href: 'transactions.html', icon: 'ph-list-dashes', label: 'Ledger & Txns', useFillIcon: true },
                    { href: 'cheques.html', icon: 'ph-money', label: 'Cheque Operations' } // NEW
                ]
            },
            {
                title: 'Internal Operations',
                items: [
                    { href: 'payroll.html', icon: 'ph-briefcase', label: 'Payroll Engine' },
                    { href: 'calendar.html', icon: 'ph-calendar-blank', label: 'Systems Calendar' },
                    { href: 'staff.html', icon: 'ph-identification-badge', label: 'Staff Directory' }
                ]
            },
            {
                title: 'Government & Entities',
                items: [
                    { href: 'government-accounts.html', icon: 'ph-bank', label: 'Government Accounts' }
                ]
            },
            {
                title: 'System Intelligence',
                items: [
                    { href: 'analytics.html', icon: 'ph-chart-line-up', label: 'Analytics & Reports' },
                    { href: 'settings.html', icon: 'ph-gear', label: 'Platform Settings' }
                ]
            }
        ],
        footerItems: [
            { href: 'index.html', icon: 'ph-sign-out', label: 'Sign Out', isSignOut: true }
        ]
    }
};

/**
 * Initialize and inject navigation into the page
 * Usage: renderNavigation('admin', 'users.html');
 */
function renderNavigation(portalType = 'customer', currentPage = '') {
    const config = NAVIGATION_CONFIG[portalType];
    if (!config) {
        console.error(`Navigation Error: Unknown portal type '${portalType}'`);
        return;
    }

    // Identify DOM targets
    const mobileNav = document.getElementById('mobileNav');
    const desktopNav = document.getElementById('desktopNav');
    const mobileFooter = document.getElementById('mobileFooter');
    const desktopFooter = document.getElementById('desktopFooter');
    const mobileFooterNav = document.getElementById('mobileFooterNav'); // Bottom nav on mobile

    let navHtml = '';

    // ==========================================
    // 1. BUILD ADMIN NAVIGATION (GROUPED)
    // ==========================================
    if (portalType === 'admin') {
        config.navGroups.forEach(group => {
            navHtml += `
                <div class="mb-6">
                    <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-4">${group.title}</p>
                    <div class="space-y-1">
            `;
            
            group.items.forEach(item => {
                const isActive = currentPage === item.href;
                
                // Admin Active/Inactive Styling
                const activeClasses = isActive 
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 shadow-sm' 
                    : 'border border-transparent hover:bg-slate-800/50 hover:text-white text-slate-400';
                
                const iconStyle = (item.useFillIcon || isActive) ? 'ph-fill' : 'ph-bold';
                const textWeight = isActive ? 'font-bold' : 'font-semibold';

                navHtml += `
                    <a href="${item.href}" class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group interactive-press ${activeClasses}">
                        <i class="${iconStyle} ${item.icon} text-xl ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400'}"></i>
                        <span class="text-sm ${textWeight} flex-1">${item.label}</span>
                    </a>
                `;
            });
            
            navHtml += `</div></div>`;
        });
    } 
    
    // ==========================================
    // 2. BUILD CUSTOMER NAVIGATION (FLAT)
    // ==========================================
    else {
        navHtml += '<div class="space-y-1">';
        config.navItems.forEach(item => {
            const isActive = currentPage === item.href;
            
            // Customer Active/Inactive Styling
            const activeClasses = isActive 
                ? 'bg-blue-600/10 text-blue-600 border-l-2 border-blue-600' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white';
            
            const textWeight = isActive ? 'font-bold' : 'font-medium';

            navHtml += `
                <a href="${item.href}" class="flex items-center space-x-3 px-4 py-3.5 rounded-xl transition interactive-press ${activeClasses}">
                    <i class="ph ${item.icon} text-xl ${isActive ? 'text-blue-600' : ''}"></i>
                    <span class="${textWeight}">${item.label}</span>
                </a>
            `;
        });
        navHtml += '</div>';
    }

    // Inject Navigation HTML
    if (desktopNav) desktopNav.innerHTML = navHtml;
    if (mobileNav) mobileNav.innerHTML = navHtml;

    // ==========================================
    // 3. BUILD FOOTERS
    // ==========================================
    let footerHtml = '';
    
    config.footerItems.forEach(item => {
        if (item.isSignOut) {
            footerHtml += `
                <a href="${item.href}" class="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl hover:bg-red-500/10 text-red-400/80 hover:text-red-400 transition text-sm font-bold interactive-press mt-2">
                    <i class="ph-bold ${item.icon} text-lg"></i>
                    <span>${item.label}</span>
                </a>
            `;
        } else {
            footerHtml += `
                <a href="${item.href}" class="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white transition interactive-press mb-2 text-slate-400">
                    <i class="ph ${item.icon} text-xl"></i>
                    <span class="text-sm font-semibold">${item.label}</span>
                </a>
            `;
        }
    });

    if (mobileFooter) mobileFooter.innerHTML = footerHtml;
    
    if (desktopFooter) {
        // If it's the admin portal, we inject the User Profile widget above the sign out button
        if (portalType === 'admin') {
            desktopFooter.innerHTML = `
                <div class="bg-slate-800/40 p-4 rounded-2xl flex items-center space-x-3 mb-4 cursor-pointer hover:bg-slate-800 transition">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">TK</div>
                    <div class="overflow-hidden flex-1">
                        <p class="text-xs font-bold text-white truncate">Tony Ken</p>
                        <p class="text-[10px] text-slate-500 truncate">Senior Administrator</p>
                    </div>
                </div>
                ${footerHtml}
            `;
        } else {
            desktopFooter.innerHTML = footerHtml;
        }
    }

    // ==========================================
    // 4. BUILD MOBILE BOTTOM NAV
    // ==========================================
    if (mobileFooterNav) {
        let bottomNavHtml = '';
        if (portalType === 'admin') {
            const adminBottomItems = [
                { href: 'admin-dashboard.html', icon: 'ph-squares-four', label: 'Dashboard' },
                { href: 'users.html', icon: 'ph-users', label: 'Users' },
                { href: 'transactions.html', icon: 'ph-list-dashes', label: 'Ledger' },
                { href: 'cheques.html', icon: 'ph-money', label: 'Cheques' } // Added cheques to bottom nav
            ];
            
            adminBottomItems.forEach(item => {
                const isActive = currentPage === item.href;
                const activeClasses = isActive 
                    ? 'text-indigo-600 border-t-2 border-indigo-600 bg-indigo-50/50' 
                    : 'text-slate-500 hover:text-indigo-600';
                
                const iconStyle = isActive ? 'ph-fill' : 'ph-bold';
                
                bottomNavHtml += `
                    <a href="${item.href}" class="flex flex-col items-center justify-center w-full h-full transition-colors ${activeClasses}">
                        <i class="${iconStyle} ${item.icon} text-2xl"></i>
                        <span class="text-[10px] font-bold mt-1">${item.label}</span>
                    </a>
                `;
            });
            
            // Add Menu Button
            bottomNavHtml += `
                <button onclick="toggleMobileMenu()" class="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-indigo-600 transition-colors">
                    <i class="ph-bold ph-list text-2xl"></i>
                    <span class="text-[10px] font-bold mt-1">Menu</span>
                </button>
            `;
        } else {
            const customerBottomItems = [
                { href: 'dashboard.html', icon: 'ph-squares-four', label: 'Home' },
                { href: 'transfers.html', icon: 'ph-arrows-left-right', label: 'Send' },
                { href: 'wallet.html', icon: 'ph-wallet', label: 'Wallet' },
                { href: 'statements.html', icon: 'ph-file-text', label: 'History' }
            ];
            
            customerBottomItems.forEach(item => {
                const isActive = currentPage === item.href;
                const activeClasses = isActive 
                    ? 'text-blue-600' 
                    : 'text-slate-500 hover:text-blue-600';
                    
                const wrapperActive = isActive
                    ? 'bg-blue-50 text-blue-600 -translate-y-2 shadow-sm'
                    : '';
                
                const iconStyle = isActive ? 'ph-fill' : 'ph';
                
                bottomNavHtml += `
                    <a href="${item.href}" class="flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${activeClasses}">
                        <div class="w-12 h-8 rounded-full flex items-center justify-center mb-1 transition-all duration-300 ${wrapperActive}">
                            <i class="${iconStyle} ${item.icon} text-2xl"></i>
                        </div>
                        <span class="text-[10px] font-medium tracking-wide ${isActive ? 'font-bold' : ''}">${item.label}</span>
                    </a>
                `;
            });
        }
        
        mobileFooterNav.innerHTML = bottomNavHtml;
    }
}
