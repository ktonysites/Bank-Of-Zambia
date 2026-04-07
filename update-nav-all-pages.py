#!/usr/bin/env python3
import os
import re

# Pages that still need nav replacement
pages_to_update = [
    'payroll.html',
    'government-accounts.html',
    'transactions.html',
    'staff.html',
    'analytics.html',
    'service-channels.html',
    'settings.html'
]

def replace_mobile_nav(content):
    """Replace mobile sidebar nav content"""
    # Pattern to find and replace mobile nav content
    pattern = r'(<nav class="flex-1 overflow-y-auto py-6 px-4 space-y-6">)[\s\S]*?(</nav>\s*<div class="p-4 mt-auto border-t border-slate-800)'
    replacement = r'\1\n            <!-- Navigation populated by renderNavigation() -->\n        \2'
    return re.sub(pattern, replacement, content, count=1)

def replace_desktop_nav(content):
    """Replace desktop sidebar nav content"""
    # Pattern for desktop nav content
    pattern = r'(<div class="flex-1 overflow-y-auto py-6 px-4 space-y-[0-9]">)[\s\S]*?(<div class="p-4 border-t border-slate-800 bg-\[#0B0F19\]">)'
    replacement = r'\1\n            <nav>\n                <!-- Navigation populated by renderNavigation() -->\n            </nav>\n        \2'
    return re.sub(pattern, replacement, content, count=1)

count = 0
for page in pages_to_update:
    filepath = os.path.join(".", page)
    if not os.path.exists(filepath):
        print(f"⚠️  {page} not found")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Try to replace mobile nav
    content = replace_mobile_nav(content)
    
    # Try to replace desktop nav  
    content = replace_desktop_nav(content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Updated {page}")
        count += 1
    else:
        print(f"⚠️  Could not update {page} - nav structure may differ")

print(f"\n✨ Updated {count}/{len(pages_to_update)} pages")
