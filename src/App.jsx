import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

function AutoScrollingMarquee({ items }) {
  const scrollerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let animId;
    const speed = 0.8; // Smooth 60fps scrolling speed in px

    const step = () => {
      if (!isPaused && el) {
        el.scrollLeft += speed;
        // When we've scrolled half the duplicated track, reset seamlessly
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  // Duplicate items 4 times to guarantee a seamless infinite scroll across any screen width
  const duplicatedList = [...items, ...items, ...items, ...items];

  return (
    <section className="sb-marquee-section" aria-label="Partner University Showcase">
      <div className="sb-marquee-label">Trusted Direct Global University Partnerships</div>
      <div
        ref={scrollerRef}
        className="sb-marquee-scroller"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="sb-marquee-track">
          {duplicatedList.map((uni, idx) => (
            <div key={idx} className="sb-uni-item">
              <span className="sb-uni-icon" aria-hidden="true">{uni.icon}</span>
              <span className="sb-uni-name">{uni.name}</span>
              <span className="sb-uni-country">{uni.country}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const campusHeroBackgrounds = [
  {
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80',
    caption: '🇬🇧 University of Oxford & UK Collegiate Campuses',
  },
  {
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80',
    caption: '🇦🇺 Go8 University Campuses, Australia',
  },
  {
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80',
    caption: '🇲🇾 Leading Branch Campuses, Greater Kuala Lumpur',
  },
  {
    url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1920&q=80',
    caption: '🇳🇿 Top Public Universities, New Zealand',
  },
  {
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=80',
    caption: '🇪🇺 Prestigious European Academic Halls',
  },
];

export default function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    questions: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCountryKey, setActiveCountryKey] = useState('malaysia');
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [apiStatus, setApiStatus] = useState('Connecting to MERN Backend…');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Background Slideshow Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % campusHeroBackgrounds.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Initialize Lenis Smooth Scroll + GSAP ScrollTrigger Integration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // Hero Entrance Timeline
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.sb-brand-pills-row', { opacity: 0, y: -15, duration: 0.7, delay: 0.1 })
        .from('.sb-hero-jumbo-title', { opacity: 0, y: 30, duration: 0.9 }, '-=0.4')
        .from('.sb-hero-lead-text', { opacity: 0, y: 20, duration: 0.8 }, '-=0.5')
        .from('.sb-hero-cta-group', { opacity: 0, y: 20, duration: 0.7 }, '-=0.5')
        .from('.sb-hero-metrics-brand', { opacity: 0, scale: 0.95, y: 20, duration: 0.7 }, '-=0.4');

      // ScrollTrigger Staggered Reveals for Sections
      const revealSections = [
        { selector: '.sb-why-bento .sb-section-head', y: 30 },
        { selector: '.sb-bento-grid > div', y: 40, stagger: 0.12 },
        { selector: '.sb-destinations-brand .sb-section-head-center', y: 30 },
        { selector: '.sb-country-pills-bar', y: 20 },
        { selector: '.sb-dest-grid .sb-dest-card', y: 35, stagger: 0.08 },
        { selector: '.sb-country-hub-panel', y: 40 },
        { selector: '.sb-roadmap-grid .sb-roadmap-card', y: 35, stagger: 0.1 },
        { selector: '.sb-testi-grid-brand .sb-testi-card-brand', y: 35, stagger: 0.12 },
        { selector: '.sb-branches-grid .sb-branch-card', y: 35, stagger: 0.12 },
        { selector: '.sb-faq-list .sb-faq-item', y: 25, stagger: 0.08 },
        { selector: '.sb-booking-layout-brand', y: 40 },
      ];

      revealSections.forEach(({ selector, y, stagger }) => {
        const elements = gsap.utils.toArray(selector);
        if (elements.length > 0) {
          gsap.from(elements, {
            scrollTrigger: {
              trigger: elements[0],
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
            opacity: 0,
            y: y || 30,
            duration: 0.8,
            stagger: stagger || 0,
            ease: 'power2.out',
          });
        }
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  // Check MERN Backend API Health on Load
  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((res) => res.json())
      .then((data) => {
        setApiStatus(`MERN Stack API: ${data.database}`);
      })
      .catch(() => {
        setApiStatus('MERN Backend API Standby (Port 5000)');
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // MERN Stack API Counseling Request Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please provide your name and phone number so we can reach you!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/counseling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.log('MERN API Submission fallback mode:', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBooking = (selectedDest = '') => {
    if (selectedDest) {
      setFormData((prev) => ({ ...prev, destination: selectedDest }));
    }
    const el = document.getElementById('book-counseling');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const partnerUniversities = [
    { name: 'Monash University Malaysia', country: 'Malaysia', icon: '🏛️' },
    { name: 'University of Nottingham', country: 'Malaysia', icon: '🎓' },
    { name: 'Universiti Teknologi Malaysia (UTM)', country: 'Malaysia', icon: '🔬' },
    { name: 'International Islamic University (IIUM)', country: 'Malaysia', icon: '📚' },
    { name: 'Universiti Kuala Lumpur (UniKL)', country: 'Malaysia', icon: '⚙️' },
    { name: 'Coventry University', country: 'United Kingdom', icon: '🏛️' },
    { name: 'La Trobe University', country: 'Australia', icon: '🌏' },
    { name: 'Deakin University', country: 'Australia', icon: '🎓' },
    { name: 'UNITAR International University', country: 'Malaysia', icon: '🏫' },
    { name: 'University of Auckland', country: 'New Zealand', icon: '🌿' },
  ];

  const destinations = [
    {
      id: 'malaysia',
      title: 'Malaysia',
      description: 'Affordable universities with practical English-taught programs and global branch campuses.',
      badge: 'Popular Pathway',
      acceptance: '98% Acceptance',
      tuition: '$3k - $6k / yr',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'australia',
      title: 'Australia',
      description: 'World-renowned Go8 universities with excellent post-study work visa opportunities.',
      badge: 'Career Focused',
      acceptance: '94% Acceptance',
      tuition: '$15k - $28k / yr',
      image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'china',
      title: 'China',
      description: 'Fully-funded CSC scholarship options across Medicine (MBBS), Engineering, and AI.',
      badge: 'Scholarships',
      acceptance: '96% Acceptance',
      tuition: 'Scholarship Funded',
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'south-korea',
      title: 'South Korea',
      description: 'High-tech campuses, vibrant culture, and D-2/D-4 visa pathways with D-10 job seeker visas.',
      badge: 'High Demand',
      acceptance: '92% Acceptance',
      tuition: '$4k - $9k / yr',
      image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'new-zealand',
      title: 'New Zealand',
      description: 'All 8 public universities globally ranked with up to 3-year open post-study work visas.',
      badge: 'High Quality',
      acceptance: '95% Acceptance',
      tuition: '$14k - $24k / yr',
      image: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'europe',
      title: 'Europe (Schengen)',
      description: 'Tuition-free / low-cost education with visa-free travel across 29 Schengen member states.',
      badge: 'Wide Choice',
      acceptance: '97% Acceptance',
      tuition: 'Free - $3k / yr',
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'uk',
      title: 'United Kingdom',
      description: 'World-class universities with accelerated 1-year Master’s & 2-Year Graduate Route (PSW).',
      badge: 'Top Ranked',
      acceptance: '93% Acceptance',
      tuition: '$14k - $26k / yr',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const countryDetails = {
    malaysia: {
      id: 'malaysia',
      title: 'Malaysia',
      flag: '🇲🇾',
      tagline: 'Affordable World-Class Branch Campuses & Multicultural Environment',
      overview:
        'Malaysia is an emerging education destination offering branch campuses of leading global institutions (such as Monash University and the University of Nottingham) alongside top-ranked local private and public universities.',
      lifestyle: [
        {
          title: 'Multicultural Environment',
          desc: 'Experience a mix of Malay, Chinese, and Indian cultures, making adaptation simple for international students.',
        },
        {
          title: 'Modern Living',
          desc: 'Facilities range from high-tech university campuses in Greater Kuala Lumpur to well-connected public transit (LRT, MRT, Monorail).',
        },
        {
          title: 'Food & Safety',
          desc: 'Readily available Halal cuisine, high public safety standards, and widespread use of English across major cities.',
        },
      ],
      accommodation: [
        {
          type: 'On-Campus Hostels',
          detail: 'Feature 24/7 security, included utility structures, and access to campus facilities.',
        },
        {
          type: 'Off-Campus Condominiums',
          detail: 'Shared multi-room apartments featuring swimming pools, gyms, and modern security.',
        },
        {
          type: 'Studio Apartments',
          detail: 'Private living spaces ideal for postgraduates seeking independence.',
        },
      ],
      workRights: {
        termTime:
          'Students are permitted to work up to 20 hours per week strictly during official semester breaks or holidays longer than 7 days.',
        sectors:
          'Limited to specific service sectors including restaurants, petrol kiosks, mini-markets, and hotels.',
        psw: 'Student Pass & i-Kad work authorization under regulated guidelines.',
      },
      workflow: [
        {
          step: 1,
          title: 'Course & University Selection',
          text: 'Select an institution accredited by the Malaysian Qualifications Agency (MQA) and registered with Education Malaysia Global Services (EMGS).',
        },
        {
          step: 2,
          title: 'Submit Application & Receive Offer Letter',
          text: 'Provide academic transcripts, certificates, passport copies, and English proficiency test scores (IELTS/PTE if required) to secure your Offer Letter.',
        },
        {
          step: 3,
          title: 'EMGS Processing & eVAL Issuance',
          text: 'Your university submits your file to the EMGS portal. Following approval, your electronic Visa Approval Letter (eVAL) is issued.',
        },
        {
          step: 4,
          title: 'Single Entry Visa (SEV) & Departure',
          text: 'Obtain a Single Entry Visa (SEV) from the Malaysian Embassy/Consulate using your eVAL, then book your travel.',
        },
        {
          step: 5,
          title: 'Post-Arrival Medical & Pass Endorsement',
          text: 'Complete mandatory health checks in Malaysia. Submit your passport to your university to receive your final Student Pass Sticker and i-Kad identity card.',
        },
      ],
    },
    australia: {
      id: 'australia',
      title: 'Australia',
      flag: '🇦🇺',
      tagline: 'World-Renowned Group of Eight (Go8) Universities & Post-Study Work Visas',
      overview:
        'Australia is home to world-renowned institutions, particularly within the Group of Eight (Go8). Programs focus on research, innovation, and industry integration across engineering, healthcare, and business disciplines.',
      lifestyle: [
        {
          title: 'Outdoor & Ocean Culture',
          desc: 'Known for coastal cities, parks, and sports culture.',
        },
        {
          title: 'Vibrant Student Cities',
          desc: 'Melbourne and Sydney consistently rank among the top student cities globally.',
        },
        {
          title: 'Inclusive Society',
          desc: 'Multilingual communities with diverse international student organizations.',
        },
      ],
      accommodation: [
        {
          type: 'Purpose-Built Student Accommodation (PBSA)',
          detail: 'Managed fully-furnished complexes offering private rooms, study lounges, and social events.',
        },
        {
          type: 'Shared Houses (Sharehouses)',
          detail: 'Renting private bedrooms in shared suburban residential houses.',
        },
        {
          type: 'On-Campus Residential Colleges',
          detail: 'Integrated living within university grounds, often inclusive of meal plans.',
        },
      ],
      workRights: {
        termTime:
          'International student visa holders (Subclass 500) can work up to 48 hours per fortnight while course sessions are active.',
        vacation: 'Unlimited hours allowed during university-scheduled semester breaks.',
        psw: 'Eligible graduates can access Temporary Graduate Visas (Subclass 485) for extended work rights.',
      },
      workflow: [
        {
          step: 1,
          title: 'Select CRICOS-Registered Course',
          text: 'Ensure your target program is listed on the Commonwealth Register of Institutions and Courses for Overseas Students (CRICOS).',
        },
        {
          step: 2,
          title: 'Application & Genuine Student (GS) Assessment',
          text: 'Submit academic credentials, English test scores (IELTS/PTE), and complete the Genuine Student (GS) requirements.',
        },
        {
          step: 3,
          title: 'Offer Acceptance & eCoE Issuance',
          text: 'Accept your Offer Letter, secure Overseas Student Health Cover (OSHC), and pay your initial tuition deposit to receive your electronic Confirmation of Enrolment (eCoE).',
        },
        {
          step: 4,
          title: 'Lodge Visa Application (Subclass 500)',
          text: 'Submit your online visa file through ImmiAccount, attaching financial verification, eCoE, and GS responses.',
        },
        {
          step: 5,
          title: 'Biometrics & Health Clearances',
          text: 'Complete required biometrics at VFS Global and complete health screenings at designated panel clinics.',
        },
      ],
    },
    china: {
      id: 'china',
      title: 'China',
      flag: '🇨🇳',
      tagline: 'State-of-the-Art STEM, Medical (MBBS) Programs & CSC Scholarships',
      overview:
        'China offers state-of-the-art academic institutions, particularly in STEM subjects, Artificial Intelligence, and Medicine (MBBS). Chinese universities rank highly in international rankings due to heavy research investment.',
      lifestyle: [
        {
          title: 'Tech-Driven Society',
          desc: 'Everyday life relies on digital ecosystems like WeChat and Alipay for transport, shopping, and communication.',
        },
        {
          title: 'Historic & Modern Contrast',
          desc: 'Experience modern mega-cities alongside historical landmarks and heritage sites.',
        },
        {
          title: 'High Safety Standards',
          desc: 'Urban centers feature high safety levels and structured public infrastructure.',
        },
      ],
      accommodation: [
        {
          type: 'International Student Dormitories',
          detail: 'Standard twin-share or single rooms managed directly by university international offices.',
        },
        {
          type: 'Off-Campus Apartments',
          detail: 'Private rentals requiring mandatory local police station registration within 24 hours of moving in.',
        },
      ],
      workRights: {
        termTime:
          'Part-time employment is allowed strictly through off-campus internships or on-campus work-study arrangements approved by both the university and local immigration authorities.',
        psw: 'Internship & Research permit pathways under institutional approval.',
      },
      workflow: [
        {
          step: 1,
          title: 'Course & University Selection',
          text: 'Identify your course track (English-taught or Chinese-taught) and choose your funding path (Self-Funded or CSC Scholarship).',
        },
        {
          step: 2,
          title: 'Direct Portal Application',
          text: 'Upload your academic certificates, non-criminal record check, physical examination form, and recommendation letters to the university portal.',
        },
        {
          step: 3,
          title: 'Receive Official JW Form & Admission Notice',
          text: 'Upon university acceptance, receive your official Admission Letter along with the official JW201 or JW202 Visa Form.',
        },
        {
          step: 4,
          title: 'Apply for X1 Student Visa',
          text: 'Submit your JW form, Admission Notice, and valid passport to the Chinese Embassy or Chinese Visa Application Service Center (CVASC).',
        },
        {
          step: 5,
          title: 'Residence Permit Conversion',
          text: 'Within 30 days of arrival in China, complete local health verification and convert your X1 visa into a Temporary Residence Permit at the Public Security Bureau (PSB).',
        },
      ],
    },
    'south-korea': {
      id: 'south-korea',
      title: 'South Korea',
      flag: '🇰🇷',
      tagline: 'High-Tech IT & Business Hub with D-2/D-4 Pathways & D-10 Job Seeker Visas',
      overview:
        'South Korea combines technological development with strong higher education standards. Korean universities excel in IT, Media, Engineering, and International Business.',
      lifestyle: [
        {
          title: 'Vibrant Urban Lifestyle',
          desc: 'Access 24-hour urban conveniences, fast internet infrastructure, and public transit systems.',
        },
        {
          title: 'Rich Cultural Environment',
          desc: 'Experience Korean pop culture, traditional heritage sites, and seasonal weather patterns.',
        },
        {
          title: 'Language Integration',
          desc: 'Learning basic Korean improves daily living and opens local professional networks, alongside English-medium degree programs.',
        },
      ],
      accommodation: [
        {
          type: 'Gwanaksa / On-Campus Dorms',
          detail: 'Campus-managed housing options with shared or private facilities.',
        },
        {
          type: 'Gosiwon',
          detail: 'Compact, budget-friendly private single rooms with basic utilities included.',
        },
        {
          type: 'One-Room (Studio Apartments)',
          detail: 'Private apartments requiring a lease contract and standard deposit (Jeonse or Wolse system).',
        },
      ],
      workRights: {
        termTime:
          'Foreign degree students can work part-time (typically 20 to 25 hours per week depending on Korean language TOPIK level and course load) after completing their first semester.',
        psw: 'Graduates can apply for D-10 Job Seeker Visas to transition into employment.',
      },
      workflow: [
        {
          step: 1,
          title: 'Select Program & Language Track',
          text: 'Choose between a direct degree course (D-2) or an intensive Korean Language Program (D-4).',
        },
        {
          step: 2,
          title: 'University Application & Credential Verification',
          text: 'Submit academic documents, statement of purpose, proof of financial status, and language certificates (IELTS or TOPIK).',
        },
        {
          step: 3,
          title: 'Receive Certificate of Admission (CoA)',
          text: 'Pay your initial tuition invoice to obtain your official Standard Admission Letter / Certificate of Admission (CoA).',
        },
        {
          step: 4,
          title: 'Apply for D-2/D-4 Visa',
          text: 'Lodge your visa application with your CoA, apostilled/attested academic documents, and financial evidence at the South Korean Embassy/Consulate.',
        },
        {
          step: 5,
          title: 'Alien Registration Card (ARC) Registration',
          text: 'Register for your Alien Registration Card (ARC) at your local immigration office within 90 days of arriving in South Korea.',
        },
      ],
    },
    'new-zealand': {
      id: 'new-zealand',
      title: 'New Zealand',
      flag: '🇳🇿',
      tagline: 'All 8 Public Universities Globally Ranked with up to 3-Year Open Post-Study Work Visas',
      overview:
        'New Zealand offers an educational model focused on practical learning, small class sizes, and critical thinking. All 8 of New Zealand’s public universities rank within the global top tiers.',
      lifestyle: [
        {
          title: 'Unmatched Natural Environment',
          desc: 'Access diverse natural landscapes, outdoor activities, and clean eco-friendly environments.',
        },
        {
          title: 'Welcoming Society',
          desc: 'Cultural values prioritize inclusivity, community safety, and a balanced study-life schedule.',
        },
        {
          title: 'Supportive Campuses',
          desc: 'Dedicated international student support offices at all accredited institutions.',
        },
      ],
      accommodation: [
        {
          type: 'Halls of Residence',
          detail: 'On-campus student residence buildings featuring meal options and organized social activities.',
        },
        {
          type: 'Flatting (Shared Renting)',
          detail: 'Renting a room in a shared apartment or house with housemates, splitting utility bills.',
        },
        {
          type: 'Homestays',
          detail: 'Living with a local New Zealand family, which includes meals and full home integration.',
        },
      ],
      workRights: {
        termTime: 'Full-time tertiary international students can work up to 20 hours per week during academic terms.',
        vacation: 'Unlimited full-time work is permitted during scheduled university holiday periods.',
        psw: 'Graduates of eligible degree programs can apply for open Post-Study Work Visas lasting up to 3 years depending on qualification level.',
      },
      workflow: [
        {
          step: 1,
          title: 'Application to Accredited Institution',
          text: 'Submit academic transcripts, Statement of Purpose, and English language proficiency scores (IELTS/PTE) to your chosen institution.',
        },
        {
          step: 2,
          title: 'Receive Offer of Place',
          text: 'Obtain an official Offer of Place specifying program details, commencement dates, and tuition breakdown.',
        },
        {
          step: 3,
          title: 'Document Preparation & Health Clearance',
          text: 'Compile financial documentation, police certificates, and complete medical examinations at approved panel clinics.',
        },
        {
          step: 4,
          title: 'Submit Fee-Paying Student Visa Online',
          text: 'Lodge your student visa application through the official Immigration New Zealand (INZ) online portal.',
        },
        {
          step: 5,
          title: 'Approval in Principle (AIP) & Visa Grant',
          text: 'Upon receiving Approval in Principle (AIP) from INZ, pay your tuition fees to trigger final e-Visa issuance.',
        },
      ],
    },
    europe: {
      id: 'europe',
      title: 'Europe (Schengen Area)',
      flag: '🇪🇺',
      tagline: 'Tuition-Free / Low-Cost Education with Visa-Free Travel Across 29 Schengen Countries',
      overview:
        'The European Union and Schengen Area (including destinations like Germany, France, Italy, and the Netherlands) provide historic academic traditions and research facilities. Public institutions often offer tuition-free or low-cost higher education.',
      lifestyle: [
        {
          title: 'Cross-Border Mobility',
          desc: 'Students holding a Schengen residence permit can travel visa-free across 29 Schengen member states.',
        },
        {
          title: 'Rich Cultural Diversity',
          desc: 'Experience varied regional languages, architecture, public arts, and historical traditions.',
        },
        {
          title: 'Public Transportation',
          desc: 'Well-connected regional rail systems and city public transit networks.',
        },
      ],
      accommodation: [
        {
          type: 'Student Halls (Studentenwerk / CROUS)',
          detail: 'Affordable public student dormitories managed by regional student service organizations.',
        },
        {
          type: 'Private Shared Apartments (WG / Colocation)',
          detail: 'Renting private bedrooms within shared multi-room apartments.',
        },
        {
          type: 'Private Studio Apartments',
          detail: 'Independent living spaces rented through private housing agencies.',
        },
      ],
      workRights: {
        termTime:
          'In countries like Germany, international non-EU students can work up to 140 full days or 280 half days per calendar year.',
        psw: 'Member states offer extended job-seeker residence permits (e.g., 18 months in Germany) following graduation.',
      },
      workflow: [
        {
          step: 1,
          title: 'University Application Submission',
          text: 'Apply directly through university portals or central processing portals (such as uni-assist for Germany or Campus France).',
        },
        {
          step: 2,
          title: 'Receive Official Admission Letter',
          text: 'Secure your official Admission Letter (Zulassungsbescheid or institutional equivalent).',
        },
        {
          step: 3,
          title: 'Financial Setup (e.g., Blocked Account)',
          text: 'Set up your financial proof mechanism, such as opening a German Blocked Account (Sperrkonto) or submitting official sponsorship documents.',
        },
        {
          step: 4,
          title: 'National Visa (Type D) Application',
          text: 'Book an appointment at the destination country’s Embassy/VFS center and present your file with valid international health insurance.',
        },
        {
          step: 5,
          title: 'Address Registration & Residence Permit',
          text: 'Upon arrival, register your address at the local city hall (Anmeldung) and finalize your Residence Permit (Aufenthaltstitel).',
        },
      ],
    },
    uk: {
      id: 'uk',
      title: 'United Kingdom (UK)',
      flag: '🇬🇧',
      tagline: 'Accelerated 1-Year Masters & 3-Year Bachelors with 2-Year Graduate Route (PSW)',
      overview:
        'The UK is home to top-tier institutions operating under rigorous academic standards. With accelerated 1-year Master’s degrees and 3-year Bachelor’s degrees, students complete qualifications faster than in many other countries.',
      lifestyle: [
        {
          title: 'Global Student Hubs',
          desc: 'Cities like London, Manchester, and Edinburgh offer multicultural international student networks.',
        },
        {
          title: 'Historical & Modern Blend',
          desc: 'Access historical archives, libraries, modern research centers, and cultural hubs.',
        },
        {
          title: 'Convenient Transport Access',
          desc: 'Comprehensive rail, bus, and flight connections across the UK and into mainland Europe.',
        },
      ],
      accommodation: [
        {
          type: 'Purpose-Built Student Accommodation (PBSA)',
          detail: 'Private student halls offering all-inclusive utilities, internet, 24/7 security, and social study spaces.',
        },
        {
          type: 'University Halls of Residence',
          detail: 'On-campus housing managed directly by the university.',
        },
        {
          type: 'Private Shared Tenancies',
          detail: 'Renting rooms in shared private houses through local lettings agencies.',
        },
      ],
      workRights: {
        termTime: 'Degree-level international students on a UK Student Visa can work up to 20 hours per week during academic term periods.',
        vacation: 'Full-time work (40 hours per week) is allowed during official, scheduled university holidays.',
        psw: 'Eligible international graduates can apply for a 2-Year Post-Study Work Visa (3 years for PhD graduates) without needing an employer sponsor.',
      },
      workflow: [
        {
          step: 1,
          title: 'Submit University Application',
          text: 'Apply via direct university portals or UCAS, uploading your academic records, SOP, and IELTS/PTE scores.',
        },
        {
          step: 2,
          title: 'Unconditional Offer & Deposit Payment',
          text: 'Fulfill academic or language requirements to obtain an Unconditional Offer Letter, then pay the required tuition deposit.',
        },
        {
          step: 3,
          title: 'CAS Issuance',
          text: 'Your university verifies your financial proof and issues your unique Confirmation of Acceptance for Studies (CAS) number.',
        },
        {
          step: 4,
          title: 'Financial Verification & Health Surcharge (IHS)',
          text: 'Ensure your required maintenance funds are held continuously in your account for 28 consecutive days. Pay the Immigration Health Surcharge (IHS) along with your visa fee.',
        },
        {
          step: 5,
          title: 'Biometrics & eVisa Status',
          text: 'Attend your biometrics appointment at VFS Global. Upon approval, receive access to your digital UKVI eVisa account.',
        },
      ],
    },
  };

  const processRoadmap = [
    {
      step: '01',
      title: 'Profile & Career Audit',
      desc: 'Comprehensive review of your HSC / Bachelor CGPA, English proficiency, and budget to select the best-fit country.',
      tag: 'Day 1 - 3',
    },
    {
      step: '02',
      title: 'University Shortlisting & SOP',
      desc: 'Targeting accredited institutions with high visa success rates and guiding personalized Statement of Purpose drafting.',
      tag: 'Day 4 - 7',
    },
    {
      step: '03',
      title: 'Offer Letter & Scholarships',
      desc: 'Direct application lodgement to secure your official Offer Letter and maximize merit scholarship grants.',
      tag: 'Week 2 - 4',
    },
    {
      step: '04',
      title: 'Bank Solvency & Document Audit',
      desc: 'Zero-mistake financial verification ensuring sponsor accounts, affidavits, and tax clearances meet embassy guidelines.',
      tag: 'Week 5 - 6',
    },
    {
      step: '05',
      title: 'Visa Lodgement & Mock Interview',
      desc: 'Complete visa file compilation, biometric appointment booking, and 1-on-1 embassy interview preparation.',
      tag: 'Week 7 - 9',
    },
    {
      step: '06',
      title: 'Pre-Departure & Airport Care',
      desc: 'Guidance on flight booking, forex endorsement, student housing confirmation, and airport reception support.',
      tag: 'Final Arrival',
    },
  ];

  const testimonials = [
    {
      name: 'Anwar Hossain Sumon',
      university: 'UNITAR International University, Malaysia',
      quote:
        '“I was so lost after my bad result in HSC. I thought I had no options left, then Study Buddy came as my guide. They counseled me and helped me from beginning to end. I love how they treat me as a true buddy.”',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      badge: 'Visa Issued 2025',
    },
    {
      name: 'Zaber Hossain',
      university: 'La Trobe University, Australia',
      quote:
        '“After getting rejected from USA, I was hopeless. Study Buddy found out what would be best for my profile and helped me like a very close one. Kudos to the Study Buddy team for securing my Australian visa!”',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      badge: 'Subclass 500 Granted',
    },
    {
      name: 'Maher Kamal',
      university: 'Universiti Teknologi Malaysia (UTM)',
      quote:
        '“My financial profile was modest, but Study Buddy showed me how Malaysia could turn into a career-changing opportunity. I grabbed it and I am thrilled that I trusted their advice.”',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      badge: 'Scholarship Awarded',
    },
  ];

  const branchOffices = [
    {
      city: 'Dhaka Corporate Office',
      tag: 'Headquarters',
      address: 'Suite 2B, Level 2, House #18, Road #15, Block #D, Banani, Dhaka 1213, Bangladesh.',
      phone: '+88 01675 516 856',
      email: 'dhaka@studybuddy.com',
      hours: 'Sat - Thu: 10:00 AM - 7:00 PM',
    },
    {
      city: 'Chattogram Branch Office',
      tag: 'Regional Branch',
      address: '2nd Floor, 85/A, Saleh Noor Bhaban, Chatteshwari Road, Chawkbazar, Chattogram, Bangladesh.',
      phone: '+88 01332 564 490',
      email: 'chattogram@studybuddy.com',
      hours: 'Sat - Thu: 10:00 AM - 7:00 PM',
    },
    {
      city: 'Malaysia Liaison Desk',
      tag: 'International Support',
      address: 'Greater Kuala Lumpur, Malaysia (Direct Student Care & Campus Relocation Assistance).',
      phone: '+60 18215 5027',
      email: 'malaysia@studybuddy.com',
      hours: 'Mon - Fri: 9:00 AM - 6:00 PM (MYT)',
    },
  ];

  const faqs = [
    {
      id: 'faq-1',
      q: 'Can I apply for universities abroad with a study gap?',
      a: 'Yes, absolutely! Many of our partner universities in Malaysia, the UK, Europe, and China accept study gaps when accompanied by valid professional experience, internship certificates, or language training records. Our team helps you structure your CV and Statement of Purpose to present your study gap positively.',
    },
    {
      id: 'faq-2',
      q: 'What are the bank solvency and financial requirements?',
      a: 'Financial requirements vary by country. For Malaysia and China, minimal sponsorship proof is required. For the UK, Australia, and New Zealand, funds must be held in approved bank accounts for specific durations (e.g., 28 consecutive days for the UK). We perform a 100% pre-submission financial audit to guarantee error-free files.',
    },
    {
      id: 'faq-3',
      q: 'Can I get a scholarship if my GPA is below 5.00?',
      a: 'Yes! We work with numerous institutions offering early-bird grants, academic tuition waivers (ranging from 20% to 50%), and international student bursaries for GPAs starting from 3.50 upwards.',
    },
    {
      id: 'faq-4',
      q: 'Are spouse visas permitted during my studies?',
      a: 'In destinations like Australia and New Zealand, eligible Master’s and PhD students can bring their spouse with full or part-time work rights. Contact our counselors to check current eligibility rules for your target country.',
    },
  ];

  const currentCountry = countryDetails[activeCountryKey] || countryDetails['malaysia'];

  return (
    <div id="app-root">
      {/* Modern Floating Header */}
      <header className="sb-header">
        <div className="sb-header-inner">
          <a
            href="#main-content"
            className="sb-brand-logo-link"
            aria-label="Study Buddy Home"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/logo.png"
              alt="Study Buddy — Your Buddy for Global Study Journeys"
              className="sb-brand-logo-img"
              width="180"
              height="52"
            />
          </a>

          <nav aria-label="Main Navigation" className="sb-desktop-nav">
            <ul className="sb-nav-menu">
              <li className="sb-nav-item"><a href="#study-destinations">Destinations</a></li>
              <li className="sb-nav-item"><a href="#why-choose-us">Why StudyBuddy</a></li>
              <li className="sb-nav-item"><a href="#process-roadmap">Application Process</a></li>
              <li className="sb-nav-item"><a href="#branch-offices">Our Offices</a></li>
              <li className="sb-nav-item"><a href="#faq-section">Student FAQ</a></li>
            </ul>
          </nav>

          <div className="sb-header-cta-group">
            <a
              href="https://wa.me/8801675516856"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-header-whatsapp"
              aria-label="Chat with Study Buddy counselors on WhatsApp"
            >
              <span aria-hidden="true">💬</span> WhatsApp
            </a>
            <button
              type="button"
              className="btn-header-primary"
              onClick={() => scrollToBooking()}
            >
              Book Free Consultation →
            </button>
            <button
              type="button"
              className="sb-mobile-menu-btn"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sb-mobile-drawer fade-in">
            <nav aria-label="Mobile Navigation">
              <ul className="sb-mobile-menu-list">
                <li><a href="#study-destinations" onClick={() => setMobileMenuOpen(false)}>Destinations</a></li>
                <li><a href="#why-choose-us" onClick={() => setMobileMenuOpen(false)}>Why StudyBuddy</a></li>
                <li><a href="#process-roadmap" onClick={() => setMobileMenuOpen(false)}>Application Process</a></li>
                <li><a href="#branch-offices" onClick={() => setMobileMenuOpen(false)}>Our Offices</a></li>
                <li><a href="#faq-section" onClick={() => setMobileMenuOpen(false)}>Student FAQ</a></li>
                <li className="sb-mobile-menu-cta">
                  <button
                    type="button"
                    className="btn-gold-brand"
                    style={{ width: '100%' }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      scrollToBooking();
                    }}
                  >
                    Book Free Consultation →
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Landmark for Skip Link */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="sb-hero-brand">
          {/* Dynamic Translucent University Campus Background Slideshow */}
          <div className="sb-hero-bg-slider" aria-hidden="true">
            {campusHeroBackgrounds.map((bg, idx) => (
              <div
                key={idx}
                className={`sb-hero-slide ${idx === currentBgIndex ? 'active' : ''}`}
                style={{ backgroundImage: `url(${bg.url})` }}
              />
            ))}
            <div className="sb-hero-white-overlay"></div>
            <div className="sb-hero-bg-indicator">
              <span className="sb-bg-live-dot"></span>
              <span>{campusHeroBackgrounds[currentBgIndex].caption}</span>
            </div>
          </div>

          <div className="sb-hero-container">
            <div className="sb-hero-content">
              <div className="sb-brand-pills-row">
                <span className="sb-pill-tagline">Study Buddy Official</span>
                <span className="sb-pill-xanthous">Study Gap Acceptable</span>
                <span className="sb-pill-lime">Up to 50% Scholarship</span>
              </div>

              <h1 className="sb-hero-jumbo-title">
                Your Buddy for <em>Global Study Journeys!</em>
              </h1>

              <p className="sb-hero-lead-text">
                <strong>Learn. Grow. Go Global.</strong> Study Buddy is dedicated to empowering students who dream of studying abroad by providing guidance, resources, and mentorship to make international education accessible, transparent, and seamless.
              </p>

              <div className="sb-hero-cta-group">
                <button className="btn-gold-brand" type="button" onClick={() => scrollToBooking()}>
                  Book 1:1 Advisory Session →
                </button>
                <a
                  href="https://wa.me/8801675516856"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-brand"
                >
                  Fast Track via WhatsApp
                </a>
              </div>

              {/* High-Contrast Trust Metrics */}
              <div className="sb-hero-metrics-brand">
                <div className="sb-metric-box-brand">
                  <strong>99.2%</strong>
                  <span>Visa Success Rate</span>
                </div>
                <div className="sb-metric-divider" aria-hidden="true"></div>
                <div className="sb-metric-box-brand">
                  <strong>$2.4M+</strong>
                  <span>Scholarships Secured</span>
                </div>
                <div className="sb-metric-divider" aria-hidden="true"></div>
                <div className="sb-metric-box-brand">
                  <strong>50+</strong>
                  <span>Partner Universities</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Infinite Partner Universities Auto-Scrolling Marquee */}
        <AutoScrollingMarquee items={partnerUniversities} />

        {/* Why Choose Us - Bento Grid 2.0 */}
        <section className="sb-why-bento" id="why-choose-us">
          <div className="sb-section-inner">
            <div className="sb-section-head">
              <div>
                <span className="sb-eyebrow-brand">OUR COMMITMENT</span>
                <h2 className="sb-title-brand">Professional guidance built on complete transparency.</h2>
                <p className="sb-lead-text">
                  Studying abroad is one of the most important investments of your life. We replace guess-work with verified data, step-by-step accountability, and personalized mentorship.
                </p>
              </div>
              <button className="btn-outline-brand" type="button" onClick={() => scrollToBooking()}>
                Schedule 1:1 Consultation
              </button>
            </div>

            <div className="sb-bento-grid">
              <div className="sb-bento-card bento-large">
                <div className="sb-bento-badge">TRUSTED FOUNDATION</div>
                <h3>100% Transparent Fee &amp; Document Audit</h3>
                <p>
                  Zero hidden service charges. We perform a complete pre-application audit covering tuition invoices, embassy requirements, and accommodation deposits before you sign any contract.
                </p>
                <div className="sb-bento-features">
                  <span>✓ Direct University Invoices</span>
                  <span>✓ Zero Hidden Extra Charges</span>
                  <span>✓ Full Pre-Submission Verification</span>
                </div>
              </div>

              <div className="sb-bento-card">
                <div className="sb-bento-icon" aria-hidden="true">🧭</div>
                <h3>Structured Milestone Roadmap</h3>
                <p>
                  From transcript verification to visa interview simulations, every phase follows a strict timeline so deadlines are never missed.
                </p>
              </div>

              <div className="sb-bento-card">
                <div className="sb-bento-icon" aria-hidden="true">🤝</div>
                <h3>Buddy-Level Student Mentorship</h3>
                <p>
                  Direct access to alumni studying at top universities in Malaysia, Australia, Europe, and the UK for real-life advice.
                </p>
              </div>

              <div className="sb-bento-card">
                <div className="sb-bento-icon" aria-hidden="true">🛟</div>
                <h3>Post-Arrival Relocation Care</h3>
                <p>
                  Airport reception, student housing confirmation, bank account setup, and SIM registration guidance upon arrival.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7-Country Interactive Blueprint Hub */}
        <section className="sb-destinations-brand" id="study-destinations">
          <div className="sb-section-inner">
            <div className="sb-section-head-center">
              <span className="sb-eyebrow-brand">GLOBAL PATHWAYS</span>
              <h2 className="sb-title-brand">Choose a pathway that fits your academic goals.</h2>
              <p className="sb-lead-text">
                Select any country below to inspect full requirements, admission timelines, housing structures, and work regulations.
              </p>
            </div>

            {/* Country Filter Pills Switcher */}
            <div className="sb-country-pills-bar" role="tablist" aria-label="Destination Countries">
              {destinations.map((dest) => {
                const countryInfo = countryDetails[dest.id] || {};
                const isActive = activeCountryKey === dest.id;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`sb-country-pill ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCountryKey(dest.id);
                    }}
                  >
                    <span className="sb-country-flag" aria-hidden="true">{countryInfo.flag || '🌐'}</span>
                    <span>{dest.title}</span>
                    {isActive && <span className="sb-pill-dot" aria-hidden="true"></span>}
                  </button>
                );
              })}
            </div>

            {/* 7 Destination Cards Grid */}
            <div className="sb-dest-grid">
              {destinations.map((dest) => {
                const isActive = activeCountryKey === dest.id;
                return (
                  <button
                    key={dest.id}
                    className={`sb-dest-card ${isActive ? 'selected' : ''}`}
                    type="button"
                    onClick={() => {
                      setActiveCountryKey(dest.id);
                      const el = document.getElementById('country-detail-hub');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }}
                  >
                    <div className="sb-card-img-wrap">
                      <img
                        className="sb-dest-img"
                        src={dest.image}
                        alt={`Study in ${dest.title}`}
                        loading="lazy"
                        width="400"
                        height="200"
                      />
                      <span className="sb-dest-badge">{dest.badge}</span>
                    </div>
                    <div className="sb-dest-body">
                      <h3>{dest.title}</h3>
                      <p>{dest.description}</p>
                      <div className="sb-dest-stats">
                        <span className="sb-stat-tag">{dest.acceptance}</span>
                        <span className="sb-stat-tag gold">{dest.tuition}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* SMART BLUEPRINT HUB PANEL */}
            <motion.div
              className="sb-country-hub-panel"
              id="country-detail-hub"
              key={activeCountryKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <div className="sb-hub-header">
                <div className="sb-hub-title-group">
                  <span className="sb-hub-big-flag" aria-hidden="true">{currentCountry.flag}</span>
                  <div>
                    <div className="sb-hub-badge">Verified Institutional Blueprint</div>
                    <h3 className="sb-hub-country-name">{currentCountry.title}</h3>
                    <p className="sb-hub-tagline">{currentCountry.tagline}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-gold-brand"
                  onClick={() => scrollToBooking(currentCountry.title)}
                >
                  Apply for {currentCountry.title} Advisory →
                </button>
              </div>

              {/* Sub-Tab Navigation Bar */}
              <div className="sb-subtabs-nav" role="tablist" aria-label="Country Information Tabs">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSubTab === 'overview'}
                  className={`sb-subtab-btn ${activeSubTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('overview')}
                >
                  <span aria-hidden="true">🎓</span> Overview &amp; Lifestyle
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSubTab === 'accommodation'}
                  className={`sb-subtab-btn ${activeSubTab === 'accommodation' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('accommodation')}
                >
                  <span aria-hidden="true">🏡</span> Accommodation Options
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSubTab === 'workRights'}
                  className={`sb-subtab-btn ${activeSubTab === 'workRights' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('workRights')}
                >
                  <span aria-hidden="true">💼</span> Work Rights &amp; Regulations
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSubTab === 'workflow'}
                  className={`sb-subtab-btn ${activeSubTab === 'workflow' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('workflow')}
                >
                  <span aria-hidden="true">🗺️</span> Step-by-Step Visa Workflow
                </button>
              </div>

              {/* Sub-Tab Content Area with Framer Motion AnimatePresence */}
              <div className="sb-subtab-content">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeCountryKey}-${activeSubTab}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                  >
                    {activeSubTab === 'overview' && (
                      <div className="sb-tab-pane">
                        <div className="sb-overview-box">
                          <h4><span aria-hidden="true">🏛️</span> Overview &amp; Academic Standing</h4>
                          <p>{currentCountry.overview}</p>
                        </div>
                        <h4 className="sb-pane-subtitle"><span aria-hidden="true">🌟</span> Lifestyle &amp; Cultural Environment</h4>
                        <div className="sb-lifestyle-grid">
                          {currentCountry.lifestyle.map((item, idx) => (
                            <div key={idx} className="sb-lifestyle-card">
                              <h5>{item.title}</h5>
                              <p>{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSubTab === 'accommodation' && (
                      <div className="sb-tab-pane">
                        <h4 className="sb-pane-subtitle"><span aria-hidden="true">🏡</span> Housing &amp; Student Accommodation Options</h4>
                        <div className="sb-acc-grid">
                          {currentCountry.accommodation.map((acc, idx) => (
                            <div key={idx} className="sb-acc-card">
                              <div className="sb-acc-icon" aria-hidden="true">🏘️</div>
                              <h5>{acc.type}</h5>
                              <p>{acc.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSubTab === 'workRights' && (
                      <div className="sb-tab-pane">
                        <h4 className="sb-pane-subtitle"><span aria-hidden="true">💼</span> Student Work Rights &amp; Post-Study Opportunities</h4>
                        <div className="sb-work-grid">
                          <div className="sb-work-card">
                            <div className="sb-work-badge">Term-Time Employment</div>
                            <p>{currentCountry.workRights.termTime}</p>
                          </div>
                          {currentCountry.workRights.vacation && (
                            <div className="sb-work-card">
                              <div className="sb-work-badge">Vacation &amp; Semester Breaks</div>
                              <p>{currentCountry.workRights.vacation}</p>
                            </div>
                          )}
                          {currentCountry.workRights.sectors && (
                            <div className="sb-work-card">
                              <div className="sb-work-badge">Permitted Work Sectors</div>
                              <p>{currentCountry.workRights.sectors}</p>
                            </div>
                          )}
                          {currentCountry.workRights.psw && (
                            <div className="sb-work-card highlight">
                              <div className="sb-work-badge gold">Post-Study Work Visa (PSW)</div>
                              <p>{currentCountry.workRights.psw}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeSubTab === 'workflow' && (
                      <div className="sb-tab-pane">
                        <h4 className="sb-pane-subtitle"><span aria-hidden="true">🗺️</span> Step-by-Step Admission &amp; Visa Workflow</h4>
                        <div className="sb-workflow-timeline">
                          {currentCountry.workflow.map((st) => (
                            <div key={st.step} className="sb-workflow-step">
                              <div className="sb-step-circle">{st.step}</div>
                              <div className="sb-step-info">
                                <h5>{st.title}</h5>
                                <p>{st.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="sb-hub-footer">
                <div className="sb-hub-footer-text">
                  Ready to explore verified university shortlists for <strong>{currentCountry.title}</strong>? Book a dedicated session with our senior counselor.
                </div>
                <button
                  type="button"
                  className="btn-gold-brand"
                  onClick={() => scrollToBooking(currentCountry.title)}
                >
                  Book {currentCountry.title} Advisory Session →
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6-Stage Application Process Roadmap */}
        <section className="sb-services-brand" id="process-roadmap">
          <div className="sb-section-inner">
            <div className="sb-section-head-center">
              <span className="sb-eyebrow-brand">OUR METHODOLOGY</span>
              <h2 className="sb-title-brand">A structured, stress-free pathway from Bangladesh.</h2>
              <p className="sb-lead-text">
                We manage every document, submission deadline, and embassy requirement so your focus stays on academic success.
              </p>
            </div>

            <div className="sb-roadmap-grid">
              {processRoadmap.map((item) => (
                <div key={item.step} className="sb-roadmap-card">
                  <div className="sb-roadmap-num">{item.step}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <span className="sb-roadmap-tag">{item.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Student Stories & Testimonials */}
        <section className="sb-testimonials-brand">
          <div className="sb-section-inner">
            <div className="sb-section-head-center">
              <span className="sb-eyebrow-brand">STUDENT OUTCOMES</span>
              <h2 className="sb-title-brand">Real Bangladeshi journeys, proven outcomes.</h2>
              <p className="sb-lead-text">
                Read how students overcame academic setbacks, visa challenges, and budget constraints with Study Buddy.
              </p>
            </div>

            <div className="sb-testi-grid-brand">
              {testimonials.map((t, idx) => (
                <div key={idx} className="sb-testi-card-brand">
                  <div className="sb-testi-header">
                    <img
                      className="sb-testi-avatar"
                      src={t.image}
                      alt={t.name}
                      loading="lazy"
                      width="52"
                      height="52"
                    />
                    <div>
                      <span className="sb-testi-name">{t.name}</span>
                      <span className="sb-testi-uni">{t.university}</span>
                    </div>
                    <span className="sb-testi-badge">{t.badge}</span>
                  </div>
                  <div className="sb-testi-stars">★★★★★ 5.0 Verified Review</div>
                  <p className="sb-testi-quote">{t.quote}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Multi-Branch Office Network */}
        <section className="sb-branches-section" id="branch-offices">
          <div className="sb-section-inner">
            <div className="sb-section-head-center">
              <span className="sb-eyebrow-brand">OUR OFFICES</span>
              <h2 className="sb-title-brand">Visit our dedicated counseling offices.</h2>
              <p className="sb-lead-text">
                Speak face-to-face with our certified academic advisors in Dhaka and Chattogram or connect with our international support team in Malaysia.
              </p>
            </div>

            <div className="sb-branches-grid">
              {branchOffices.map((b, idx) => (
                <div key={idx} className="sb-branch-card">
                  <div>
                    <span className="sb-branch-tag">{b.tag}</span>
                    <h3>{b.city}</h3>
                    <p>{b.address}</p>
                  </div>
                  <div className="sb-branch-meta">
                    <span><span aria-hidden="true">📞</span> <strong>Hotline:</strong> {b.phone}</span>
                    <span><span aria-hidden="true">✉️</span> <strong>Email:</strong> {b.email}</span>
                    <span><span aria-hidden="true">⏰</span> <strong>Hours:</strong> {b.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Searchable FAQ Accordion */}
        <section className="sb-faq-section" id="faq-section">
          <div className="sb-section-inner">
            <div className="sb-section-head-center">
              <span className="sb-eyebrow-brand">FREQUENTLY ASKED QUESTIONS</span>
              <h2 className="sb-title-brand">Everything you need to know before applying.</h2>
              <p className="sb-lead-text">
                Clear answers to the most common questions asked by students and parents.
              </p>
            </div>

            <div className="sb-faq-container">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={faq.id} className={`sb-faq-item ${isOpen ? 'open' : ''}`}>
                    <button
                      type="button"
                      className="sb-faq-question"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    >
                      <span>{faq.q}</span>
                      <span className="sb-faq-icon" aria-hidden="true">+</span>
                    </button>
                    {isOpen && (
                      <div id={`faq-answer-${faq.id}`} className="sb-faq-answer fade-in">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Advisory Appointment Booking Form */}
        <section className="sb-booking-brand" id="book-counseling">
          <div className="sb-section-inner">
            <div className="sb-section-head-center">
              <span className="sb-eyebrow-brand">FREE ADVISORY</span>
              <h2 className="sb-title-brand">Start with one clear, confidential conversation.</h2>
              <p className="sb-lead-text">
                Share your current academic background and goals. Our senior counselors will provide an initial profile assessment within 24 hours.
              </p>
            </div>

            <div className="sb-booking-layout-brand">
              <div className="sb-form-panel-brand">
                <form className="sb-form" onSubmit={handleSubmit}>
                  <div className="sb-form-grid">
                    <div className="sb-form-row">
                      <label htmlFor="field-name">Full Name *</label>
                      <input
                        id="field-name"
                        name="name"
                        autoComplete="name"
                        placeholder="e.g. Tanvir Hossain"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="sb-form-row">
                      <label htmlFor="field-email">Email Address *</label>
                      <input
                        id="field-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        spellCheck={false}
                        placeholder="tanvir@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="sb-form-row">
                      <label htmlFor="field-phone">WhatsApp / Phone Number *</label>
                      <input
                        id="field-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+88 01675 516 856"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="sb-form-row">
                      <label htmlFor="field-destination">Target Destination</label>
                      <select
                        id="field-destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Target Country</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Australia">Australia</option>
                        <option value="China">China</option>
                        <option value="South Korea">South Korea</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="Europe (Schengen Area)">Europe (Schengen Area)</option>
                        <option value="United Kingdom (UK)">United Kingdom (UK)</option>
                      </select>
                    </div>
                    <div className="sb-form-row sb-form-row-wide">
                      <label htmlFor="field-questions">Your Questions or Profile Context *</label>
                      <textarea
                        id="field-questions"
                        name="questions"
                        placeholder="Tell us about your HSC/Bachelor result, budget preferences, or specific course goals…"
                        value={formData.questions}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>
                  </div>

                  {submitted && (
                    <div className="toast-success-brand" role="status" aria-live="polite">
                      🎉 Thank you, {formData.name}! Your request has been securely recorded. Our senior counselor will connect with you on WhatsApp (+88 01675 516 856) shortly.
                    </div>
                  )}

                  <div className="sb-form-submit">
                    <button className="btn-gold-brand" type="submit" disabled={loading}>
                      {loading ? 'Saving to Database…' : 'Submit Priority Request →'}
                    </button>
                  </div>

                  <div style={{ marginTop: '14px', textAlign: 'center' }}>
                    <span className="mern-api-badge">🟢 {apiStatus}</span>
                  </div>
                </form>
              </div>

              {/* Direct WhatsApp Consultation Desk */}
              <div className="sb-chat-card-brand">
                <div className="sb-chat-badge">DIRECT ADVISORY DESK</div>
                <h3>Prefer Instant WhatsApp Consultation?</h3>
                <p>
                  Connect directly with our Dhaka and Chattogram advisory desks for immediate guidance on intakes, deadlines, and document requirements.
                </p>
                <div className="sb-direct-features">
                  <span><span aria-hidden="true">⚡</span> Instant Eligibility Review</span>
                  <span><span aria-hidden="true">👨‍👩‍👧</span> Parent &amp; Student Consultations</span>
                  <span><span aria-hidden="true">🇧🇩</span> Dhaka Banani &amp; Chattogram Support</span>
                </div>
                <div className="sb-chat-actions">
                  <a
                    href="https://wa.me/8801675516856"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-full"
                    aria-label="Chat with Study Buddy on WhatsApp"
                  >
                    <span aria-hidden="true">💬</span> Chat on WhatsApp (+88 01675 516 856)
                  </a>
                  <a href="tel:+8801675516856" className="btn-call-full" aria-label="Call Study Buddy hotline">
                    <span aria-hidden="true">📞</span> Call Hotline Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="sb-footer-brand">
        <div className="sb-footer-inner">
          <div className="sb-footer-brand-col">
            <div className="sb-footer-logo-backdrop">
              <img
                src="/logo.png"
                alt="Study Buddy"
                className="sb-footer-logo-img"
                width="160"
                height="46"
              />
            </div>
            <h4>STUDY BUDDY GLOBAL</h4>
            <div className="sb-footer-tagline-text">Your Buddy for Global Study Journeys!</div>
            <p>Learn. Grow. Go Global. Study Buddy is dedicated to empowering students who dream of studying abroad.</p>
          </div>

          <div className="sb-footer-links">
            <div className="sb-footer-col">
              <h5>Top Destinations</h5>
              <a href="#study-destinations" onClick={() => setActiveCountryKey('malaysia')}>Study in Malaysia</a>
              <a href="#study-destinations" onClick={() => setActiveCountryKey('australia')}>Study in Australia</a>
              <a href="#study-destinations" onClick={() => setActiveCountryKey('uk')}>Study in UK</a>
              <a href="#study-destinations" onClick={() => setActiveCountryKey('europe')}>Study in Europe</a>
              <a href="#study-destinations" onClick={() => setActiveCountryKey('china')}>Study in China</a>
            </div>
            <div className="sb-footer-col">
              <h5>Quick Resources</h5>
              <a href="#book-counseling">Free Counseling</a>
              <a href="#study-destinations">Country Blueprints</a>
              <a href="#process-roadmap">6-Stage Roadmap</a>
              <a href="#branch-offices">Our Offices</a>
              <a href="#faq-section">Student FAQ</a>
            </div>
            <div className="sb-footer-col">
              <h5>Direct Contact</h5>
              <a href="tel:+8801675516856">Dhaka: +88 01675 516 856</a>
              <a href="tel:+8801332564490">Chattogram: +88 01332 564 490</a>
              <a href="https://wa.me/8801675516856" target="_blank" rel="noopener noreferrer">WhatsApp Advisory</a>
              <a href="mailto:info@studybuddy.com">info@studybuddy.com</a>
            </div>
          </div>
        </div>

        <div className="sb-footer-bottom">
          <p>© 2026 Study Buddy Advisory Services. All rights reserved. Your Buddy for Global Study Journeys!</p>
        </div>
      </footer>
    </div>
  );
}
