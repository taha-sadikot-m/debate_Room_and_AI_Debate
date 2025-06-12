
export interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeEstimate: string;
  theme: string;
  aiArguments: {
    pro: string[];
    con: string[];
  };
}

export const allTopics: Topic[] = [
  // Technology Topics
  {
    id: 'tech-1',
    title: "Should AI be regulated by an international body?",
    description: "Debate the global governance of artificial intelligence development",
    difficulty: 'Hard',
    category: 'AI Governance',
    timeEstimate: '15-20 min',
    theme: 'Technology',
    aiArguments: {
      pro: [
        "Prevents misuse and ensures ethical deployment globally",
        "Sets a unified benchmark for AI safety",
        "Encourages transparency across countries",
        "Prevents a global AI arms race",
        "Protects user data and privacy internationally"
      ],
      con: [
        "Difficult to enforce across sovereign nations",
        "Could slow down innovation due to red tape",
        "National interests and definitions of ethics vary",
        "Risk of dominant countries influencing the body",
        "Tech evolves faster than global governance frameworks"
      ]
    }
  },
  {
    id: 'tech-2',
    title: "Is the ban on TikTok and similar apps justified?",
    description: "Examine the balance between security and digital freedom",
    difficulty: 'Medium',
    category: 'Digital Rights',
    timeEstimate: '12-15 min',
    theme: 'Technology',
    aiArguments: {
      pro: [
        "Protects user data from foreign surveillance",
        "Prevents spread of misinformation and harmful content",
        "Safeguards mental health of youth",
        "Encourages local alternatives and innovation",
        "Limits national security vulnerabilities"
      ],
      con: [
        "Restricts freedom of expression",
        "Hurts small creators and businesses",
        "Sets a bad precedent for internet censorship",
        "Data breaches happen even with local apps",
        "Impacts global digital diplomacy negatively"
      ]
    }
  },
  {
    id: 'tech-3',
    title: "Should social media platforms ban political advertisements?",
    description: "Examine the impact of political ads on democratic processes",
    difficulty: 'Hard',
    category: 'Digital Democracy',
    timeEstimate: '15-20 min',
    theme: 'Technology',
    aiArguments: {
      pro: [
        "Political ads spread misinformation and manipulate voters",
        "Wealthy candidates get unfair advantages through ad spending",
        "Foreign interference through paid political content threatens democracy"
      ],
      con: [
        "Political advertising is protected free speech",
        "Banning ads limits candidates' ability to reach voters",
        "Transparency and fact-checking are better solutions than censorship"
      ]
    }
  },
  
  // Politics Topics
  {
    id: 'politics-1',
    title: "Should the United Nations have binding power over sovereign nations?",
    description: "Debate the balance between global governance and national sovereignty",
    difficulty: 'Hard',
    category: 'International Relations',
    timeEstimate: '15-20 min',
    theme: 'Politics',
    aiArguments: {
      pro: [
        "Enables decisive action on global crises",
        "Holds violators of international law accountable",
        "Helps prevent wars and human rights abuse",
        "Gives teeth to environmental/climate mandates",
        "Promotes collective action for peace"
      ],
      con: [
        "Violates national sovereignty",
        "UN decision-making is politically biased",
        "Enforcement power could be abused",
        "Rich nations may influence outcomes unfairly",
        "Risks replacing local accountability with global bureaucracy"
      ]
    }
  },
  {
    id: 'politics-2',
    title: "Should voting be mandatory in democratic countries?",
    description: "Debate compulsory voting and civic responsibility",
    difficulty: 'Medium',
    category: 'Democratic Participation',
    timeEstimate: '12-15 min',
    theme: 'Politics',
    aiArguments: {
      pro: [
        "Mandatory voting ensures government represents the entire population",
        "It reduces the influence of extreme political groups",
        "Countries like Australia show it works successfully"
      ],
      con: [
        "Forcing people to vote violates individual freedom",
        "Uninformed forced votes can harm democratic quality",
        "The right to vote includes the right not to vote"
      ]
    }
  },
  
  // Environment Topics
  {
    id: 'env-1',
    title: "Is carbon tax the best way to fight climate change?",
    description: "Evaluate economic approaches to environmental protection",
    difficulty: 'Hard',
    category: 'Climate Policy',
    timeEstimate: '15-20 min',
    theme: 'Environment',
    aiArguments: {
      pro: [
        "Internalizes environmental costs into economy",
        "Encourages companies to innovate greener tech",
        "Generates funds for climate action",
        "Proven effective in countries like Sweden",
        "Drives behavioral change in consumers"
      ],
      con: [
        "Increases costs for the average citizen",
        "Disproportionately affects lower-income groups",
        "Industries may pass costs to consumers",
        "May push polluters to countries with lax rules",
        "Alternatives like subsidies for clean energy work better"
      ]
    }
  },
  {
    id: 'env-2',
    title: "Should fast fashion be banned to save the environment?",
    description: "Discuss the environmental impact of disposable clothing",
    difficulty: 'Easy',
    category: 'Sustainable Fashion',
    timeEstimate: '10-12 min',
    theme: 'Environment',
    aiArguments: {
      pro: [
        "Fast fashion is one of the world's largest polluting industries",
        "It promotes wasteful consumption and exploits workers",
        "Sustainable alternatives exist and are becoming more affordable"
      ],
      con: [
        "Fast fashion makes clothing accessible to low-income families",
        "Banning it would eliminate millions of jobs globally",
        "Consumer education is better than government bans"
      ]
    }
  },
  
  // Education Topics
  {
    id: 'edu-1',
    title: "Should all universities worldwide be tuition-free?",
    description: "Debate universal access to higher education",
    difficulty: 'Medium',
    category: 'Higher Education Policy',
    timeEstimate: '12-15 min',
    theme: 'Education',
    aiArguments: {
      pro: [
        "Education is a basic right, not a privilege",
        "Reduces inequality and poverty in the long run",
        "Promotes innovation and research diversity",
        "Encourages students to pursue their passion",
        "Attracts international talent to countries"
      ],
      con: [
        "Financially unsustainable without taxation increase",
        "Devalues higher education quality in some systems",
        "May lead to overcrowding and reduced meritocracy",
        "Opens the system to misuse without fees",
        "Puts additional pressure on taxpayers"
      ]
    }
  },
  {
    id: 'edu-2',
    title: "Should AI replace human teachers in schools?",
    description: "Debate the role of artificial intelligence in education",
    difficulty: 'Medium',
    category: 'Education Technology',
    timeEstimate: '12-15 min',
    theme: 'Education',
    aiArguments: {
      pro: [
        "AI can provide personalized learning at scale for every student",
        "AI teachers are available 24/7 and never get tired or frustrated",
        "AI can instantly adapt to different learning styles and speeds"
      ],
      con: [
        "Human emotional connection is crucial for student development",
        "Teachers provide mentorship and life guidance beyond academics",
        "AI lacks creativity and cannot inspire students like humans can"
      ]
    }
  },
  
  // Food Topics
  {
    id: 'food-1',
    title: "Should schools serve only vegetarian meals?",
    description: "Debate plant-based nutrition in educational institutions",
    difficulty: 'Easy',
    category: 'School Nutrition',
    timeEstimate: '10-12 min',
    theme: 'Food',
    aiArguments: {
      pro: [
        "Plant-based diets are healthier and reduce childhood obesity",
        "Vegetarian meals have a lower environmental impact",
        "It teaches children compassion towards animals"
      ],
      con: [
        "Children need protein from meat for proper development",
        "Many families' cultural and religious practices include meat",
        "Schools should offer choice, not impose dietary restrictions"
      ]
    }
  },
  
  // Cinema Topics
  {
    id: 'cinema-1',
    title: "Should movie theaters be replaced by streaming platforms?",
    description: "Debate the future of cinema experience vs convenience",
    difficulty: 'Easy',
    category: 'Entertainment Industry',
    timeEstimate: '10-12 min',
    theme: 'Cinema',
    aiArguments: {
      pro: [
        "Streaming is more convenient and affordable for families",
        "Home viewing allows for pause, rewind, and comfort",
        "Streaming platforms offer more diverse content choices"
      ],
      con: [
        "Movie theaters provide unmatched audio-visual experience",
        "Cinema is a social activity that brings communities together",
        "Big-screen spectacles lose their impact on small screens"
      ]
    }
  },
  
  // Health Topics
  {
    id: 'health-1',
    title: "Should mental health days be mandatory in schools and workplaces?",
    description: "Discuss the importance of mental health in productivity",
    difficulty: 'Medium',
    category: 'Workplace Wellness',
    timeEstimate: '12-15 min',
    theme: 'Health',
    aiArguments: {
      pro: [
        "Mental health is as important as physical health",
        "Mandatory breaks prevent burnout and improve productivity",
        "It reduces stigma around mental health issues"
      ],
      con: [
        "People can already take sick days for mental health",
        "Mandatory days might be abused by some individuals",
        "Flexible personal time off is more effective than mandates"
      ]
    }
  }
];
