export const categories = [
  {
    id: "commercial-vehicles",
    title: "Commercial Vehicles",
    summary: "Backhoe loaders, excavators, tippers, dump trucks, cranes and tractors for site movement and earthwork.",
    explanation:
      "Commercial vehicles cover the machines teams hire to move earth, haul material and lift loads. NIRMANH360 is built so customers can find owners of this equipment and start a conversation about availability.",
    examples: ["JCB", "Excavators", "Tippers", "Dump trucks", "Cranes", "Tractors"],
    use: "Useful for homeowners, contractors and site teams that need a machine for a defined stretch of work.",
    image: "/images/cat-vehicles.jpg",
    imageAlt: "A backhoe loader, excavator, dump truck and mobile crane parked on a construction site.",
  },
  {
    id: "construction-materials",
    title: "Construction Materials",
    summary: "Cement, sand, steel, bricks, aggregates and blocks from suppliers who serve building work.",
    explanation:
      "Construction materials are the supplies a site consumes as work moves forward. The marketplace is meant to help customers find suppliers of cement, sand, steel, bricks, aggregates and blocks.",
    examples: ["Cement", "Sand", "Steel", "Bricks", "Aggregates", "Blocks"],
    use: "Useful for residential builds, commercial sites and renovation work that needs a reliable supply contact.",
    image: "/images/cat-materials.jpg",
    imageAlt: "Stacks of cement bags, clay bricks, concrete blocks, steel rebar, sand and aggregate.",
  },
  {
    id: "heavy-equipment",
    title: "Heavy Equipment",
    summary: "Concrete mixers, road rollers, asphalt pavers, compactors and other construction machinery.",
    explanation:
      "Heavy equipment covers specialised machinery used for mixing, compaction and road work. Owners can list these machines so project teams can find them when a job calls for more than a general vehicle.",
    examples: ["Concrete mixers", "Road rollers", "Asphalt pavers", "Compactors", "Construction machinery"],
    use: "Useful for road works, larger building sites and contractors planning a specific machine for a package of work.",
    image: "/images/cat-heavy.jpg",
    imageAlt: "A road roller, concrete mixer truck and compactor on a road construction site.",
  },
  {
    id: "power-tools",
    title: "Power Tools and Electrical Equipment",
    summary: "Drills, cutting machines, welding machines, generators and other electrical tools.",
    explanation:
      "Power tools and electrical equipment include the smaller machines a crew uses every day, from drills and cutters to welders and generators. The category gives those listings a clear place beside heavier plant.",
    examples: ["Drilling machines", "Cutting machines", "Welding machines", "Generators", "Electrical tools"],
    use: "Useful for fit-out, repair and site teams that need tools or temporary power for a job.",
    image: "/images/cat-tools.jpg",
    imageAlt: "A generator, drill, cutting tool and welding machine arranged in a site workshop.",
  },
  {
    id: "scaffolding-safety",
    title: "Scaffolding, Ladders and Safety",
    summary: "Scaffolding, ladders, helmets, safety equipment and construction support systems.",
    explanation:
      "Access and safety equipment keeps people able to work at height and on exposed parts of a site. This category covers scaffolding, ladders, helmets and related support systems.",
    examples: ["Scaffolding", "Ladders", "Safety helmets", "Safety equipment", "Construction support systems"],
    use: "Useful for contractors and supervisors setting up access and basic protective equipment for a site.",
    image: "/images/cat-safety.jpg",
    imageAlt: "Steel scaffolding, an extension ladder and safety helmets at a building site.",
  },
] as const;

export const steps = [
  {
    title: "Discover",
    text: "Find the materials or equipment that match the work in front of you.",
  },
  {
    title: "Compare",
    text: "Review the options and details that owners and suppliers have chosen to share.",
  },
  {
    title: "Connect",
    text: "Contact the relevant owner or supplier about the resource you need.",
  },
  {
    title: "Coordinate",
    text: "Continue with that business on timing and the service. Confirmation stays with the people involved.",
  },
] as const;

export const features = [
  {
    icon: "layers",
    title: "Multiple resource categories",
    text: "Materials, machines, tools and site access equipment sit in one marketplace, organised the way a site actually buys and hires.",
  },
  {
    icon: "pin",
    title: "Location-aware discovery",
    text: "The product is designed so people can look for resources around a work site when location access is granted in the app.",
  },
  {
    icon: "compare",
    title: "Easier resource comparison",
    text: "Review published options next to each other instead of reconstructing them from separate phone calls.",
  },
  {
    icon: "users",
    title: "Customer and owner connections",
    text: "A customer can reach the owner or supplier responsible for a resource and continue the conversation with them.",
  },
  {
    icon: "phone",
    title: "Digital marketplace experience",
    text: "Discovery and enquiries are being brought into one product, starting with the NIRMANH360 mobile experience.",
  },
  {
    icon: "hardhat",
    title: "Designed for construction",
    text: "The categories follow construction work: vehicles, materials, heavy plant, tools and safety access.",
  },
] as const;

