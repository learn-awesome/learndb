export const io_getRandomItemId_mock = 16764;
export const io_getRandomTopicName_mock = 'mythology';

export const io_getItemById_mock = {
  rowid: 12420,
  iid: '858b0507-c1a3-4c37-94d0-26bfdf461213',
  name: 'Irrigation and Drainage Engineering',
  description: 'By Peter Waller, Muluneh Yitayew',
  image: '',
  links: 'book|http://link.springer.com/openurl?genre=book&isbn=978-3-319-05699-9',
  topics: 'civil-engineering;irrigation;drainage',
  creators: '',
  year: '',
  difficulty: '',
  cost: '',
  rating: '',
  tags: '',
};

export const io_fetchBookmark_mock = [
  {
    rowid: 14631,
    iid: '5895c3a2-b050-4915-b578-cc8171c2e24c',
    name: 'The User Experience Team of One: A Research and Design Su...',
    description: 'By Leah Buley',
    image: 'https://learn-awesome.github.io/assets/book_covers/18177290.jpg',
    links: 'book|https://www.goodreads.com/book/show/18177290-the-user-experience-team-of-one',
    topics: 'design',
    creators: '',
    year: '',
    difficulty: '',
    cost: '',
    rating: '',
    tags: '',
  },
];

export const io_getItemById_mock = {
  rowid: 483,
  iid: 'e4af7c19-a6f4-4664-b843-4f3dc3cc46f3',
  name: 'Visual Group Theory',
  description: '',
  image: '',
  links:
    'book|https://www.goodreads.com/book/show/7629307-visual-group-theory-maa-classroom-resource-materials;course|http://www.math.clemson.edu/~macaule/classes/m20_math4120/',
  topics: 'abstract-algebra',
  creators: '',
  year: '',
  difficulty: '',
  cost: '',
  rating: '',
  tags: '',
};

export const io_fetchReviews_mock = [
  {
    rowid: 997,
    item_id: '17dcaf28-177d-4bcf-9e65-265a8e0d9235',
    by: 'Reddit',
    rating: '',
    blurb: '',
    url: '',
  },
];

export const io_getTopicList_mock = [
  {
    rowid: 1,
    name: 'pricing',
    display_name: 'pricing',
    image:
      'https://images.unsplash.com/photo-1530856021941-02c71be5926f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=400',
    parent_id: 'business',
    sort_index: '',
  },
  {
    rowid: 2,
    name: 'prisoners-dilemma',
    display_name: 'Prisoners Dilemma',
    image:
      'https://images.unsplash.com/photo-1603340424570-3a4603d4814d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=400',
    parent_id: '',
    sort_index: '',
  },
  {
    rowid: 3,
    name: '15-puzzle',
    display_name: '15-puzzle',
    image:
      'https://images.unsplash.com/photo-1587397717868-1c05d68bb8b3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=400',
    parent_id: '',
    sort_index: '',
  },

  /* ... */
  {
    rowid: 2947,
    name: 'aerospace-engineering',
    display_name: 'aerospace-engineering',
    image:
      'https://images.unsplash.com/photo-1581089786257-d34fe7d9bff6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=400',
    parent_id: 'engineering',
    sort_index: '',
  },
  {
    rowid: 2948,
    name: 'digital-marketing',
    display_name: 'digital-marketing',
    image:
      'https://images.unsplash.com/photo-1517614138969-67d1892d0edf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=400',
    parent_id: 'business',
    sort_index: '',
  },
];

export const io_fetchItemWithTopic_mock = [
  {
    rowid: 43,
    iid: 'aeef2d26-1e39-4fb9-b97e-53f8456e8bf3',
    name: 'Programming Language Foundations in Agda (2018)',
    description: '',
    image: '',
    links: 'book|https://plfa.github.io/',
    topics: 'programming-languages/agda',
    creators: '',
    year: '',
    difficulty: '',
    cost: '',
    rating: '',
    tags: 'oer',
  },
  /* ... */
  {
    rowid: 496,
    iid: '6b3d6a35-c211-48d0-aeb2-311f5f296917',
    name: 'Algebra: A Very Short Introduction',
    description: '',
    image: '',
    links: 'book|https://www.goodreads.com/book/show/26257385-algebra',
    topics: 'algebra',
    creators: '',
    year: '',
    difficulty: '',
    cost: '',
    rating: '',
    tags: '',
  },
];

