import * as yup from "yup";

const options = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
  { value: 20, label: "20" },
];

const classoptions = [
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10" },
  { value: 11, label: "11" },
  { value: 12, label: "12" },
];

// Define the dynamic subject options based on class
const dynamicSubjectOptions = {
  "6": [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
    { value: "Social Science", label: "Social Science" },
    { value: "Urdu", label: "Urdu" },
    { value: "Sanskrit", label: "Sanskrit" },
  ],
  "7": [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
    { value: "Social Science", label: "Social Science" },
    { value: "Urdu", label: "Urdu" },
    { value: "Sanskrit", label: "Sanskrit" },
  ],
  "8": [
    { value: "English It So Happened", label: "English It So Happened" },
    { value: "English HoneyDew", label: "English HoneyDew" },
    { value: "Hindi", label: "Hindi" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
    { value: "Political Science", label: "Political Science" },
    { value: "History", label: "History" },
    { value: "Geography", label: "Geography" },
    { value: "Urdu", label: "Urdu" },
    { value: "Sanskrit", label: "Sanskrit" },
  ],
  "9": [
    { value: "English Beehive", label: "English Beehive" },
    {
      value: "English Moments Supplementary Reader",
      label: "English Moments Supplementary Reader",
    },
    {
      value: "English Words and Expressions 1",
      label: "English Words and Expressions 1",
    },
    { value: "Hindi Kshitij", label: "Hindi Kshitij" },
    { value: "Hindi Sprash", label: "Hindi Sprash" },
    { value: "Hindi Kritika", label: "Hindi Kritika" },
    { value: "Hindi Sanchayan", label: "Hindi Sanchayan" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
    { value: "Political Science", label: "Political Science" },
    { value: "History", label: "History" },
    { value: "Geography", label: "Geography" },
    { value: "Economics", label: "Economics" },
    { value: "Urdu", label: "Urdu" },
    { value: "Sanskrit Shemushi Prathmo", label: "Sanskrit Shemushi Prathmo" },
    { value: "Sanskrit Vyakranavithi", label: "Sanskrit Vyakranavithi" },
    { value: "Sanskrit Abhyaswaan Bhav", label: "Sanskrit Abhyaswaan Bhav" },
    {
      value: "Information and Communication Technology",
      label: "Information and Communication Technology",
    },
  ],
  "10": [
    { value: "English First Flight", label: "English First Flight" },
    {
      value: "English Foot Prints Without Feet",
      label: "English Foot Prints Without Feet",
    },
    {
      value: "English Words and Expressions 2",
      label: "English Words and Expressions 2",
    },
    { value: "Hindi Kshitij", label: "Hindi Kshitij" },
    { value: "Hindi Sprash", label: "Hindi Sprash" },
    { value: "Hindi Kritika", label: "Hindi Kritika" },
    { value: "Hindi Sanchayan", label: "Hindi Sanchayan" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
    { value: "Political Science", label: "Political Science" },
    { value: "History", label: "History" },
    { value: "Geography", label: "Geography" },
    { value: "Economics", label: "Economics" },
    { value: "Urdu", label: "Urdu" },
    { value: "Sanskrit Shemushi Part 2", label: "Sanskrit Shemushi Prathmo" },
    { value: "Sanskrit Vyakranavithi", label: "Sanskrit Vyakranavithi" },
    { value: "Sanskrit Abhyaswaan Bhav", label: "Sanskrit Abhyaswaan Bhav" },
    
  ],
  "11": [
    { value: "English Woven Words", label: "English Woven Words" },
    { value: "English Hornbill", label: "English Hornbill" },
    {
      value: "English Snapshots Supplementary Reader",
      label: "English Snapshots Supplementary Reader",
    },
    { value: "Physics Part 1", label: "Physics Part 1" },
    { value: "Physics Part 2", label: "Physics Part 2" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Chemistry Part 1", label: "Chemistry Part 1" },
    { value: "Chemistry Part 2", label: "Chemistry Part 2" },
    { value: "Biology", label: "Biology" },
    { value: "Sanskrit Bhaswati", label: "Sanskrit Bhaswati" },
    { value: "Sanskrit Shashwati", label: "Sanskrit Shashwati" },
    { value: "Psychology", label: "Psychology" },
    { value: "Biotechnology", label: "Biotechnology" },
    {
      value: "Geography Fundamental of Physical Geography",
      label: "Geography Fundamental of Physical Geography",
    },
    {
      value: "Geography Pratical Work in Geography",
      label: "Geography Pratical Work in Geography",
    },
    {
      value: "Geography India Physical Environment",
      label: "Geography India Physical Environment",
    },
    { value: "Hindi Antra Part 1", label: "Hindi Antra Part 1" },
    { value: "Hindi Aroh", label: "Hindi Aroh" },
    { value: "Hindi Vitan Part 1", label: "Hindi Vitan Part 1" },
    {
      value: "Sociology Introducing Sociology",
      label: "Sociology Introducing Sociology",
    },
    {
      value: "Sociology Understanding Society",
      label: "Sociology Understanding Society",
    },
    {
      value: "Political Science Political Theory",
      label: "Political Science Political Theory",
    },
    {
      value: "Political Science India Constitution at Work",
      label: "Political Science India Constitution at Work",
    },
    {
      value: "History Themes in World History",
      label: "History Themes in World History",
    },
    {
      value: "Economics Indian Economic Development",
      label: "Economics Indian Economic Development",
    },
    {
      value: "Economics Statistics for Economics",
      label: "Economics Statistics for Economics",
    },
    { value: "Business Studies", label: "Business Studies" },
    { value: "Urdu", label: "Urdu" },
    {
      value: "Home Science Human Ecology and Family Sciences Part 1",
      label: "Home Science Human Ecology and Family Sciences Part 1",
    },
    {
      value: "Home Science Human Ecology and Family Sciences Part 2",
      label: "Home Science Human Ecology and Family Sciences Part 2",
    },
    {
      value: "Creative Writing and Translation",
      label: "Creative Writing and Translation",
    },
    { value: "Informatics Practices", label: "Informatics Practices" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Financial Accounting", label: "Financial Accounting" },
    { value: "Accountancy Part 1", label: "Accountancy Part 1" },
    { value: "Accountancy Part 2", label: "Accountancy Part 2" },
  ],
  "12": [
    { value: "English Vistas", label: "English Vistas" },
    { value: "Physics Part 1", label: "Physics Part 1" },
    { value: "Physics Part 2", label: "Physics Part 2" },
    { value: "Mathematics Part 1", label: "Mathematics Part 1" },
    { value: "Mathematics Part 2", label: "Mathematics Part 2" },
    { value: "Chemistry Part 1", label: "Chemistry Part 1" },
    { value: "Chemistry Part 2", label: "Chemistry Part 2" },
    { value: "Biology", label: "Biology" },
    { value: "Sanskrit", label: "Sanskrit" },
    {
      value: "Computerised Accounting System",
      label: "Computerised Accounting System",
    },
    { value: "Accountancy Part 1", label: "Accountancy Part 1" },
    { value: "Accountancy Part 2", label: "Accountancy Part 2" },
    { value: "Psychology", label: "Psychology" },
    { value: "Biotechnology", label: "Biotechnology" },
    {
      value: "Geography Fundamentals of Human Geography",
      label: "Geography Fundamentals of Human Geography",
    },
    {
      value: "Geography Pratical Work in Geography",
      label: "Geography Pratical Work in Geography",
    },
    {
      value: "Geography India People And Economy",
      label: "Geography India People And Economy",
    },
    { value: "Hindi Antra Part 2", label: "Hindi Antra Part 2" },
    { value: "Hindi Aroh Part 2", label: "Hindi Aroh Part 2" },
    { value: "Hindi Vitan Part 2", label: "Hindi Vitan Part 2" },
    { value: "Sociology Indian Society", label: "Sociology Indian Society" },
    {
      value: "Sociology Social Change and Development in India",
      label: "Sociology Social Change and Development in India",
    },
    {
      value: "Political Science Politics in India Since Independence",
      label: "Political Science Politics in India Since Independence",
    },
    {
      value: "Political Science Contemporary World Politics",
      label: "Political Science Contemporary World Politics",
    },
    {
      value: "History Themes in Indian History Part 1",
      label: "History Themes in Indian History Part 1",
    },
    {
      value: "History Themes in Indian History Part 2",
      label: "History Themes in Indian History Part 2",
    },
    {
      value: "History Themes in Indian History Part 3",
      label: "History Themes in Indian History Part 3",
    },
    {
      value: "Economics Introductory Microeconomics",
      label: "Economics Introductory Microeconomics",
    },
    {
      value: "Economics Introductory Macroeconomics",
      label: "Economics Introductory Macroeconomics",
    },
    { value: "Business Studies Part 1", label: "Business Studies Part 1" },
    { value: "Business Studies Part 2", label: "Business Studies Part 2" },
    { value: "Urdu", label: "Urdu" },
    {
      value: "Home Science Human Ecology and Family Sciences Part 1",
      label: "Home Science Human Ecology and Family Sciences Part 1",
    },
    {
      value: "Home Science Human Ecology and Family Sciences Part 2",
      label: "Home Science Human Ecology and Family Sciences Part 2",
    },
    {
      value: "Creative Writing and Translation",
      label: "Creative Writing and Translation",
    },
    { value: "Informatics Practices", label: "Informatics Practices" },
    { value: "Computer Science", label: "Computer Science" },
  ],
  default: [],
};

const chapterCounts = new Map<string, string[] | number>([
  [
    "6-Mathematics-NCERT",
    [
      "Knowing Our Numbers",
      "Whole Numbers",
      "Playing with Numbers",
      "Basic Geometrical Ideas",
      "Understanding Elementary Shapes",
      "Integers",
      "Fractions",
      "Decimals",
      "Data Handling",
      "Mensuration",
      "Algebra",
      "Ratio and Proportion",
      "Symmetry",
      "Practical Geometry",
    ],
  ],
  [
    "7-Mathematics-NCERT",
    [
      "Integers",
      "Fractions and Decimals",
      "Data Handling",
      "Simple Equations",
      "Lines and Angles",
      "The Triangle and its Properties",
      "Congruence of Triangles",
      "Comparing Quantities",
      "Rational Numbers",
      "Practical Geometry",
      "Perimeter and Area",
      "Algebraic Expressions",
      "Exponents and Powers",
      "Symmetry",
      "Visualising Solid Shapes",
    ],
  ],
  [
    "8-Mathematics-NCERT",
    [
      "Rational Numbers",
      "Linear Equations in One Variable",
      "Understanding Quadrilaterals",
      "Practical Geometry",
      "Data Handling",
      "Squares and Square Roots",
      "Cubes and Cube Roots",
      "Comparing Quantities",
      "Algebraic Expressions and Identities",
      "Visualising Solid Shapes",
      "Mensuration",
      "Exponents and Powers",
      "Direct and Inverse Proportions",
      "Factorisation",
      "Introduction to Graphs",
      "Playing with Numbers",
    ],
  ],
  [
    "9-Mathematics-NCERT",
    [
      "Number Systems",
      "Polynomials",
      "Coordinate Geometry",
      "Linear Equations in Two Variables",
      "Introduction to Euclid’s Geometry",
      "Lines and Angles",
      "Triangles",
      "Quadrilaterals",
      "Areas of Parallelograms and Triangles",
      "Circles",
      "Constructions",
      "Heron’s Formula",
      "Surface Areas and Volumes",
      "Statistics",
      "Probability",
    ],
  ],
  [
    "10-Mathematics-NCERT",
    [
      "Real Numbers",
      "Polynomials",
      "Pair of Linear Equations in Two Variables",
      "Quadratic Equations",
      "Arithmetic Progressions",
      "Triangles",
      "Coordinate Geometry",
      "Introduction to Trigonometry",
      "Some Applications of Trigonometry",
      "Circles",
      "Areas Related to Circles",
      "Surface Areas and Volumes",
      "Statistics",
      "Probability",
    ],
  ],
  [
    "11-Mathematics-NCERT",
    [
      "Sets",
      "Relations and Functions",
      "Trigonometric Functions",
      "Principle of Mathematical Induction",
      "Complex Numbers and Quadratic Equations",
      "Linear Inequalities",
      "Permutations and Combinations",
      "Binomial Theorem",
      "Sequences and Series",
      "Straight Lines",
      "Conic Sections",
      "Introduction to Three Dimensional Geometry",
      "Limits and Derivatives",
      "Mathematical Reasoning",
      "Statistics",
      "Probability",
    ],
  ],
  [
    "12-Mathematics Part 1-NCERT",
    [
      "Relations and Functions",
      "Inverse Trigonometric Functions",
      "Matrices",
      "Determinants",
      "Continuity and Differentiability",
      "Application of Derivatives",
    ],
  ],
  [
    "12-Mathematics Part 2-NCERT",
    [
      "Integrals",
      "Application of Integrals",
      "Differential Equations",
      "Vector Algebra",
      "Three Dimensional Geometry",
      "Linear Programming",
      "Probability",
    ],
  ],

  [
    "6-Urdu-NCERT",
    [
      "हमद",
      "नाथ",
      "आओ हिन्दी सीखें",
      "रंग-बिरंगा",
      "ख़ुदा की कुदरत",
      "पौधे",
      "एक कहानी",
      "इंसाफ़",
      "पहेलियाँ",
      "क़िस्सा",
      "ख़ूबियाँ",
      "दोस्ती",
      "मेरा घर",
      "आज़ादी",
    ],
  ],
  [
    "7-Urdu-NCERT",
    [
      "अल्लाह",
      "पहाड़ और गिलहरी",
      "ख़ुदा के रहमते",
      "पहेलियाँ",
      "खेल",
      "मेरी अम्मी",
      "फूल",
      "इंसाफ़",
      "चिड़िया",
      "सूरज",
      "मेरा घर",
      "आज़ादी",
      "चाँद",
      "ख़ुदा की क़ुदरत",
    ],
  ],
  [
    "8-Urdu-NCERT",
    [
      "दोहे",
      "नन्हीं चींटी",
      "फ़रज़ की दावत",
      "लड़की की दुनिया",
      "अल्लाह की कुदरत",
      "खेल",
      "इल्म की रोशनी",
      "मेरा वतन",
      "पहाड़ और गिलहरी",
      "पेड़ की कहानी",
      "सूरज और चाँद",
      "दोस्ती का रिश्ता",
      "इल्म और अक़ल",
      "अल्लाह की कुदरत",
      "हमद",
      "नाथ",
      "क़ुदरत का मंज़र",
      "इंसाफ़",
      "मेरे घर",
      "आज़ादी",
      "ख़ुशियाँ",
      "पहेलियाँ",
    ],
  ],
  [
    "9-Urdu-NCERT",
    [
      "हमद",
      "नात",
      "गुलिस्तां",
      "नज़्म",
      "अफ़साना",
      "मर्सिया",
      "रुबाई",
      "क़िता",
      "दास्तान",
      "मसनवी",
      "नावेल",
      "दोहे",
    ],
  ],
  [
    "10-Urdu-NCERT",
    [
      "हज़रत मुहम्मद सल्लल्लाहु अलैहि वसल्लम",
      "क़ुतुबुद्दीन ऐबक",
      "शेर शाह सूरी",
      "अल्लामा इक़बाल",
      "मिर्ज़ा ग़ालिब",
      "मीर अनीस",
      "अब्दुल हलीम शरर",
      "प्रेमचन्द",
      "डा. ज़ाकिर हुसैन",
      "क़ुदरत की दुनिया",
      "सच्चा दोस्त",
      "मेरे घर",
      "आज का दौर",
      "पहेलियाँ",
    ],
  ],
  [
    "11-Urdu-NCERT",
    [
      "तारीख़",
      "अदब का मअनी",
      "उर्दू ज़बान की तारीख़",
      "दास्तान",
      "अफ़साना",
      "ड्रामा",
      "ग़ज़ल",
      "नज़्म",
      "मर्सिया",
      "रुबाई",
      "क़िता",
      "ख़ुत्बा",
      "मसनवी",
      "अल्लामा इक़बाल",
      "मिर्ज़ा ग़ालिब",
      "मीर अनीस",
    ],
  ],
  [
    "12-Urdu-NCERT",
    [
      "नक़्क़ाद",
      "नवाए उर्दू",
      "इल्म की रोशनी",
      "अदब की दुनिया",
      "मिर्ज़ा ग़ालिब",
      "सौदा",
      "मीर",
      "अनीस",
      "मुहसिन काकोरवी",
      "इकबाल",
      "चकबस्त",
      "जोश",
      "फैज़",
    ],
  ],

  [
    "6-Hindi-NCERT",
    [
      "वह चिड़िया जो",
      "बचपन",
      "नादान दोस्त",
      "चाँद से थोड़ी-सी गप्पें",
      "अक्षरों का महत्व",
      "पार नज़र के",
      "साथी हाथ बढ़ाना",
      "ऐसे-ऐसे",
      "टिकट-एल्बम",
      "झाँसी की रानी",
      "जो देखकर भी नहीं देखते",
      "संसार पुस्तक है",
      "मैं सबसे छोटी होऊँ",
      "लोकगीत",
    ],
  ],
  [
    "7-Hindi-NCERT",
    [
      "हम पंछी उन्मुक्त गगन के",
      "दादी माँ",
      "हिमालय की बेटियाँ",
      "कठपुतली",
      "मिठाईवाला",
      "रक्त और हमारा शरीर",
      "पापा खो गए",
      "शाम - एक किसान",
      "रहीम के दोहे",
      "कंचा",
      "संघर्ष के कारण मैं तुनकमिजाज हो गया : धनराज",
      "वीर कुंवर सिंह",
      "विप्लव गायन",
      "एक तिनका",
    ],
  ],
  [
    "8-Hindi-NCERT",
    [
      "ध्वनि",
      "लाख की चूड़ियाँ",
      "बस की यात्रा",
      "दीवानों की हस्ती",
      "चिट्ठियों की अनूठी दुनिया",
      "भगवान के डाकिये",
      "क्या निराश हुआ जाए",
      "यह सबसे कठिन समय नहीं",
      "कबीर की साखियाँ",
      "कामचोर",
      "जब सिनेमा ने बोलना सीखा",
      "सुदामा चरित",
      "जहाँ पहिया है",
    ],
  ],
  [
    "9-Hindi Kshitij-NCERT",
    [
      "कबीर की साखियाँ और सबद",
      "ललद्यद",
      "रसखान",
      "माखनलाल चतुर्वेदी",
      "सुमित्रानंदन पंत",
      "सर्वेश्वर दयाल सक्सेना",
      "चंद्रकांत देवtale",
      "प्रेमचंद",
      "राहुल सांकृत्यायन",
      "श्यामाचरण दुबे",
      "जाबिर हुसैन",
      "हरिशंकर परसाई",
      "हजारी प्रसाद द्विवेदी",
    ],
  ],
  [
    "9-Hindi Sprash-NCERT",
    [
      "तुलसीदास",
      "रहीम",
      "कबीर",
      "सूर्यकांत त्रिपाठी 'निराला'",
      "अरुण कमल",
      "प्रेमचंद",
      "सियारामशरण गुप्त",
      "रमेश चंद्र शाह",
      "महादेवी वर्मा",
      "निदा फ़ाज़ली",
    ],
  ],
  [
    "9-Hindi Kritika-NCERT",
    ["इस जल प्रलय में", "मेरे संग की औरतें", "रीढ़ की हड्डी"],
  ],
  ["9-Hindi Sanchayan-NCERT", ["गिल्लू", "स्मृति", "कल्लू कुम्हार की उनाकोटी"]],
  [
    "10-Hindi Kshitij-NCERT",
    [
      "उत्साह और अट नहीं रही है",
      "फ़सल और यह दंतुरित मुसकान",
      "छाया मत छूना",
      "कन्यादान",
      "संगतकार",
      "नेताजी का चश्मा",
      "बालगोबिन भगत",
      "लखनवी अंदाज़",
      "मानवीय करुणा की दिव्य चमक",
      "एक कहानी यह भी",
      "नौबतखाने में इबादत",
      "संस्कृति",
    ],
  ],
  [
    "10-Hindi Sprash-NCERT",
    [
      "साखी",
      "पद",
      "दोहे",
      "मनुष्यता",
      "पर्वत प्रदेश में पावस",
      "मधुर-मधुर मेरे दीपक जल",
      "कर चले हम फ़िदा",
      "तोप",
      "बड़े भाई साहब",
      "डायरी का एक पन्ना",
      "तताँरा-वामीरो कथा",
      "अब कहाँ दूसरों के दुख से दुखी होने वाले",
      "पतझर में टूटी पत्तियाँ",
      "कारतूस",
    ],
  ],
  [
    "10-Hindi Kritika-NCERT",
    ["माता का आँचल", "जॉर्ज पंचम की नाक", "साना-साना हाथ जोड़ि"],
  ],
  [
    "10-Hindi Sanchayan-NCERT",
    ["हरिहर काका", "सपनों के-से दिन", "टोपी शुक्ला"],
  ],
  [
    "11-Hindi Antra Part 1-NCERT",
    [
      "कबीर",
      "सूरदास",
      "देव",
      "सुमित्रानंदन पंत",
      "महादेवी वर्मा",
      "नरेश सक्सेना",
      "हज़ारी प्रसाद द्विवेदी",
      "प्रेमचंद",
      "अमरकांत",
      "विष्णु प्रभाकर",
      "निर्मल वर्मा",
      "रामविलास शर्मा",
      "मन्नू भंडारी",
      "मंगलेश डबराल",
      "निर्मल वर्मा",
      "अब्दुल कलाम",
    ],
  ],
  [
    "11-Hindi Aroh-NCERT",
    [
      "कबीर",
      "मीरा",
      "राम नरेश त्रिपाठी",
      "सुमित्रानंदन पंत",
      "भवानी प्रसाद मिश्र",
      "त्रिलोचन",
      "दुष्यंत कुमार",
      "निर्मला पुतुल",
      "गजानन माधव मुक्तिबोध",
      "जाबिर हुसैन",
      "कृष्णा सोबती",
      "सत्यजीत राय",
      "बालमुकुंद गुप्त",
      "शेखर जोशी",
      "मन्नू भंडारी",
      "कृष्णनाथ",
    ],
  ],
  [
    "11-Hindi Vitan Part 1-NCERT",
    [
      "भारतीय गायिकाओं में बेजोड़ : लता मंगेशकर",
      "राजस्थान की रजत बूंदें",
      "आलो-आँधारि",
    ],
  ],
  [
    "12-Hindi Antra Part 2-NCERT",
    [
      "जयशंकर प्रसाद",
      "सूर्यकांत त्रिपाठी 'निराला'",
      "सच्चिदानंद हीरानंद वात्स्यायन 'अज्ञेय'",
      "केदारनाथ सिंह",
      "विष्णु खरे",
      "रघुवीर सहाय",
      "प्रेमघन की छाया-स्मृति",
      "सुमेधा की डायरी",
      "सूरदास की झोपड़ी",
      "अरुण कमल",
      "हजारी प्रसाद द्विवेदी",
      "रामचन्द्र शुक्ल",
      "फणीश्वर नाथ रेणु",
      "भीष्म साहनी",
      "असलम",
      "निर्मल वर्मा",
      "अज्ञेय",
    ],
  ],
  [
    "12-Hindi Aroh Part 2-NCERT",
    [
      "हरिवंश राय बच्चन",
      "आलोक धन्वा",
      "कुंवर नारायण",
      "रघुवीर सहाय",
      "गजानन माधव मुक्तिबोध",
      "शमशेर बहादुर सिंह",
      "सूर्यकांत त्रिपाठी 'निराला'",
      "तुलसीदास",
      "फिराक गोरखपुरी",
      "उमाशंकर जोशी",
      "महादेवी वर्मा",
      "जैनेन्द्र कुमार",
      "धर्मवीर भारती",
      "रामविलास शर्मा",
      "हजारी प्रसाद द्विवेदी",
    ],
  ],
  [
    "12-Hindi Vitan Part 2-NCERT",
    ["सिल्वर वैडिंग", "जूझ", "अतीत में दबे पाँव"],
  ],
  ["6-Sanskrit-NCERT", 16],
  ["7-Sanskrit-NCERT", 15],
  ["8-Sanskrit-NCERT", 14],
  ["9-Sanskrit Shemushi Prathmo-NCERT", 10],
  ["9-Sanskrit Vyakranavithi-NCERT", 12],
  ["9-Sanskrit Abhyaswaan Bhav-NCERT", 12],
  ["10-Sanskrit Shemushi Part 2-NCERT", 10],
  ["10-Sanskrit Vyakranavithi-NCERT", 12],
  ["10-Sanskrit Abhyaswaan Bhav-NCERT", 14],
  ["11-Sanskrit Bhaswati-NCERT", 11],
  ["11-Sanskrit Shashwati-NCERT", 16],
  ["12-Sanskrit-NCERT", 13],
  [
    "6-English-NCERT",
    [
      "Who Did Patrick’s Homework?",
      "How the Dog Found Himself a New Master!",
      "Taro’s Reward",
      "An Indian-American Woman in Space: Kalpana Chawla",
      "A Different Kind of School",
      "Who I Am",
      "Fair Play",
      "Vocation",
    ],
  ],
  [
    "7-English-NCERT",
    [
      "Three Questions",
      "A Gift of Chappals",
      "Gopal and the Hilsa Fish",
      "The Ashes that Made Trees Bloom",
      "Quality",
      "Expert Detectives",
      "The Invention of Vita-Wonk",
      "Fire: Friend and Foe",
      "A Bicycle in Good Repair",
      "The Story of Cricket",
    ],
  ],
  [
    "8-English HoneyDew-NCERT",
    [
      "The Best Christmas Present in the World",
      "The Tsunami",
      "Glimpses of the Past",
      "Bepin Choudhury’s Lapse of Memory",
      "The Summit Within",
      "This is Jody’s Fawn",
      "A Visit to Cambridge",
      "A Short Monsoon Diary",
    ],
  ],
  [
    "8-English It So Happened-NCERT",
    [
      "How the Camel Got His Hump",
      "Children at Work",
      "The Selfish Giant",
      "The Treasure Within",
      "Princess September",
      "The Fight",
      "The Open Window",
      "Jalebis",
    ],
  ],
  [
    "9-English Beehive-NCERT",
    [
      "The Fun They Had",
      "The Sound of Music",
      "The Little Girl",
      "A Truly Beautiful Mind",
      "The Snake and the Mirror",
      "My Childhood",
      "Packing",
      "Reach for the Top",
      "The Bond of Love",
    ],
  ],
  [
    "9-English Moments Supplementary Reader-NCERT",
    [
      "The Lost Child",
      "The Adventures of Toto",
      "Iswaran the Storyteller",
      "In the Kingdom of Fools",
      "The Happy Prince",
      "Weathering the Storm in Ersama",
      "The Last Leaf",
      "A House Is Not a Home",
      "The Accidental Tourist",
    ],
  ],

  ["9-English Words and Expressions 1-NCERT", 9], // This is a workbook, so a numerical count is appropriate

  [
    "10-English First Flight-NCERT",
    [
      "A Letter to God",
      "Nelson Mandela: Long Walk to Freedom",
      "Two Stories about Flying",
      "From the Diary of Anne Frank",
      "The Hundred Dresses–I",
      "The Hundred Dresses–II",
      "Glimpses of India",
      "Mijbil the Otter",
      "Madam Rides the Bus",
    ],
  ],
  [
    "10-English Foot Prints Without Feet-NCERT",
    [
      "A Triumph of Surgery",
      "The Thief’s Story",
      "The Midnight Visitor",
      "A Question of Trust",
      "Footprints without Feet",
      "The Making of a Scientist",
      "The Necklace",
      "The Hack Driver",
      "Bholi",
    ],
  ],
  ["10-English Words and Expressions 2-NCERT", 9], // This is a workbook, so a numerical count is appropriate
  [
    "11-English Woven Words-NCERT",
    [
      "The Lament",
      "A Pair of Mustachios",
      "The Rocking-horse Winner",
      "The Adventure of the Three Garridebs",
      "Pappachi's Moth",
      "The Third and Final Continent",
      "Glory at Twilight",
      "The Luncheon",
      "The Peacock",
      "Let Me Not to the Marriage of True Minds",
      "Coming",
      "Telephone Conversation",
      "The World is too Much with Us",
      "Mother Tongue",
      "Hawk Roosting",
      "For Elkana",
      "My Watch",
      "My First Steps",
      "The Story",
      "The Watcher",
      "My Mother",
      "The Road to Peace",
    ],
  ],
  [
    "11-English Hornbill-NCERT",
    [
      "The Portrait of a Lady",
      "We're Not Afraid to Die... If We Can All Be Together",
      "Discovering Tut: The Saga Continues",
      "Landscape of the Soul",
      "The Ailing Planet: The Green Movement's Role",
      "The Browning Version",
      "The Adventure",
      "Silk Road",
      "A Photograph",
      "The Laburnum Top",
      "The Voice of the Rain",
      "Childhood",
      "Father to Son",
    ],
  ],
  [
    "11-English Snapshots Supplementary Reader-NCERT",
    [
      "The Summer of the Beautiful White Horse",
      "The Address",
      "Ranga's Marriage",
      "Albert Einstein at School",
      "Mother's Day",
      "The Ghat of the Only World",
      "Birth",
      "The Tale of Melon City",
    ],
  ],
  [
    "12-English Vistas-NCERT",
    [
      "The Third Level",
      "The Tiger King",
      "Journey to the End of the Earth",
      "The Enemy",
      "On the Face of It",
      "Memories of Childhood",
    ],
  ],
  [
    "6-Science-NCERT",
    [
      "Food: Where Does It Come From?",
      "Components of Food",
      "Fibre to Fabric",
      "Sorting Materials into Groups",
      "Separation of Substances",
      "Changes Around Us",
      "Getting to Know Plants",
      "Body Movements",
      "The Living Organisms and Their Surroundings",
      "Motion and Measurement of Distances",
      "Light, Shadows and Reflections",
      "Electricity and Circuits",
      "Fun with Magnets",
      "Water",
      "Air Around Us",
      "Garbage In, Garbage Out",
    ],
  ],
  [
    "7-Science-NCERT",
    [
      "Nutrition in Plants",
      "Nutrition in Animals",
      "Fibre to Fabric",
      "Heat",
      "Acids, Bases and Salts",
      "Physical and Chemical Changes",
      "Weather, Climate and Adaptations of Animals to Climate",
      "Winds, Storms and Cyclones",
      "Soil",
      "Respiration in Organisms",
      "Transportation in Animals and Plants",
      "Reproduction in Plants",
      "Motion and Time",
      "Electric Current and Its Effects",
      "Light",
      "Water: A Precious Resource",
      "Forests: Our Lifeline",
      "Wastewater Story",
    ],
  ],
  [
    "8-Science-NCERT",
    [
      "Crop Production and Management",
      "Microorganisms: Friend and Foe",
      "Synthetic Fibres and Plastics",
      "Materials: Metals and Non-Metals",
      "Coal and Petroleum",
      "Combustion and Flame",
      "Conservation of Plants and Animals",
      "Cell – Structure and Functions",
      "Reproduction in Animals",
      "Reaching the Age of Adolescence",
      "Force and Pressure",
      "Friction",
      "Sound",
      "Chemical Effects of Electric Current",
      "Some Natural Phenomena",
      "Light",
      "Stars and the Solar System",
      "Pollution of Air and Water",
    ],
  ],
  [
    "9-Science-NCERT",
    [
      "Matter in Our Surroundings",
      "Is Matter Around Us Pure?",
      "Atoms and Molecules",
      "Structure of the Atom",
      "The Fundamental Unit of Life",
      "Tissues",
      "Motion",
      "Force and Laws of Motion",
      "Gravitation",
      "Work and Energy",
      "Sound",
      "Improvement in Food Resources",
    ],
  ],
  [
    "10-Science-NCERT",
    [
      "Chemical Reactions and Equations",
      "Acids, Bases and Salts",
      "Metals and Non-metals",
      "Carbon and its Compounds",
      "Life Processes",
      "Control and Coordination",
      "How do Organisms Reproduce?",
      "Heredity",
      "Light – Reflection and Refraction",
      "Human Eye and Colourful World",
      "Electricity",
      "Magnetic Effects of Electric Current",
      "Our Environment",
    ],
  ],
  ["6-Social Science-NCERT", 14],
  ["7-Social Science-NCERT", 12],
  ["9-Information and Communication Technology-NCERT", 8],
  [
    "8-Political Science-NCERT",
    [
      "The Indian Constitution",
      "Understanding Secularism",
      "Why Do We Need a Parliament?",
      "Understanding Laws",
      "Judiciary",
      "Understanding Our Criminal Justice System",
      "Understanding Marginalisation",
      "Confronting Marginalisation",
      "Public Facilities",
      "Law and Social Justice",
    ],
  ],
  [
    "9-Political Science-NCERT",
    [
      "What is Democracy? Why Democracy?",
      "Constitutional Design",
      "Electoral Politics",
      "Working of Institutions",
      "Democratic Rights",
    ],
  ],
  [
    "10-Political Science-NCERT",
    [
      "Power-sharing",
      "Federalism",
      "Gender, Religion and Caste",
      "Political Parties",
      "Outcomes of Democracy",
    ],
  ],
  [
    "11-Political Science Political Theory-NCERT",
    [
      "Political Theory: An Introduction",
      "Freedom",
      "Equality",
      "Social Justice",
      "Rights",
      "Citizenship",
      "Nationalism",
      "Secularism",
    ],
  ],
  [
    "11-Political Science India Constitution at Work-NCERT",
    [
      "Constitution: Why and How?",
      "Rights in the Indian Constitution",
      "Election and Representation",
      "Executive",
      "Legislature",
      "Judiciary",
      "Federalism",
      "Local Governments",
      "Constitution as a Living Document",
      "The Philosophy of the Constitution",
    ],
  ],
  [
    "12-Political Science Contemporary World Politics-NCERT",
    [
      "The Cold War Era",
      "The End of Bipolarity",
      "New Centres of Power",
      "Contemporary South Asia",
      "International Organisations",
      "Security in the Contemporary World",
      "Globalisation",
    ],
  ],
  [
    "12-Political Science Politics in India Since Independence-NCERT",
    [
      "Challenges of Nation Building",
      "Era of One-Party Dominance",
      "Politics of Planned Development",
      "India’s External Relations",
      "Challenges to and Restoration of the Congress System",
      "The Crisis of Democratic Order",
      "Rise of Popular Movements",
      "Regional Aspirations",
      "Recent Developments in Indian Politics",
    ],
  ],
  [
    "8-History-NCERT",
    [
      "How, When and Where",
      "From Trade to Territory",
      "Ruling the Countryside",
      "Tribals, Dikus and the Vision of a Golden Age",
      "When People Rebel 1857 and After",
      "Weavers, Iron Smelters and Factory Owners",
      "Civilising the 'Native', Educating the Nation",
      "Women, Caste and Reform",
      "The Making of the National Movement: 1870s–1947",
      "India After Independence",
    ],
  ],
  [
    "9-History-NCERT",
    [
      "The French Revolution",
      "Socialism in Europe and the Russian Revolution",
      "Nazism and the Rise of Hitler",
      "Forest Society and Colonialism",
      "Pastoralists in the Modern World",
    ],
  ],
  [
    "10-History-NCERT",
    [
      "The Rise of Nationalism in Europe",
      "Nationalism in India",
      "The Making of a Global World",
      "The Age of Industrialisation",
      "Print Culture and the Modern World",
    ],
  ],
  [
    "11-History Themes in World History-NCERT",
    [
      "From the Beginning of Time",
      "Writing and City Life",
      "An Empire Across Three Continents",
      "The Central Islamic Lands",
      "Nomadic Empires",
      "The Three Orders",
      "Changing Cultural Traditions",
      "Confrontation of Cultures",
      "The Industrial Revolution",
      "Displacing Indigenous Peoples",
      "Paths to Modernisation",
    ],
  ],
  [
    "12-History Themes in Indian History Part 1-NCERT",
    [
      "The Story of the First Cities: Harappan Archaeology",
      "Political and Economic History: How Inscriptions tell a story",
      "Social Histories: Using the Mahabharata",
      "A History of Buddhism: Sanchi Stupa",
    ],
  ],
  [
    "12-History Themes in Indian History Part 2-NCERT",
    [
      "Through the Eyes of Travellers: Perceptions of Society",
      "Bhakti-Sufi Traditions: Changes in Religious Beliefs and Devotional Texts",
      "An Imperial Capital: Vijayanagara",
      "Agrarian Relations: The Ain-i-Akbari",
    ],
  ],
  [
    "12-History Themes in Indian History Part 3-NCERT",
    [
      "Kings and Chronicles: The Mughal Courts",
      "Colonialism and the Countryside: Exploring Official Archives",
      "Rebels and the Raj: The Revolt of 1857 and its Representations",
      "Mahatma Gandhi and the Nationalist Movement: Civil Disobedience and Beyond",
    ],
  ],

  [
    "8-Geography-NCERT",
    [
      "Resources",
      "Land, Soil, Water, Natural Vegetation and Wildlife Resources",
      "Agriculture",
      "Industries",
      "Human Resources",
    ],
  ],
  [
    "9-Geography-NCERT",
    [
      "India - Size and Location",
      "Physical Features of India",
      "Drainage",
      "Climate",
      "Natural Vegetation and Wildlife",
    ],
  ],
  [
    "10-Geography-NCERT",
    [
      "Resources and Development",
      "Forest and Wildlife Resources",
      "Water Resources",
      "Agriculture",
      "Minerals and Energy Resources",
      "Manufacturing Industries",
      "Lifelines of National Economy",
    ],
  ],
  [
    "11-Geography Fundamental of Physical Geography-NCERT",
    [
      "Geography as a Discipline",
      "The Origin and Evolution of the Earth",
      "Interior of the Earth",
      "Distribution of Oceans and Continents",
      "Minerals and Rocks",
      "Geomorphic Processes",
      "Landforms and their Evolution",
      "Composition and Structure of Atmosphere",
      "Solar Radiation, Heat Balance and Temperature",
      "Atmospheric Circulation and Weather Systems",
      "Water in the Atmosphere",
      "World Climate and Climate Change",
      "Water (Oceans)",
      "Movements of Ocean Water",
    ],
  ],
  [
    "11-Geography Pratical Work in Geography-NCERT",
    [
      "Introduction to Maps",
      "Map Scale",
      "Latitude, Longitude and Time",
      "Map Projections",
      "Topographical Maps",
      "Introduction to Aerial Photographs, Remote Sensing and Geographic Information System",
    ],
  ],
  [
    "11-Geography India Physical Environment-NCERT",
    [
      "Introduction",
      "Structure and Physiography",
      "Drainage System",
      "Climate",
      "Natural Vegetation",
      "Soils",
    ],
  ],
  [
    "12-Geography Fundamentals of Human Geography-NCERT",
    [
      "Human Geography: Nature and Scope",
      "The World Population: Distribution, Density and Growth",
      "Human Development",
      "Primary Activities",
      "Secondary Activities",
      "Tertiary and Quaternary Activities",
      "Transport and Communication",
      "International Trade",
    ],
  ],
  [
    "12-Geography Pratical Work in Geography-NCERT",
    [
      "Data-Its Source and Compilation",
      "Data Processing",
      "Graphical Representation of Data",
      "Use of Computer in Data Processing and Thematic Mapping",
    ],
  ],
  [
    "12-Geography India People And Economy-NCERT",
    [
      "Population: Distribution, Density, Growth and Composition",
      "Migration: Types, Causes and Consequences",
      "Human Development",
      "Human Settlements",
      "Land Resources and Agriculture",
      "Water Resources",
      "Mineral and Energy Resources",
      "Manufacturing Industries",
      "Planning and Sustainable Development in Indian Context",
    ],
  ],

  [
    "9-Economics-NCERT",
    [
      "The Story of Village Palampur",
      "People as Resource",
      "Poverty as a Challenge",
      "Food Security in India",
    ],
  ],
  [
    "10-Economics-NCERT",
    [
      "Development",
      "Sectors of the Indian Economy",
      "Money and Credit",
      "Globalisation and the Indian Economy",
      "Consumer Rights",
    ],
  ],
  [
    "11-Economics Indian Economic Development-NCERT",
    [
      "Indian Economy on the Eve of Independence",
      "Indian Economy (1950-1990)",
      "Liberalisation, Privatisation and Globalisation: An Appraisal",
      "Poverty",
      "Human Capital Formation in India",
      "Rural Development",
      "Employment: Growth, Informalisation and other Issues",
      "Infrastructure",
    ],
  ],
  [
    "11-Economics Statistics for Economics-NCERT",
    [
      "Introduction",
      "Collection of Data",
      "Organisation of Data",
      "Presentation of Data",
      "Measures of Central Tendency",
      "Measures of Dispersion",
      "Correlation",
      "Index Numbers",
    ],
  ],
  [
    "12-Economics Introductory Microeconomics-NCERT",
    [
      "Introduction",
      "Theory of Consumer Behaviour",
      "Production and Costs",
      "The Theory of the Firm under Perfect Competition",
      "Market Equilibrium",
    ],
  ],
  [
    "12-Economics Introductory Macroeconomics-NCERT",
    [
      "Introduction",
      "National Income Accounting",
      "Money and Banking",
      "Income and Employment Determination",
      "Government Budget and the Economy",
      "Open-Economy Macroeconomics",
    ],
  ],

  [
    "11-Business Studies-NCERT",
    [
      "Business, Trade and Commerce",
      "Forms of Business Organisations",
      "Private, Public and Global Enterprises",
      "Business Services",
      "Emerging Modes of Business",
      "Social Responsibilities of Business and Business Ethics",
      "Sources of Business Finance",
      "Small Business",
      "Internal Trade",
      "International Business",
    ],
  ],
  [
    "12-Business Studies Part 1-NCERT",
    [
      "Nature and Significance of Management",
      "Principles of Management",
      "Business Environment",
      "Planning",
      "Organising",
      "Staffing",
      "Directing",
      "Controlling",
    ],
  ],
  [
    "12-Business Studies Part 2-NCERT",
    [
      "Financial Management",
      "Financial Markets",
      "Marketing Management",
      "Consumer Protection",
    ],
  ],
  [
    "11-Home Science Human Ecology and Family Sciences Part 1-NCERT",
    [
      "Introduction to Home Science",
      "Food, Nutrition, Health and Fitness",
      "The Family",
      "The Family Life Cycle",
      "The Family and its Resources",
      "The World of the Young Child",
      "Adolescence",
    ],
  ],
  [
    "11-Home Science Human Ecology and Family Sciences Part 2-NCERT",
    [
      "The World of Work",
      "Fabrics",
      "Clothing",
      "Care and Maintenance of Fabrics and Apparels",
    ],
  ],
  [
    "12-Home Science Human Ecology and Family Sciences Part 1-NCERT",
    [
      "Work, Livelihood and Career",
      "Clinical Nutrition and Dietetics",
      "Public Nutrition and Health",
      "Food Processing and Technology",
      "Catering and Food Service Management",
      "Hospitality Management",
      "Institutional Management",
    ],
  ],
  [
    "12-Home Science Human Ecology and Family Sciences Part 2-NCERT",
    [
      "Early Childhood Care and Education",
      "Fashion Design and Merchandising",
      "Mass Communication and Entertainment",
      "Designing, Planning and Organising Events",
    ],
  ],

  [
    "11-Informatics Practices-NCERT",
    [
      "Computer System",
      "Emerging Trends",
      "Introduction to Problem Solving",
      "Getting Started with Python",
      "Python Fundamentals",
      "Data Handling",
      "Conditional and Looping Constructs",
      "Strings in Python",
    ],
  ],
  [
    "12-Informatics Practices-NCERT",
    [
      "Python Pandas - I",
      "Python Pandas - II",
      "Introduction to Plotting",
      "SQL Commands",
      "SQL Functions",
      "Database and Management System",
      "Society, Law and Ethics",
    ],
  ],
  [
    "11-Computer Science-NCERT",
    [
      "Computer Systems",
      "Encoding Schemes and Number System",
      "Emerging Trends",
      "Introduction to Problem Solving",
      "Getting Started with Python",
      "Python Fundamentals",
      "Data Handling",
      "Conditional and Looping Constructs",
      "Strings",
      "Lists",
      "Tuples and Dictionaries",
    ],
  ],
  [
    "12-Computer Science-NCERT",
    [
      "Review of Python",
      "Functions",
      "File Handling",
      "Data Structure: Stacks and Queues",
      "Computer Networks",
      "Database Concepts",
      "Structured Query Language",
      "Society, Law and Ethics",
    ],
  ],
  [
    "11-Biotechnology-NCERT",
    [
      "Biotechnology - Principles and Processes",
      "Genetic Engineering",
      "Bioethics",
      "Bioprocessing",
      "Applications of Biotechnology",
    ],
  ],
  [
    "12-Biotechnology-NCERT",
    [
      "Introduction",
      "Recombinant DNA Technology",
      "Protein Structure and Engineering",
      "Genomics",
      "Bioethics",
      "Biosafety",
      "Intellectual Property Rights",
      "Biotechnology in Agriculture",
      "Biotechnology in Health",
      "Biotechnology in Environment",
    ],
  ],

  [
    "11-Physics Part 1-NCERT",
    [
      "Physical World",
      "Units and Measurements",
      "Motion in a Straight Line",
      "Motion in a Plane",
      "Laws of Motion",
      "Work, Energy and Power",
      "System of Particles and Rotational Motion",
    ],
  ],
  [
    "11-Physics Part 2-NCERT",
    [
      "Gravitation",
      "Mechanical Properties of Solids",
      "Mechanical Properties of Fluids",
      "Thermal Properties of Matter",
      "Thermodynamics",
      "Kinetic Theory",
      "Oscillations",
    ],
  ],
  [
    "12-Physics Part 1-NCERT",
    [
      "Electric Charges and Fields",
      "Electrostatic Potential and Capacitance",
      "Current Electricity",
      "Moving Charges and Magnetism",
      "Magnetism and Matter",
      "Electromagnetic Induction",
      "Alternating Current",
      "Electromagnetic Waves",
    ],
  ],
  [
    "12-Physics Part 2-NCERT",
    [
      "Ray Optics and Optical Instruments",
      "Wave Optics",
      "Dual Nature of Radiation and Matter",
      "Atoms",
      "Nuclei",
      "Semiconductor Electronics",
    ],
  ],

  [
    "11-Chemistry Part 1-NCERT",
    [
      "Some Basic Concepts of Chemistry",
      "Structure of Atom",
      "Classification of Elements and Periodicity in Properties",
      "Chemical Bonding and Molecular Structure",
      "Chemical Thermodynamics",
      "Equilibrium",
    ],
  ],
  [
    "11-Chemistry Part 2-NCERT",
    [
      "Redox Reactions",
      "Organic Chemistry – Some Basic Principles and Techniques",
      "Hydrocarbons",
    ],
  ],
  [
    "12-Chemistry Part 1-NCERT",
    [
      "Solutions",
      "Electrochemistry",
      "Chemical Kinetics",
      "The d- and f-Block Elements",
      "Coordination Compounds",
    ],
  ],
  [
    "12-Chemistry Part 2-NCERT",
    [
      "Haloalkanes and Haloarenes",
      "Alcohols, Phenols and Ethers",
      "Aldehydes, Ketones and Carboxylic Acids",
      "Amines",
      "Biomolecules",
    ],
  ],

  [
    "11-Biology-NCERT",
    [
      "The Living World",
      "Biological Classification",
      "Plant Kingdom",
      "Animal Kingdom",
      "Morphology of Flowering Plants",
      "Anatomy of Flowering Plants",
      "Structural Organisation in Animals",
      "Cell: The Unit of Life",
      "Biomolecules",
      "Cell Cycle and Cell Division",
      "Photosynthesis in Higher Plants",
      "Respiration in Plants",
      "Plant Growth and Development",
      "Breathing and Exchange of Gases",
      "Body Fluids and Circulation",
      "Excretory Products and their Elimination",
      "Locomotion and Movement",
      "Neural Control and Coordination",
      "Chemical Coordination and Integration",
    ],
  ],
  [
    "12-Biology-NCERT",
    [
      "Sexual Reproduction in Flowering Plants",
      "Human Reproduction",
      "Reproductive Health",
      "Principles of Inheritance and Variation",
      "Molecular Basis of Inheritance",
      "Evolution",
      "Human Health and Disease",
      "Microbes in Human Welfare",
      "Biotechnology - Principles and Processes",
      "Biotechnology and its Applications",
      "Organisms and Populations",
      "Ecosystem",
      "Biodiversity and Conservation",
    ],
  ],

  [
    "11-Psychology-NCERT",
    [
      "What is Psychology?",
      "Methods of Enquiry in Psychology",
      "The Bases of Human Behaviour",
      "Human Development",
      "Sensory, Attentional and Perceptual Processes",
      "Learning",
      "Human Memory",
      "Motivation and Emotion",
    ],
  ],
  [
    "12-Psychology-NCERT",
    [
      "Psychological Attributes",
      "Self and Personality",
      "Meeting Life Challenges",
      "Psychological Disorders",
      "Therapeutic Approaches and Counselling",
      "Attitude and Social Cognition",
      "Social Influence and Group Processes",
    ],
  ],

  [
    "11-Sociology Introducing Sociology-NCERT",
    [
      "Sociology and Society",
      "Terms, Concepts and their Use in Sociology",
      "Understanding Social Institutions",
      "Culture and Socialisation",
      "Doing Sociology: Research Methods",
    ],
  ],
  [
    "11-Sociology Understanding Society-NCERT",
    [
      "Social Structure, Stratification and Social Processes in Society",
      "Social Change and Social Order in Rural and Urban Society",
      "Environment and Society",
      "Western Sociologists: A Theoretical Perspective",
      "Indian Sociologists: A Theoretical Perspective",
    ],
  ],
  [
    "12-Sociology Indian Society-NCERT",
    [
      "The Demographic Structure of the Indian Society",
      "Social Institutions: Continuity and Change",
      "The Market as a Social Institution",
      "The Pattern of Social Inequality and Exclusion",
      "Challenges of Cultural Diversity",
      "The Binders of a Nation",
    ],
  ],
  [
    "12-Sociology Social Change and Development in India-NCERT",
    [
      "Structural Change",
      "Cultural Change",
      "The Story of Indian Democracy at Work",
      "Change and Development in Rural Society",
      "Change and Development in Industrial Society",
      "Globalisation and Social Change",
      "Social Movements",
    ],
  ],

  [
    "11-Accountancy Part 1-NCERT",
    [
      "Introduction to Accounting",
      "Theory Base of Accounting",
      "Recording of Transactions-I",
      "Recording of Transactions-II",
      "Bank Reconciliation Statement",
    ],
  ],
  [
    "11-Accountancy Part 2-NCERT",
    [
      "Trial Balance and Errors",
      "Depreciation, Provisions and Reserves",
      "Accounting for Bills of Exchange",
      "Financial Statements-I",
    ],
  ],
  [
    "12-Computerised Accounting System-NCERT",
    [
      "Introduction to Computerised Accounting System",
      "Accounting Application of Electronic Spreadsheet",
      "Using Computerised Accounting System",
      "Database Management System for Accounting",
    ],
  ],
  [
    "12-Accountancy Part 1-NCERT",
    [
      "Accounting for Partnership: Basic Concepts",
      "Reconstitution of a Partnership Firm – Admission of a Partner",
      "Reconstitution of a Partnership Firm – Retirement/Death of a Partner",
      "Dissolution of Partnership Firm",
    ],
  ],
  [
    "12-Accountancy Part 2-NCERT",
    [
      "Financial Statements of a Company",
      "Analysis of Financial Statements",
      "Accounting Ratios",
      "Cash Flow Statement",
    ],
  ],
  ["6-Mathematics-CBSE", 0],
  ["7-Mathematics-CBSE", 3],
  ["8-Mathematics-CBSE", 3],
  ["9-Mathematics-CBSE", 2],
  ["10-Mathematics-CBSE", 4],
  ["11-Mathematics-CBSE", 6],
  ["12-Mathematics-CBSE", 3],
  ["7-Science-Default", 15],
  ["7-Geography-Default", 10],
  ["7-Economics-Default", 8],
  ["8-Physics-Default", 12],
  ["8-Chemistry-Default", 11],
  ["8-Biology-Default", 13],
  ["6-English-Default", 10],
  ["6-Hindi-Default", 10],
  ["6-Mathematics-Default", 10],
  ["7-Math-State Board", 15],
  ["8-English-Default", 25],
  ["9-Social Studies-Default", 12],
]);

const generateChapterOptions = (selectedClass, subject, syllabus) => {
  let key;

  let chapterData = null;

  if (syllabus) {
    // Try the exact syllabus first
    key = `${selectedClass}-${subject}-${syllabus}`;
    chapterData = chapterCounts.get(key);

    // If not found, try with NCERT (most common)
    if (!chapterData) {
      key = `${selectedClass}-${subject}-NCERT`;
      chapterData = chapterCounts.get(key);
    }

    // If still not found, try with Default
    if (!chapterData) {
      key = `${selectedClass}-${subject}-Default`;
      chapterData = chapterCounts.get(key);
    }

    // If still not found, try with CBSE
    if (!chapterData) {
      key = `${selectedClass}-${subject}-CBSE`;
      chapterData = chapterCounts.get(key);
    }
  } else {
    key = `${selectedClass}-${subject || "Default"}-Default`;
    chapterData = chapterCounts.get(key);
  }

  if (Array.isArray(chapterData)) {
    // Correct logic: value is the chapter name, label is the number
    return chapterData.map((chapterName, index) => ({
      value: chapterName,
      label: (index + 1).toString(),
    }));
  } else if (typeof chapterData === "number") {
    // Correct logic: both are the number, as there's no name data
    return Array.from({ length: chapterData }, (_, i) => ({
      value: (i + 1).toString(),
      label: (i + 1).toString(),
    }));
  }

  return [];
};

export const fields = (
  useGetSubjectOptionsMutation,
  useGetSyllabusOptionsMutation,
  currentClass,
  setCurrentClass,
  currentSubject,
  setCurrentSubject,
  currentSyllabus,
  setCurrentSyllabus,
  childrenListData,
  childrenListClass,
  selectedTopic,
  currentTopics,
  setCurrentTopics,
) => {
  const subjectOptionsForClass =
  dynamicSubjectOptions[currentClass] || dynamicSubjectOptions["default"];

const subjectOptionsToShow = (() => {
  const options = subjectOptionsForClass || [];
  const classKey = String(currentClass);

  switch (classKey) {
    case "12": {
      const subjectMapping = {
        "Physics": ["Physics Part 1", "Physics Part 2"],
        "Chemistry": ["Chemistry Part 1", "Chemistry Part 2"],
        "Mathematics": ["Mathematics Part 1", "Mathematics Part 2"],
        "Biology": ["Biology"],
        "Biotechnology": ["Biotechnology"],
        "English": ["English Vistas"],
        "Accountancy": ["Accountancy Part 1", "Accountancy Part 2", "Computerised Accounting System"],
        "History": [
          "History Themes in Indian History Part 1",
          "History Themes in Indian History Part 2",
          "History Themes in Indian History Part 3"
        ],
        "Geography": [
          "Geography Fundamentals of Human Geography",
          "Geography Pratical Work in Geography",
          "Geography India People And Economy"
        ],
        "Political Science": [
          "Political Science Politics in India Since Independence",
          "Political Science Contemporary World Politics"
        ],
        "Economics": [
          "Economics Introductory Microeconomics",
          "Economics Introductory Macroeconomics"
        ],
        "Sociology": [
          "Sociology Indian Society",
          "Sociology Social Change and Development in India"
        ],
        "Hindi": ["Hindi Antra Part 2", "Hindi Aroh Part 2", "Hindi Vitan Part 2"],
        "Business Studies": ["Business Studies Part 1", "Business Studies Part 2"],
        "Home Science": [
          "Home Science Human Ecology and Family Sciences Part 1",
          "Home Science Human Ecology and Family Sciences Part 2"
        ],
        "Computer Science": ["Computer Science"],
        "Informatics Practices": ["Informatics Practices"],
        "Psychology": ["Psychology"],
        "Sanskrit": ["Sanskrit"],
        "Urdu": ["Urdu"],
        "Creative Writing and Translation": ["Creative Writing and Translation"],
        
      };
    const allowedBooks = subjectMapping[selectedTopic] || [];
      return allowedBooks.length > 0 
        ? options.filter(opt => allowedBooks.includes(opt.value)) 
        : options;
     
    }

      case "11": {
      const subjectMapping = {
        "Physics": ["Physics Part 1", "Physics Part 2"],
        "Chemistry": ["Chemistry Part 1", "Chemistry Part 2"],
        "Mathematics": ["Mathematics"],
        "Biology": ["Biology"],
        "Biotechnology": ["Biotechnology"],                
        "English": ["English Woven Words", "English Hornbill", "English Snapshots Supplementary Reader"],
        "Accountancy": ["Accountancy Part 1", "Accountancy Part 2", "Financial Accounting"],
        "History": ["History Themes in World History"],
        "Geography": [
          "Geography Fundamental of Physical Geography",
          "Geography Pratical Work in Geography",
          "Geography India Physical Environment"
        ],
        "Political Science": [
          "Political Science Political Theory",
          "Political Science India Constitution at Work"
        ],
        "Economics": [
          "Economics Indian Economic Development",
          "Economics Statistics for Economics"
        ],
        "Sociology": [
          "Sociology Introducing Sociology",
          "Sociology Understanding Society"
        ],
        "Hindi": ["Hindi Antra Part 1", "Hindi Aroh", "Hindi Vitan Part 1"],
        "Business Studies": ["Business Studies"],
        "Home Science": [
          "Home Science Human Ecology and Family Sciences Part 1",
          "Home Science Human Ecology and Family Sciences Part 2"
        ],
        "Computer Science": ["Computer Science"],
        "Informatics Practices": ["Informatics Practices"],
        "Urdu": ["Urdu"],
        "Psychology": ["Psychology"],
        "Sanskrit": ["Sanskrit Bhaswati", "Sanskrit Shashwati"],                
        "Creative Writing and Translation": ["Creative Writing and Translation"]
      };
    const allowedBooks = subjectMapping[selectedTopic] || [];
      return allowedBooks.length > 0 
        ? options.filter(opt => allowedBooks.includes(opt.value)) 
        : options;
     
    }

    case "10": {
       const subjectMapping = {
        "English": ["English First Flight", "English Foot Prints Without Feet", "English Words and Expressions 2"],
        "Hindi": ["Hindi Kshitij", "Hindi Sprash", "Hindi Kritika", "Hindi Sanchayan"],            
        "Mathematics": ["Mathematics"],
        "Science": ["Science"],
        "Social Science": ["Political Science", "History", "Geography", "Economics"],
        "Urdu": ["Urdu"],
        "Sanskrit": ["Sanskrit Shemushi Part 2", "Sanskrit Vyakranavithi", "Sanskrit Abhyaswaan Bhav"],      };
    const allowedBooks = subjectMapping[selectedTopic] || [];
      return allowedBooks.length > 0 
        ? options.filter(opt => allowedBooks.includes(opt.value)) 
        : options;
      }

      case "9": {
      const subjectMapping = {
        "English": ["English Beehive", "English Moments Supplementary Reader", "English Words and Expressions 1"],
        "Hindi": ["Hindi Kshitij", "Hindi Sprash", "Hindi Kritika", "Hindi Sanchayan"],            
        "Mathematics": ["Mathematics"],
        "Science": ["Science"],
        "Social Science": ["Political Science", "History", "Geography", "Economics"],
        "Urdu": ["Urdu"],
        "Information and Communication Technology": ["Information and Communication Technology"],
        "Sanskrit": ["Sanskrit Shemushi Prathmo", "Sanskrit Vyakranavithi", "Sanskrit Abhyaswaan Bhav"],     
      
      };
    const allowedBooks = subjectMapping[selectedTopic] || [];
      return allowedBooks.length > 0 
        ? options.filter(opt => allowedBooks.includes(opt.value)) 
        : options;
    }

    case "6":
    case "7":
    case "8": {
      // Direct matches for Class 6-8 (English, Hindi, Mathematics, Science, etc.)
      const validSubjects = ["English", "Hindi", "Mathematics", "Science", "Social Science", "Urdu", "Sanskrit"];
      return validSubjects.includes(selectedTopic)
        ? options.filter(opt => opt.value === selectedTopic)
        : options;
    }

    default:
      return options;
  }
})();
  const chapterOptions = generateChapterOptions(
    currentClass,
    currentSubject,
    currentSyllabus
  );


    const childOptions = childrenListData?.map(e => {
    return {
      id: e._id,
      value: e.grade,
      label: e.name,
    }
  })

  return [
    {
      name: "class",
      label: "Class",
      placeholder: "Class ...",
      type: "select",
      options: childOptions || [],
      autoFocus: true,
      wrapperClassName: "mb-6",
      fieldWrapperClassName: "col-span-12",
      className: "mobile-select-no-keyboard",
      getSelectedOption: (option) => {
      const child = childrenListData?.find(e => e._id === option.id);
      if (child?.topics) {
        const topicOpts = child.topics.map(t => ({ value: t, label: t }));
        setCurrentTopics(topicOpts);
      } else {
        setCurrentTopics([]);
      }
    },
      getValueCallback: (value) => {
        setCurrentClass(value);
        setCurrentSubject(null);
      },
    },
    {
      name: "syllabus",
      label: "Syllabus",
      placeholder: "Syllabus Subject ...",
      type: "select",
      autoFocus: true,
      fetchData: useGetSyllabusOptionsMutation,
      wrapperClassName: "mb-6",
      fieldWrapperClassName: "col-span-12",
      className: "mobile-select-no-keyboard",
      getValueCallback: (value) => setCurrentSyllabus(value),
    },
    {
      name: "topics",
      label: "Subject",
      placeholder: "Select Chapter ...",
      type: "select",
      // hide: !currentClass,
      options: currentTopics || [],
      wrapperClassName: "mb-6",
      fieldWrapperClassName: "col-span-6",
    },
    {
      name: "subject",
      label: "Book",
      placeholder: "Select Subject ...",
      type: "select",
      autoFocus: true,
      options: selectedTopic ? subjectOptionsToShow : [],
      wrapperClassName: "mb-6",
      fieldWrapperClassName: "col-span-6",
      className: "mobile-select-no-keyboard",
      getValueCallback: (value) => setCurrentSubject(value),
      disabled: (() => {
        const isDisabled =
          !currentClass ||
          subjectOptionsForClass.length === 0 ||
          !selectedTopic;
        return isDisabled;
      })(),
    },

    {
      name: "chapter_from",
      label: "Chapter From",
      placeholder: "Select Chapter ...",
      type: "select",
      autoFocus: true,
      options: chapterOptions,
      wrapperClassName: "mb-6",
      fieldWrapperClassName: "col-span-6",
      className: "mobile-select-no-keyboard",
      disabled: (() => {
        const isDisabled =
          !currentClass || !currentSubject || chapterOptions.length === 0;

        return isDisabled;
      })(),
    },
    {
      name: "chapter_to",
      label: "Chapter To",
      placeholder: "Select Chapter ...",
      type: "select",
      autoFocus: true,
      options: chapterOptions,
      wrapperClassName: "mb-6",
      fieldWrapperClassName: "col-span-6",
      className: "mobile-select-no-keyboard",
      disabled: (() => {
        const isDisabled =
          !currentClass || !currentSubject || chapterOptions.length === 0;

        return isDisabled;
      })(),
    },
    {
      name: "language",
      label: "Language",
      placeholder: "Chapter Language ...",
      type: "select",
      autoFocus: true,
      options: [
        { value: "English", label: "English" },
        { value: "Hindi", label: "Hindi" },
        { value: "Marathi", label: "Marathi" },
        { value: "Tamil", label: "Tamil" },
        { value: "Telugu", label: "Telugu" },
        { value: "Bengali", label: "Bengali" },
        { value: "Gujarati", label: "Gujarati" },
        { value: "Kannada", label: "Kannada" },
        { value: "Malayalam", label: "Malayalam" },
        { value: "Urdu", label: "Urdu" },
        { value: "Manipuri", label: "Manipuri" },
        { value: "Kashmiri", label: "Kashmiri" },
      ],
      wrapperClassName: "mb-6",
      fieldWrapperClassName: "col-span-6",
      className: "mobile-select-no-keyboard",
    },
    {
      name: "no_of_question",
      label: "Number Of Question",
      placeholder: "Select Number ...",
      type: "select",
      options: options,
      autoFocus: true,
      wrapperClassName: "mb-6",
      fieldWrapperClassName: "col-span-6 mb-[400px] sm:mb-5",
      className: "mobile-select-no-keyboard",
    },
  ];
};

export const schema = yup
  .object()
  .shape({
    language: yup.string().required("This field required"),
    chapter_from: yup.string().required("This field required"),
    chapter_to: yup.string().when("chapter_from", {
      is: (chapter_from) => chapter_from,
      then: (schema) =>
        schema
          .required("This field required")
          .test(
            "is-greater-or-equal",
            "Chapter to cannot be less than Chapter from",
            function (chapter_to) {
              const {
                chapter_from,
                subject,
                class: classValue,
                syllabus,
              } = this.parent;

              if (!chapter_from || !chapter_to) {
                return true; // Pass validation if one is missing
              }

              // Try to parse the values as numbers. This works for numerical chapters (e.g., Math)
              const numChapterFrom = parseInt(chapter_from);
              const numChapterTo = parseInt(chapter_to);

              if (!isNaN(numChapterFrom) && !isNaN(numChapterTo)) {
                return numChapterTo >= numChapterFrom;
              }

              // If parsing fails, it means the values are chapter names (e.g., Science).
              // We must find their index in the original data to compare them.
              let key;
              if (syllabus) {
                key = `${classValue}-${subject}-${syllabus}`;
              } else {
                key = `${classValue}-${subject || "Default"}-Default`;
              }
              const chapterData = chapterCounts.get(key);

              if (Array.isArray(chapterData)) {
                const indexFrom = chapterData.indexOf(chapter_from);
                const indexTo = chapterData.indexOf(chapter_to);

                // Ensure both chapter names were found and compare their indices
                if (indexFrom !== -1 && indexTo !== -1) {
                  return indexTo >= indexFrom;
                }
              }

              // If the logic above couldn't find a valid comparison,
              // we return true to not block the user.
              return true;
            }
          ),
      otherwise: (schema) => schema.required("This field required"),
    }),
    syllabus: yup.string().required("This field required"),
    subject: yup.string().required("This field required"),
    no_of_question: yup.string().required("This field required"),
    class: yup.string().required("This field required"),
    topics: yup.string().required("This field required"),
  })
  .required();
