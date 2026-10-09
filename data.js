// ---------------------------------------------------------------------------
// HomeNex — Indian Property Buyer Tool
// Sample property data for Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune
// Prices in lakhs (L) / crores (Cr). All data is illustrative.
// ---------------------------------------------------------------------------

export const CITIES = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune']

export const LOCALITIES = {
  'Bengaluru': ['Whitefield', 'Koramangala', 'Electronic City', 'Indiranagar', 'Hebbal', 'Sarjapur Road', 'HSR Layout', 'Marathahalli', 'JP Nagar', 'Yelahanka'],
  'Mumbai': ['Andheri West', 'Powai', 'Thane West', 'Navi Mumbai', 'Borivali', 'Goregaon', 'Malad West', 'Kandivali', 'Panvel', 'Mulund'],
  'Delhi NCR': ['Noida Sec 150', 'Gurgaon Sec 49', 'Dwarka', 'Greater Noida', 'Faridabad', 'Ghaziabad', 'Noida Ext', 'Golf Course Road', 'Indirapuram', 'Raj Nagar Ext'],
  'Hyderabad': ['Gachibowli', 'Kondapur', 'Madhapur', 'Jubilee Hills', 'Banjara Hills', 'Kompally', 'Kukatpally', 'Miyapur', 'Manikonda', 'Narsingi'],
  'Pune': ['Hinjewadi', 'Wakad', 'Baner', 'Kharadi', 'Hadapsar', 'Viman Nagar', 'Aundh', 'PCMC', 'Undri', 'Wagholi'],
}