export const io_fetchItemsWithTopic_mock = [
  {
    rowid: 43,
    iid: 'aeef2d26-1e39-4fb9-b97e-53f8456e8bf3',
    name: 'Programming Language Foundations in Agda (2018)',
    description: '',
    image: '',
    links: 'book|https://plfa.github.io/',
    topics: 'programming-languages/agda',
    creators: '',
    year: '',
    difficulty: '',
    cost: '',
    rating: '',
    tags: 'oer',
  },

  /* ... */
  {
    rowid: 483,
    iid: 'e4af7c19-a6f4-4664-b843-4f3dc3cc46f3',
    name: 'Visual Group Theory',
    description: '',
    image: '',
    links:
      'book|https://www.goodreads.com/book/show/7629307-visual-group-theory-maa-classroom-resource-materials;course|http://www.math.clemson.edu/~macaule/classes/m20_math4120/',
    topics: 'abstract-algebra',
    creators: '',
    year: '',
    difficulty: '',
    cost: '',
    rating: '',
    tags: '',
  },
  {
    rowid: 496,
    iid: '6b3d6a35-c211-48d0-aeb2-311f5f296917',
    name: 'Algebra: A Very Short Introduction',
    description: '',
    image: '',
    links: 'book|https://www.goodreads.com/book/show/26257385-algebra',
    topics: 'algebra',
    creators: '',
    year: '',
    difficulty: '',
    cost: '',
    rating: '',
    tags: '',
  },
];

export const io_fetchItemWithName_mock = [
  {
    rowid: 5600,
    iid: 'd955fc7c-9399-4ca4-9d26-74bf0337620b',
    name: 'Copywriting: Improve User Experience One Word at a Time',
    description: 'By  via openSAP',
    image: '',
    links:
      'course|https://www.classcentral.com/course/opensap-copywriting-improve-user-experience-one-word-at-a-time-8948',
    topics: 'writing;copywriting',
    creators: '',
    year: '',
    difficulty: '',
    cost: '',
    rating: '',
    tags: '',
  },
  {
    rowid: 6695,
    iid: 'e1eef408-c0b6-4932-bf32-2b8c4de1b75e',
    name: 'UX (User Experience) Capstone',
    description: 'By University of Michigan via Coursera',
    image: '',
    links: 'course|https://www.classcentral.com/course/coursera-ux-user-experience-capstone-12355',
    topics: 'design',
    creators: '',
    year: '',
    difficulty: '',
    cost: '',
    rating: '',
    tags: '',
  },
  {
    rowid: 6737,
    iid: 'd04481c1-7564-4c95-b5ef-48726e72cb4d',
    name: 'User Experience: Research & Prototyping',
    description: 'By University of California, San Diego  via Coursera',
    image: '',
    links:
      'course|https://www.classcentral.com/course/coursera-user-experience-research-prototyping-2788',
    topics: 'user-experience',
    creators: '',
    year: '',
    difficulty: '',
    cost: '',
    rating: '',
    tags: '',
  },
  {
    rowid: 6749,
    iid: '7838b08e-accc-4292-88b3-0ae7a46dba12',
    name: 'Print and Digital Elements of Design: Branding and User Experience',
    description: 'By University of Colorado Boulder via Coursera',
    image: '',
    links: 'course|https://www.coursera.org/learn/designing-print-digital-media',
    topics: 'design;branding',
    creators: '',
    year: '',
    difficulty: '',
    cost: '',
    rating: '',
    tags: '',
  },
  {
    rowid: 6753,
    iid: 'cc0c9386-c591-4b6e-98de-07eceb580084',
    name: 'Introduction to User Experience Design',
    description: 'By Georgia Institute of Technology via Coursera',
    image: '',
    links:
      'course|https://www.classcentral.com/course/coursera-introduction-to-user-experience-design-6535',
    topics: 'user-experience',
    creators: '',
    year: '',
    difficulty: '',
    cost: '',
    rating: '',
    tags: '',
  },
  {
    rowid: 6791,
    iid: 'e52246fe-53a8-40f0-8440-ae8c564151cd',
    name: 'Digital Skills: User Experience',
    description: 'By Accenture via FutureLearn',
    image: '',
    links: 'course|https://www.futurelearn.com/courses/digital-skills-user-experience',
    topics: 'user-experience',
    creators: '',
    year: '',
    difficulty: '',
    cost: '',
    rating: '',
    tags: '',
  },
];


