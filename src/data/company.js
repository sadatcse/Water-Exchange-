// Company content shown across the public pages (services, expertise, clients, FAQ).
// Products, team, client logos and blog posts live in MongoDB and are managed from the dashboard.
// Contact details and the founder live in src/config/site.js. Images live in public/images.
import {
  FaIndustry, FaBuilding, FaTint, FaFileSignature, FaTrashAlt, FaRecycle, FaChalkboardTeacher, FaMicrochip,
  FaMapMarkedAlt, FaBriefcaseMedical, FaFlask, FaLeaf, FaHandsWash, FaChartLine, FaMicroscope, FaClipboardCheck,
  FaSyncAlt, FaWater, FaMountain, FaSeedling, FaAward, FaLightbulb, FaChartBar, FaGlobeAsia, FaComments, FaVial,
  FaTools, FaCertificate, FaFileAlt, FaDraftingCompass, FaCogs, FaBolt, FaSmileBeam, FaCalendarCheck, FaFolderOpen,
  FaHandHoldingUsd, FaBullseye, FaEye,
} from 'react-icons/fa';

// "Our Key Services" — the six service groups (id = anchor on /services)
export const keyServices = [
  {
    id: 'environment-management',
    icon: FaClipboardCheck,
    title: 'Environment Management',
    items: ['Yearly water test', 'Yearly paper renewal', 'Monthly basis monitoring', 'Check log book'],
  },
  {
    id: 'environment-report',
    icon: FaFileAlt,
    title: 'Environment Report',
    items: ['EMP report', 'IEE report', 'EIA report', 'ZLD plan'],
  },
  {
    id: 'design-drawing',
    icon: FaDraftingCompass,
    title: 'Environmental Design & Drawing',
    items: ['ETP drawing', 'STP drawing', 'WTP drawing', 'ETP, STP & WTP maintenance'],
  },
  {
    id: 'chemical-machineries',
    icon: FaCogs,
    title: 'Chemical & Machineries',
    items: ['Domestic water filter', 'Water treatment chemical', 'ETP machineries', 'STP machineries'],
  },
  {
    id: 'captive-power-plants',
    icon: FaBolt,
    title: 'Captive Power Plants (CPPs)',
    items: ['Environmental Clearance Certificate for diesel / gas generators', 'Yearly paper renewal for CPPs'],
  },
  {
    id: 'sustainability-research',
    icon: FaLeaf,
    title: 'Environmental Sustainability Research',
    items: ['E-waste & research', 'Environmental sustainability', 'Capacity building', 'Compost plant', 'Proposal & report'],
  },
];

// The four treatment services on the business card (hero card + /services detail rows)
export const coreServices = [
  {
    id: 'etp',
    icon: FaIndustry,
    short: 'ETP',
    title: 'Effluent Treatment Plant',
    text: 'Design and installation of ETPs that treat industrial wastewater — dyeing, washing, textile and food processing — to DOE discharge standards.',
    points: ['Capacity & load assessment', 'Process design & drawings', 'Installation & commissioning'],
  },
  {
    id: 'stp',
    icon: FaBuilding,
    short: 'STP',
    title: 'Sewage Treatment Plant',
    text: 'Compact STPs for residential buildings, hospitals, offices and factories — customised designs or readymade plants.',
    points: ['Building & site survey', 'System sizing & layout', 'Installation & operator training'],
  },
  {
    id: 'wtp',
    icon: FaTint,
    short: 'WTP',
    title: 'Water Treatment Plant',
    text: 'Water treatment for safe drinking and process water — iron removal, filtration, softening and disinfection.',
    points: ['Raw water analysis', 'Treatment train design', 'Maintenance & chemicals'],
  },
  {
    id: 'doe',
    icon: FaFileSignature,
    short: 'DOE',
    title: 'DOE Water Test & Clearance',
    text: 'Department of Environment (DOE) water testing and Environmental Clearance Certificate (ছাড়পত্র) — new applications and yearly renewals, start to finish.',
    points: ['DoE-standard water tests', 'Documents & application', 'Yearly renewal'],
  },
];

