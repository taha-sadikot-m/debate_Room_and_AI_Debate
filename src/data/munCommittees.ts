
export interface MunCommittee {
  id: string;
  name: string;
  fullName: string;
  description: string;
  currentAgendas: string[];
  type: 'international' | 'indian';
  rulesOfProcedure: string;
  participants: number;
}

export interface LiveMunSession {
  id: string;
  committee: string;
  agenda: string;
  startTime: string;
  duration: string;
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'live' | 'completed';
  countries: string[];
}

export const munCommittees: MunCommittee[] = [
  {
    id: 'unsc',
    name: 'UNSC',
    fullName: 'United Nations Security Council',
    description: 'Maintains international peace and security',
    currentAgendas: [
      'Situation in Ukraine and Russian Federation',
      'Middle East Peace Process',
      'Climate Security and Conflict Prevention',
      'Cybersecurity Threats to International Peace'
    ],
    type: 'international',
    rulesOfProcedure: 'UNA-USA',
    participants: 15
  },
  {
    id: 'unga',
    name: 'UNGA',
    fullName: 'United Nations General Assembly',
    description: 'Main deliberative organ of the UN',
    currentAgendas: [
      'Sustainable Development Goals Progress',
      'Climate Change Mitigation and Adaptation',
      'Digital Divide and Technology Access',
      'Global Health Security Post-Pandemic'
    ],
    type: 'international',
    rulesOfProcedure: 'UNA-USA',
    participants: 193
  },
  {
    id: 'ecosoc',
    name: 'ECOSOC',
    fullName: 'Economic and Social Council',
    description: 'Coordinates economic and social work of UN',
    currentAgendas: [
      'Economic Recovery Post-COVID-19',
      'Social Protection Systems Strengthening',
      'Sustainable Urban Development',
      'Digital Economy and Future of Work'
    ],
    type: 'international',
    rulesOfProcedure: 'UNA-USA',
    participants: 54
  },
  {
    id: 'unhrc',
    name: 'UNHRC',
    fullName: 'UN Human Rights Council',
    description: 'Promotes and protects human rights globally',
    currentAgendas: [
      'Freedom of Expression in Digital Age',
      'Rights of Migrant Workers',
      'Gender Equality and Women Empowerment',
      'Rights of Indigenous Peoples'
    ],
    type: 'international',
    rulesOfProcedure: 'UNA-USA',
    participants: 47
  },
  {
    id: 'unep',
    name: 'UNEP',
    fullName: 'UN Environment Programme',
    description: 'Leading global environmental authority',
    currentAgendas: [
      'Plastic Pollution Crisis',
      'Biodiversity Conservation',
      'Green Economy Transition',
      'Environmental Justice and Equity'
    ],
    type: 'international',
    rulesOfProcedure: 'UNA-USA',
    participants: 193
  },
  {
    id: 'loksabha',
    name: 'Lok Sabha',
    fullName: 'House of the People',
    description: 'Lower house of Indian Parliament',
    currentAgendas: [
      'Digital India and Privacy Rights',
      'Agricultural Reforms and Farmer Welfare',
      'Healthcare Infrastructure Development',
      'Education Policy and Implementation'
    ],
    type: 'indian',
    rulesOfProcedure: 'Indian Parliamentary',
    participants: 543
  },
  {
    id: 'rajyasabha',
    name: 'Rajya Sabha',
    fullName: 'Council of States',
    description: 'Upper house of Indian Parliament',
    currentAgendas: [
      'Federal Structure and State Rights',
      'Environmental Protection Laws',
      'Women Reservation Bill',
      'Industrial Relations Code'
    ],
    type: 'indian',
    rulesOfProcedure: 'Indian Parliamentary',
    participants: 245
  }
];

export const liveMunSessions: LiveMunSession[] = [
  {
    id: 'unsc-001',
    committee: 'UNSC',
    agenda: 'Situation in Ukraine and Russian Federation',
    startTime: 'Saturday, 10:00 AM',
    duration: '4 hours',
    participants: 12,
    maxParticipants: 15,
    status: 'upcoming',
    countries: ['USA', 'UK', 'France', 'Russia', 'China', 'Germany', 'Japan', 'Brazil', 'India', 'Nigeria', 'UAE', 'Ghana']
  },
  {
    id: 'unga-001',
    committee: 'UNGA',
    agenda: 'Climate Change Mitigation and Adaptation',
    startTime: 'Saturday, 2:00 PM',
    duration: '4 hours',
    participants: 45,
    maxParticipants: 60,
    status: 'upcoming',
    countries: ['USA', 'China', 'India', 'Germany', 'UK', 'France', 'Brazil', 'Japan', 'Canada', 'Australia']
  },
  {
    id: 'loksabha-001',
    committee: 'Lok Sabha',
    agenda: 'Digital India and Privacy Rights',
    startTime: 'Saturday, 11:00 AM',
    duration: '4 hours',
    participants: 28,
    maxParticipants: 35,
    status: 'upcoming',
    countries: ['BJP', 'INC', 'AAP', 'TMC', 'DMK', 'SP', 'BSP', 'BJD', 'YSRCP', 'TRS']
  }
];
