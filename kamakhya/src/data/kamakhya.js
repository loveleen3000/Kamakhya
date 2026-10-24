export const IMAGES = {
  hero: 'https://media.base44.com/images/public/6adb9860d532be10328c5d19/76c1ba550_generated_image.png',
  ritvi: 'https://media.base44.com/images/public/6adb9860d532be10328c5d19/9fb5b0ba1_generated_image.png',
  user: 'https://media.base44.com/images/public/6adb9860d532be10328c5d19/a00c4a03a_generated_image.png',
  pcos: 'https://media.base44.com/images/public/6adb9860d532be10328c5d19/e54fb2fd5_generated_image.png',
  cramps: 'https://media.base44.com/images/public/6adb9860d532be10328c5d19/572cbb0a9_generated_image.png',
  firstPeriod: 'https://media.base44.com/images/public/6adb9860d532be10328c5d19/bccf0279f_generated_image.png',
  sustainable: 'https://media.base44.com/images/public/6adb9860d532be10328c5d19/0642bcf0f_generated_image.png',
  logo: 'https://media.base44.com/images/public/6adb9860d532be10328c5d19/351109ed7_233333.jpg',
};

export const CYCLE = {
  today: 23,
  monthLabel: 'October 2026',
  monthShort: 'Oct',
  daysInMonth: 31,
  firstWeekday: 4, // Sunday-first index (Oct 1, 2026 is a Thursday)
  weekdayLabels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  cycleDay: 18,
  cycleLength: 35,
  periodLength: 5,
  periodDays: [6, 7, 8, 9, 10],
  predictedDays: [26, 27, 28, 29, 30, 31],
  ovulationDay: 31,
  nextWindow: 'Oct 26–31',
  nextPeriod: 'Nov 10',
  wellnessScore: 88,
  basalTemp: 36.6,
};

export const PHASES = [
  {
    key: 'menstrual',
    name: 'Menstrual',
    range: 'Day 1–5',
    from: 1,
    to: 5,
    days: 5,
    note: 'Rest & restore',
    detail: 'Iron-rich food, warmth on the belly, permission to slow down.',
    gradient: 'from-[#8E1F45] to-[#E85D75]',
    chip: 'bg-lotus-100 text-berry',
  },
  {
    key: 'follicular',
    name: 'Follicular',
    range: 'Day 6–20',
    from: 6,
    to: 20,
    days: 15,
    note: 'Energy rising',
    detail: 'Oestrogen climbs — ideal for new projects, strength work and social plans.',
    gradient: 'from-[#E85D75] to-[#F7B267]',
    chip: 'bg-peach text-[#9A5B1F]',
  },
  {
    key: 'ovulatory',
    name: 'Ovulatory',
    range: 'Day 21–23',
    from: 21,
    to: 23,
    days: 3,
    note: 'Peak glow',
    detail: 'Peak fertility and confidence. Hydrate more, notice your skin shine.',
    gradient: 'from-[#F7B267] to-[#FFD9A0]',
    chip: 'bg-[#FFF3DC] text-[#8A5A12]',
  },
  {
    key: 'luteal',
    name: 'Luteal',
    range: 'Day 24–35',
    from: 24,
    to: 35,
    days: 12,
    note: 'Wind down',
    detail: 'Progesterone settles in — magnesium, sleep and softer workouts help most.',
    gradient: 'from-[#5C1D2E] to-[#8B5CF6]',
    chip: 'bg-lavender-100 text-[#5B3FA8]',
  },
];

export const phaseForCycleDay = (cycleDay) =>
  PHASES.find((p) => cycleDay >= p.from && cycleDay <= p.to) ?? PHASES[0];

export const MOODS = [
  { key: 'calm', label: 'Calm', hint: 'Steady & restful', from: '#8B5CF6', to: '#C4B5FD' },
  { key: 'radiant', label: 'Radiant', hint: 'Bright & social', from: '#F7B267', to: '#FFD9A0' },
  { key: 'sensitive', label: 'Sensitive', hint: 'Tender, close to tears', from: '#60A5FA', to: '#BFDBFE' },
  { key: 'crampy', label: 'Crampy', hint: 'Aching, low belly', from: '#E85D75', to: '#F7A5B4' },
  { key: 'low', label: 'Low Energy', hint: 'Flat & foggy', from: '#64748B', to: '#94A3B8' },
];

export const SYMPTOMS = [
  { key: 'cramps', label: 'Cramps' },
  { key: 'headache', label: 'Headache' },
  { key: 'acne', label: 'Acne' },
  { key: 'bloating', label: 'Bloating' },
  { key: 'fatigue', label: 'Fatigue' },
  { key: 'mood', label: 'Mood swings' },
];