// "Our Expertise"
export const expertise = [
  { icon: FaChalkboardTeacher, title: 'Capacity Building', text: 'Empowering teams through specialized training programs in environmental compliance, assessment methodologies, and sustainable management practices for long-term success.' },
  { icon: FaMicrochip, title: 'E-Waste', text: 'Comprehensive e-waste management solutions ensuring safe disposal, recycling, regulatory compliance, and environmental protection for electronic and hazardous waste materials.' },
  { icon: FaMicroscope, title: 'Research', text: 'Conducting cutting-edge environmental research, impact studies, and sustainability assessments to drive evidence-based solutions and informed decision-making for complex projects.' },
  { icon: FaMapMarkedAlt, title: 'GIS', text: 'Advanced GIS mapping and spatial analysis for environmental planning, impact assessment, land use optimization, and data-driven project visualization and decision support.' },
  { icon: FaFlask, title: 'Waste Characterization', text: 'Detailed waste analysis and characterization services identifying composition, classification, and disposal requirements to ensure proper management, compliance, and environmental safety.' },
  { icon: FaMountain, title: 'Landfill', text: 'Expert landfill design, site assessment, and management solutions ensuring safe waste disposal, environmental protection, leachate control, and full regulatory compliance throughout operations.' },
  { icon: FaGlobeAsia, title: 'EIA', text: 'Comprehensive Environmental Impact Assessments evaluating project effects on ecosystems, communities, and resources with detailed mitigation strategies ensuring regulatory compliance and sustainable development.' },
  { icon: FaLeaf, title: 'Carbon Credit', text: 'Strategic carbon credit advisory services including emission assessments, offset project development, verification, and trading guidance to achieve sustainability goals and regulatory compliance.' },
];

// Broader specialist fields (timeline on /expertise)
export const specialties = [
  { icon: FaAward, title: 'Environmental Excellence', text: 'Assessments, waste management and treatment plant design that keep you compliant and protect the environment.' },
  { icon: FaLightbulb, title: 'Sustainable Solutions', text: 'EIA / IEE assessments, waste-to-resource strategies and carbon management tailored to your project.' },
  { icon: FaRecycle, title: 'Integrated Waste Management', text: 'End-to-end waste solutions — from characterization and collection to treatment and disposal — for solid, e-waste, medical and plastic waste.' },
  { icon: FaTint, title: 'Water & Sanitation', text: 'Water supply systems, wastewater treatment plants (ETP / STP / WTP) and WASH infrastructure for communities, industries and commercial facilities.' },
  { icon: FaChartBar, title: 'Research & GIS Analytics', text: 'Environmental research and GIS-based spatial analysis for data-driven decisions, impact studies and project planning.' },
  { icon: FaSyncAlt, title: 'Circular Economy & Climate Action', text: 'Waste-to-resource programmes, compost facilities and carbon credit strategies that turn challenges into opportunities.' },
];

// Full consultancy list (/services)
export const services = [
  { icon: FaTrashAlt, title: 'Solid Waste Management', text: 'Integrated solutions for sustainable waste collection, treatment and disposal.' },
  { icon: FaRecycle, title: 'Plastic Waste Management', text: 'Plastic waste collection, recycling, reduction and compliance solutions.' },
  { icon: FaChalkboardTeacher, title: 'Capacity Building', text: 'Training programmes that build environmental compliance know-how in your team.' },
  { icon: FaMicrochip, title: 'E-Waste', text: 'Safe electronic waste disposal, recycling and regulatory compliance.' },
  { icon: FaMapMarkedAlt, title: 'GIS', text: 'Spatial mapping and analysis for environmental project planning.' },
  { icon: FaBriefcaseMedical, title: 'Medical Waste', text: 'Safe healthcare waste collection, treatment, disposal and compliance.' },
  { icon: FaFlask, title: 'Waste Characterization', text: 'Detailed waste analysis — composition, classification and disposal requirements.' },
  { icon: FaLeaf, title: 'Carbon Credit', text: 'Carbon emission assessment, offset development and trading advisory.' },
  { icon: FaHandsWash, title: 'WASH', text: 'Water, sanitation and hygiene infrastructure for healthy communities.' },
  { icon: FaChartLine, title: 'Development Study', text: 'Feasibility and impact studies for sustainable development.' },
  { icon: FaMicroscope, title: 'Research', text: 'Evidence-based environmental research that drives practical solutions.' },
  { icon: FaClipboardCheck, title: 'Evaluation', text: 'Independent evaluation of environmental performance and compliance.' },
  { icon: FaSyncAlt, title: 'Circular Economy', text: 'Waste-to-resource strategies that add recycling and economic value.' },
  { icon: FaWater, title: 'Water Supply', text: 'Water supply infrastructure design, distribution and quality management.' },
  { icon: FaMountain, title: 'Landfill', text: 'Engineered landfill design, management and environmental protection.' },
  { icon: FaSeedling, title: 'Compost Plant', text: 'Organic waste composting facilities and sustainable nutrient recovery.' },
];

