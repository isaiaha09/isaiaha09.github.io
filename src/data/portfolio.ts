export type ProjectStatus = "Live" | "In progress";
export type ProjectKind = "web-and-ios" | "standalone-web";

export type ProjectDetail = {
  overview: string;
  surfaces: { title: string; description: string }[];
  highlights: { title: string; description: string }[];
};

export type Project = {
  id: string;
  name: string;
  kind: ProjectKind;
  status: ProjectStatus;
  summary: string;
  stack: string[];
  logo?: string;
  accent: string;
  siteUrl?: string;
  appUrl?: string;
  siteVideo?: string;
  appVideo?: string;
  sitePoster?: string;
  appPoster?: string;
  sitePreview: string[];
  appPreview?: string[];
  detail: ProjectDetail;
};

export const portfolio = {
  name: "Isaiah",
  brandName: "IASAPPS",
  email: "isaiah.aris@gmail.com",
  github: "https://github.com/isaiaha09",
  linkedin: "https://www.linkedin.com/in/isaiah-a-473355121/",
  instagram: "https://www.instagram.com/_iasapps_/",
  tiktok: "",
  youtube: "https://www.youtube.com/@iasapps-ia",
  stackOverflow: "https://stackoverflow.com/users/33174991/iasapps",
  resumeHref: "/Isaiah-Resume.pdf",
  resumeFileName: "Isaiah-Resume.pdf",
  web3FormsAccessKey: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "",
};

