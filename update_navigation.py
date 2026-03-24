#!/usr/bin/env python3
"""
Updates all HTML pages to use new navigation structure and premium CSS
"""
import glob
import re

OLD_NAV_PATTERN = r'<section class="hero-section[^"]*">\s*<div class="nav-component">.*?</div>\s*<div class="hamburger-menu".*?</div>\s*</div>'
OLD_CSS_PATTERN = r'<link rel="stylesheet" href="\./index\.css" />'

NEW_HEADER = '''<header id="navbar">
        <nav>
            <div class="logo">AR EVENTS</div>
            
            <ul class="nav-links" id="navLinks">
                <li><a href="index.html">Home</a></li>
                <li class="nav-dropdown">
                    <a href="index.html#services" class="dropdown-toggle">Services <i class="fas fa-chevron-down"></i></a>
                    <ul class="dropdown-menu">
                        <li><a href="wedding-planning.html">Wedding Planning</a></li>
                        <li><a href="corporate-events.html">Corporate Events</a></li>
                        <li><a href="birthday-parties.html">Birthday Parties</a></li>
                        <li><a href="cultural-events.html">Cultural Events</a></li>
                        <li><a href="college-festivals.html">College Festivals</a></li>
                        <li><a href="award-ceremonies.html">Award Ceremonies</a></li>
                    </ul>
                </li>
                <li><a href="portfolio.html">Portfolio</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="pricing.html">Pricing</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="book.html" class="btn-book-nav">Book Now</a></li>
            </ul>
            
            <div class="hamburger-menu" id="hamburger" onclick="toggleMobileNav()">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
        </nav>
    </header>'''

NEW_CSS = '''<link rel="stylesheet" href="./index.css" />
    <link rel="stylesheet" href="./styles-premium.css" />'''

FILES_TO_UPDATE = [
    'pricing.html',
    'book.html', 
    'faq.html',
    'gallery.html',
    'testimonials.html',
    'event.html',
    'eventcard.html'
]

def update_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Update CSS links
        if '<link rel="stylesheet" href="./index.css" />' in content and 'styles-premium.css' not in content:
            content = content.replace(
                '    <link rel="stylesheet" href="./index.css" />',
                NEW_CSS,
                1
            )
        
        # Fix the navbar for these pages - they have nav-component div with specific structure
        # We need to replace the old nav-component section with the new header
        
        # Pattern for pricing, faq, gallery, etc
        old_nav = r'<div class="nav-component">\s*<div class="nav-logo"></div>\s*<div class="nav-links">.*?</div>\s*<div class="hamburger-menu".*?</div>\s*</div>'
        
        if re.search(old_nav, content, re.DOTALL):
            # Replace the old nav-component structure
            content = re.sub(
                old_nav,
                f'<!-- New Header -->\n    {NEW_HEADER}\n\n    <section class="hero-section">',
                content,
                count=1,
                flags=re.DOTALL
            )
        
        if content != original:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Updated {filename}")
            return True
        else:
            print(f"  No changes needed for {filename}")
            return False
    except Exception as e:
        print(f"✗ Error updating {filename}: {e}")
        return False

if __name__ == '__main__':
    print("Updating HTML pages with new navigation structure...")
    print("=" * 60)
    
    updated = 0
    for filename in FILES_TO_UPDATE:
        if update_file(filename):
            updated += 1
    
    print("=" * 60)
    print(f"Updated {updated}/{len(FILES_TO_UPDATE)} files")
