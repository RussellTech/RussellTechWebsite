export const services = [
  {
    slug: "cross-platform-app-development",
    number: "01",
    title: "Cross-platform app development",
    shortTitle: "App development",
    intro:
      "Apps for iOS, Android and the web, built from one sensible codebase wherever that makes sense.",
    detail:
      "Russell Tech is at its best when a business has a useful idea that needs to become a proper product. We work across the full journey: shaping the idea, designing the experience, building the app and backend, getting it live, then helping keep it in good nick.",
    points: [
      "Ionic and Capacitor applications",
      "React and Angular web apps",
      "Firebase-backed products and services",
      "APIs, accounts, payments and notifications",
      "App Store and Google Play preparation",
      "Ongoing improvements and support",
    ],
    description:
      "Cross-platform mobile and web app development using Ionic, Capacitor, React, Angular and Firebase, delivered from Leeds for businesses across the UK.",
    relatedProjects: ["pe-pro", "pitcrew"],
  },
  {
    slug: "website-development",
    number: "02",
    title: "Website development",
    shortTitle: "Website development",
    intro:
      "Fast, distinctive websites that explain what you do and make it easy for the right people to get in touch.",
    detail:
      "From a straightforward business site to a more involved e-commerce store or customer-facing system, we build websites around the people who need to use them. They should look the part, load quickly and be easy for your team to keep up to date.",
    points: [
      "Business and brochure websites",
      "E-commerce websites",
      "Booking and enquiry journeys",
      "Custom business systems",
      "Third-party integrations",
      "Search-friendly, accessible builds",
    ],
    description:
      "Fast, accessible website development for Leeds and UK businesses, including business websites, e-commerce stores, booking journeys and integrations.",
    relatedProjects: ["jansons-direct-linens", "testing-services-uk"],
  },
  {
    slug: "bespoke-cms-crm-development",
    number: "03",
    title: "Bespoke CMS and CRM systems",
    shortTitle: "Custom CMS and CRM",
    intro:
      "Custom tools for the way your team actually works, rather than another generic platform to wrestle with.",
    detail:
      "Sometimes the right answer is not another off-the-shelf system. We design and build bespoke CMS and CRM tools that fit your processes, content and customers, whether that means a focused publishing system or a larger business workflow.",
    points: [
      "Custom content management systems",
      "Bespoke CRM platforms",
      "Admin dashboards and portals",
      "Roles, permissions and workflows",
      "Data imports and integrations",
      "Reporting and operational tooling",
    ],
    description:
      "Bespoke CMS and CRM development for businesses that need a system shaped around their content, customers, workflows and operations.",
    relatedProjects: ["testing-services-uk"],
  },
  {
    slug: "hosting-infrastructure",
    number: "04",
    title: "Hosting and infrastructure",
    shortTitle: "Hosting and infrastructure",
    intro:
      "Reliable technical foundations across AWS, GCP, Azure, Firebase and Cloudflare.",
    detail:
      "Hosting is part of the product, not something to think about once the build is finished. We can help choose the right home for your app or website, set up the moving parts, improve an existing setup or look after it once it is live.",
    points: [
      "AWS, Google Cloud and Azure",
      "Firebase services and deployments",
      "Cloudflare hosting and edge services",
      "DNS, SSL and domain setup",
      "Deployments, environments and backups",
      "Migration, maintenance and support",
    ],
    description:
      "Cloud hosting and infrastructure support across AWS, Google Cloud, Azure, Firebase and Cloudflare, from setup and migration to ongoing maintenance.",
    relatedProjects: ["pitcrew"],
  },
  {
    slug: "quality-assurance-testing",
    number: "05",
    title: "Quality assurance and testing",
    shortTitle: "QA and testing",
    intro:
      "Confidence that the thing works before your customers, colleagues or clients have to find out the hard way.",
    detail:
      "We offer QA as part of a build or as a separate piece of work. Testing can happen throughout development or before a release, with a practical focus on finding problems early and giving the team a clear route to fixing them.",
    points: [
      "Unit testing",
      "Integration testing",
      "End-to-end testing",
      "Regression checks",
      "Browser and device testing",
      "Release confidence and test reporting",
    ],
    description:
      "Practical QA and software testing covering unit, integration and end-to-end testing for websites, web apps and cross-platform products.",
    relatedProjects: ["jansons-direct-linens", "pitcrew"],
  },
] as const;

export type Service = (typeof services)[number];
