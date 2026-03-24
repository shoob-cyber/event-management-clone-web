#!/usr/bin/env python3
"""
Update all service pages with standardized template structure
"""

import os

template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{service_title} Services in Muzaffarpur | AR Events & Wedding Planner</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="Professional {service_title_lower} services in Muzaffarpur, Bihar. Complete event management and planning. Make your {service_title_lower} unforgettable with AR Events.">
    <meta name="keyword" content="{service_keywords}">
    <meta name="theme-color" content="#D19C4A">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="{service_title} Services - AR Events & Wedding Planner">
    <meta property="og:description" content="Professional {service_title_lower} planning & management in Muzaffarpur, Bihar">
    <meta property="og:site_name" content="AR Events & Wedding Planner">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Premium CSS -->
    <link rel="stylesheet" href="styles-premium.css">
</head>
<body>
    <!-- ==========================================
         HEADER & NAVIGATION
         ========================================== -->
    <header id="navbar">
        <nav>
            <div class="logo">AR EVENTS</div>
            
            <ul class="nav-links" id="navLinks">
                <li><a href="index-new.html">Home</a></li>
                <li class="nav-dropdown">
                    <a href="index-new.html#services" class="dropdown-toggle">Services <i class="fas fa-chevron-down"></i></a>
                    <ul class="dropdown-menu">
                        <li><a href="wedding-planning.html">Wedding Planning</a></li>
                        <li><a href="corporate-events.html">Corporate Events</a></li>
                        <li><a href="birthday-parties.html">Birthday Parties</a></li>
                        <li><a href="cultural-events.html">Cultural Events</a></li>
                        <li><a href="college-festivals.html">College Festivals</a></li>
                        <li><a href="award-ceremonies.html">Award Ceremonies</a></li>
                    </ul>
                </li>
                <li><a href="index-new.html#portfolio">Portfolio</a></li>
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
    </header>

    <!-- ==========================================
         HERO SECTION - SERVICE PAGE
         ========================================== -->
    <section class="hero hero-service">
        <div class="hero-background"></div>
        
        <div class="hero-content">
            <h1 class="fade-in-up">{service_title}</h1>
            <p class="hero-tagline">{service_tagline}</p>
            <p class="hero-description">
                {service_description}
            </p>
            
            <div class="hero-cta-group">
                <a href="book.html" class="btn btn-primary">
                    <i class="fas fa-calendar-check"></i> Plan Your {service_title}
                </a>
                <a href="#process" class="btn btn-white">
                    <i class="fas fa-arrow-down"></i> See Our Process
                </a>
            </div>
        </div>
    </section>

    <!-- ==========================================
         ABOUT SECTION
         ========================================== -->
    <section class="container" style="padding: var(--space-3xl) var(--space-lg);">
        <div class="story" style="animation: fadeInUp 0.8s ease-out;">
            <div class="story-content fade-in-left">
                <h2 data-animate="fade-in-left">{service_heading}</h2>
                <p>
                    {service_intro}
                </p>
                <p>
                    From initial consultation to the grand finale, we handle every detail with precision and care. We believe in personalization and ensuring every element reflects your unique preferences and vision.
                </p>
                
                <div class="story-highlights">
                    <div class="highlight fade-in-left" style="animation-delay: 0.2s;">
                        <div class="highlight-icon"><i class="fas fa-check-circle"></i></div>
                        <div>
                            <h3>150+ Successful Events</h3>
                            <p>Diverse celebrations across all event categories.</p>
                        </div>
                    </div>
                    <div class="highlight fade-in-left" style="animation-delay: 0.4s;">
                        <div class="highlight-icon"><i class="fas fa-heart"></i></div>
                        <div>
                            <h3>100% Satisfaction Rate</h3>
                            <p>Your vision is our mission. We commit to excellence.</p>
                        </div>
                    </div>
                    <div class="highlight fade-in-left" style="animation-delay: 0.6s;">
                        <div class="highlight-icon"><i class="fas fa-handshake"></i></div>
                        <div>
                            <h3>Premium Partnerships</h3>
                            <p>Trusted vendors and artisans for luxury experiences.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="story-image fade-in-right image-depth overlay-dark" data-parallax>
                <img src="./assets/images/{service_image_folder}/{service_image}" alt="{service_title}" loading="lazy">
            </div>
        </div>
    </section>

    <!-- ==========================================
         WHAT WE OFFER - SERVICE FEATURES
         ========================================== -->
    <section style="background-color: var(--bg-light); padding: var(--space-3xl) var(--space-lg);">
        <div class="container">
            <h2 class="fade-in-up" style="text-align: center; margin-bottom: var(--space-xl);">What We Offer</h2>
            <p style="text-align: center; color: var(--secondary-gray); margin-bottom: var(--space-2xl); max-width: 700px; margin-left: auto; margin-right: auto;">
                Comprehensive {service_title_lower} services designed to bring your vision to life.
            </p>

            <div class="features-grid">
                {service_features}
            </div>
        </div>
    </section>

    <!-- ==========================================
         OUR PROCESS - 4 STEPS
         ========================================== -->
    <section id="process" style="padding: var(--space-3xl) var(--space-lg);">
        <div class="container">
            <h2 class="fade-in-up" style="text-align: center; margin-bottom: var(--space-xl);">Our Planning Process</h2>
            <p style="text-align: center; color: var(--secondary-gray); margin-bottom: var(--space-3xl); max-width: 700px; margin-left: auto; margin-right: auto;">
                A structured approach to creating your perfect experience.
            </p>

            <div class="process-timeline">
                <div class="process-step fade-in-up" style="animation-delay: 0.1s;">
                    <div class="step-number">01</div>
                    <h3>Initial Consultation</h3>
                    <p>We meet to understand your vision, budget, timeline, and preferences. This is where we get to know you and your dreams.</p>
                    <div class="step-icon"><i class="fas fa-comments"></i></div>
                </div>

                <div class="process-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>

                <div class="process-step fade-in-up" style="animation-delay: 0.2s;">
                    <div class="step-number">02</div>
                    <h3>Planning & Design</h3>
                    <p>Our team creates detailed plans, selects venues, vendors, and designs the aesthetic vision for your special day.</p>
                    <div class="step-icon"><i class="fas fa-pencil"></i></div>
                </div>

                <div class="process-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>

                <div class="process-step fade-in-up" style="animation-delay: 0.3s;">
                    <div class="step-number">03</div>
                    <h3>Preparation</h3>
                    <p>Regular check-ins, finalizations, confirmations, and preparations. We ensure every detail is perfect.</p>
                    <div class="step-icon"><i class="fas fa-tasks"></i></div>
                </div>

                <div class="process-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>

                <div class="process-step fade-in-up" style="animation-delay: 0.4s;">
                    <div class="step-number">04</div>
                    <h3>Celebration</h3>
                    <p>Our team manages everything on your event day, allowing you to celebrate with loved ones and create memories.</p>
                    <div class="step-icon"><i class="fas fa-star"></i></div>
                </div>
            </div>
        </div>
    </section>

    <!-- ==========================================
         PORTFOLIO / GALLERY SECTION
         ========================================== -->
    <section style="background-color: var(--bg-light); padding: var(--space-3xl) var(--space-lg);">
        <div class="container">
            <h2 class="fade-in-up" style="text-align: center; margin-bottom: var(--space-xl);">Our {service_gallery_title} Collections</h2>
            <p style="text-align: center; color: var(--secondary-gray); margin-bottom: var(--space-2xl); max-width: 700px; margin-left: auto; margin-right: auto;">
                Beautiful moments from memorable celebrations we've created.
            </p>

            <div class="portfolio-grid" style="margin-bottom: var(--space-2xl);">
                {portfolio_items}
            </div>
        </div>
    </section>

    <!-- ==========================================
         CTA SECTION
         ========================================== -->
    <section style="padding: var(--space-3xl) var(--space-lg);">
        <div class="container">
            <div style="background: linear-gradient(135deg, rgba(209, 156, 74, 0.1) 0%, rgba(81, 81, 82, 0.05) 100%); border: 1px solid rgba(209, 156, 74, 0.2); border-radius: var(--radius-2xl); padding: var(--space-3xl); text-align: center;">
                <h2 style="margin-bottom: var(--space-lg); color: var(--text-dark);">Ready to Plan Your Perfect {service_title}?</h2>
                <p style="color: var(--secondary-gray); margin-bottom: var(--space-2xl); font-size: 1.1rem; max-width: 600px; margin-left: auto; margin-right: auto;">
                    Let's create an unforgettable experience. Contact us today for a free consultation and let's bring your vision to life.
                </p>
                
                <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
                    <a href="book.html" class="btn btn-primary">Schedule Consultation</a>
                    <a href="https://wa.me/919006532324" class="btn btn-white" target="_blank">
                        <i class="fab fa-whatsapp"></i> WhatsApp Us
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- ==========================================
         FOOTER
         ========================================== -->
    <footer class="footer-enhanced" style="margin-top: var(--space-3xl);">
        <div class="footer-container">
            <div class="footer-column footer-about">
                <div class="footer-logo-section">
                    <h3 style="color: var(--primary-gold); font-size: 1.5rem; margin-bottom: 1rem;">AR EVENTS</h3>
                </div>
                <p class="footer-description">
                    A Pioneer in the Event Management & Wedding Planner Field From Muzaffarpur, Bihar. Creating unforgettable moments since 2013.
                </p>
                <div class="footer-social">
                    <a href="https://wa.me/919006532324" target="_blank" aria-label="WhatsApp" class="social-icon">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                    <a href="https://youtube.com/@areventandweddingplanner33" target="_blank" aria-label="YouTube" class="social-icon">
                        <i class="fab fa-youtube"></i>
                    </a>
                    <a href="https://www.facebook.com/people/AR-event-and-wedding-planner/100064093007551/" target="_blank" aria-label="Facebook" class="social-icon">
                        <i class="fab fa-facebook"></i>
                    </a>
                    <a href="https://www.instagram.com/ar_event_and_wedding_planner/" target="_blank" aria-label="Instagram" class="social-icon">
                        <i class="fab fa-instagram"></i>
                    </a>
                </div>
            </div>

            <div class="footer-column footer-services">
                <h3 class="footer-heading">Our Services</h3>
                <ul class="footer-list">
                    <li><a href="wedding-planning.html">Wedding Planning</a></li>
                    <li><a href="corporate-events.html">Corporate Events</a></li>
                    <li><a href="birthday-parties.html">Birthday Parties</a></li>
                    <li><a href="cultural-events.html">Cultural Events</a></li>
                    <li><a href="college-festivals.html">College Festivals</a></li>
                    <li><a href="award-ceremonies.html">Award Ceremonies</a></li>
                </ul>
            </div>

            <div class="footer-column footer-quick-links">
                <h3 class="footer-heading">Quick Links</h3>
                <ul class="footer-list">
                    <li><a href="index-new.html">Home</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="pricing.html">Pricing</a></li>
                    <li><a href="faq.html">FAQ</a></li>
                    <li><a href="contact.html">Contact Us</a></li>
                </ul>
            </div>

            <div class="footer-column footer-contact">
                <h3 class="footer-heading">Contact Us</h3>
                <ul class="footer-contact-list">
                    <li>
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Nirala Nagar, P&T chowk<br />Muzaffarpur - 842001, Bihar</span>
                    </li>
                    <li>
                        <i class="fas fa-phone"></i>
                        <a href="tel:+919006532324">+91-9006532324</a>
                    </li>
                    <li>
                        <i class="fas fa-envelope"></i>
                        <a href="mailto:areventsol.2013@gmail.com">areventsol.2013@gmail.com</a>
                    </li>
                    <li>
                        <i class="fas fa-clock"></i>
                        <span>Mon - Sun: 9:00 AM - 9:00 PM</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="footer-bottom-content">
                <p>© 2025 AR Event and Wedding Planner. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- ==========================================
         FLOATING BUTTONS
         ========================================== -->
    <div class="floating-buttons">
        <a href="https://wa.me/919006532324" class="floating-btn whatsapp-btn" data-tooltip="Chat on WhatsApp" aria-label="Chat on WhatsApp">
            <i class="fab fa-whatsapp"></i>
        </a>
        <a href="tel:+919006532324" class="floating-btn call-btn" data-tooltip="Call Us" aria-label="Call Us">
            <i class="fas fa-phone"></i>
        </a>
    </div>

    <!-- Scripts -->
    <script src="scripts-premium.js"></script>
    <script>
        // Ensure active nav link
        const links = document.querySelectorAll('.nav-links a');
        const currentPage = window.location.pathname.split('/').pop() || 'index-new.html';
        
        links.forEach(link => {
            if (link.getAttribute('href').includes(currentPage) || 
                (currentPage === '' && link.getAttribute('href') === 'index-new.html')) {
                link.classList.add('active');
            }
        });
    </script>

    <!-- Schema Markup -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "AR Events & Wedding Planner",
        "description": "Professional {service_title_lower} planning and event management services",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Nirala Nagar, P&T chowk",
            "addressLocality": "Muzaffarpur",
            "addressRegion": "Bihar",
            "postalCode": "842001",
            "addressCountry": "IN"
        },
        "telephone": "+91-9006532324",
        "email": "areventsol.2013@gmail.com",
        "url": "https://arevents.in",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "100"
        }
    }
    </script>
