-- Add sauce customization options to sides

-- Update Crispy Fries with sauce options
UPDATE public.menu_items
SET customization_options = '[
  {
    "name": "Choose Your Dipping Sauce",
    "options": ["Ketchup", "Mayo", "Ranch", "BBQ", "Honey Mustard", "Chipotle Aioli", "Garlic Aioli", "Truffle Aioli", "Buffalo Sauce", "Sweet Chili"]
  },
  {
    "name": "Size",
    "options": ["Regular", "Large"]
  }
]'::jsonb
WHERE name = 'Crispy Fries';

-- Update Sweet Potato Fries with sauce options
UPDATE public.menu_items
SET customization_options = '[
  {
    "name": "Choose Your Dipping Sauce",
    "options": ["Chipotle Mayo", "Honey Mustard", "Garlic Aioli", "Cinnamon Sugar", "Marshmallow Dip", "Ranch", "BBQ"]
  },
  {
    "name": "Size",
    "options": ["Regular", "Large"]
  }
]'::jsonb
WHERE name = 'Sweet Potato Fries';

-- Update Onion Rings with sauce options
UPDATE public.menu_items
SET customization_options = '[
  {
    "name": "Choose Your Dipping Sauce",
    "options": ["Ranch", "BBQ", "Honey Mustard", "Chipotle Aioli", "Garlic Aioli", "Sriracha Mayo", "Horseradish Cream"]
  },
  {
    "name": "Size",
    "options": ["Regular", "Large"]
  }
]'::jsonb
WHERE name = 'Onion Rings';

-- Update Loaded Fries with sauce options
UPDATE public.menu_items
SET customization_options = '[
  {
    "name": "Choose Your Dipping Sauce",
    "options": ["Sour Cream", "Ranch", "BBQ", "Chipotle Aioli", "Garlic Aioli", "Buffalo Sauce"]
  },
  {
    "name": "Extra Toppings",
    "options": ["Extra Cheese", "Extra Bacon", "Jalapeños", "Green Onions"]
  }
]'::jsonb
WHERE name = 'Loaded Fries';

-- Update Mac & Cheese Bites with sauce options
UPDATE public.menu_items
SET customization_options = '[
  {
    "name": "Choose Your Dipping Sauce",
    "options": ["Ranch", "Marinara", "BBQ", "Honey Mustard", "Chipotle Aioli", "Sriracha Mayo"]
  }
]'::jsonb
WHERE name = 'Mac & Cheese Bites';
