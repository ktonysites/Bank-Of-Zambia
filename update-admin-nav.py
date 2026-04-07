#!/usr/bin/env python3
"""
Script to update all admin pages to use centralized navigation from navigation-config.js
"""

import os
import re

# List of admin pages to update (excluding admin-dashboard.html and loans.html which are already done)
admin_pages = [
    'users.html',
    'payroll.html',
    'government-accounts.html',
    'transactions.html',
    'staff.html',
    'analytics.html',
    'service-channels.html',
    'settings.html'
]

base_path = r"c:\Users\Administrator\OneDrive\INTERNET BANKING"

def update_admin_page(filename):
    """Update an admin page to use centralized navigation"""
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"⚠️  File not found: {filepath}")
        return False
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Replace mobile sidebar nav content (between <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-6"> and </nav>)
    # This pattern finds the nav with organized sections and replaces it with a simple placeholder
    nav_pattern = r'(<aside id="mobileSidebar"[\s\S]*?<nav class="flex-1 overflow-y-auto py-6 px-4 space-y-6">)[\s\S]*?(</nav>\s*<div class="p-4 mt-auto border-t border-slate-800)'
    
    nav_replacement = r'\1\n            <!-- Navigation populated by renderNavigation() -->\n        \2'
    
    content = re.sub(nav_pattern, nav_replacement, content)
    
    # 2. Replace desktop sidebar nav content
    desktop_nav_pattern = r'(<aside class="w-64 bg-\[#0B0F19\][\s\S]*?<div class="flex-1 overflow-y-auto py-6 px-4 space-y-8">)[\s\S]*?(</div>\s*<div class="p-4 border-t border-slate-800 bg-\[#0B0F19\]">)'
    
    desktop_nav_replacement = r'\1\n            <nav>\n                <!-- Navigation populated by renderNavigation() -->\n            </nav>\n        \2'
    
    content = re.sub(desktop_nav_pattern, desktop_nav_replacement, content)
    
    # 3. Add renderNavigation initialization after closeMobileMenu function
    init_pattern = r'(function closeMobileMenu\(\)[\s\S]*?\n        }\s*\n)'
    
    init_code = r'''\1
        // Initialize navigation from centralized config
        document.addEventListener('DOMContentLoaded', function() {
            renderNavigation('admin', ''' + f"'{filename}'" + r''');
        });
'''
    
    # Only add if not already present
    if "renderNavigation('admin'" not in content:
        content = re.sub(init_pattern, init_code, content)
    
    if content == original_content:
        print(f"⚠️  No changes made to {filename} (nav structure may differ)")
        return False
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Updated {filename}")
    return True

# Update all admin pages
print("🔄 Updating admin pages with centralized navigation...\n")

success_count = 0
for page in admin_pages:
    if update_admin_page(page):
        success_count += 1

print(f"\n✨ Complete! Updated {success_count}/{len(admin_pages)} pages")