export const whatWeDo = [
  { title: 'Environmental Impact Assessment', text: 'EIA / IEE studies that evaluate project impacts and deliver mitigation plans for sustainable development and regulatory approval.' },
  { title: 'Waste Management Solutions', text: 'Characterization, treatment plant design and disposal systems for solid, medical, plastic and e-waste — with full DOE compliance.' },
  { title: 'Water & Treatment Design', text: 'Design and optimisation of water supply systems and treatment plants (ETP / STP / WTP) to regulatory standards.' },
];

export const mission = {
  icon: FaBullseye,
  title: 'Our Mission',
  text: 'To become the premier environmental consultancy in Bangladesh by providing seamless, record-time water testing and regulatory compliance services. We empower industries and hospitals to focus on their core operations while we handle their environmental documentation with speed, transparency, and integrity.',
};

export const vision = {
  icon: FaEye,
  title: 'Our Vision',
  text: 'Our goal is to be the consultant of choice for industrial and hospital environments, driving excellence through market-leading expertise.',
};

export const ceoMessage = {
  headline: 'Excellence driven by discipline.',
  text: 'We leverage years of expertise and thorough due diligence to give our clients a competitive edge. We don’t just meet standards — we set them. We take the stress out of compliance by delivering your Yearly EC Certificate renewal, including two DoE-standard water tests, in record time every year.',
};

export const whyChooseUs = [
  { icon: FaSmileBeam, title: 'Zero-Stress Compliance & Timely Renewals', text: 'We keep track of your deadlines and deliver your yearly Environmental Clearance renewal on time — no last-minute rush, no fines.' },
  { icon: FaCalendarCheck, title: 'The “30-Day Guarantee” Water Sampling', text: 'Water sampling and DoE-standard testing completed within our 30-day guarantee.' },
  { icon: FaFolderOpen, title: 'Total Environmental Paperwork Support', text: 'From new ECC applications to renewals, reports and DOE notices — we prepare, submit and follow up every document.' },
  { icon: FaHandHoldingUsd, title: 'Expertise That Fits Your Budget', text: 'In-house engineering expertise at a price that works for factories, hospitals and buildings of every size.' },
];

// "Interesting facts about us" — value counts up on screen
export const facts = [
  { value: 300, suffix: '+', label: 'Projects completed', text: 'A proven track record — 300+ projects isn’t just a number.' },
  { value: 200, suffix: '+', label: 'Companies & hospitals consulted', text: 'Corporate companies and hospitals trust us with their compliance.' },
  { value: 95, suffix: '+', label: 'Power plants cleared', text: 'Clearance secured for 95+ gas and diesel generator power plants.' },
  { value: 800, suffix: '+', label: 'DoE-standard water tests', text: 'Water tests delivered for ETPs, STPs and yearly EC Certificate renewals.' },
];

export const promises = [
  { title: 'The “Stress-Free” Guarantee', text: 'Beyond just managing paperwork — we take the stress out of compliance.' },
  { title: 'In-house engineering brilliance', text: 'Our own engineers design, test and report — nothing is outsourced to chance.' },
];

