export const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/expertise', label: 'Expertise' },
  { href: '/projects', label: 'Work' },
  { href: '/experience', label: 'Experience' },
  { href: '/cv', label: 'CV' },
  { href: '/contact', label: 'Contact' },
];

export const experience = [
  {
    period: '10 Jan/2026 - Present', designation: 'Pattern Master.', organization: 'Interfab Shirt Manufacturing LTD. (VIYELLATEX Group)', buyerHandling: "M&S, LAND'S END",
    sections: [
      { label: 'M&S:', responsibilities: ['Maintain M&S buyer blocks and develop patterns from tech packs, measurements and buyer comments.','Prepare measurement sheets and support sample development for Fit, PP and Size-Set stages.','Perform pattern grading and sample corrections based on fit, measurement and technical comments.','Hands-on experience with M&S T11, T25 and T68 departments.','Coordinate with sample makers and QC teams during sample development and checking.','Participate in sample submissions at M&S BDSO.','Review buyer comments at M&S BDSO with the factory technical team and implement required corrections.','Handle M&S-related technical email communication and follow-up.'] },
      { label: "LAND'S END:", responsibilities: ['Develop patterns as per tech pack and buyer requirements.','Perform pattern making, grading and Size-Set development.','Review Size-Set evaluation and adjust patterns and measurements as required.','Support production pattern requirements and ongoing adjustments as production has started for this new buyer program.'] }
    ]
  },
  {
    period: 'May/2025 - December/2025', designation: 'Pattern Master.', organization: 'Fun Factory BD Ltd.', buyerHandling: 'LOGONET, CREON, COBALT GEAR, FINLAND ARMY',
    sections: [{ label: '', responsibilities: ['Pattern making and pattern grading for assigned styles.','Sample-pattern preparation and sample-development support.','Review buyer comments and tech packs; analyze requirements and adjust patterns/comments accordingly.','Support production pattern requirements and necessary corrections.','Prepare consumption markers / marker making for assigned styles.'] }]
  },
  {
    period: 'Feb/2022 - April/2025', designation: 'CAD Pattern Maker.', organization: 'International Trading Service Ltd. (Standard Group)', buyerHandling: "AMERICAN EAGLE OUTFITTER (AEO), PEPE JEANS LONDON, LAND'S END",
    sections: [{ label: '', responsibilities: ['Pattern making for buyer styles using Gerber CAD and manual pattern-development methods as required.','Pattern grading for sample, size-set and production-related requirements.','Review and analyze buyer tech packs, specifications and technical requirements before pattern development and adjustment.'] }]
  }
];

export const capabilities = [
  { n: '01', title: 'Pattern development', body: 'Professional pattern development from tech packs, measurements, specifications and technical comments using Gerber AccuMark / PDS.' },
  { n: '02', title: 'Pattern grading', body: 'Pattern grading for sample, Size-Set and production-related requirements.' },
  { n: '03', title: 'Sample development', body: 'Pattern preparation, measurement-sheet support and corrections across Fit, PP and Size-Set stages.' },
  { n: '04', title: 'Technical review', body: 'Reviewing tech packs, measurements and technical comments before making pattern adjustments.' },
  { n: '05', title: 'CLO 3D support', body: 'Practical use of CLO 3D for garment visualization, pattern checking and product-development support.' },
  { n: '06', title: 'Production support', body: 'Production pattern support, technical corrections, marker preparation and coordination with sample and QC teams.' },
];

export const projects = [
  { slug: 'comment-to-pattern-workflow', eyebrow: 'Pattern workflow', title: 'From technical comment to pattern correction', summary: 'A public-safe view of reviewing technical requirements, adjusting patterns and supporting the sample-development cycle.', tags: ['Gerber AccuMark', 'Pattern correction', 'Sample development'] },
  { slug: 'clo-3d-pattern-validation', eyebrow: 'Digital development support', title: 'CLO 3D for visualization and pattern checking', summary: 'Practical 3D garment visualization and pattern-checking work used to support product development.', tags: ['CLO 3D', 'Pattern checking', 'Product development'] },
];