export const ENERGY_LABELS = {
  1: 'Running on empty',
  2: 'Gentle day',
  3: 'Steady',
  4: 'Bright',
  5: 'Radiant',
};

const DAY_NOTES = {
  23: 'Steady and clear today. The morning walk is doing more than I gave it credit for.',
  22: 'Slept 8 hours, skipped sugar, skin looks calmer. Focus held all day.',
  20: 'Light stretch after dinner helped the bloat settle by night.',
  18: 'Tender and tired. Said no to the late call and it was the right call.',
  16: 'Cramps came in waves in the morning, warmth helped a lot.',
};

export function dayInfo(day) {
  const isPeriod = CYCLE.periodDays.includes(day);
  const isPredicted = CYCLE.predictedDays.includes(day);
  const isToday = day === CYCLE.today;
  const isOvulation = day === CYCLE.ovulationDay;
  const cycleDay = day >= 6 ? day - 5 : day + 30;
  const phase = phaseForCycleDay(cycleDay);

  const moodKey = isPeriod ? 'crampy' : phase.key === 'luteal' ? 'sensitive' : 'radiant';
  const symptoms = isPeriod
    ? ['cramps', 'fatigue']
    : isOvulation
      ? ['acne']
      : phase.key === 'luteal'
        ? ['bloating', 'mood']
        : ['bloating'];

  return {
    day,
    isToday,
    isPeriod,
    isPredicted,
    isOvulation,
    cycleDay,
    phase,
    flow: isPeriod ? (day <= 8 ? 'Heavy' : day <= 9 ? 'Medium' : 'Light') : null,
    moodKey,
    mood: MOODS.find((m) => m.key === moodKey),
    energy: isPeriod ? 2 : isOvulation ? 4 : 3,
    symptoms,
    temperature: (36.3 + ((day * 7) % 5) * 0.1).toFixed(1),
    note: DAY_NOTES[day] ?? 'No reflection logged for this day yet.',
    logged: day <= CYCLE.today,
  };
}

export const JOURNAL = [
  {
    id: 'j1',
    date: 'Oct 22',
    label: 'Yesterday',
    cycleDay: 17,
    phase: 'Follicular',
    moodKey: 'radiant',
    energy: 4,
    pain: 1,
    temperature: '36.6',
    symptoms: ['Bloating'],
    note: 'Slept 8 hours and skipped sugar. Skin looks calmer and my focus held all day.',
    ritual: '20-min walk · 2L water',
  },
  {
    id: 'j2',
    date: 'Oct 20',
    label: 'Mon',
    cycleDay: 15,
    phase: 'Follicular',
    moodKey: 'calm',
    energy: 3,
    pain: 2,
    temperature: '36.5',
    symptoms: ['Bloating', 'Headache'],
    note: 'Light stretch after dinner helped the bloat settle by night. Screens off by 10.',
    ritual: 'Yin stretch · magnesium',
  },
  {
    id: 'j3',
    date: 'Oct 18',
    label: 'Sat',
    cycleDay: 13,
    phase: 'Follicular',
    moodKey: 'sensitive',
    energy: 2,
    pain: 3,
    temperature: '36.4',
    symptoms: ['Fatigue', 'Mood swings'],
    note: 'Tender and tired. Said no to the late call and it was the right call.',
    ritual: 'Hot water bag · early night',
  },
  {
    id: 'j4',
    date: 'Oct 16',
    label: 'Thu',
    cycleDay: 11,
    phase: 'Follicular',
    moodKey: 'crampy',
    energy: 1,
    pain: 4,
    temperature: '36.3',
    symptoms: ['Cramps', 'Fatigue', 'Mood swings'],
    note: 'Cramps came in waves in the morning, warmth helped a lot. Skipped the gym guilt-free.',
    ritual: 'Heat therapy · iron-rich lunch',
  },
];