export const PROPERTIES = [
  // Bengaluru
  { id: 'p1',  title: 'Brigade Cornerstone Utopia',   bhk: '2 BHK', type: 'Apartment', city: 'Bengaluru', locality: 'Whitefield',       price: 7800000,  priceLabel: '₹78 L',   area: 1180, status: 'ready', rera: 'PRM/KA/RERA/1251/310/PR/200928/003722', builder: 'Brigade Group',     amenities: ['Club House', 'Swimming Pool', 'Gym', 'Kids Play Area', 'Power Backup'], img: '🏢', yearBuilt: 2022, floors: '12th of 18', facing: 'East', parking: 1 },
  { id: 'p2',  title: 'Prestige Lakeside Habitat',    bhk: '3 BHK', type: 'Apartment', city: 'Bengaluru', locality: 'Whitefield',       price: 13500000, priceLabel: '₹1.35 Cr', area: 1650, status: 'uc',    rera: 'PRM/KA/RERA/1251/310/PR/210115/004103', builder: 'Prestige Group',    amenities: ['Lake View', 'Club House', 'Jogging Track', 'Indoor Games', 'Gym'], img: '🏗️', yearBuilt: 2025, floors: 'G+24', facing: 'North', parking: 2 },
  { id: 'p3',  title: 'Sobha Dream Acres',            bhk: '2 BHK', type: 'Apartment', city: 'Bengaluru', locality: 'Sarjapur Road',    price: 6200000,  priceLabel: '₹62 L',   area: 1010, status: 'ready', rera: 'PRM/KA/RERA/1251/310/PR/171216/000863', builder: 'Sobha Ltd',         amenities: ['Swimming Pool', 'Tennis Court', 'Gym', 'Park'], img: '🏢', yearBuilt: 2021, floors: '6th of 14', facing: 'South-East', parking: 1 },
  { id: 'p4',  title: 'Godrej Splendour',             bhk: '3 BHK', type: 'Apartment', city: 'Bengaluru', locality: 'Electronic City',  price: 11000000, priceLabel: '₹1.1 Cr',  area: 1485, status: 'uc',    rera: 'PRM/KA/RERA/1251/310/PR/200201/003105', builder: 'Godrej Properties', amenities: ['Club House', 'Swimming Pool', 'Garden', 'Indoor Games'], img: '🏗️', yearBuilt: 2025, floors: 'G+20', facing: 'West', parking: 1 },
  { id: 'p5',  title: 'Purva Zenium',                 bhk: '1 BHK', type: 'Apartment', city: 'Bengaluru', locality: 'Hosur Road',       price: 4800000,  priceLabel: '₹48 L',   area: 660,  status: 'ready', rera: null, builder: 'Puravankara',      amenities: ['Gym', 'Power Backup', 'Lift', 'Security'], img: '🏢', yearBuilt: 2020, floors: '3rd of 8', facing: 'North', parking: 1 },
  { id: 'p6',  title: 'Embassy Lake Terraces',        bhk: '4 BHK', type: 'Penthouse', city: 'Bengaluru', locality: 'Hebbal',           price: 32000000, priceLabel: '₹3.2 Cr',  area: 3400, status: 'uc',    rera: 'PRM/KA/RERA/1251/310/PR/220305/005622', builder: 'Embassy Group',     amenities: ['Infinity Pool', 'Helipad', 'Concierge', 'Home Theatre'], img: '🏗️', yearBuilt: 2026, floors: 'Penthouse', facing: 'All sides', parking: 3 },
  { id: 'p7',  title: 'Salarpuria Sattva Greenage',   bhk: '3 BHK', type: 'Apartment', city: 'Bengaluru', locality: 'Hosur Road',       price: 9500000,  priceLabel: '₹95 L',   area: 1350, status: 'ready', rera: 'PRM/KA/RERA/1251/310/PR/190622/002541', builder: 'Salarpuria Sattva', amenities: ['Club House', 'Swimming Pool', 'Gym', 'Badminton Court'], img: '🏢', yearBuilt: 2022, floors: '8th of 22', facing: 'North-East', parking: 2 },
  { id: 'p8',  title: 'Mantri Webcity',               bhk: '2 BHK', type: 'Apartment', city: 'Bengaluru', locality: 'Hennur Road',      price: 5500000,  priceLabel: '₹55 L',   area: 1050, status: 'ready', rera: 'PRM/KA/RERA/1251/310/PR/180315/001234', builder: 'Mantri Developers', amenities: ['Swimming Pool', 'Gym', 'Children Play Area', 'Jogging Track'], img: '🏢', yearBuilt: 2021, floors: '5th of 16', facing: 'East', parking: 1 },

  // Mumbai
  { id: 'p9',  title: 'Lodha Amara',                  bhk: '2 BHK', type: 'Apartment', city: 'Mumbai', locality: 'Thane West',          price: 12500000, priceLabel: '₹1.25 Cr', area: 870,  status: 'ready', rera: 'P51700001438', builder: 'Lodha Group',        amenities: ['Club House', 'Swimming Pool', 'Jogging Track', 'Gym', 'Garden'], img: '🏢', yearBuilt: 2023, floors: '15th of 40', facing: 'West', parking: 1 },
  { id: 'p10', title: 'Hiranandani Fortune City',      bhk: '1 BHK', type: 'Apartment', city: 'Mumbai', locality: 'Panvel',              price: 7500000,  priceLabel: '₹75 L',   area: 650,  status: 'uc',    rera: 'P52100000438', builder: 'Hiranandani',        amenities: ['Swimming Pool', 'Club House', 'Gym', 'Power Backup'], img: '🏗️', yearBuilt: 2025, floors: 'G+32', facing: 'South', parking: 1 },
  { id: 'p11', title: 'Rustomjee Pinnacle',            bhk: '3 BHK', type: 'Apartment', city: 'Mumbai', locality: 'Borivali',            price: 22000000, priceLabel: '₹2.2 Cr',  area: 1200, status: 'ready', rera: 'P51800002145', builder: 'Rustomjee',          amenities: ['Terrace Garden', 'Gym', 'Swimming Pool', 'Library'], img: '🏢', yearBuilt: 2022, floors: '22nd of 45', facing: 'East', parking: 2 },
  { id: 'p12', title: 'Oberoi Sky City',               bhk: '2 BHK', type: 'Apartment', city: 'Mumbai', locality: 'Borivali',            price: 16000000, priceLabel: '₹1.6 Cr',  area: 960,  status: 'ready', rera: 'P51900003215', builder: 'Oberoi Realty',       amenities: ['Infinity Pool', 'Sky Lounge', 'Gym', 'Concierge'], img: '🏢', yearBuilt: 2023, floors: '28th of 60', facing: 'Sea-facing', parking: 1 },

  // Delhi NCR
  { id: 'p13', title: 'DLF The Ultima',                bhk: '3 BHK', type: 'Apartment', city: 'Delhi NCR', locality: 'Gurgaon Sec 49',   price: 18000000, priceLabel: '₹1.8 Cr',  area: 1980, status: 'ready', rera: 'DLRERA2018A0080', builder: 'DLF Ltd',            amenities: ['Golf Course View', 'Club House', 'Swimming Pool', 'Gym'], img: '🏢', yearBuilt: 2022, floors: '14th of 28', facing: 'North-East', parking: 2 },
  { id: 'p14', title: 'ATS Pristine',                  bhk: '2 BHK', type: 'Apartment', city: 'Delhi NCR', locality: 'Noida Sec 150',    price: 7000000,  priceLabel: '₹70 L',   area: 1150, status: 'ready', rera: 'UPRERAPRJ3462', builder: 'ATS Group',           amenities: ['Swimming Pool', 'Gym', 'Garden', 'Children Play Area'], img: '🏢', yearBuilt: 2021, floors: '9th of 18', facing: 'East', parking: 1 },
  { id: 'p15', title: 'Godrej Nurture',                bhk: '2 BHK', type: 'Apartment', city: 'Delhi NCR', locality: 'Noida Ext',        price: 5500000,  priceLabel: '₹55 L',   area: 1045, status: 'uc',    rera: 'UPRERAPRJ5841', builder: 'Godrej Properties',  amenities: ['Club House', 'Gym', 'Swimming Pool', 'Jogging Track'], img: '🏗️', yearBuilt: 2025, floors: 'G+22', facing: 'South', parking: 1 },

  // Hyderabad
  { id: 'p16', title: 'My Home Bhooja',                bhk: '3 BHK', type: 'Apartment', city: 'Hyderabad', locality: 'Madhapur',         price: 14500000, priceLabel: '₹1.45 Cr', area: 1820, status: 'ready', rera: 'P02400001547', builder: 'My Home Group',       amenities: ['Club House', 'Swimming Pool', 'Gym', 'Mini Theatre'], img: '🏢', yearBuilt: 2023, floors: '18th of 30', facing: 'North', parking: 2 },
  { id: 'p17', title: 'Aparna Sarovar Zenith',         bhk: '2 BHK', type: 'Apartment', city: 'Hyderabad', locality: 'Gachibowli',       price: 8000000,  priceLabel: '₹80 L',   area: 1220, status: 'ready', rera: 'P02400002189', builder: 'Aparna Constructions', amenities: ['Club House', 'Gym', 'Swimming Pool', 'Badminton Court'], img: '🏢', yearBuilt: 2022, floors: '10th of 20', facing: 'East', parking: 1 },
  { id: 'p18', title: 'Ramky One Galaxia',             bhk: '2 BHK', type: 'Apartment', city: 'Hyderabad', locality: 'Kompally',         price: 4500000,  priceLabel: '₹45 L',   area: 950,  status: 'uc',    rera: 'P02400003415', builder: 'Ramky Group',          amenities: ['Swimming Pool', 'Gym', 'Park', 'Power Backup'], img: '🏗️', yearBuilt: 2025, floors: 'G+16', facing: 'West', parking: 1 },

  // Pune
  { id: 'p19', title: 'Godrej 24',                     bhk: '2 BHK', type: 'Apartment', city: 'Pune', locality: 'Hinjewadi',             price: 6800000,  priceLabel: '₹68 L',   area: 1100, status: 'ready', rera: 'P52100010453', builder: 'Godrej Properties',  amenities: ['24hr Club House', 'Swimming Pool', 'Gym', 'Tennis Court'], img: '🏢', yearBuilt: 2023, floors: '7th of 15', facing: 'East', parking: 1 },
  { id: 'p20', title: 'Kolte Patil Life Republic',     bhk: '3 BHK', type: 'Apartment', city: 'Pune', locality: 'Hinjewadi',             price: 9000000,  priceLabel: '₹90 L',   area: 1350, status: 'ready', rera: 'P52100010815', builder: 'Kolte Patil',         amenities: ['Township', 'Swimming Pool', 'Club House', 'School Nearby'], img: '🏢', yearBuilt: 2022, floors: '4th of 12', facing: 'South-East', parking: 1 },
  { id: 'p21', title: 'VTP Blue Waters',               bhk: '2 BHK', type: 'Apartment', city: 'Pune', locality: 'Hadapsar',              price: 5500000,  priceLabel: '₹55 L',   area: 980,  status: 'uc',    rera: 'P52100012034', builder: 'VTP Realty',           amenities: ['Club House', 'Swimming Pool', 'Gym', 'Garden'], img: '🏗️', yearBuilt: 2025, floors: 'G+18', facing: 'North', parking: 1 },
]