</body>
</html>'''

# Service configurations
services = {
    'wedding-planning.html': {
        'title': 'Wedding Planning',
        'title_lower': 'wedding',
        'tagline': 'Turning Your Dream Wedding Into a Grand Celebration',
        'heading': 'Your Perfect Wedding Awaits',
        'intro': 'At AR Events & Wedding Planner, we understand that your wedding is more than just an event—it\'s the beginning of your forever story. With over a decade of experience in creating magical moments, we specialize in transforming dreams into reality through impeccable planning and creative excellence.',
        'description': 'From intimate ceremonies to grand celebrations, we bring your vision to life with meticulous planning, creative design, and flawless execution.',
        'image_folder': 'Wedding',
        'image': '475159695_1097850219043563_871709032766323656_n.webp',
        'gallery_title': 'Wedding',
        'keywords': 'wedding planner, wedding planning, marriage planner, wedding organizer, wedding decoration, Muzaffarpur',
    },
    'corporate-events.html': {
        'title': 'Corporate Events',
        'title_lower': 'corporate event',
        'tagline': 'Professional Excellence Meets Creative Innovation',
        'heading': 'Elevate Your Corporate Image',
        'intro': 'Corporate events demand precision, professionalism, and creativity. At AR Events & Wedding Planner, we specialize in creating impactful corporate experiences that strengthen team bonds, impress clients, and leave lasting impressions. From intimate boardroom meetings to grand galas, we manage every detail.',
        'description': 'From product launches to annual galas, we create corporate experiences that impress and inspire your stakeholders.',
        'image_folder': 'Corporate',
        'image': 'orange-blue-white-themed-decoration-main_1667823481.webp',
        'gallery_title': 'Corporate',
        'keywords': 'corporate events, corporate management, business events, corporate gala, Muzaffarpur',
    },
    'birthday-parties.html': {
        'title': 'Birthday Celebrations',
        'title_lower': 'birthday celebration',
        'tagline': 'Making Every Birthday Moment Unforgettable',
        'heading': 'Celebrate in Style',
        'intro': 'Birthdays are special milestones that deserve to be celebrated in style. Whether it\'s a milestone birthday, a kids\' party, or an adult celebration, we bring creativity and joy to make your day truly memorable. Our team specializes in creating vibrant, personalized celebrations.',
        'description': 'From themed kids\' parties to milestone celebrations, we create birthday experiences that blend fun, creativity, and personalization.',
        'image_folder': 'Birthday Party',
        'image': 'pexels-photo-1126490.webp',
        'gallery_title': 'Birthday',
        'keywords': 'birthday party, birthday planner, kids birthday, birthday decoration, Muzaffarpur',
    },
    'cultural-events.html': {
        'title': 'Cultural Events',
        'title_lower': 'cultural event',
        'tagline': 'Honoring Tradition with Modern Elegance',
        'heading': 'Celebrate Your Heritage',
        'intro': 'Cultural events deserve to be celebrated with authenticity and respect. At AR Events & Wedding Planner, we understand the importance of preserving traditions while adding modern flair. We specialize in organizing cultural celebrations that honor your heritage and create lasting memories.',
        'description': 'From traditional festivals to cultural celebrations, we honor heritage while creating modern, memorable experiences.',
        'image_folder': 'God',
        'image': 'pexels-photo-3962286.webp',
        'gallery_title': 'Cultural',
        'keywords': 'cultural events, festival planning, tradition, heritage, Muzaffarpur',
    },
    'college-festivals.html': {
        'title': 'College Festivals',
        'title_lower': 'college festival',
        'tagline': 'Energizing Campus Spirit and Talent',
        'heading': 'Create Unforgettable Campus Moments',
        'intro': 'College festivals are all about energy, innovation, and bringing students together. We specialize in creating high-impact college events that celebrate talent, foster community, and generate buzz. From planning to execution, we ensure your festival creates memories.',
        'description': 'From talent shows to annual college festivals, we create high-energy events that celebrate youth, talent, and campus spirit.',
        'image_folder': 'Stage',
        'image': 'pexels-photo-3708233.webp',
        'gallery_title': 'College Festival',
        'keywords': 'college festival, college events, campus events, talent show, Muzaffarpur',
    },
    'award-ceremonies.html': {
        'title': 'Award Ceremonies',
        'title_lower': 'award ceremony',
        'tagline': 'Recognizing Excellence with Prestige',
        'heading': 'Honor Achievement in Style',
        'intro': 'Award ceremonies celebrate excellence and recognize achievements. These prestigious events require meticulous planning, professional execution, and attention to detail. We specialize in creating ceremonies that honor your recipients and impress your audience.',
        'description': 'From recognition ceremonies to prestigious award events, we create ceremonies that honor excellence and celebrate achievements.',
        'image_folder': 'Award',
        'image': 'istockphoto-1319849486-612x612.webp',
        'gallery_title': 'Award',
        'keywords': 'award ceremony, award event, recognition event, awards management, Muzaffarpur',
    },
}

# Generate feature boxes
def generate_features(service_title):
    features_template = '''<div class="feature-box fade-in-up" style="animation-delay: {delay}s;">
                    <div class="feature-icon"><i class="fas fa-{icon}"></i></div>
                    <h3>{feature_title}</h3>
                    <p>{feature_desc}</p>
                </div>'''
    
    features_data = [
        ('creative', 'Creative Vision', 'Custom designs and concepts tailored to your preferences.'),
        ('check-double', 'Attention to Detail', 'Every element is meticulously coordinated for perfection.'),
        ('network-wired', 'Trusted Vendors', 'Partnerships with premium service providers.'),
        ('headset', '24/7 Support', 'Dedicated team available before, during, and after your event.'),
        ('star', 'Premium Quality', 'We source the finest materials and services.'),
        ('bolt', 'Stress-Free Experience', 'Leave the logistics to us while you enjoy the moment.'),
    ]
    
    features_html = ''
    for i, (icon, title, desc) in enumerate(features_data):
        features_html += features_template.format(delay=0.1 * (i + 1), icon=icon, feature_title=title, feature_desc=desc)
        if i < len(features_data) - 1:
            features_html += '\n                '
    
    return features_html

# Generate portfolio items
def generate_portfolio(image_folder):
    portfolio_template = '''<div class="portfolio-item fade-in-up stagger-{stagger} tilt-on-hover lightbox-trigger" data-alt="{alt}" style="animation-delay: {delay}s;">
                    <img src="./assets/images/{image_folder}/{image}" alt="{alt_text}" class="portfolio-item-image" loading="lazy">
                    <div class="portfolio-item-overlay">
                        <div class="portfolio-item-info">
                            <h3>{title}</h3>
                            <p><i class="fas fa-search-plus"></i> {category}</p>
                        </div>
                    </div>
                </div>'''
    
    images = [
        ('475159695_1097850219043563_871709032766323656_n.webp', 'Event Showcase 1', 'Event Moment 1'),
        ('474687434_1095392799289305_5414725815205043615_n.webp', 'Event Showcase 2', 'Event Moment 2'),
        ('474704237_1095392699289315_5300054725633379556_n.webp', 'Event Showcase 3', 'Event Moment 3'),
        ('475371625_1097849975710254_5933682938701390008_n.webp', 'Event Showcase 4', 'Event Moment 4'),
    ]
    
    portfolio_html = ''
    for i, (img, alt, title) in enumerate(images):
        if i > 0:
            portfolio_html += '\n                '
        portfolio_html += portfolio_template.format(
            stagger=(i % 5) + 1,
            delay=0.1 * (i + 1),
            image_folder=image_folder,
            image=img,
            alt=alt,
            alt_text=alt,
            title=title,
            category=image_folder
        )
    
    return portfolio_html

# Update each service page
for filename, config in services.items():
    content = template.format(
        service_title=config['title'],
        service_title_lower=config['title_lower'],
        service_tagline=config['tagline'],
        service_heading=config['heading'],
        service_intro=config['intro'],
        service_description=config['description'],
        service_image_folder=config['image_folder'],
        service_image=config['image'],
        service_gallery_title=config['gallery_title'],
        service_keywords=config['keywords'],
        service_features=generate_features(config['title']),
        portfolio_items=generate_portfolio(config['image_folder']),
    )
    
    filepath = filename
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✓ Updated {filename}")

print("\n✓ All service pages updated successfully!")