export const processSteps = [
  { icon: FaComments, title: 'Consultation & site visit', text: 'We understand your facility, its water use and what the DOE expects from you.' },
  { icon: FaVial, title: 'Testing & assessment', text: 'Samples are collected and tested to DoE standards; we explain the results in plain language.' },
  { icon: FaTools, title: 'Design & installation', text: 'We design the right ETP, STP or WTP and install and commission it on site.' },
  { icon: FaCertificate, title: 'DOE clearance & renewals', text: 'We prepare the documents, follow the application through and handle every yearly renewal.' },
];


export const partners = [
  { name: 'UNDP', logo: '/images/partners/undp.webp', sector: 'Development partner' },
  { name: 'JICA', logo: '/images/partners/jica.webp', sector: 'Development partner' },
  { name: 'BRAC', logo: '/images/partners/brac.webp', sector: 'Development partner' },
  { name: 'IFRC', logo: '/images/partners/ifrc.webp', sector: 'Red Cross & Red Crescent' },
  { name: 'NGO Forum for Public Health', logo: '/images/partners/ngo-forum.webp', sector: 'Development partner' },
];

// Campaign posters (Bangla) in public/images/projects — title is the English meaning, used as caption and alt text
export const projects = [
  { src: '/images/projects/power-plant-clearance.webp', title: 'Clearance secured for 20+ gas & diesel power plants', tag: 'Captive power plants' },
  { src: '/images/projects/hospital-management.webp', title: 'Hospital management — full support for environment & water test reports', tag: 'Hospitals' },
  { src: '/images/projects/stp-design-approval.webp', title: 'Professional design, accurate drawings and fast STP approval', tag: 'STP' },
  { src: '/images/projects/smart-building-stp.webp', title: 'Smart STP solutions for buildings — top performance in little space', tag: 'STP' },
  { src: '/images/projects/etp-needs-stp.webp', title: 'An ETP alone isn’t enough — a separate STP is mandatory for toilet & bath water', tag: 'ETP & STP' },
  { src: '/images/projects/clearance-renewal-report.webp', title: 'Afraid of late reports for your clearance renewal? We submit on time', tag: 'DOE renewal' },
  { src: '/images/projects/timely-renewal.webp', title: 'Renew on time and avoid fines — leave the paperwork to us', tag: 'DOE renewal' },
  { src: '/images/projects/etp-stp-water-test.webp', title: 'Your ETP / STP water test report, right on time', tag: 'Water test' },
  { src: '/images/projects/high-end-consultancy.webp', title: 'The high-end environment consultancy firm in Bangladesh', tag: 'Water Exchange' },
];

export const industries = [
  { icon: FaIndustry, title: 'Garments & textiles', text: 'ETPs for dyeing, washing and knitting units, plus DOE clearance and yearly renewals.' },
  { icon: FaBriefcaseMedical, title: 'Hospitals & healthcare', text: 'STPs, water testing and environment reports for hospitals.' },
  { icon: FaBolt, title: 'Captive power plants', text: 'Environmental clearance and yearly renewal for gas and diesel generators.' },
  { icon: FaGlobeAsia, title: 'Development partners', text: 'Research, baseline surveys and evaluations for NGOs and international agencies.' },
];