export const industries = [
  {
    title: "Residential construction",
    text: "Houses and small residential projects that need materials, tools and hired machines.",
    image: "/images/ind-residential.jpg",
    imageAlt: "A two-storey residential building under construction in warm evening light.",
  },
  {
    title: "Commercial construction",
    text: "Offices, retail and other commercial buildings with larger material and equipment needs.",
    image: "/images/ind-commercial.jpg",
    imageAlt: "A commercial building frame with a tower crane against a blue evening sky.",
  },
  {
    title: "Infrastructure projects",
    text: "Bridges, civil structures and longer-running public or private infrastructure work.",
    image: "/images/ind-infrastructure.jpg",
    imageAlt: "Concrete piers and an elevated structure under construction.",
  },
  {
    title: "Road construction",
    text: "Road building and resurfacing that depends on haulage, rollers and paving plant.",
    image: "/images/ind-road.jpg",
    imageAlt: "A newly laid asphalt road with a road roller in the distance.",
  },
  {
    title: "Renovation projects",
    text: "Alterations and fit-out work that still needs materials, tools and short-term equipment.",
    image: "/images/ind-renovation.jpg",
    imageAlt: "An interior renovation with exposed brick, conduits and stacked tiles.",
  },
  {
    title: "Industrial construction",
    text: "Sheds, plants and industrial buildings with steel, concrete and heavy-equipment needs.",
    image: "/images/ind-industrial.jpg",
    imageAlt: "A steel industrial shed under construction with a concrete floor.",
  },
] as const;

export const faqs = [
  {
    question: "What is NIRMANH360?",
    answer:
      "NIRMANH360 is a construction technology platform being built as a digital marketplace. It is designed to help people who need construction materials and equipment discover options and connect with owners and suppliers.",
  },
  {
    question: "What services does NIRMANH360 provide?",
    answer:
      "The platform is organised around five resource groups: commercial vehicles, construction materials, heavy equipment, power tools and electrical equipment, and scaffolding, ladders and safety equipment. This website explains those categories. What you can book or compare in the mobile app depends on the current release and on the listings owners publish.",
  },
  {
    question: "Can I find construction equipment?",
    answer:
      "Yes. Equipment discovery is a core part of the platform, including machines such as excavators, tippers, cranes and other site vehicles. Listings depend on what owners publish. This website does not show a live inventory.",
  },
  {
    question: "Can I find construction materials?",
    answer:
      "Yes. Materials such as cement, sand, steel, bricks, aggregates and blocks are part of the marketplace. Supply still depends on the suppliers who join and on what they make available.",
  },
  {
    question: "How can equipment owners join?",
    answer:
      "Use the Become a Partner page and send an enquiry with the equipment you own. Submitting the form shares your details for follow-up. It does not by itself publish a listing.",
  },
  {
    question: "How can material suppliers join?",
    answer:
      "The same partner form includes a material supplier option. Choose that type, select the category you supply, and describe the materials. The team can follow up only after the enquiry inbox is connected.",
  },
  {
    question: "Is NIRMANH360 available in Bengaluru?",
    answer:
      "NIRMANH360 is starting in Bengaluru, India. Coverage of other cities should not be assumed from this website.",
  },
  {
    question: "How can I contact support?",
    answer:
      "Use the contact form. Email, phone and WhatsApp are shown on the contact page only after they have been confirmed. The form records a message only when the site backend is connected, and it will say so if it is not.",
  },
  {
    question: "Does this website show live prices or availability?",
    answer:
      "No. The website explains the platform and collects partner and support enquiries. It does not display live stock, prices or guaranteed availability.",
  },
  {
    question: "Does NIRMANH360 guarantee a booking?",
    answer:
      "No. A conversation with an owner or supplier is not a confirmed booking. Timing, price, condition and suitability are agreed with that business.",
  },
] as const;

export const audiences = [
  "Individual homeowners",
  "Civil contractors",
  "Builders and developers",
  "Construction companies",
  "Civil engineers",
  "Site supervisors and managers",
  "Infrastructure project operators",
] as const;