export const VIDEOS = [
  {
    id: 'v1',
    title: 'PCOS & Hormones: What Your Bloodwork Really Says',
    category: 'PCOS & Hormones',
    author: 'Dr. Ananya Rao, Gynaecologist',
    verified: true,
    duration: '14:20',
    views: '128k views',
    image: IMAGES.pcos,
    takeaways: [
      'Which two of the three Rotterdam criteria actually confirm PCOS.',
      'Why a single ultrasound scan is rarely enough on its own.',
      'The lifestyle levers that shift insulin resistance in 8–12 weeks.',
    ],
  },
  {
    id: 'v2',
    title: '5 Cramp Relief Hacks That Actually Work',
    category: 'Period Pain Hacks',
    author: 'Dr. Meera Iyer, Physiotherapist',
    verified: true,
    duration: '8:45',
    views: '96k views',
    image: IMAGES.cramps,
    takeaways: [
      'Continuous low-level heat beats intermittent heat for cramp relief.',
      'Two stretches that release the lower belly and pelvic floor.',
      'When pain stops your day — the signs that need a doctor.',
    ],
  },
  {
    id: 'v3',
    title: 'Your First Period: A Gentle Guide for Her & You',
    category: 'First Period Guide',
    author: 'Kamakhya Care Team',
    verified: false,
    duration: '11:02',
    views: '54k views',
    image: IMAGES.firstPeriod,
    takeaways: [
      'What a first cycle usually looks like in the first two years.',
      'How to talk about it without fear or euphemism.',
      'A simple starter kit for school days.',
    ],
  },
  {
    id: 'v4',
    title: 'Sustainable Care: Cups, Cloth & Comfort',
    category: 'Sustainable Care (Cups & Cloth)',
    author: 'Sana Kapoor, Menstrual Health Educator',
    verified: true,
    duration: '9:36',
    views: '72k views',
    image: IMAGES.sustainable,
    takeaways: [
      'How to choose a cup size without guesswork.',
      'Boiling, storing and travelling with reusable care.',
      'Washing cloth pads so they last three years, not three months.',
    ],
  },
  {
    id: 'v5',
    title: 'Iron, Ferritin & Why You’re Always Tired',
    category: 'PCOS & Hormones',
    author: 'Dr. Ananya Rao, Gynaecologist',
    verified: true,
    duration: '12:10',
    views: '61k views',
    image: IMAGES.pcos,
    takeaways: [
      'Why ferritin, not haemoglobin, explains period tiredness.',
      'What to eat together to actually absorb iron.',
      'The symptoms that make low iron worth testing.',
    ],
  },
  {
    id: 'v6',
    title: 'Heat, TENS & Your Personal Cramp Toolkit',
    category: 'Period Pain Hacks',
    author: 'Dr. Meera Iyer, Physiotherapist',
    verified: true,
    duration: '7:28',
    views: '44k views',
    image: IMAGES.cramps,
    takeaways: [
      'How to time heat for the first 48 hours.',
      'A two-minute pelvic release you can do at a desk.',
      'What to log so your doctor sees the real pattern.',
    ],
  },
  {
    id: 'v7',
    title: 'Talking to Your Daughter Before Her First Period',
    category: 'First Period Guide',
    author: 'Kamakhya Care Team',
    verified: false,
    duration: '10:15',
    views: '38k views',
    image: IMAGES.firstPeriod,
    takeaways: [
      'Three sentences that make the conversation easier.',
      'What to pack in a school-day kit.',
      'How to talk about pain without fear-mongering.',
    ],
  },
  {
    id: 'v8',
    title: 'Cup vs Cloth: A Practical 30-Day Test',
    category: 'Sustainable Care (Cups & Cloth)',
    author: 'Sana Kapoor, Menstrual Health Educator',
    verified: true,
    duration: '13:44',
    views: '29k views',
    image: IMAGES.sustainable,
    takeaways: [
      'Comfort, cost and cleaning compared honestly.',
      'Troubleshooting leaks in week one.',
      'A wash routine that fits a shared bathroom.',
    ],
  },
];

export const CATEGORIES = [
  { key: 'all', label: 'All lessons', count: 24, icon: 'sparkle', gradient: 'from-[#5C1D2E] to-[#8E1F45]' },
  { key: 'PCOS & Hormones', label: 'PCOS & Hormones', count: 8, icon: 'flask', gradient: 'from-[#8B5CF6] to-[#C4B5FD]' },
  { key: 'Period Pain Hacks', label: 'Period Pain Hacks', count: 6, icon: 'zap', gradient: 'from-[#E85D75] to-[#F7A5B4]' },
  { key: 'First Period Guide', label: 'First Period Guide', count: 5, icon: 'flower', gradient: 'from-[#F7B267] to-[#FFD9A0]' },
  { key: 'Sustainable Care (Cups & Cloth)', label: 'Sustainable Care', count: 5, icon: 'leaf', gradient: 'from-[#4A7C59] to-[#9BC4A8]' },
];

export const MYTHS = [
  {
    id: 'm1',
    myth: '“You can’t get pregnant during your period.”',
    fact: 'Fertility can begin before bleeding fully stops. In shorter cycles, ovulation can arrive within days of the last bleeding day — so the tail of your period can overlap a fertile window.',
    source: 'Reviewed by Dr. Ananya Rao',
  },
  {
    id: 'm2',
    myth: '“Irregular cycles always mean PCOS.”',
    fact: 'Stress, weight change, thyroid disorders, intense training and travel all shift cycles. PCOS needs two of three clinical criteria — and a proper review, never a self-diagnosis.',
    source: 'Reviewed by Dr. Meera Iyer',
  },
  {
    id: 'm3',
    myth: '“Cramps are just part of being a woman.”',
    fact: 'Mild cramping is common. Pain that stops school, work or sleep is not normal — endometriosis and fibroids are still missed for an average of seven years. It deserves investigation.',
    source: 'Reviewed by Dr. Ananya Rao',
  },
];