// FAQ grouped by topic (/faq). home: true = also shown on the home page.
export const faqGroups = [
  {
    id: 'renewal',
    title: 'DOE renewal & water testing',
    items: [
      { home: true, q: 'How do you help with DOE paper renewal?', a: 'We handle all documentation, testing, and submission processes to renew your environmental clearance certificate efficiently and on time.' },
      { q: 'What is the “6-month alternative basis” water test?', a: 'It’s a bi-annual water quality testing schedule where tests are conducted every six months to maintain DOE compliance.' },
      { q: 'Is paper-based renewal still available at the DoE?', a: 'Currently, most renewals are processed online through the DOE portal, though some paper submissions may still be accepted for specific cases.' },
      { home: true, q: 'How often should I conduct water quality testing for my industry?', a: 'Testing frequency depends on your industry category — typically quarterly or bi-annually as per DOE requirements.' },
      { home: true, q: 'Can you help if my industry has received a notice from the DOE?', a: 'Yes, we provide urgent compliance support, documentation correction, and liaison services to resolve DOE notices promptly.' },
    ],
  },
  {
    id: 'treatment-plants',
    title: 'ETP, STP & WTP',
    items: [
      { home: true, q: 'What is the difference between an ETP and STP?', a: 'ETP (Effluent Treatment Plant) treats industrial wastewater, while STP (Sewage Treatment Plant) treats domestic/sanitary wastewater.' },
      { q: 'What design services do you provide for treatment plants?', a: 'We design WWTP, ETP, STP, and WTP facilities. Services include conceptual design, detailed engineering, process selection, equipment specification, hydraulic modeling, and construction drawings — all ensuring regulatory compliance and optimal performance.' },
      { home: true, q: 'Can you help if my current ETP/STP is failing DOE standards?', a: 'Yes. We audit your facility, identify compliance gaps, and provide tailored solutions including process optimization, equipment upgrades, and operational improvements to meet Department of Environment standards efficiently and cost-effectively.' },
      { q: 'Do you provide customised ETP/STP design or readymade plants?', a: 'We offer both customised treatment plant designs tailored to your needs and readymade solutions for standard requirements.' },
      { q: 'How much space is required to install a Sewage Treatment Plant?', a: 'Space requirements vary based on capacity and technology — typically 100–500 sq ft for small to medium installations.' },
      { q: 'Do you provide maintenance and chemicals for water treatment?', a: 'Yes, we offer comprehensive maintenance services and supply treatment chemicals for optimal plant performance.' },
      { q: 'Why is an iron removal plant necessary for my factory?', a: 'High iron content damages equipment, stains products, and violates water quality standards, making removal essential for operations.' },
    ],
  },
  {
    id: 'eia-ecc',
    title: 'EIA, IEE & ECC',
    items: [
      { q: 'What is the difference between IEE, EIA, and EMP?', a: 'IEE is a preliminary screening for minor impacts. EIA is a comprehensive study for significant impacts. EMP is the action plan detailing how to manage and mitigate identified impacts during implementation.' },
      { q: 'Does my project need an EIA/IEE report?', a: 'It depends on scale, location, and environmental impact. Large developments and sensitive-area projects typically require EIA; smaller projects need IEE. We offer free consultations to determine your specific requirements.' },
      { q: 'What documents do I need to provide for a new ECC application?', a: 'Required documents include project details, site plans, land ownership papers, business registration, and existing environmental studies. Requirements vary by project type. We provide a complete checklist and guide you through documentation.' },
      { q: 'How long does the DOE approval process take?', a: 'IEE approvals take 30–60 days; EIA approvals require 3–6 months or longer. Timeline depends on project complexity, document completeness, and stakeholder consultation requirements. We expedite processes while ensuring compliance.' },
    ],
  },
  {
    id: 'power-plants',
    title: 'Captive power plants',
    items: [
      { q: 'Is an Environmental Clearance Certificate (ECC) mandatory for all Captive Power Plants?', a: 'Yes, ECC is mandatory for Captive Power Plants with capacity of 5 MW or above. Coal, lignite, or petroleum-based plants require clearance regardless of size. Smaller plants using cleaner fuels may be exempt but need State Pollution Control Board consent.' },
      { q: 'How long does the clearance process take for Captive Power Plants, and how often must it be renewed?', a: 'The ECC process takes 45–60 days depending on project category. Once granted, it’s valid for the project’s lifetime without renewal. However, bi-annual compliance reports are mandatory and work must commence within 7 years.' },
    ],
  },
  {
    id: 'general',
    title: 'General',
    items: [{ home: true, q: 'What areas of Bangladesh do you serve?', a: 'We provide services nationwide across all divisions and industrial zones in Bangladesh.' }],
  },
];

export const faqs = faqGroups.flatMap((g) => g.items);
export const homeFaqs = faqs.filter((f) => f.home);
