
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
    title: "Should AI replace human teachers in schools?",
    description: "Debate the role of artificial intelligence in education",
    difficulty: 'Medium',
    category: 'Education Technology',
    timeEstimate: '12-15 min',
    theme: 'Technology',
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
  {
    id: 'tech-2',
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