export const io_fetchTopicByName_mock = [{"rowid":135,"name":"engineering-mathematics","display_name":"engineering-mathematics","image":"https://images.unsplash.com/photo-1596496356933-9b6e0b186b88?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=400","parent_id":"mathematics","sort_index":""},{"rowid":163,"name":"math","display_name":"math","image":"https://images.unsplash.com/photo-1597599354513-e1e8a3c565cb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=400","parent_id":"","sort_index":""},{"rowid":266,"name":"mathematics","display_name":"mathematics","image":"https://images.unsplash.com/photo-1548691905-57c36cc8d935?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=400","parent_id":"","sort_index":"1"},{"rowid":414,"name":"mathematical-thinking","display_name":"mathematical-thinking","image":"https://images.unsplash.com/photo-1523283224234-07d5b6463f30?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=400","parent_id":"thinking","sort_index":""},{"rowid":749,"name":"mathematical-economics","display_name":"mathematical-economics","image":"https://images.unsplash.com/photo-1571340910399-354d2ce7f1dd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=400","parent_id":"","sort_index":""},{"rowid":852,"name":"aromatherapy","display_name":"aromatherapy","image":"https://images.unsplash.com/photo-1515377905703-c4788e51af15?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=400","parent_id":"","sort_index":""}]
datasette.js:92 ---io_fetchItemWithName-------
datasette.js:93 [{"rowid":484,"iid":"8ca80cea-2541-4b3d-84e7-39f08ad61e85","name":"Math E-222 Instructor- Professor Benedict Gross","description":"","image":"","links":"course|http://www.infocobuild.com/education/audio-video-courses/mathematics/math-e222-harvard.html","topics":"abstract-algebra","creators":"","year":"","difficulty":"","cost":"","rating":"","tags":""},{"rowid":497,"iid":"862d763c-de07-47c2-8766-c5f2400537a6","name":"MathBox: Tool for Thought (Algebra & Fourier Analysis)","description":"","image":"","links":"interactive|https://acko.net/files/gltalks/toolsforthought/#0","topics":"algebra","creators":"","year":"","difficulty":"","cost":"","rating":"","tags":""},{"rowid":686,"iid":"dff92bcc-77d6-4669-8513-abc39452398d","name":"UpAndAtom: Is Mathematics Invented or Discovered?","description":"","image":"","links":"video|https://watchnebula.com/videos/up-and-atom-is-mathematics-invented-or-discovered","topics":"mathematics","creators":"","year":"","difficulty":"","cost":"","rating":"","tags":""},{"rowid":853,"iid":"bfe62e02-0851-4749-893d-ec657a71c2f8","name":"MIT Mathematics for Computer Science (2010)","description":"","image":"","links":"course|https://www.youtube.com/playlist?list=PLB7540DEDD482705B","topics":"computer-science","creators":"","year":"","difficulty":"","cost":"","rating":"","tags":"oer"},{"rowid":1221,"iid":"da5d4e71-e574-4d71-a378-47610fe2d450","name":"AP®︎ Statistics | Math |\nKhan Academy","description":"","image":"","links":"course|https://www.khanacademy.org/math/ap-statistics","topics":"statistics","creators":"","year":"","difficulty":"","cost":"","rating":"","tags":""},{"rowid":1385,"iid":"36e54c26-fac4-4e6d-ab5d-3644b4ac112f","name":"Compositionality – The open-access journal for the mathematics of composition","description":"","image":"","links":"journal|https://compositionality-journal.org/","topics":"category-theory","creators":"","year":"","difficulty":"","cost":"","rating":"","tags":""}]