export const AREA_GUIDES = {
  'Whitefield': { avgPrice: '₹5,800–7,200/sq.ft', trend: '+12% YoY', metro: 'Purple Line 2 km', schools: 'TISB, Inventure Academy', hospitals: 'Columbia Asia, Manipal', vibe: 'IT hub with family-friendly gated communities' },
  'Koramangala': { avgPrice: '₹8,500–12,000/sq.ft', trend: '+8% YoY', metro: 'Coming soon', schools: 'NPS, DPS', hospitals: 'Fortis, Apollo', vibe: 'Startup central — cafes, restaurants, buzzy nightlife' },
  'Electronic City': { avgPrice: '₹4,200–5,500/sq.ft', trend: '+15% YoY', metro: 'Phase 2 planned', schools: 'IISM, Greenwood', hospitals: 'Narayana Health', vibe: 'Affordable IT corridor with rapid development' },
  'Gachibowli': { avgPrice: '₹6,000–8,500/sq.ft', trend: '+18% YoY', metro: 'Blue Line nearby', schools: 'ISB, IIIT-H', hospitals: 'Continental, AIG', vibe: 'Financial district meets tech park — Hyderabad\'s Silicon Valley' },
  'Hinjewadi': { avgPrice: '₹5,500–7,000/sq.ft', trend: '+14% YoY', metro: 'Metro Phase 3 planned', schools: 'Symbiosis, VIBGYOR', hospitals: 'Sahyadri, Jupiter', vibe: 'IT park hub — young professionals, new townships' },
  'Thane West': { avgPrice: '₹12,000–18,000/sq.ft', trend: '+10% YoY', metro: 'Metro connectivity', schools: 'Podar, DAV', hospitals: 'Jupiter, Hiranandani', vibe: 'Lake city — great infra, cleaner air than Mumbai proper' },
  'Gurgaon Sec 49': { avgPrice: '₹8,000–12,000/sq.ft', trend: '+9% YoY', metro: 'Rapid Metro', schools: 'DPS, GD Goenka', hospitals: 'Medanta, Artemis', vibe: 'Golf course road adjacent — premium corporates' },
  'Noida Sec 150': { avgPrice: '₹4,500–6,000/sq.ft', trend: '+20% YoY', metro: 'Aqua Line nearby', schools: 'Amity, DPS', hospitals: 'Jaypee, Max', vibe: 'Expressway living — affordable, well-planned, rapidly growing' },
}

