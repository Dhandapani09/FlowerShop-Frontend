export const seedSuppliers = [
  { id: "SUP001", name: "Ramesh Flowers", phone: "9876543210", type: "Farmer", location: "Poonamallee", advance: 30000, payable: 0 },
  { id: "SUP002", name: "Lakshmi Farms", phone: "9840012345", type: "Farm", location: "Thiruvallur", advance: 12500, payable: 2500 },
  { id: "SUP003", name: "Green Valley", phone: "9003012345", type: "Trader", location: "Koyambedu", advance: 0, payable: 7800 }
];
export const seedCustomers = [
  { id: "CUS001", name: "Kumar Flowers", phone: "9884012345", shop: "Kumar Flower Shop", receivable: 11900, creditLimit: 30000 },
  { id: "CUS002", name: "Rose Shop", phone: "9841012345", shop: "Rose Shop", receivable: 6000, creditLimit: 20000 },
  { id: "CUS003", name: "Fresh Flowers", phone: "9790012345", shop: "Fresh Flowers", receivable: 0, creditLimit: 15000 }
];
export const flowers = [
  { id: "FL001", name: "Rose", unit: "KG", rate: 100, saleRate: 140, stock: 120 },
  { id: "FL002", name: "Jasmine", unit: "KG", rate: 200, saleRate: 250, stock: 80 },
  { id: "FL003", name: "Marigold", unit: "KG", rate: 40, saleRate: 60, stock: 150 },
  { id: "FL004", name: "Lotus", unit: "Bunch", rate: 30, saleRate: 45, stock: 70 }
];
export const seedLedger = [
  { date: "19 Nov 2026", party: "Ramesh Flowers", type: "Supplier", description: "Opening advance", debit: 50000, credit: 0 },
  { date: "19 Nov 2026", party: "Ramesh Flowers", type: "Supplier", description: "Rose & Jasmine delivery", debit: 0, credit: 11000 },
  { date: "19 Nov 2026", party: "Kumar Flowers", type: "Customer", description: "Wholesale sale", debit: 7900, credit: 0 },
  { date: "19 Nov 2026", party: "Kumar Flowers", type: "Customer", description: "Cash received", debit: 0, credit: 3000 }
];
