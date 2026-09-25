export type MenuItem = {
  name: string;
  desc?: string;
  cal?: string;
  price: string; // in SR; "S/L" prices shown as "5/7"
};

export type MenuGroup = { category: string; items: MenuItem[] };

const SET_SIDES = "Plain Rice, Vegetable, Bhorta/Shak, Dal, Salad";

export const MENU: MenuGroup[] = [
  {
    category: "Set Menu · Meat",
    items: [
      { name: "Murgi Combo", desc: `Chicken Jhal Fry, ${SET_SIDES}`, cal: "1050", price: "20" },
      { name: "Deshi Murgi Combo", desc: `Deshi Chicken Curry, ${SET_SIDES}`, cal: "1047", price: "20" },
      { name: "Beef Combo", desc: `Beef Curry, ${SET_SIDES}`, cal: "1120", price: "20" },
      { name: "Beef Khalabhuna Combo", desc: `Special Beef Khalabhuna, ${SET_SIDES}`, cal: "1150", price: "20" },
      { name: "Mutton Combo", desc: `Mutton Curry, ${SET_SIDES}`, cal: "1100", price: "20" },
      { name: "Duck Combo", desc: `Duck Curry, ${SET_SIDES}`, cal: "1060", price: "23" },
      { name: "Koel Combo", desc: `Koel Gravy Roast, ${SET_SIDES}`, cal: "960", price: "32" },
      { name: "Pigeon Combo", desc: `Pigeon Gravy Roast, ${SET_SIDES}`, cal: "960", price: "32" },
      { name: "Bhuri Bhuna Combo", desc: `Bhuri Bhuna, ${SET_SIDES}`, cal: "1090", price: "20" },
    ],
  },
  {
    category: "Set Menu · Fish",
    items: [
      { name: "Ilish Combo", desc: `Hilsha Curry, ${SET_SIDES}`, cal: "1015", price: "23" },
      { name: "Ilish Egg Combo", desc: `Ilish Egg Curry, ${SET_SIDES}`, cal: "1090", price: "30" },
      { name: "Rupchanda Combo", desc: `King Prawn Bhuna, ${SET_SIDES}`, cal: "1040", price: "20" },
      { name: "Shrimp and Bean Curry", desc: `King Prawn Bhuna, ${SET_SIDES}`, cal: "1050", price: "20" },
      { name: "Rui Combo", desc: `Rohu Curry, ${SET_SIDES}`, cal: "1050", price: "20" },
      { name: "Koral Combo", desc: `Koral Curry, ${SET_SIDES}`, cal: "1060", price: "20" },
      { name: "Boal Combo", desc: `Boal Curry, ${SET_SIDES}`, cal: "1065", price: "20" },
      { name: "King Prawn Bhuna", desc: `Rupchanda Curry, ${SET_SIDES}`, cal: "1050", price: "32" },
      { name: "Gutum Combo", desc: `Koral Curry, Basmati Rice, ${SET_SIDES}`, cal: "1070", price: "20" },
      { name: "Shorputi Combo", desc: `Shorputi Curry, ${SET_SIDES}`, cal: "850", price: "20" },
      { name: "Tengra Combo", desc: `Tengra Curry, ${SET_SIDES}`, cal: "880", price: "20" },
      { name: "Shurma Combo", desc: `Shurma Curry, ${SET_SIDES}`, cal: "890", price: "20" },
      { name: "Pabda Combo", desc: `Pabda Curry, ${SET_SIDES}`, cal: "890", price: "20" },
      { name: "Bata Combo", desc: `Bata Curry, ${SET_SIDES}`, cal: "880", price: "20" },
      { name: "Kachki Combo", desc: `Kachki Curry, ${SET_SIDES}`, cal: "850", price: "20" },
      { name: "Mola Combo", desc: `Mola Curry, ${SET_SIDES}`, cal: "860", price: "20" },
      { name: "Koi Combo", desc: `Koi Curry, ${SET_SIDES}`, cal: "880", price: "20" },
      { name: "Telapia Combo", desc: `Telapia Curry, ${SET_SIDES}`, cal: "860", price: "20" },
      { name: "Loitta Combo", desc: `Loitta Curry, ${SET_SIDES}`, cal: "840", price: "20" },
    ],
  },
  {
    category: "Breakfast",
    items: [
      { name: "Lamb Curry", desc: "S/L", cal: "156", price: "13/25" },
      { name: "Beef Curry", desc: "S/L", cal: "450", price: "13/25" },
      { name: "Paratha", cal: "156", price: "2" },
      { name: "Ruti", desc: "2 pcs", cal: "85", price: "2" },
      { name: "Bhaji (Mixed)", desc: "S/L", cal: "156", price: "5/7" },
      { name: "Chana Dal", desc: "S/L", cal: "160", price: "5/7" },
      { name: "Moong Dal", desc: "S/L", cal: "176", price: "5/7" },
      { name: "Daal-Bhaji", desc: "S/L", cal: "158", price: "5/7" },
      { name: "Egg Omelette", cal: "100", price: "3" },
      { name: "Egg Paratha", cal: "250", price: "5" },
      { name: "Poached Egg", cal: "70", price: "3" },
      { name: "Chicken Soup", cal: "130", price: "13" },
      { name: "Egg Curry", cal: "250", price: "5" },
    ],
  },
  {
    category: "Nola (Paya)",
    items: [
      { name: "Beef", cal: "320", price: "25" },
      { name: "Mutton", desc: "Full", cal: "320", price: "17" },
      { name: "Mutton", desc: "Half", cal: "175", price: "10" },
      { name: "Camel", desc: "Full", cal: "350", price: "17" },
      { name: "Camel", desc: "Half", cal: "190", price: "15" },
    ],
  },
  {
    category: "Main Curry",
    items: [
      { name: "Chicken Curry", cal: "400", price: "15" },
      { name: "Chicken Jhal Fry", cal: "350", price: "15" },
      { name: "Deshi Chicken Curry", cal: "250", price: "15" },
      { name: "Lamb Bhuna", cal: "350", price: "15" },
      { name: "Duck Curry", cal: "400", price: "17" },
      { name: "Koel Gravy Roast", cal: "380", price: "20" },
      { name: "Pigeon Gravy Roast", cal: "400", price: "20" },
      { name: "Bhuri Bhuna (Beef)", cal: "300", price: "17" },
      { name: "Shrimp & Bean Curry", cal: "260", price: "15" },
      { name: "Chicken Roast", cal: "300", price: "15" },
    ],
  },
  {
    category: "Popular",
    items: [
      { name: "Special Beef Curry", cal: "450", price: "15" },
      { name: "Beef Kalabhuna", cal: "400", price: "15" },
      { name: "Lamb Curry", cal: "350", price: "15" },
    ],
  },
  {
    category: "Fish Curry",
    items: [
      { name: "Mola Curry", cal: "260", price: "15" },
      { name: "Kachki Curry", cal: "260", price: "15" },
      { name: "Boal Curry", cal: "300", price: "15" },
      { name: "Rui Curry", cal: "260", price: "15" },
      { name: "Rupchanda Curry (Black/White)", cal: "300", price: "15" },
      { name: "Koral Curry", cal: "300", price: "15" },
      { name: "Hilsha Curry", cal: "380", price: "17" },
      { name: "Pabda Curry", cal: "300", price: "15" },
      { name: "Tengra Curry", cal: "260", price: "15" },
      { name: "Loitta Curry", cal: "260", price: "15" },
      { name: "Surma Curry", cal: "300", price: "15" },
      { name: "Telapia Curry", cal: "300", price: "15" },
      { name: "Hilsha Egg", cal: "300", price: "25" },
      { name: "King Prawn Bhuna", cal: "260", price: "20" },
      { name: "Koi Curry", cal: "250", price: "15" },
      { name: "Bata Curry", cal: "300", price: "15" },
    ],
  },
  {
    category: "Biriyani & Polao",
    items: [
      { name: "Beef Akhni Biriyani", desc: "Half", price: "10" },
      { name: "Beef Akhni Biriyani", desc: "Full", cal: "1138", price: "17" },
      { name: "Mutton Kacchi", cal: "1120", price: "20" },
      { name: "Murog Polao", cal: "920", price: "20" },
      { name: "Ilish Polao", cal: "890", price: "32" },
      { name: "Chingri Polao", cal: "870", price: "32" },
    ],
  },
  {
    category: "Add-Ons",
    items: [
      { name: "Polao Rice", cal: "340", price: "10" },
      { name: "Kacchi Rice", cal: "350", price: "10" },
      { name: "Chicken Roast", cal: "440", price: "15" },
      { name: "Extra Boiled Egg", cal: "70", price: "3" },
    ],
  },
  {
    category: "Snacks & Appetizers",
    items: [
      { name: "Beef Haleem", desc: "S/L", cal: "350", price: "7/14" },
      { name: "Mughlai Paratha", cal: "450", price: "7" },
      { name: "Singara", desc: "2 pcs", cal: "150", price: "2" },
      { name: "Samosa", desc: "2 pcs", cal: "150", price: "2" },
      { name: "Puri", cal: "100", price: "2" },
      { name: "Alor Chop", desc: "2 pcs", cal: "200", price: "2" },
      { name: "Dim Chop", cal: "250", price: "3" },
      { name: "Piyaju", desc: "4 pcs", cal: "320", price: "2" },
      { name: "Beguni", desc: "2 pcs", cal: "150", price: "2" },
      { name: "Shemai", cal: "250", price: "5" },
      { name: "Noodles with Boiled Egg", cal: "500", price: "7" },
      { name: "Beef Boll", cal: "200", price: "5" },
      { name: "Beef Sandwich", cal: "350", price: "5" },
      { name: "Beef Meatball", desc: "S/L", cal: "100", price: "2/3" },
      { name: "Morisa", desc: "2 pcs", cal: "200", price: "2" },
      { name: "Jhal Bhora", desc: "2 pcs", cal: "100", price: "2" },
      { name: "Wonton", desc: "2 pcs", price: "2" },
      { name: "Chana Muri (Mixer)", desc: "S/L", cal: "150", price: "5/7" },
      { name: "Chana (Chola)", desc: "S/L", cal: "150", price: "5/7" },
    ],
  },
  {
    category: "Desserts",
    items: [
      { name: "Misti Doi", desc: "Popular", cal: "300", price: "5" },
      { name: "Firni", desc: "Popular", cal: "250", price: "5" },
      { name: "Golab Jamun", cal: "150", price: "2" },
      { name: "Kalo Jam", cal: "200", price: "3" },
      { name: "Shada Misti", cal: "180", price: "2" },
      { name: "Shujir Halwa", cal: "400", price: "5" },
      { name: "Khaja", cal: "300", price: "2" },
      { name: "Nimki", cal: "150", price: "2" },
      { name: "Doi Chira", cal: "350", price: "5" },
      { name: "Jilapi", desc: "Popular · 2 pcs", cal: "300", price: "2" },
      { name: "Misti (per kg)", desc: "Golab Jamun 4 pcs, Kalo Jam 4 pcs, Shada Misti 5 pcs", cal: "2840", price: "35" },
      { name: "Jilapi (per kg)", cal: "2460", price: "32" },
    ],
  },
  {
    category: "Beverages",
    items: [
      { name: "Milk Tea", desc: "Small / Large", cal: "150", price: "2/3" },
      { name: "Lal Cha", desc: "Small / Large", price: "2/3" },
      { name: "Water", price: "2" },
    ],
  },
];

export const TERMS = [
  "1 Meal (for 1 person) — 20 SR",
  "1 Meal (for 2 persons) — 28 SR",
  "1 Meal (without main curry) — 10 SR",
  "*applicable for SET MENU only",
];