export const STAMP_DUTY_RATES = {
  'Karnataka': { male: 5, female: 5, joint: 5, reg: 1, cess: 0 },
  'Maharashtra': { male: 6, female: 5, joint: 6, reg: 1, cess: 1 },
  'Uttar Pradesh': { male: 7, female: 6, joint: 7, reg: 1, cess: 0 },
  'Telangana': { male: 6, female: 6, joint: 6, reg: 0.5, cess: 0 },
  'Haryana': { male: 7, female: 5, joint: 6, reg: 0, cess: 0 },
}

export const STATE_FOR_CITY = {
  'Bengaluru': 'Karnataka',
  'Mumbai': 'Maharashtra',
  'Delhi NCR': 'Uttar Pradesh',
  'Hyderabad': 'Telangana',
  'Pune': 'Maharashtra',
}

export const BANK_RATES = [
  { bank: 'SBI', rate: 8.50, maxTenure: 30 },
  { bank: 'HDFC', rate: 8.70, maxTenure: 30 },
  { bank: 'ICICI', rate: 8.75, maxTenure: 30 },
  { bank: 'Axis Bank', rate: 8.80, maxTenure: 30 },
  { bank: 'Bank of Baroda', rate: 8.40, maxTenure: 30 },
  { bank: 'PNB', rate: 8.45, maxTenure: 30 },
  { bank: 'Kotak Mahindra', rate: 8.85, maxTenure: 20 },
]

export const SITE_URL = 'https://home.doaide.com'
