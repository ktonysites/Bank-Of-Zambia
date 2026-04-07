# CENTRALIZED NAVIGATION SETUP GUIDE

## Problem Solved ✅
Instead of updating navigation in EVERY page, you now only update **one file**: `navigation-config.js`

## How It Works

### Step 1: Include the Navigation Configuration File
Add this line in the `<head>` section of each HTML page (before closing `</head>`):

```html
<script src="navigation-config.js"></script>
```

### Step 2: Update Navigation on Page Load
Add this script at the bottom of each page (before closing `</body>`):

```html
<script>
    // Call this with your portal type ('customer' or 'admin') and current page filename
    document.addEventListener('DOMContentLoaded', () => {
        renderNavigation('customer', 'dashboard.html'); // Change filename to match current page
    });
</script>
```

## Example for Each Page

**dashboard.html:**
```html
<script>
    renderNavigation('customer', 'dashboard.html');
</script>
```

**transfers.html:**
```html
<script>
    renderNavigation('customer', 'transfers.html');
</script>
```

**wallet.html:**
```html
<script>
    renderNavigation('customer', 'wallet.html');
</script>
```

**settings.html:**
```html
<script>
    renderNavigation('customer', 'settings.html');
</script>
```

**borrow.html:**
```html
<script>
    renderNavigation('customer', 'borrow.html');
</script>
```

## To Add a New Navigation Item

Open `navigation-config.js` and update `NAVIGATION_CONFIG`:

```javascript
customer: {
    mobileItems: [
        { href: 'dashboard.html', icon: 'ph-squares-four', label: 'Dashboard', id: 'dashboard' },
        // Add new item here:
        { href: 'new-page.html', icon: 'ph-icon-name', label: 'New Page', id: 'new-page' }
    ],
    // ... repeat for desktopItems
}
```

## To Change Branding

Edit the `branding` object in `NAVIGATION_CONFIG`:

```javascript
branding: {
    bankName: 'Your Bank Name',
    shortName: 'YBN',
    logoGradient: 'from-blue-600 to-blue-400'
}
```

## Benefits

✅ **One Source of Truth** - Update navigation once, applies everywhere  
✅ **Consistent Navigation** - All pages always match  
✅ **Easy Maintenance** - Add/remove items in one place  
✅ **Multiple Portals** - Support both customer and admin portals  
✅ **Active State Tracking** - Automatically highlights current page  

## Current Navigation Structure

### Customer Portal
- Dashboard → dashboard.html
- Transfers → transfers.html
- Wallet & Cards → wallet.html
- Statements → statements.html
- Borrow & Credit → borrow.html
- Settings → settings.html (footer)
- Sign Out → index.html (footer)

### Admin Portal (BOZ CORE)
- Overview → admin-dashboard.html
- User Accounts → users.html
- Loan Book → loans.html
- Payroll → payroll.html
- Sign Out → index.html (footer)
