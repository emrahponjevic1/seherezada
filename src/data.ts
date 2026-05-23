export type Category = 'Kebab' | 'Pice' | 'Burgeri' | 'Falafel' | 'Ostalo' | 'Dodatki' | 'Pijača' | 'Meni';

export interface MenuItem {
  id: string;
  title: { sl: string; en: string };
  price: string;
  category: Category;
  desc: { sl: string; en: string };
  ingredients: { sl: string[]; en: string[] };
  allergens: string[];
  img: string;
  popular?: boolean;
}

const IMAGES = {
  kebab: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80",
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  falafel: "https://images.unsplash.com/photo-1593010950930-741fb981f26a?w=800&q=80",
  default: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80"
};

export const menuItems: MenuItem[] = [
  // Meni
  {
    id: "studentski-meni",
    title: { sl: "Študentski meni", en: "Student menu" },
    price: "3,00 €",
    category: "Meni",
    desc: { sl: "Juha, solata, jabolko, pijača in glavna jed po izbiri.", en: "Soup, salad, apple, drink and main course of choice." },
    ingredients: { sl: ["Glavna jed po izbiri", "Juha", "Solata", "Jabolko", "Pijača"], en: ["Main course of choice", "Soup", "Salad", "Apple", "Drink"] },
    allergens: ["Gluten", "Laktoza"],
    img: IMAGES.default
  },
  
  // Kebab
  {
    id: "doner-kebab",
    title: { sl: "Doner Kebab", en: "Doner Kebab" },
    price: "8,50 €",
    category: "Kebab",
    desc: { sl: "Tradicionalni turški doner kebab v svežem kruhu.", en: "Traditional Turkish doner kebab in fresh bread." },
    ingredients: { sl: ["Govedina/Teletina", "Zelje", "Paradižnik", "Čebula", "Jogurtov preliv"], en: ["Beef/Veal", "Cabbage", "Tomato", "Onion", "Yogurt sauce"] },
    allergens: ["Gluten", "Laktoza", "Sezam"],
    img: IMAGES.kebab,
    popular: true
  },
  {
    id: "jufka",
    title: { sl: "Kebab Jufka", en: "Kebab Yufka" },
    price: "9,50 €",
    category: "Kebab",
    desc: { sl: "Kebab v tanki turški jufki, hrustljavo zapečen.", en: "Kebab in thin Turkish yufka, crisply baked." },
    ingredients: { sl: ["Govedina/Teletina", "Zelje", "Paradižnik", "Čebula", "Jogurtov preliv"], en: ["Beef/Veal", "Cabbage", "Tomato", "Onion", "Yogurt sauce"] },
    allergens: ["Gluten", "Laktoza"],
    img: IMAGES.kebab,
    popular: true
  },
  {
    id: "kebab-kroznik",
    title: { sl: "Kebab na krožniku", en: "Kebab Plate" },
    price: "12,00 €",
    category: "Kebab",
    desc: { sl: "Sočni rezini kebaba s krompirčkom, solato in prelivom.", en: "Juicy kebab slices with fries, salad and dressing." },
    ingredients: { sl: ["Govedina/Teletina", "Pomfrit", "Zelje", "Paradižnik", "Jogurtov preliv"], en: ["Beef/Veal", "Fries", "Cabbage", "Tomato", "Yogurt sauce"] },
    allergens: ["Laktoza"],
    img: IMAGES.kebab
  },

  // Pice
  {
    id: "pica-klasika",
    title: { sl: "Pica Klasika", en: "Classic Pizza" },
    price: "9,50 €",
    category: "Pice",
    desc: { sl: "Pradomači paradižnik in mozzarella.", en: "Traditional tomato and mozzarella." },
    ingredients: { sl: ["Pelati", "Mozzarella", "Origano"], en: ["Tomato sauce", "Mozzarella", "Oregano"] },
    allergens: ["Gluten", "Laktoza"],
    img: IMAGES.pizza
  },
  {
    id: "margerita",
    title: { sl: "Margerita", en: "Margherita" },
    price: "9,50 €",
    category: "Pice",
    desc: { sl: "Mozzarella, paradižnik, sveža bazilika.", en: "Mozzarella, tomato, fresh basil." },
    ingredients: { sl: ["Pelati", "Mozzarella", "Sveža bazilika"], en: ["Tomato sauce", "Mozzarella", "Fresh basil"] },
    allergens: ["Gluten", "Laktoza"],
    img: IMAGES.pizza
  },
  {
    id: "salami",
    title: { sl: "Salami", en: "Salami Pizza" },
    price: "9,50 €",
    category: "Pice",
    desc: { sl: "Pikantna salama na mozzarelli.", en: "Spicy salami on mozzarella." },
    ingredients: { sl: ["Pelati", "Mozzarella", "Pikantna salama"], en: ["Tomato sauce", "Mozzarella", "Spicy salami"] },
    allergens: ["Gluten", "Laktoza"],
    img: IMAGES.pizza
  },
  {
    id: "tuna",
    title: { sl: "Tuna", en: "Tuna Pizza" },
    price: "9,50 €",
    category: "Pice",
    desc: { sl: "Tuna in rdeča čebula.", en: "Tuna and red onion." },
    ingredients: { sl: ["Pelati", "Mozzarella", "Tuna", "Rdeča čebula"], en: ["Tomato sauce", "Mozzarella", "Tuna", "Red onion"] },
    allergens: ["Gluten", "Laktoza", "Ribe"],
    img: IMAGES.pizza
  },
  {
    id: "zelenjavna",
    title: { sl: "Zelenjavna", en: "Veggie Pizza" },
    price: "9,50 €",
    category: "Pice",
    desc: { sl: "Sezonska zelenjava na mozzarelli.", en: "Seasonal vegetables on mozzarella." },
    ingredients: { sl: ["Pelati", "Mozzarella", "Sezonska zelenjava"], en: ["Tomato sauce", "Mozzarella", "Seasonal vegetables"] },
    allergens: ["Gluten", "Laktoza"],
    img: IMAGES.pizza
  },
  {
    id: "kebab-pizza",
    title: { sl: "Kebab Pizza", en: "Kebab Pizza" },
    price: "9,50 €",
    category: "Pice",
    desc: { sl: "Hišna posebnost – pica obložena s kebab mesom.", en: "House specialty – pizza topped with kebab meat." },
    ingredients: { sl: ["Pelati", "Mozzarella", "Kebab meso", "Čebula", "Jogurtov preliv"], en: ["Tomato sauce", "Mozzarella", "Kebab meat", "Onion", "Yogurt sauce"] },
    allergens: ["Gluten", "Laktoza"],
    img: IMAGES.pizza,
    popular: true
  },

  // Burgeri
  {
    id: "piscancji-burger",
    title: { sl: "Piščančji burger", en: "Chicken burger" },
    price: "9,00 €",
    category: "Burgeri",
    desc: { sl: "Piščančji file v hrustljavi štručki.", en: "Chicken fillet in a crispy bun." },
    ingredients: { sl: ["Piščančji file", "Hrustljava štručka", "Zelena solata", "Paradižnik", "Omaka"], en: ["Chicken fillet", "Crispy bun", "Lettuce", "Tomato", "Sauce"] },
    allergens: ["Gluten", "Jajca", "Sezam"],
    img: IMAGES.burger
  },
  {
    id: "king-burger",
    title: { sl: "King burger", en: "King burger" },
    price: "7,50 €",
    category: "Burgeri",
    desc: { sl: "Sočna goveja pleskavica s svežo zelenjavo.", en: "Juicy beef patty with fresh vegetables." },
    ingredients: { sl: ["Goveja pleskavica", "Zelena solata", "Paradižnik", "Čebula", "Omaka"], en: ["Beef patty", "Lettuce", "Tomato", "Onion", "Sauce"] },
    allergens: ["Gluten", "Jajca", "Sezam"],
    img: IMAGES.burger
  },
  {
    id: "cheese-burger",
    title: { sl: "Cheese burger", en: "Cheese burger" },
    price: "9,00 €",
    category: "Burgeri",
    desc: { sl: "Govedina, čedar, kisle kumarice in hišni preliv.", en: "Beef, cheddar, pickles and house dressing." },
    ingredients: { sl: ["Goveje meso", "Čedar sir", "Kisle kumarice", "Hišni preliv"], en: ["Beef", "Cheddar cheese", "Pickles", "House dressing"] },
    allergens: ["Gluten", "Laktoza", "Jajca", "Sezam"],
    img: IMAGES.burger,
    popular: true
  },

  // Falafel
  {
    id: "falafel-kroznik",
    title: { sl: "Falafel na krožniku", en: "Falafel Plate" },
    price: "13,50 €",
    category: "Falafel",
    desc: { sl: "Domači falafel s krompirčkom in solato.", en: "Homemade falafel with fries and salad." },
    ingredients: { sl: ["Falafel polpeti", "Ocvrt krompirček", "Sezonska solata", "Preliv"], en: ["Falafel balls", "Fries", "Seasonal salad", "Dressing"] },
    allergens: ["Gluten", "Sezam"],
    img: IMAGES.falafel
  },
  {
    id: "falafel-5",
    title: { sl: "Falafel 4–5 polpetov", en: "Falafel 4–5 pieces" },
    price: "9,00 €",
    category: "Falafel",
    desc: { sl: "Falafel polpeti v jufki s prelivom.", en: "Falafel balls in yufka with dressing." },
    ingredients: { sl: ["4-5x Falafel", "Jufka", "Solata", "Preliv"], en: ["4-5x Falafel", "Yufka", "Salad", "Dressing"] },
    allergens: ["Gluten", "Sezam"],
    img: IMAGES.falafel
  },
  {
    id: "falafel-12",
    title: { sl: "12 kosov falafla + humus", en: "12 pieces of falafel + hummus" },
    price: "12,00 €",
    category: "Falafel",
    desc: { sl: "12 falafel polpetov s sveže pripravljenim humusom.", en: "12 falafel balls with freshly prepared hummus." },
    ingredients: { sl: ["12x Falafel", "Domači humus", "Solata"], en: ["12x Falafel", "Homemade hummus", "Salad"] },
    allergens: ["Sezam"],
    img: IMAGES.falafel
  },

  // Ostalo
  {
    id: "piscancji-meni-2",
    title: { sl: "Piščančji meni 2", en: "Chicken Menu 2" },
    price: "13,50 €",
    category: "Ostalo",
    desc: { sl: "Piščančji file z dodatki.", en: "Chicken fillet with sides." },
    ingredients: { sl: ["Piščančji file", "Dodatki"], en: ["Chicken fillet", "Sides"] },
    allergens: ["Gluten"],
    img: IMAGES.default
  },
  {
    id: "piscancji-meni-3",
    title: { sl: "Piščančji meni 3", en: "Chicken Menu 3" },
    price: "13,50 €",
    category: "Ostalo",
    desc: { sl: "Piščančji file z rižem in solato.", en: "Chicken fillet with rice and salad." },
    ingredients: { sl: ["Piščančji file", "Riž", "Solata"], en: ["Chicken fillet", "Rice", "Salad"] },
    allergens: [],
    img: IMAGES.default
  },
  {
    id: "cevapcici",
    title: { sl: "Čevapčiči", en: "Cevapcici" },
    price: "13,00 €",
    category: "Ostalo",
    desc: { sl: "Tradicionalni balkanski čevapčiči s čebulo.", en: "Traditional Balkan cevapcici with onion." },
    ingredients: { sl: ["Čevapčiči", "Čebula", "Lepinja"], en: ["Cevapcici", "Onion", "Flatbread"] },
    allergens: ["Gluten"],
    img: IMAGES.default
  },

  // Dodatki
  {
    id: "pomfrit",
    title: { sl: "Ocvrt krompirček", en: "French fries" },
    price: "4,00 €",
    category: "Dodatki",
    desc: { sl: "Hrustljav, zlato ocvrt krompirček.", en: "Crispy, golden-fried french fries." },
    ingredients: { sl: ["Krompir", "Sol"], en: ["Potatoes", "Salt"] },
    allergens: [],
    img: IMAGES.default
  },

  // Pijača
  {
    id: "coca-cola",
    title: { sl: "Coca-Cola", en: "Coca-Cola" },
    price: "2,00 €",
    category: "Pijača",
    desc: { sl: "0,33 l pločevinka.", en: "0.33 l can." },
    ingredients: { sl: [], en: [] },
    allergens: [],
    img: IMAGES.default
  },
  {
    id: "ayran",
    title: { sl: "Ayran", en: "Ayran" },
    price: "1,50 €",
    category: "Pijača",
    desc: { sl: "Tradicionalna turška jogurtova pijača.", en: "Traditional Turkish yogurt drink." },
    ingredients: { sl: ["Jogurt", "Voda", "Sol"], en: ["Yogurt", "Water", "Salt"] },
    allergens: ["Laktoza"],
    img: IMAGES.default
  },
  {
    id: "voda",
    title: { sl: "Voda", en: "Water" },
    price: "1,00 €",
    category: "Pijača",
    desc: { sl: "Negazirana voda 0,5 l.", en: "Still water 0.5 l." },
    ingredients: { sl: [], en: [] },
    allergens: [],
    img: IMAGES.default
  },
  {
    id: "radenska",
    title: { sl: "Radenska", en: "Radenska" },
    price: "2,50 €",
    category: "Pijača",
    desc: { sl: "Mineralna voda z mehurčki.", en: "Sparkling mineral water." },
    ingredients: { sl: [], en: [] },
    allergens: [],
    img: IMAGES.default
  }
];

export const reviews = [
  {
    id: 1,
    text: "Najboljši kebab v Ljubljani! Vedno sveže in okusno.",
    author: "Maja K."
  },
  {
    id: 2,
    text: "Best doner in town, open late, super friendly staff.",
    author: "Tom R."
  },
  {
    id: 3,
    text: "Fantastična pizza, brza dostava. Priporočam vsem!",
    author: "Alen M."
  }
];