export const projects: Project[] = [
  {
    id: "circlecal",
    name: "CircleCal",
    kind: "web-and-ios",
    status: "Live",
    summary:
      "A scheduling and booking platform for businesses, with public booking, team operations, and a companion iOS app.",
    stack: ["Django", "React Native", "Expo", "Stripe"],
    logo: "/projects/circlecal.webp",
    accent: "#756df0",
    siteUrl: "https://circlecal.app/",
    appUrl: "https://apps.apple.com/ca/app/circlecal/id6758738591",
    siteVideo: "/projects/circlecal/site.mp4",
    sitePoster: "/projects/circlecal/poster.jpg",
    appVideo: "/projects/circlecal/app.mp4",
    appPoster: "/projects/circlecal/app-poster.jpg",
    sitePreview: ["Services", "Availability", "Bookings"],
    appPreview: ["Today", "Appointments", "Team"],
    detail: {
      overview:
        "CircleCal brings customer booking and business operations into one system. The Django platform handles public booking and staff workflows, with a React Native companion available for iPhone.",
      surfaces: [
        {
          title: "Website",
          description:
            "Customers book through public service pages. Businesses manage availability, appointments, team access, and billing in the web workspace.",
        },
        {
          title: "iOS app",
          description:
            "The Expo app brings CircleCal scheduling and business workflows to iPhone.",
        },
      ],
      highlights: [
        {
          title: "Public booking",
          description:
            "Service pages and embeddable booking flows let customers choose an available time without calling the business.",
        },
        {
          title: "Team scheduling",
          description:
            "Organization roles, staff access, availability rules, and booking changes share the same workspace.",
        },
        {
          title: "Billing foundation",
          description:
            "Stripe subscriptions and Connect onboarding support the platform's plan and payment workflows.",
        },
      ],
    },
  },
  {
    id: "grand-coast-construction",
    name: "Grand Coast Construction",
    kind: "web-and-ios",
    status: "In progress",
    summary:
      "A public construction website connected to staff operations, project workflows, and a secure client portal.",
    stack: ["Django", "Operations", "Client portal", "Expo"],
    logo: "/projects/grand-coast.webp",
    accent: "#d5a43a",
    sitePreview: ["Projects", "Our process", "Get in touch"],
    appPreview: ["My projects", "Updates", "Documents"],
    detail: {
      overview:
        "The Grand Coast platform connects a construction company's public website with the work behind each project. Its Django application keeps leads, estimates, project records, staff tasks, and client updates together.",
      surfaces: [
        {
          title: "Website",
          description:
            "A public site introduces the company, while private Operations, Team, and client workspaces support the work after an inquiry arrives.",
        },
        {
          title: "iOS app",
          description:
            "An Expo mobile shell brings the existing Django workspaces to employees and clients with role-aware navigation and device features.",
        },
      ],
      highlights: [
        {
          title: "Lead to project",
          description:
            "Leads, estimates, approvals, and project creation follow a connected workflow instead of separate records.",
        },
        {
          title: "Client portal",
          description:
            "Clients can review updates, documents, and messages in a protected area tied to their projects.",
        },
        {
          title: "Field access",
          description:
            "The mobile shell adds staff navigation, a notification inbox, and an optional bridge for capturing project media.",
        },
      ],
    },
  },
  {
    id: "diningdealz",
    name: "DiningDealz",
    kind: "web-and-ios",
    status: "Live",
    summary:
      "A local guide to happy hours, food deals, and discounts in Ventura, Oxnard, and Camarillo.",
    stack: ["Next.js", "Django", "React Native", "Expo"],
    logo: "/projects/diningdealz.webp",
    accent: "#fb3d36",
    siteUrl: "https://diningdealz.com/",
    appUrl: "https://apps.apple.com/ca/app/diningdealz/id6781421160",
    siteVideo: "/projects/diningdealz/site.mp4",
    sitePoster: "/projects/diningdealz/poster.jpg",
    appVideo: "/projects/diningdealz/app.mp4",
    appPoster: "/projects/diningdealz/app-poster.jpg",
    sitePreview: ["Browse deals", "Near Ventura", "Saved places"],
    appPreview: ["Map", "Happy hour", "Nearby"],
    detail: {
      overview:
        "DiningDealz helps people find local offers around Ventura, Oxnard, and Camarillo through its website and mobile app.",
      surfaces: [
        {
          title: "Website",
          description:
            "The Next.js website lets visitors explore local listings and deals from a browser.",
        },
        {
          title: "iOS app",
          description:
            "The React Native app has list and map browsing, search, city and venue filters, and place details connected to backend APIs.",
        },
      ],
      highlights: [
        {
          title: "Local discovery",
          description:
            "Browse places and offers by map or list, then narrow the view with search and location filters.",
        },
        {
          title: "Source-backed listings",
          description:
            "The Django backend normalizes listing information and groups locations for the mobile experience.",
        },
        {
          title: "Business claims",
          description:
            "Claim and membership flows give businesses a path to manage their presence in the app.",
        },
      ],
    },
  },
  {
    id: "miranda-insights",
    name: "Miranda Insights",
    kind: "web-and-ios",
    status: "Live",
    summary:
      "A consulting and education website with a mobile companion built around the existing web experience.",
    stack: ["Django", "Tailwind CSS", "Expo", "WebView"],
    logo: "/projects/miranda-insights.webp",
    accent: "#d29a36",
    siteUrl: "https://mirandainsights.com/",
    appUrl: "https://apps.apple.com/ca/app/miranda-insights-mobile/id6762920274",
    siteVideo: "/projects/miranda-insights/site.mp4",
    sitePoster: "/projects/miranda-insights/poster.jpg",
    appVideo: "/projects/miranda-insights/app.mp4",
    appPoster: "/projects/miranda-insights/app-poster.jpg",
    sitePreview: ["Services", "Resources", "Get started"],
    appPreview: ["Explore", "Resources", "Profile"],
    detail: {
      overview:
        "Miranda Insights is a Django website for consulting and educational content with an Expo mobile companion. The mobile app keeps the website as its main content layer and adds native navigation around it.",
      surfaces: [
        {
          title: "Website",
          description:
            "Django templates and Tailwind CSS organize the site's services, resources, and supporting content.",
        },
        {
          title: "iOS app",
          description:
            "An Expo WebView shell displays the site with a native header, bottom navigation, drawer, and notification permission flow.",
        },
      ],
      highlights: [
        {
          title: "Shared content",
          description:
            "The mobile companion presents the existing Django experience instead of maintaining a second copy of the site's content.",
        },
        {
          title: "Native navigation",
          description:
            "Header, drawer, and bottom navigation help visitors move through the web content on a phone.",
        },
        {
          title: "Notification foundation",
          description:
            "The Expo shell includes permission handling for future mobile notifications.",
        },
      ],
    },
  },
  {
    id: "developmental-baseball",
    name: "Developmental Baseball",
    kind: "standalone-web",
    status: "Live",
    summary:
      "A private baseball coaching site with an instructor story, player gallery, and CircleCal lesson booking.",
    stack: ["Django", "HTML/CSS", "JavaScript", "CircleCal"],
    logo: "/projects/developmental-baseball.png",
    accent: "#c9ad7b",
    siteUrl: "https://coachalvarez44.com/",
    siteVideo: "/projects/developmental-baseball/site.mp4",
    sitePoster: "/projects/developmental-baseball/poster.jpg",
    sitePreview: ["Baseball lessons", "Coaching", "Book a lesson"],
    detail: {
      overview:
        "This public site introduces private baseball instruction and gives players and families a route from learning about the coach to booking a lesson. Its public pages are prepared for static hosting.",
      surfaces: [
        {
          title: "Website",
          description:
            "The site brings together the instructor's story, credibility, gallery, contact page, and a booking page with an embedded CircleCal calendar.",
        },
      ],
      highlights: [
        {
          title: "Instructor story",
          description:
            "Background and credibility pages give visitors context before they reach out for a lesson.",
        },
        {
          title: "Player gallery",
          description:
            "Photos and video help visitors see the training environment and coaching work.",
        },
        {
          title: "Lesson booking",
          description:
            "An embedded CircleCal flow lets visitors choose a lesson from the website.",
        },
      ],
    },
  },
  {
    id: "jptraining",
    name: "JPTraining",
    kind: "standalone-web",
    status: "Live",
    summary:
      "A multi-page training website with services, session media, recovery guidance, and embedded CircleCal booking.",
    stack: ["Django", "django-distill", "Web3Forms", "CircleCal"],
    logo: "/projects/jptraining.png",
    accent: "#7479b5",
    siteUrl: "https://jptvt.com/",
    siteVideo: "/projects/jptraining/site.mp4",
    sitePoster: "/projects/jptraining/poster.jpg",
    sitePreview: ["Train with JP", "Strength", "Book a session"],
    detail: {
      overview:
        "A branded, multi-page site for Just Perform Training. It introduces the trainer and services, shows session media, explains recovery work, and gives visitors direct routes to contact and booking.",
      surfaces: [
        {
          title: "Website",
          description:
            "Django templates are exported as static pages with django-distill. Web3Forms handles inquiries, and an embedded CircleCal calendar handles session booking.",
        },
      ],
      highlights: [
        {
          title: "Training content",
          description:
            "Dedicated pages explain performance training, recovery, and the person behind the brand.",
        },
        {
          title: "Session media",
          description:
            "A gallery of videos and photos shows what training sessions look like.",
        },
        {
          title: "Contact and booking",
          description:
            "Visitors can send an inquiry through Web3Forms or book a session through CircleCal.",
        },
      ],
    },
  },
];

export const profile = {
  about:
    "I build websites and iOS apps around practical, everyday problems. Across my projects, I work on both the experience people see and the systems a team needs to keep it running.",
  approach:
    "I work across the product: shaping the interface, connecting the data and workflows, and refining the experience for the people who use it.",
  focus: [
    "Websites and product interfaces",
    "iOS apps with React Native and Expo",
    "Django applications and operations tools",
    "Accessible, responsive user experiences",
  ],
};
