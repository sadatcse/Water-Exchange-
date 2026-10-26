// Starter blog posts loaded by `npm run seed` (only posts whose slug is not in the database yet).
// After seeding, posts are edited from Dashboard → Blog. Cover images are hosted on Unsplash.
const unsplash = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

export const seedBlogPosts = [
  {
    slug: 'how-an-effluent-treatment-plant-works',
    title: 'How an Effluent Treatment Plant Works: A Step-by-Step Guide for Factory Owners',
    category: 'Water Treatment',
    coverImage: unsplash('1513828583688-c52646db42da'),
    publishedAt: '2026-10-20',
    tags: ['ETP', 'Textiles', 'Wastewater'],
    excerpt: 'From the equalization tank to the final clarifier — what happens to your wastewater at each stage of an ETP, and why every stage matters for DOE compliance.',
    content: `An effluent treatment plant (ETP) takes the coloured, chemical-heavy water that leaves a dyeing, washing or processing unit and makes it safe to discharge. Most factories only see the inlet and the outlet, but the real work happens in between.

## 1. Screening and equalization
Wastewater first passes a bar screen that catches fibres, plastic and other solids. It then collects in an equalization tank, where mixers or diffused air keep it uniform. Factories discharge in bursts — a dye bath dump can change the pH and temperature in minutes — so equalization smooths those peaks before treatment.

## 2. Chemical treatment
In a physico-chemical ETP, coagulants and flocculants are dosed to bind fine particles and colour into larger flocs. Dosing pumps add exactly the right amount, and the pH is corrected so the chemistry works.

## 3. Biological treatment
In a biological or combined ETP, the water moves to an aeration tank. Blowers push air through diffusers on the tank floor so bacteria have the oxygen they need to break down organic matter. This is the stage that brings BOD and COD down.

## 4. Settling and sludge handling
A clarifier lets the flocs and biomass settle. Clear water flows over the top; the settled sludge is returned to the aeration tank or sent to a sludge thickener and filter press for drying and safe disposal.

## 5. Polishing and monitoring
A pressure sand filter and activated carbon filter remove what remains. An online analyzer and flow meter at the outlet record pH, flow and other parameters, giving you evidence for your DOE reports.

## What this means for you
- An undersized plant is the most common reason for failed water tests.
- Blowers, pumps and meters need planned maintenance, not just repairs.
- Keep your daily logbook — DOE inspectors ask for it.

If you are planning a new ETP or your current plant struggles to meet the standards, our engineers can review your flow data and recommend a solution.`,
  },
  {
    slug: 'doe-environmental-clearance-certificate-guide',
    title: 'Getting an Environmental Clearance Certificate from the DOE: What You Need to Know',
    category: 'Compliance',
    coverImage: unsplash('1581092160562-40aa08e78837'),
    publishedAt: '2026-10-08',
    tags: ['DOE', 'ECC', 'Bangladesh'],
    excerpt: 'Every industrial unit in Bangladesh needs an Environmental Clearance Certificate. Here is how the category of your project shapes the process and the documents you will need.',
    content: `The Department of Environment (DOE) requires industrial units and projects in Bangladesh to hold an Environmental Clearance Certificate (ECC) before they operate, and to renew it on time. The process depends heavily on how your project is classified.

## Your project category comes first
Under the Environment Conservation Rules, projects are grouped by their pollution potential. A small, low-impact unit follows a simpler route; projects with a higher impact need more studies, such as an Initial Environmental Examination (IEE) or a full Environmental Impact Assessment (EIA), before clearance is granted.

## Documents you will usually need
- Trade licence and proof of land ownership or lease
- Location map and factory layout
- Process flow diagram and list of raw materials
- Design and drawings of the ETP or STP, where wastewater is produced
- No-objection letters from the local authority where required
- Environmental studies appropriate to your category

## Common reasons for delay
Applications are most often held back by incomplete drawings, a treatment plant design that does not match the production capacity, or missing water test reports. Starting the ETP design early saves months.

## Renewal is not optional
An ECC has to be renewed on schedule. Late renewal can lead to fines and, in the worst case, closure orders. Keep a calendar of expiry dates and prepare your renewal reports well before the deadline.

## How we help
Water Exchange prepares the documents, designs the treatment plant, arranges water testing and follows your application through the DOE — and we handle each yearly renewal so you never miss a deadline.`,
  },
  {
    slug: 'sewage-treatment-plants-for-buildings',
    title: 'Why Your Building Needs a Sewage Treatment Plant — and How to Size One',
    category: 'Water Treatment',
    coverImage: unsplash('1541888946425-d81bb19240f5'),
    publishedAt: '2026-09-24',
    tags: ['STP', 'Buildings', 'RAJUK'],
    excerpt: 'Hospitals, apartment blocks and commercial buildings produce sewage every hour. A properly sized STP protects public health and keeps approvals on track.',
    content: `Sewage from toilets, kitchens and bathrooms carries pathogens and organic load that should never reach drains or water bodies untreated. For hospitals, residential towers, hotels and factories with large workforces, a sewage treatment plant (STP) is the practical answer.

## An ETP is not an STP
Factories sometimes assume their effluent treatment plant can take domestic sewage as well. The two waste streams are very different, and mixing them upsets the treatment process. Domestic sewage needs its own STP.

## How an STP is sized
Sizing starts with the population the building serves and the expected water use per person. From there the engineer works out:
- The daily flow and the peak hourly flow
- The organic load (BOD) the biological stage must remove
- The tank volumes and the air the blowers must supply
- The space available — compact designs suit basements and tight plots

## Choosing the technology
Conventional activated sludge works well where space allows. Where it does not, compact packaged systems, moving-bed bioreactors or membrane systems treat the same load in a fraction of the footprint.

## Operation decides performance
Even a well-designed STP fails without care. Blowers must run on schedule, sludge must be removed regularly, and the treated water should be tested periodically.

We design STPs for buildings of every size, prepare the drawings for approval and install and commission the plant on site.`,
  },
  {
    slug: 'water-quality-testing-parameters-explained',
    title: 'pH, BOD, COD and TSS: The Water Test Parameters Explained',
    category: 'Compliance',
    coverImage: unsplash('1532187643603-ba119ca4109e'),
    publishedAt: '2026-09-10',
    tags: ['Water testing', 'Laboratory', 'DOE'],
    excerpt: 'Your water test report is full of abbreviations. This plain-language guide explains what each key parameter measures and what a bad result usually means.',
    content: `Water test reports are a regular part of environmental compliance, but the parameters on them are rarely explained. Here is what the most common ones mean.

## pH
pH shows how acidic or alkaline the water is. Dyeing and washing processes can swing it sharply in either direction. Treated effluent needs to stay within a neutral band; a reading outside it usually points to a problem with chemical dosing or equalization.

## BOD — Biochemical Oxygen Demand
BOD measures how much oxygen bacteria need to break down the organic matter in the water. A high BOD means the effluent would starve a river of oxygen. In an ETP or STP, the biological stage is responsible for bringing BOD down.

## COD — Chemical Oxygen Demand
COD measures the oxygen needed to oxidise everything in the water chemically, including substances bacteria cannot easily digest. COD is always higher than BOD; a large gap between them suggests hard-to-treat chemicals.

## TSS — Total Suspended Solids
TSS is the amount of solid particles floating in the water. High TSS usually means the clarifier or filters are not working well, or that sludge is not being removed often enough.

## Other parameters you may see
- Dissolved oxygen (DO) in the aeration tank
- Total dissolved solids (TDS) and electrical conductivity
- Colour, oil and grease, and heavy metals for specific industries

## Getting reliable results
Samples must be collected correctly, preserved and delivered to the laboratory quickly. We arrange sampling and testing for ETPs and STPs and deliver your report on time for DOE submissions.`,
  },
  {
    slug: 'roots-blower-or-turbo-blower',
    title: 'Roots Blower or Turbo Blower? Choosing the Right Aeration Blower',
    category: 'Water Treatment',
    coverImage: unsplash('1621905252507-b35492cc74b4'),
    publishedAt: '2026-08-27',
    tags: ['Blowers', 'Aeration', 'Energy'],
    excerpt: 'Aeration is often the largest electricity cost in a treatment plant. Here is how Roots and turbo blowers compare, and when each one makes sense.',
    content: `In a biological ETP or STP, blowers supply the air that keeps bacteria alive. Because they run around the clock, the choice of blower affects your power bill for years.

## Roots (rotary lobe) blowers
A Roots blower moves a fixed volume of air with every turn of its lobes. It is robust, simple to maintain and delivers steady airflow even when the pressure changes.
- Lower purchase price
- Suits small and medium plants
- Airflow is fixed at a given speed unless a VFD is added

## Turbo blowers
A turbo blower uses a high-speed impeller and inverter control. Airflow can follow the oxygen demand of the tank, so the blower slows down when less air is needed.
- Higher purchase price
- Very efficient on large plants with varying load
- Quiet operation and a compact footprint

## How to decide
Start with the air demand your plant actually needs, including future expansion. For a small plant with a steady load, a Roots blower is usually the sensible choice. For a large plant, or one where the load changes through the day, the energy saved by a turbo blower can repay the extra cost.

## Don't forget the diffusers
Even the best blower wastes energy if the diffusers are clogged or poorly laid out. Fine bubble diffusers transfer oxygen far more efficiently than coarse bubble types.

Our engineers size blowers from your plant data and supply Roots and turbo blowers with installation and after-sales support.`,
  },
  {
    slug: 'plastic-waste-coxs-bazar-baseline-survey',
    title: 'Assessing Plastic Waste Conditions in Cox’s Bazar and Rohingya Camps: A Baseline Survey',
    category: 'Research',
    coverImage: unsplash('1530587191325-3db32d826c18'),
    publishedAt: '2026-08-12',
    tags: ['Plastic', 'Research', 'Cox’s Bazar'],
    excerpt: 'A waste audit and baseline survey, including the registration of waste workers, to understand plastic waste conditions in Cox’s Bazar and the Rohingya camps.',
    content: `Plastic waste is one of the most visible environmental challenges in Cox’s Bazar, where a tourist economy and one of the world’s largest refugee settlements sit side by side.

## Why a baseline matters
Before any programme can reduce plastic waste, it needs to know how much waste is produced, what it is made of and where it ends up. A baseline survey provides that starting point and lets future progress be measured.

## What the survey covered
- A waste audit to measure the types and quantities of plastic waste
- Mapping of collection points, informal dumping sites and recycling routes
- Registration of waste workers, many of whom work informally
- Interviews with households, shopkeepers and community leaders

## The role of waste workers
Informal waste pickers recover much of the plastic that is recycled. Registering them is the first step towards safer working conditions, fair prices and their inclusion in formal waste management.

## From findings to action
The results give programme planners a clear picture of where plastic leaks into the environment and which interventions — collection, segregation, recycling or reduction at source — will have the most effect.

Water Exchange carries out baseline surveys, waste audits and evaluations for development partners and NGOs across Bangladesh.`,
  },
  {
    slug: 'solid-waste-management-for-industries',
    title: 'Solid Waste Management for Industries: From Segregation to Safe Disposal',
    category: 'Waste Management',
    coverImage: unsplash('1532996122724-e3c354a0b15b'),
    publishedAt: '2026-07-29',
    tags: ['Solid waste', 'Segregation', 'Recycling'],
    excerpt: 'Fabric scraps, packaging, sludge and chemical containers each need their own route. A simple waste plan keeps your factory compliant and can even earn revenue.',
    content: `Every factory produces solid waste: offcuts, packaging, used chemical containers, ETP sludge and general rubbish. Treating it all as one pile is expensive and risky.

## Start with segregation
Separate waste where it is produced, using clearly labelled, colour-coded bins:
- Recyclables such as paper, cardboard and clean plastics
- Textile offcuts and yarn waste
- Hazardous waste such as chemical containers, oils and batteries
- ETP sludge, which needs its own handling
- General waste

## Know your hazardous waste
Hazardous waste must be stored safely, labelled and handed only to authorised handlers. Keep records of quantities and the handover documents — auditors and the DOE may ask for them.

## Turn waste into value
Clean, segregated recyclables have a market. Textile waste can be sold for recycling, and cardboard and plastics fetch better prices when they are not contaminated.

## Write it down
A written waste management plan should name who is responsible, describe storage areas, list approved contractors and set out how records are kept. Train staff so the plan is followed on every shift.

We help factories prepare waste management plans, set up segregation systems and meet buyer and DOE requirements.`,
  },
  {
    slug: 'zero-liquid-discharge-textile-industry',
    title: 'Zero Liquid Discharge: Is It Right for Your Textile Factory?',
    category: 'Water Treatment',
    coverImage: unsplash('1518837695005-2083093ee35b'),
    publishedAt: '2026-07-15',
    tags: ['ZLD', 'Water reuse', 'Textiles'],
    excerpt: 'Zero liquid discharge recycles almost all of a factory’s wastewater. It saves groundwater but needs careful planning. Here is what is involved.',
    content: `Zero liquid discharge (ZLD) is a treatment approach in which a factory recovers and reuses almost all of its wastewater, leaving only solid residue behind. With groundwater levels falling in industrial areas, interest in ZLD is growing.

## How ZLD works
A ZLD system builds on a conventional ETP:
- Biological and chemical treatment remove most pollutants
- Ultrafiltration and reverse osmosis recover clean water for reuse
- The concentrated reject is evaporated, leaving salts as a solid

## The benefits
- Large reductions in groundwater extraction
- A reliable water supply for the process
- A strong position with international buyers that set water targets

## The challenges
ZLD systems cost more to build and run, mainly because of the energy needed for evaporation. They also need skilled operators and careful handling of the solid residue.

## A step-by-step path
Many factories start with partial recycling — reusing treated water for washing, cooling or toilets — before moving towards full ZLD. An audit of water use often reveals easy savings first.

We assess water use, design recycling systems and help factories plan a realistic route towards zero liquid discharge.`,
  },
  {
    slug: 'environmental-impact-assessment-explained',
    title: 'Environmental Impact Assessment (EIA): What It Involves and Why It Matters',
    category: 'Compliance',
    coverImage: unsplash('1497436072909-60f360e1d4b1'),
    publishedAt: '2026-06-30',
    tags: ['EIA', 'IEE', 'Planning'],
    excerpt: 'Large projects need an EIA before they get environmental clearance. Here is what the study covers and how it shapes a better project.',
    content: `An Environmental Impact Assessment (EIA) studies how a proposed project will affect the air, water, land, wildlife and people around it — and how those effects can be avoided or reduced. For projects with significant impacts, it is a condition of environmental clearance.

## The main stages
- Screening and scoping: deciding which impacts need detailed study
- Baseline study: measuring the current state of air, water, noise, soil and ecology
- Impact prediction: estimating what will change once the project is built and running
- Mitigation: designing measures to avoid, reduce or offset the impacts
- Environmental Management Plan: setting out who will do what, and how it will be monitored

## Public consultation
Talking to the communities affected is a key part of a good EIA. Their knowledge often reveals issues that maps and models miss.

## More than a formality
Done properly, an EIA improves the project itself: a better site layout, a correctly sized treatment plant, or a drainage design that avoids flooding neighbours.

## IEE or EIA?
Projects with moderate impacts may need only an Initial Environmental Examination (IEE). The DOE category of the project decides which study is required.

Water Exchange prepares IEE and EIA reports, carries out baseline monitoring and supports clients through the review process.`,
  },
  {
    slug: 'water-treatment-plant-safe-drinking-water',
    title: 'Water Treatment Plants: Safe Drinking Water for Factories and Communities',
    category: 'Water Treatment',
    coverImage: unsplash('1548839140-29a749e1cf4d'),
    publishedAt: '2026-06-16',
    tags: ['WTP', 'Drinking water', 'Iron removal'],
    excerpt: 'Groundwater in many parts of Bangladesh carries iron, arsenic or high hardness. A water treatment plant matched to your source water fixes the problem.',
    content: `A water treatment plant (WTP) turns raw groundwater or surface water into water that is safe to drink or suitable for production. The right design depends entirely on what is in your source water.

## Test before you design
A full analysis of the raw water comes first. Common problems include:
- Iron and manganese, which stain fabrics and fittings
- Arsenic in some groundwater sources
- Hardness, which leaves scale in boilers and pipes
- Turbidity and bacteria in surface water

## Typical treatment steps
- Aeration and filtration to remove iron and manganese
- Pressure sand filters and activated carbon filters
- Softeners for hardness, or reverse osmosis for dissolved solids
- Disinfection with chlorine or UV before storage

## Water for production
Dyeing, boilers and cooling towers each have their own quality needs. Treating water correctly before it enters the process protects equipment and improves product quality.

## Keep it running
Filters need backwashing, media must be replaced on schedule and treated water should be tested regularly.

We design and install WTPs for factories, hospitals and communities, from compact iron removal units to complete drinking water systems.`,
  },
  {
    slug: 'rainwater-harvesting-for-factories',
    title: 'Rainwater Harvesting: A Simple Way to Cut Groundwater Use',
    category: 'Water Treatment',
    coverImage: unsplash('1437482078695-73f5ca6c96e2'),
    publishedAt: '2026-06-02',
    tags: ['Rainwater', 'Water saving', 'Sustainability'],
    excerpt: 'Large factory roofs collect millions of litres of rain every monsoon. Capturing it reduces groundwater pumping and can recharge the aquifer.',
    content: `Bangladesh receives heavy rainfall during the monsoon, yet many factories pump all of their water from deep tube wells. Rainwater harvesting puts that free resource to use.

## How it works
Rain falling on the roof is channelled through gutters and downpipes, passes a first-flush device that discards the dirtiest water, and is filtered into storage tanks. From there it can be used directly or treated further.

## Where to use harvested water
- Toilet flushing and floor washing
- Gardening and landscaping
- Cooling towers and some process uses after treatment
- Recharge wells that put water back into the ground

## Sizing the system
The amount you can collect depends on the roof area and local rainfall. Storage is usually the largest cost, so the tank size is balanced against how much water you can use during and after the monsoon.

## The benefits
- Lower pumping costs and less pressure on the aquifer
- Reduced flooding around the site during heavy rain
- A visible sustainability measure for buyers and auditors

We design rainwater harvesting and groundwater recharge systems as part of a wider water management plan.`,
  },
  {
    slug: 'industrial-air-emission-monitoring',
    title: 'Stack Emission Monitoring: Keeping Industrial Air Pollution in Check',
    category: 'Compliance',
    coverImage: unsplash('1611273426858-450d8e3c9fce'),
    publishedAt: '2026-05-19',
    tags: ['Air quality', 'Emissions', 'Generators'],
    excerpt: 'Boilers, generators and process stacks release gases that the DOE expects you to measure and control. Here is how emission monitoring works.',
    content: `Water is only part of the environmental picture. Boilers, captive power generators and process stacks release smoke and gases that affect workers and neighbours alike.

## What is measured
- Particulate matter (dust and soot)
- Sulphur dioxide and nitrogen oxides
- Carbon monoxide
- Stack temperature and gas flow

## Ambient air and noise
Besides the stack itself, monitoring often covers the air quality and noise levels around the site, especially for captive power plants and factories near homes.

## Controlling emissions
- Burner tuning and regular maintenance of boilers and generators
- Cleaner fuels where possible
- Dust collectors, cyclones or scrubbers for specific processes
- Correct stack height so emissions disperse safely

## Records for clearance renewal
Monitoring results are part of the reports submitted for environmental clearance renewal, particularly for captive power plants. Regular measurement also shows when equipment needs attention before it fails.

We arrange stack and ambient air monitoring and have secured clearance for more than twenty gas and diesel power plants.`,
  },
  {
    slug: 'solar-power-for-treatment-plants',
    title: 'Can Solar Power Run Your Treatment Plant?',
    category: 'Energy',
    coverImage: unsplash('1509391366360-2e959784a276'),
    publishedAt: '2026-05-05',
    tags: ['Solar', 'Energy', 'Cost saving'],
    excerpt: 'Treatment plants run every day of the year, which makes them a good match for rooftop solar. Here is how to estimate the savings.',
    content: `Blowers, pumps and mixers make an ETP or STP one of the steadiest electricity users on a site. That steady daytime demand makes treatment plants well suited to solar power.

## Start by cutting demand
Before adding solar, reduce the load:
- Replace old blowers with efficient models or add variable speed drives
- Control aeration by dissolved oxygen instead of running blowers flat out
- Fix leaking air pipes and clogged diffusers

## Sizing a solar system
The system is sized from the plant’s daytime electricity use and the roof or ground area available. A grid-connected system without batteries is usually the most economical, using solar power during the day and the grid at night.

## The benefits
- Lower electricity bills for decades
- Less reliance on diesel generators during the day
- A measurable cut in carbon emissions for sustainability reporting

## Things to check
Roof strength, shading, cleaning access and the condition of the electrical system all affect the design. Panels also need regular cleaning to keep their output up.

We review treatment plant energy use and recommend efficiency upgrades alongside renewable energy options.`,
  },
  {
    slug: 'capacity-building-ehs-team-training',
    title: 'Capacity Building: Training Your Team to Run a Compliant Plant',
    category: 'Training',
    coverImage: unsplash('1581091226825-a6a2a5aee158'),
    publishedAt: '2026-04-21',
    tags: ['Training', 'EHS', 'Operations'],
    excerpt: 'A treatment plant is only as good as the people who run it. Practical training for operators and EHS staff prevents most compliance failures.',
    content: `Many treatment plants that fail water tests are not badly designed — they are badly operated. Investing in the people who run the plant is one of the most effective compliance measures a factory can take.

## Who needs training
- ETP and STP operators who run the plant on every shift
- EHS officers who manage reporting and audits
- Maintenance staff who look after blowers, pumps and meters
- Managers who need to understand the risks and the costs

## What good training covers
- How each stage of the plant works and what can go wrong
- Daily checks, sampling and keeping the logbook
- Safe chemical handling and personal protective equipment
- Troubleshooting common problems such as foaming or poor settling
- What DOE inspectors and buyer auditors look for

## Learning by doing
Classroom sessions are useful, but operators learn most on their own plant. Combining short theory sessions with hands-on practice and written procedures gives the best results.

## Keep it going
Staff change, so training should be repeated and new operators should be trained before they work alone.

Water Exchange runs capacity building programmes in environmental compliance, assessment methods and sustainable management for factories and organisations.`,
  },
  {
    slug: 'circular-economy-textile-recycling',
    title: 'The Circular Economy in Garments: Turning Waste into Resources',
    category: 'Waste Management',
    coverImage: unsplash('1528323273322-d81458248d40'),
    publishedAt: '2026-04-07',
    tags: ['Recycling', 'Circular economy', 'Garments'],
    excerpt: 'Cutting-room waste, packaging and even treated water can go back into the economy. A circular approach lowers costs and meets buyer expectations.',
    content: `In a linear economy, materials are used once and thrown away. A circular economy keeps them in use for as long as possible. For the garment industry, that shift is both an environmental need and a business opportunity.

## Where the waste comes from
- Fabric offcuts from cutting rooms
- Rejected garments and samples
- Packaging such as cartons, poly bags and cones
- Water and chemicals from wet processing

## Closing the loop
- Segregated cotton offcuts can be recycled into new yarn
- Clean packaging can be baled and sold to recyclers
- Treated wastewater can be reused for washing, cooling or toilets
- Sludge can sometimes be used as a raw material for bricks or cement, where permitted

## Why buyers care
International brands increasingly set targets for recycled content and waste reduction. Factories that can show data on waste recovery are better placed in sourcing decisions.

## Getting started
Begin by measuring: how much waste of each type is produced, and where does it go? That baseline shows where the quickest wins are.

We carry out waste audits, design segregation systems and help factories build practical circular economy plans.`,
  },
  {
    slug: 'online-monitoring-effluent-quality',
    title: 'Online Monitoring: Real-Time Data on Your Effluent Quality',
    category: 'Water Treatment',
    coverImage: unsplash('1563986768609-322da13575f3'),
    publishedAt: '2026-03-24',
    tags: ['Monitoring', 'Analyzers', 'Flow meters'],
    excerpt: 'Online analyzers and flow meters show how your plant performs every minute, not just on the day of the water test.',
    content: `A water test shows how your treatment plant performed on the day the sample was taken. Online monitoring shows how it performs all the time.

## What is monitored
- pH and temperature at the inlet and outlet
- Dissolved oxygen in the aeration tank
- Total dissolved solids and conductivity
- Flow rate and total volume discharged

## The hardware
Sensors are installed in the tanks or pipes and connected to a controller. The controller displays readings, triggers alarms and can send data over RS485 or 4–20 mA signals to a PLC or a remote dashboard.

## Why it pays off
- Problems are caught within minutes, not weeks
- Blowers can be controlled by dissolved oxygen, saving energy
- Continuous records support DOE reports and buyer audits
- Flow data shows whether the plant is overloaded

## Keep sensors reliable
Sensors need regular cleaning and calibration. A sensor that drifts gives false confidence, so maintenance should be part of the operator’s routine.

We supply and install online analyzers and electromagnetic, vortex and open channel flow meters, with calibration and after-sales support.`,
  },
  {
    slug: 'solid-waste-management-seminar-brac-university-2024',
    title: 'Experts Gather at BRAC University for Solid Waste Management Seminar 2024',
    category: 'Events',
    coverImage: unsplash('1557804506-669a67965ba0'),
    publishedAt: '2026-03-10',
    tags: ['Seminar', 'Solid waste', 'JSMCWM'],
    excerpt: 'The Japan Society of Material Cycles and Waste Management (JSMCWM) hosted the Bangladesh Solid Waste Management Seminar 2024 at BRAC University.',
    content: `The Japan Society of Material Cycles and Waste Management (JSMCWM) hosted the Bangladesh Solid Waste Management Seminar 2024 at BRAC University, bringing together researchers, practitioners and policymakers.

## Why the seminar mattered
Rapid urban growth has put enormous pressure on waste collection and disposal in Bangladesh’s cities. The seminar created space to share research and practical experience from Bangladesh and Japan.

## Themes discussed
- Collection and segregation of municipal solid waste
- Plastic waste and recycling value chains
- The role of informal waste workers
- Landfill management and alternatives to open dumping
- Policy, financing and public awareness

## Learning from each other
Japan’s experience with material cycles and waste reduction offered useful lessons, while Bangladeshi practitioners highlighted the realities of working in dense, fast-growing cities.

## Our takeaway
Lasting improvement depends on cooperation between government, industry, researchers and communities — and on good data to guide decisions.

Water Exchange works on solid waste research, baseline surveys and management plans with partners across the country.`,
  },
  {
    slug: 'evaluation-please-project-plastic-waste',
    title: 'Evaluation of Plastic Waste Management Initiatives of the PLEASE Project',
    category: 'Research',
    coverImage: unsplash('1595278069441-2cf29f8005a4'),
    publishedAt: '2026-02-24',
    tags: ['Evaluation', 'Plastic', 'Research'],
    excerpt: 'An evaluation of the plastic waste management initiatives carried out under the PLEASE Project.',
    content: `Evaluation tells a programme what worked, what did not and why. We carried out an evaluation of the plastic waste management initiatives implemented under the PLEASE Project.

## What was evaluated
- How effectively plastic waste was collected and recovered
- The quality and sustainability of the recycling activities
- Changes in community awareness and behaviour
- The involvement and wellbeing of waste workers
- How well the project was managed and monitored

## How we worked
The evaluation combined document review, field visits, interviews with project staff and partners, and discussions with community members and waste workers. Quantitative data was checked against what we saw on the ground.

## Why independent evaluation matters
An outside view helps funders and implementers see results clearly, learn from challenges and design stronger follow-up programmes.

## Building on the findings
The findings point to practical recommendations for scaling up successful approaches and fixing weak links in the plastic waste value chain.

Water Exchange provides independent evaluations, baseline studies and research for development partners working on waste and the environment.`,
  },
  {
    slug: 'green-factory-certification-steps',
    title: 'Becoming a Green Factory: Practical Steps Towards Certification',
    category: 'Compliance',
    coverImage: unsplash('1542601906990-b4d3fb778b09'),
    publishedAt: '2026-02-10',
    tags: ['Green factory', 'Sustainability', 'Certification'],
    excerpt: 'Bangladesh is home to many green-certified factories. Water, energy and waste improvements are at the heart of every successful application.',
    content: `Bangladesh has become known for its green-certified garment factories. Certification rewards buildings that use less water and energy, manage waste well and provide a healthy workplace.

## Where to focus
- Water: efficient fixtures, water recycling, rainwater harvesting and a well-run ETP
- Energy: efficient lighting, motors and blowers, plus renewable energy
- Materials and waste: recycled materials, segregation and recycling
- Indoor environment: daylight, ventilation and air quality
- Site: drainage, green space and reduced heat islands

## Existing factories can improve too
Certification is not only for new buildings. Existing factories can audit their performance, upgrade systems and document the improvements.

## Data is everything
Certification depends on evidence: metered water and energy use, waste records and test reports. Installing meters early makes the process much easier.

## The business case
Lower utility bills, a better working environment and a stronger position with international buyers all follow from the investment.

We help factories assess their water, energy and waste performance and prepare the environmental systems and documents that support certification.`,
  },
  {
    slug: 'composting-organic-waste',
    title: 'Composting Organic Waste: A Low-Cost Win for Campuses and Communities',
    category: 'Waste Management',
    coverImage: unsplash('1611284446314-60a58ac0deb9'),
    publishedAt: '2026-01-27',
    tags: ['Composting', 'Organic waste', 'Community'],
    excerpt: 'Food and garden waste make up a large share of what we throw away. Composting turns it into a useful soil conditioner and keeps it out of landfill.',
    content: `Organic waste — food scraps, vegetable market waste and garden trimmings — makes up a large share of municipal waste in Bangladesh. Sent to a landfill, it produces methane and leachate. Composted, it becomes a valuable soil conditioner.

## Where composting works well
- Factory canteens and residential campuses
- Hospitals, schools and universities
- Housing societies and community projects
- Vegetable and fruit markets

## The basics
Good compost needs a balance of green material (food waste) and brown material (dry leaves, paper), enough moisture and regular turning to let air in. Covered bins, pits or windrows can be used depending on the volume.

## Segregation makes it possible
Composting only works if organic waste is kept separate from plastic and other rubbish. Clearly marked bins and short staff briefings are essential.

## The benefits
- Less waste to collect and transport
- Compost for gardens and landscaping
- Lower greenhouse gas emissions
- A visible, practical sustainability project

We design waste management systems that include composting for campuses, industries and communities.`,
  },
];
