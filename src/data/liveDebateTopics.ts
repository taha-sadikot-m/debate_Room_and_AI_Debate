export interface LiveDebateTopic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  theme: string;
  time_estimate: string;
  status: 'approved';
  format: '1v1' | '3v3' | 'both';
  aiArguments: {
    pro: string[];
    con: string[];
  };
}

export const liveDebateTopics: LiveDebateTopic[] = [
  // Technology Topics
  {
    id: 'live-tech-1',
    title: "Should social media platforms be held responsible for content moderation?",
    description: "Debate the balance between free speech and platform accountability",
    difficulty: 'Medium',
    theme: 'Technology',
    time_estimate: '15-20 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Platforms profit from user-generated content and should ensure quality",
        "Unchecked content can spread misinformation and harm",
        "Companies have resources to implement effective moderation",
        "Clear guidelines protect users from harassment and abuse"
      ],
      con: [
        "Free speech is fundamental and shouldn't be restricted",
        "Automated moderation often censors legitimate content",
        "Cultural differences make universal standards impossible",
        "Over-regulation stifles innovation and competition"
      ]
    }
  },
  {
    id: 'live-tech-2',
    title: "Is cryptocurrency the future of money?",
    description: "Examine the potential of digital currencies to replace traditional money",
    difficulty: 'Hard',
    theme: 'Technology',
    time_estimate: '20-25 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Decentralized nature eliminates need for traditional banking",
        "Lower transaction costs for international transfers",
        "Provides financial access to unbanked populations",
        "Transparent blockchain technology prevents fraud"
      ],
      con: [
        "Extreme volatility makes it unreliable as currency",
        "Environmental impact of mining operations",
        "Lack of regulation enables criminal activities",
        "Technical complexity prevents mass adoption"
      ]
    }
  },
  {
    id: 'live-tech-3',
    title: "Should AI-generated content be labeled as artificial?",
    description: "Discuss transparency requirements for AI-created media",
    difficulty: 'Easy',
    theme: 'Technology',
    time_estimate: '10-15 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Transparency builds trust with consumers",
        "Prevents deception in news and media",
        "Protects intellectual property rights",
        "Helps people make informed decisions"
      ],
      con: [
        "Quality matters more than origin",
        "Labeling could create unfair bias against AI content",
        "Difficult to enforce across all platforms",
        "May stifle creativity and innovation"
      ]
    }
  },

  // Environment Topics
  {
    id: 'live-env-1',
    title: "Should developed countries pay for climate damage in developing nations?",
    description: "Debate climate reparations and historical responsibility",
    difficulty: 'Hard',
    theme: 'Environment',
    time_estimate: '20-25 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Developed countries historically contributed most to emissions",
        "Moral obligation to help those suffering from climate change",
        "Financial resources are available in wealthy nations",
        "Would accelerate global climate adaptation efforts"
      ],
      con: [
        "Current generations shouldn't pay for past actions",
        "Developing countries also contribute to current emissions",
        "Funds might be misused or not reach those in need",
        "Could create dependency rather than solutions"
      ]
    }
  },
  {
    id: 'live-env-2',
    title: "Is nuclear energy the solution to climate change?",
    description: "Examine nuclear power as a clean energy alternative",
    difficulty: 'Medium',
    theme: 'Environment',
    time_estimate: '15-20 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Produces massive amounts of clean energy",
        "Reliable baseload power unlike solar/wind",
        "Modern reactors are much safer than older designs",
        "Minimal land use compared to renewable alternatives"
      ],
      con: [
        "Risk of catastrophic accidents remains",
        "Radioactive waste has no permanent solution",
        "Extremely expensive to build and maintain",
        "Vulnerable to terrorist attacks and sabotage"
      ]
    }
  },
  {
    id: 'live-env-3',
    title: "Should single-use plastics be banned globally?",
    description: "Discuss the environmental impact versus practical considerations",
    difficulty: 'Easy',
    theme: 'Environment',
    time_estimate: '10-15 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Reduces ocean pollution and marine life deaths",
        "Forces innovation in sustainable alternatives",
        "Sets global standard for environmental protection",
        "Prevents microplastics from entering food chain"
      ],
      con: [
        "Alternatives may be more expensive and less accessible",
        "Could impact medical equipment and food safety",
        "May increase other environmental impacts",
        "Enforcement would be difficult across different countries"
      ]
    }
  },

  // Society Topics
  {
    id: 'live-soc-1',
    title: "Should voting be mandatory in democratic countries?",
    description: "Debate compulsory voting and democratic participation",
    difficulty: 'Medium',
    theme: 'Society',
    time_estimate: '15-20 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Ensures government represents all citizens, not just activists",
        "Reduces influence of extremist groups",
        "Increases political engagement and awareness",
        "Strengthens democratic legitimacy"
      ],
      con: [
        "Freedom includes the right not to participate",
        "Uninformed voters might make poor decisions",
        "Difficult to enforce fairly across diverse populations",
        "May lead to random voting rather than informed choices"
      ]
    }
  },
  {
    id: 'live-soc-2',
    title: "Is social media more harmful than beneficial to society?",
    description: "Examine the overall impact of social media on human relationships",
    difficulty: 'Easy',
    theme: 'Society',
    time_estimate: '12-15 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Enables global communication and connection",
        "Provides platforms for education and awareness",
        "Supports small businesses and entrepreneurship",
        "Facilitates social movements and activism"
      ],
      con: [
        "Contributes to mental health issues and comparison culture",
        "Spreads misinformation and polarizes society",
        "Reduces face-to-face interaction skills",
        "Creates addiction and time-wasting behaviors"
      ]
    }
  },
  {
    id: 'live-soc-3',
    title: "Should universal basic income be implemented globally?",
    description: "Discuss the feasibility and impact of guaranteed income for all",
    difficulty: 'Hard',
    theme: 'Society',
    time_estimate: '20-25 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Provides economic security in an age of automation",
        "Reduces poverty and inequality",
        "Simplifies welfare systems and reduces bureaucracy",
        "Enables people to pursue education and entrepreneurship"
      ],
      con: [
        "Extremely expensive and may require high taxes",
        "Could reduce work incentives and productivity",
        "Might cause inflation if not carefully managed",
        "Difficult to implement fairly across different economies"
      ]
    }
  },

  // Education Topics
  {
    id: 'live-edu-1',
    title: "Should students be allowed to use AI tools for homework?",
    description: "Debate the role of AI in education and learning",
    difficulty: 'Medium',
    theme: 'Education',
    time_estimate: '15-20 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Prepares students for an AI-integrated future",
        "Helps students learn more efficiently",
        "Levels the playing field for students with different abilities",
        "Encourages critical thinking about AI-generated content"
      ],
      con: [
        "Prevents development of core skills and knowledge",
        "Creates dependency on technology",
        "Makes assessment and evaluation difficult",
        "Reduces originality and creativity in work"
      ]
    }
  },
  {
    id: 'live-edu-2',
    title: "Is online education as effective as traditional classroom learning?",
    description: "Compare virtual and in-person educational experiences",
    difficulty: 'Easy',
    theme: 'Education',
    time_estimate: '12-15 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Provides flexibility and accessibility to more students",
        "Enables personalized learning at individual pace",
        "Reduces costs and geographical barriers",
        "Develops digital literacy skills"
      ],
      con: [
        "Lacks social interaction and collaborative learning",
        "Requires self-discipline that many students lack",
        "Limited hands-on experience and practical skills",
        "Technology gaps create educational inequality"
      ]
    }
  },
  {
    id: 'live-edu-3',
    title: "Should university education be free for all students?",
    description: "Examine the economics and accessibility of higher education",
    difficulty: 'Hard',
    theme: 'Education',
    time_estimate: '20-25 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Education is a fundamental right, not a privilege",
        "Reduces inequality and increases social mobility",
        "Eliminates student debt burden",
        "Benefits society through more educated workforce"
      ],
      con: [
        "Extremely expensive for taxpayers to fund",
        "May reduce the perceived value of education",
        "Could lead to overcrowding and reduced quality",
        "Benefits often go to middle-class families more than poor"
      ]
    }
  },

  // Health Topics
  {
    id: 'live-health-1',
    title: "Should vaccination be mandatory for all children?",
    description: "Debate public health requirements versus parental choice",
    difficulty: 'Medium',
    theme: 'Health',
    time_estimate: '15-20 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Protects public health through herd immunity",
        "Prevents outbreaks of dangerous diseases",
        "Vaccines have proven safety and efficacy records",
        "Protects vulnerable populations who cannot be vaccinated"
      ],
      con: [
        "Parents should have the right to make medical decisions",
        "Rare but serious side effects can occur",
        "Religious or philosophical objections should be respected",
        "Government mandates violate personal freedom"
      ]
    }
  },
  {
    id: 'live-health-2',
    title: "Is mental health as important as physical health?",
    description: "Discuss the priority and resources given to mental health care",
    difficulty: 'Easy',
    theme: 'Health',
    time_estimate: '10-15 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Mental health affects physical health and vice versa",
        "Mental illness causes significant suffering and disability",
        "Untreated mental health issues lead to social and economic costs",
        "Stigma prevents people from seeking help"
      ],
      con: [
        "Physical health issues are more immediately life-threatening",
        "Mental health treatment is less precise and measurable",
        "Limited resources should prioritize urgent medical needs",
        "Some mental health issues resolve naturally over time"
      ]
    }
  },
  {
    id: 'live-health-3',
    title: "Should there be a universal basic income?",
    description: "Examine the feasibility and impact of providing guaranteed income to all citizens",
    difficulty: 'Medium',
    theme: 'Social Issues',
    time_estimate: '15-20 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Reduces poverty and provides economic security",
        "Simplifies welfare systems and reduces bureaucracy",
        "Enables people to pursue education and entrepreneurship",
        "Provides stability during economic transitions and automation"
      ],
      con: [
        "Creates unsustainable financial burden on government",
        "May reduce work incentives and productivity",
        "Could lead to inflation and currency devaluation",
        "Diverts resources from targeted social programs"
      ]
    }
  },

  // Business & Economics Topics
  {
    id: 'live-biz-1',
    title: "Should companies be required to have diverse leadership?",
    description: "Debate mandatory diversity requirements in corporate governance",
    difficulty: 'Medium',
    theme: 'Business',
    time_estimate: '15-20 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Diverse leadership brings different perspectives and ideas",
        "Corrects historical inequities in corporate leadership",
        "Better represents diverse customer and employee base",
        "Studies show diverse teams perform better"
      ],
      con: [
        "Merit should be the only criterion for leadership",
        "Quotas may lead to tokenism rather than inclusion",
        "Difficult to enforce fairly across different industries",
        "May create reverse discrimination"
      ]
    }
  },
  {
    id: 'live-biz-2',
    title: "Is remote work better than office work?",
    description: "Compare the benefits and drawbacks of remote versus in-person work",
    difficulty: 'Easy',
    theme: 'Business',
    time_estimate: '12-15 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Improves work-life balance and reduces commute time",
        "Increases productivity by eliminating office distractions",
        "Reduces overhead costs for companies",
        "Enables access to global talent pool"
      ],
      con: [
        "Reduces collaboration and team building",
        "Makes management and supervision more difficult",
        "Can lead to isolation and mental health issues",
        "Blurs boundaries between work and personal life"
      ]
    }
  },
  {
    id: 'live-business-2',
    title: "Should companies be required to disclose CEO-to-worker pay ratios?",
    description: "Examine whether transparency in executive compensation would benefit society",
    difficulty: 'Medium',
    theme: 'Business',
    time_estimate: '12-18 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Increases transparency and accountability in corporate governance",
        "Helps shareholders make informed decisions about executive pay",
        "Reduces excessive executive compensation through public pressure",
        "Provides valuable data for economic research and policy"
      ],
      con: [
        "Creates privacy concerns for executives and companies",
        "May lead to talent drain as executives seek private companies",
        "Oversimplifies complex compensation structures",
        "Interferes with free market determination of wages"
      ]
    }
  },

  // Science Topics
  {
    id: 'live-science-1',
    title: "Is climate change the biggest threat to humanity?",
    description: "Debate the risks and challenges posed by climate change",
    difficulty: 'Hard',
    theme: 'Science',
    time_estimate: '20-25 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Threatens global food and water supplies",
        "Increases frequency of extreme weather events",
        "Causes loss of biodiversity and ecosystems",
        "Leads to economic instability and displacement"
      ],
      con: [
        "Other issues like poverty and disease are more immediate",
        "Economic costs of action may be too high",
        "Climate models are uncertain and controversial",
        "Humanity has time and resources to adapt"
      ]
    }
  },
  {
    id: 'live-science-2',
    title: "Should genetic engineering be used to create 'designer babies'?",
    description: "Discuss the ethics and implications of genetic modification in humans",
    difficulty: 'Hard',
    theme: 'Science',
    time_estimate: '20-25 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Eliminates genetic diseases and disorders",
        "Enhances human capabilities and intelligence",
        "Increases lifespan and quality of life",
        "Reduces healthcare costs for genetic conditions"
      ],
      con: [
        "Plays God with human life and evolution",
        "Creates potential for new forms of inequality",
        "Long-term effects are unknown and potentially dangerous",
        "Could lead to eugenics and loss of genetic diversity"
      ]
    }
  },
  {
    id: 'live-science-3',
    title: "Is space exploration worth the cost?",
    description: "Evaluate whether the benefits of space exploration justify the massive expenses",
    difficulty: 'Easy',
    theme: 'Science',
    time_estimate: '10-15 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Drives technological innovation that benefits daily life",
        "Expands scientific knowledge and understanding of universe",
        "Provides backup plan for humanity's survival",
        "Creates jobs and economic growth in high-tech sectors"
      ],
      con: [
        "Money could be better spent on earthly problems like poverty",
        "Benefits are often overstated and take too long to realize",
        "Creates dangerous space debris and pollution",
        "Diverts resources from education and healthcare"
      ]
    }
  },

  // Culture Topics
  {
    id: 'live-culture-1',
    title: "Should cultural artifacts be repatriated to their country of origin?",
    description: "Debate the return of cultural artifacts to their original owners",
    difficulty: 'Medium',
    theme: 'Culture',
    time_estimate: '15-20 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Corrects historical injustices and colonial exploitation",
        "Artifacts belong to their cultures of origin",
        "Enables source countries to preserve their own heritage",
        "Promotes cultural respect and international cooperation"
      ],
      con: [
        "Major museums provide better preservation and wider access",
        "Artifacts are part of shared human heritage",
        "Some source countries lack proper storage facilities",
        "Would empty world-class museums and reduce cultural exchange"
      ]
    }
  },
  {
    id: 'live-culture-2',
    title: "Should social media platforms be regulated like traditional media?",
    description: "Examine whether social media companies should face the same regulations as newspapers and TV",
    difficulty: 'Hard',
    theme: 'Technology',
    time_estimate: '20-25 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Prevents spread of misinformation and hate speech",
        "Ensures accountability for content published on platforms",
        "Protects vulnerable populations from harmful content",
        "Maintains consistent standards across all media types"
      ],
      con: [
        "Violates principles of free speech and open internet",
        "Social media is fundamentally different from traditional media",
        "Creates barriers to innovation and new platform development",
        "Gives government too much control over digital communication"
      ]
    }
  },
  {
    id: 'live-culture-3',
    title: "Should museums return cultural artifacts to their countries of origin?",
    description: "Debate whether artifacts should be repatriated to their source countries",
    difficulty: 'Medium',
    theme: 'Culture',
    time_estimate: '15-20 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Corrects historical injustices and colonial exploitation",
        "Artifacts belong to their cultures of origin",
        "Enables source countries to preserve their own heritage",
        "Promotes cultural respect and international cooperation"
      ],
      con: [
        "Major museums provide better preservation and wider access",
        "Artifacts are part of shared human heritage",
        "Some source countries lack proper storage facilities",
        "Would empty world-class museums and reduce cultural exchange"
      ]
    }
  },

  // Politics Topics
  {
    id: 'live-politics-1',
    title: "Is democracy the best form of government?",
    description: "Debate the merits and drawbacks of democratic governance",
    difficulty: 'Medium',
    theme: 'Politics',
    time_estimate: '15-20 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Allows for peaceful transition of power",
        "Protects human rights and individual freedoms",
        "Encourages political participation and civic engagement",
        "Leads to more accountable and responsive governance"
      ],
      con: [
        "Can lead to mob rule and instability",
        "Not all democracies respect minority rights",
        "Political polarization can be exacerbated",
        "May prioritize short-term popularity over long-term solutions"
      ]
    }
  },
  {
    id: 'live-politics-2',
    title: "Should campaign financing be publicly funded?",
    description: "Examine the implications of public funding for political campaigns",
    difficulty: 'Hard',
    theme: 'Politics',
    time_estimate: '20-25 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Reduces the influence of wealthy donors and special interests",
        "Levels the playing field for all candidates",
        "Encourages more people to run for office",
        "Increases transparency and accountability in politics"
      ],
      con: [
        "Expensive and may divert funds from other public services",
        "Taxpayers may not want to fund campaigns they disagree with",
        "Difficult to implement fairly and effectively",
        "Could lead to increased government control over political speech"
      ]
    }
  },
  {
    id: 'live-politics-3',
    title: "Should voting be mandatory?",
    description: "Debate whether citizens should be legally required to vote in elections",
    difficulty: 'Medium',
    theme: 'Politics',
    time_estimate: '15-20 min',
    status: 'approved',
    format: 'both',
    aiArguments: {
      pro: [
        "Ensures representative democracy with full participation",
        "Reduces influence of extreme political factions",
        "Makes politicians accountable to entire population",
        "Increases civic engagement and political awareness"
      ],
      con: [
        "Violates individual freedom and right to abstain",
        "Forces uninformed voters to make random choices",
        "Creates unfair burden on those who cannot easily vote",
        "Voting quality matters more than quantity"
      ]
    }
  }
];

// Helper functions to get topics by criteria
export const getTopicsByDifficulty = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
  return liveDebateTopics.filter(topic => topic.difficulty === difficulty);
};

export const getTopicsByTheme = (theme: string) => {
  return liveDebateTopics.filter(topic => topic.theme === theme);
};

export const getTopicsByFormat = (format: '1v1' | '3v3') => {
  return liveDebateTopics.filter(topic => topic.format === format || topic.format === 'both');
};

export const getTopicsByDifficultyAndTheme = (difficulty: 'Easy' | 'Medium' | 'Hard', theme: string) => {
  return liveDebateTopics.filter(topic => 
    topic.difficulty === difficulty && topic.theme === theme
  );
};
