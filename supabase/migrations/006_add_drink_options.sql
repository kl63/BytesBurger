-- Add customization options to drinks

-- Update Soft Drink with flavor and size options
UPDATE public.menu_items
SET customization_options = '[
  {
    "name": "Choose Your Flavor",
    "options": ["Coca-Cola", "Sprite", "Fanta Orange", "Dr Pepper", "Root Beer", "Diet Coke", "Sprite Zero"]
  },
  {
    "name": "Size",
    "options": ["Small", "Medium", "Large"]
  },
  {
    "name": "Ice",
    "options": ["Regular Ice", "Light Ice", "No Ice", "Extra Ice"]
  }
]'::jsonb
WHERE name = 'Soft Drink';

-- Update Milkshake with flavor, size, and topping options
UPDATE public.menu_items
SET customization_options = '[
  {
    "name": "Choose Your Flavor",
    "options": ["Vanilla", "Chocolate", "Strawberry", "Oreo", "Peanut Butter", "Salted Caramel", "Mint Chocolate Chip"]
  },
  {
    "name": "Size",
    "options": ["Regular", "Large"]
  },
  {
    "name": "Add Toppings",
    "options": ["Whipped Cream", "Chocolate Syrup", "Caramel Drizzle", "Sprinkles", "Oreo Crumbles", "Cherry", "Extra Thick"]
  }
]'::jsonb
WHERE name = 'Milkshake';

-- Update Iced Tea with type and sweetness options
UPDATE public.menu_items
SET customization_options = '[
  {
    "name": "Tea Type",
    "options": ["Black Tea", "Green Tea", "Peach Tea", "Raspberry Tea", "Lemon Tea"]
  },
  {
    "name": "Sweetness",
    "options": ["Unsweetened", "Lightly Sweet", "Sweet", "Extra Sweet"]
  },
  {
    "name": "Size",
    "options": ["Small", "Medium", "Large"]
  },
  {
    "name": "Ice",
    "options": ["Regular Ice", "Light Ice", "No Ice", "Extra Ice"]
  }
]'::jsonb
WHERE name = 'Iced Tea';

-- Update Lemonade with flavor and size options
UPDATE public.menu_items
SET customization_options = '[
  {
    "name": "Flavor",
    "options": ["Classic", "Strawberry", "Raspberry", "Mango", "Peach", "Blueberry"]
  },
  {
    "name": "Sweetness",
    "options": ["Regular Sweet", "Lightly Sweet", "Extra Sweet"]
  },
  {
    "name": "Size",
    "options": ["Small", "Medium", "Large"]
  },
  {
    "name": "Ice",
    "options": ["Regular Ice", "Light Ice", "Extra Ice"]
  }
]'::jsonb
WHERE name = 'Lemonade';

-- Update Coffee with type, size, and customization options
UPDATE public.menu_items
SET customization_options = '[
  {
    "name": "Coffee Type",
    "options": ["Regular Coffee", "Espresso", "Americano", "Latte", "Cappuccino", "Mocha", "Cold Brew"]
  },
  {
    "name": "Size",
    "options": ["Small", "Medium", "Large"]
  },
  {
    "name": "Milk Options",
    "options": ["Black (No Milk)", "Whole Milk", "Skim Milk", "Almond Milk", "Oat Milk", "Soy Milk"]
  },
  {
    "name": "Add-Ons",
    "options": ["Sugar", "Sweetener", "Vanilla Syrup", "Caramel Syrup", "Hazelnut Syrup", "Whipped Cream", "Extra Shot"]
  }
]'::jsonb
WHERE name = 'Coffee';