export const FEATURES = [
  {
    key: 'predict',
    title: 'Predictions that learn you',
    text: 'Not a static 28-day template. Kamakhya follows your real record and nudges the window as your body shifts.',
    icon: 'compass',
  },
  {
    key: 'ritvi',
    title: 'Ritvi, always awake',
    text: 'Ask about a late cycle, a strange symptom or a scary headline — and get an answer grounded in your own log.',
    icon: 'sparkles',
  },
  {
    key: 'discreet',
    title: 'Discreet by design',
    text: 'One switch blurs every sensitive detail on screen. Hand your phone over without a second thought.',
    icon: 'shield',
  },
  {
    key: 'learn',
    title: 'Learning that respects you',
    text: 'Gynaecologist-reviewed lessons, myth-busting cards and no scaremongering. Ever.',
    icon: 'book',
  },
];

export const TESTIMONIALS = [
  {
    id: 't1',
    quote: 'The first cycle app that didn’t feel like it was shouting at me in pink. The phase notes actually match how my week goes.',
    name: 'Aarti M.',
    city: 'Pune',
    detail: 'Tracking for 8 months',
  },
  {
    id: 't2',
    quote: 'I asked Ritvi why my cycle was late at 1am and got a calm, sensible answer instead of a panic spiral. That mattered.',
    name: 'Neha S.',
    city: 'Bengaluru',
    detail: 'Tracking for 1 year',
  },
  {
    id: 't3',
    quote: 'Discreet mode is the reason I finally log honestly. Nobody sees anything unless I choose to show them.',
    name: 'Ritika D.',
    city: 'Chandigarh',
    detail: 'Tracking for 4 months',
  },
];

export const RITVI = {
  suggestions: [
    'Do I have PCOS?',
    'Why is my cycle late?',
    'Quick cramp relief',
    'Is spotting normal?',
  ],
  opening: 'Hello Aarohi. I can see your cycle day 18 and your last four reflections. What’s on your mind today?',
  answers: {
    'Why is my cycle late?': {
      intro: 'From your own log, a few things stand out:',
      bullets: [
        { label: 'You’re on cycle day 18', text: 'In a 35-day cycle, ovulation arrives around day 26 — so a shift of ±7 days is still inside your normal rhythm.' },
        { label: 'Sleep and stress', text: 'Your last three entries show low energy and late nights. Stress can delay ovulation, and a delayed ovulation delays the whole cycle.' },
        { label: 'What to watch', text: 'If bleeding hasn’t started 35+ days after your last period began, a pregnancy test and a check-in with a gynaecologist is the sensible next step.' },
      ],
      action: 'This week: keep logging symptoms, protect 7–8 hours of sleep, and add magnesium-rich food in the evening.',
    },
    'Do I have PCOS?': {
      intro: 'I can’t diagnose you, but here’s what your record suggests:',
      bullets: [
        { label: 'Your cycles are fairly regular', text: 'You’ve logged a 32–35 day rhythm. PCOS usually shows irregular or missed cycles — this pattern alone doesn’t point there.' },
        { label: 'Skin and energy', text: 'Two entries mention acne and fatigue, which can appear with hormonal shifts — but also with poor sleep and low iron.' },
        { label: 'What actually confirms it', text: 'Two of three: irregular ovulation, clinical signs of high androgens, or polycystic ovaries on a scan — assessed by a doctor, not an app.' },
      ],
      action: 'Worth booking if you also notice hair growth on the face, weight changes or cycles stretching past 40 days.',
    },
    default: {
      intro: 'Here’s what your cycle and reflections tell me:',
      bullets: [
        { label: 'Where you are', text: 'Cycle day 18 of a 35-day rhythm — late follicular, with your fertile window opening around Oct 26.' },
        { label: 'Your pattern', text: 'Energy peaks in the follicular phase and dips two days before bleeding, which matches your last four entries.' },
        { label: 'A gentle nudge', text: 'Heat, magnesium and an earlier night made the biggest difference in your own logs this month.' },
      ],
      action: 'Log today’s mood so tomorrow’s guidance gets sharper.',
    },
  },
  disclaimer: 'Educational guidance only — not a diagnosis. For anything persistent, please see a gynaecologist.',
};