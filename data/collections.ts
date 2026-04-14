import type { DiscoveryCollection } from '@/types/school';

const ls = (en: string, zh: string, ja: string) => ({ en, zh, ja });

export const collections: DiscoveryCollection[] = [
  {
    slug: 'students-without-cars',
    icon: 'Bus',
    schoolSlugs: ['ucla', 'northeastern-university', 'university-of-washington', 'princeton-university'],
    title: ls('Best schools for students without cars', '更适合没有车学生的学校', '車を持たない学生に向く学校'),
    description: ls('Campuses where public transit, walkability, and rideshare together reduce daily friction.', '公共交通、步行性和网约车共同降低日常摩擦的学校。', '公共交通、徒歩環境、配車サービスが重なり、日常負担を下げやすい学校です。'),
    rationale: ls('This shortlist emphasizes realistic off-campus errands for international undergraduates who may not buy a car early.', '这个专题重点考虑国际本科生前期不买车时的真实生活便利度。', '渡航初期に車を持たない留学生の現実的な生活動線を重視しています。'),
  },
  {
    slug: 'mild-winters',
    icon: 'Leaf',
    schoolSlugs: ['ucla', 'pomona-college', 'rice-university', 'university-of-washington'],
    title: ls('Colleges with milder winters', '冬季较温和的学校', '冬が比較的穏やかな学校'),
    description: ls('For families who want to limit the adjustment burden of cold weather and snow.', '适合希望降低寒冷和降雪适应成本的家庭。', '寒さや雪への適応負荷を抑えたい家庭向けです。'),
    rationale: ls('Climate scores focus on daily comfort, transport reliability, and the practical cost of winter adaptation.', '气候分重点看日常舒适度、交通可靠性和冬季适应成本。', '日常の快適さ、移動の安定性、冬への適応コストを重視しています。'),
  },
  {
    slug: 'asian-grocery-access',
    icon: 'Store',
    schoolSlugs: ['ucla', 'rice-university', 'university-of-washington', 'northeastern-university'],
    title: ls('Schools with strong Asian grocery access', '亚洲超市可达性较强的学校', 'アジア食材へのアクセスが強い学校'),
    description: ls('Useful for families who care about familiar ingredients, prepared foods, and routine grocery convenience.', '适合重视熟悉食材、熟食和日常采购便利度的家庭。', '慣れた食材、惣菜、日々の買い物のしやすさを重視する家庭向けです。'),
    rationale: ls('Scores reward both distance and realistic car-free access, not only metro-scale abundance.', '评分同时看距离与无车可达性，而不是只看大城市总量。', '都市の規模だけでなく、距離と車なしでの現実的アクセスも評価します。'),
  },
  {
    slug: 'liberal-arts-airport-access',
    icon: 'Plane',
    schoolSlugs: ['pomona-college', 'amherst-college'],
    title: ls('Liberal arts colleges with better airport access to Asia', '前往亚洲机场条件相对更好的文理学院', 'アジア方面の空港アクセスが比較的良いリベラルアーツ校'),
    description: ls('A small-college shortlist for families who need a quieter campus without giving up all flight practicality.', '适合希望兼顾安静校园与国际出行便利度的家庭。', '静かな小規模キャンパスを望みつつ、渡航の現実性も保ちたい家庭向けです。'),
    rationale: ls('Airport access is assessed as a student logistics question: how difficult is it to get from campus to a useful Asia gateway?', '这里把机场问题视为学生物流问题：从校园到真正可用的亚洲门户机场到底有多麻烦。', '空港アクセスは、キャンパスから実用的なアジア方面ゲートウェイまでの負担として評価しています。'),
  },
];
