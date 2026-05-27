-- Seed menu categories
INSERT INTO public.menu_categories (name, description, display_order, is_active) VALUES
  ('Burgers', 'Our flame-grilled signature burgers', 1, true),
  ('Sides', 'Crispy sides to complement your meal', 2, true),
  ('Drinks', 'Refreshing beverages', 3, true),
  ('Desserts', 'Sweet treats to finish your meal', 4, true);

-- Get category IDs for reference
DO $$
DECLARE
  burgers_id UUID;
  sides_id UUID;
  drinks_id UUID;
  desserts_id UUID;
BEGIN
  SELECT id INTO burgers_id FROM public.menu_categories WHERE name = 'Burgers';
  SELECT id INTO sides_id FROM public.menu_categories WHERE name = 'Sides';
  SELECT id INTO drinks_id FROM public.menu_categories WHERE name = 'Drinks';
  SELECT id INTO desserts_id FROM public.menu_categories WHERE name = 'Desserts';

  -- Seed menu items - Burgers
  INSERT INTO public.menu_items (category_id, name, description, price, calories, is_available, is_popular, customization_options) VALUES
    (burgers_id, 'Classic Byte Burger', 'Juicy beef patty with lettuce, tomato, and our signature ByteBurger sauce', 9.99, 650, true, true, 
      '[{"name":"Patty","options":["Beef","Chicken","Veggie"]},{"name":"Cheese","options":["Cheddar","Swiss","American","No Cheese"]},{"name":"Toppings","options":["Lettuce","Tomato","Onion","Pickles"]},{"name":"Sauce","options":["ByteBurger Sauce","Mayo","Mustard","Ketchup"]},{"name":"Bun","options":["Regular","Sesame","Whole Wheat"]}]'::jsonb),
    
    (burgers_id, 'Double Stack', 'Two beef patties, double cheese, bacon, and BBQ sauce', 12.99, 920, true, true,
      '[{"name":"Patty","options":["Beef","Chicken"]},{"name":"Cheese","options":["Cheddar","Swiss","American"]},{"name":"Add-ons","options":["Extra Bacon","Fried Egg","Jalapeños"]},{"name":"Sauce","options":["BBQ","Chipotle Mayo","Ranch"]},{"name":"Bun","options":["Regular","Sesame","Brioche"]}]'::jsonb),
    
    (burgers_id, 'Spicy Byte', 'Crispy chicken with jalapeños, pepper jack cheese, and spicy mayo', 10.99, 720, true, true,
      '[{"name":"Patty","options":["Crispy Chicken","Grilled Chicken"]},{"name":"Cheese","options":["Pepper Jack","Cheddar","No Cheese"]},{"name":"Toppings","options":["Jalapeños","Red Onion","Lettuce","Tomato"]},{"name":"Sauce","options":["Spicy Mayo","Sriracha","Chipotle"]},{"name":"Bun","options":["Regular","Sesame"]}]'::jsonb),
    
    (burgers_id, 'Veggie Delight', 'Plant-based patty with avocado, sprouts, and fresh veggies', 10.49, 580, true, false,
      '[{"name":"Patty","options":["Beyond Burger","Black Bean","Portobello"]},{"name":"Cheese","options":["Vegan Cheese","Swiss","No Cheese"]},{"name":"Toppings","options":["Avocado","Sprouts","Cucumber","Red Onion"]},{"name":"Sauce","options":["Herb Mayo","Tahini","Hummus"]},{"name":"Bun","options":["Whole Wheat","Regular"]}]'::jsonb),
    
    (burgers_id, 'BBQ Bacon Burger', 'Bacon-loaded burger with crispy onion rings and smoky BBQ sauce', 11.99, 850, true, false,
      '[{"name":"Patty","options":["Beef","Chicken"]},{"name":"Cheese","options":["Cheddar","Pepper Jack"]},{"name":"Add-ons","options":["Extra Bacon","Onion Rings","Fried Egg"]},{"name":"Sauce","options":["BBQ","Honey BBQ","Chipotle BBQ"]},{"name":"Bun","options":["Sesame","Brioche"]}]'::jsonb),
    
    (burgers_id, 'Mushroom Swiss', 'Sautéed mushrooms, Swiss cheese, and truffle aioli', 11.49, 680, true, false,
      '[{"name":"Patty","options":["Beef","Portobello"]},{"name":"Cheese","options":["Swiss","Gruyere"]},{"name":"Toppings","options":["Sautéed Mushrooms","Caramelized Onions","Arugula"]},{"name":"Sauce","options":["Truffle Aioli","Garlic Aioli"]},{"name":"Bun","options":["Brioche","Whole Wheat"]}]'::jsonb);

  -- Seed menu items - Sides
  INSERT INTO public.menu_items (category_id, name, description, price, calories, is_available, is_popular) VALUES
    (sides_id, 'Crispy Fries', 'Golden crispy fries with sea salt', 3.99, 340, true, true),
    (sides_id, 'Sweet Potato Fries', 'Crispy sweet potato fries with chipotle mayo', 4.49, 380, true, false),
    (sides_id, 'Onion Rings', 'Beer-battered onion rings with ranch dipping sauce', 4.49, 420, true, true),
    (sides_id, 'Loaded Fries', 'Fries topped with cheese, bacon, and green onions', 5.99, 580, true, false),
    (sides_id, 'Mac & Cheese Bites', 'Crispy fried mac and cheese balls', 5.49, 450, true, false);

  -- Seed menu items - Drinks
  INSERT INTO public.menu_items (category_id, name, description, price, calories, is_available, is_popular) VALUES
    (drinks_id, 'Soft Drink', 'Coca-Cola, Sprite, or Fanta', 2.49, 150, true, true),
    (drinks_id, 'Milkshake', 'Vanilla, chocolate, or strawberry', 4.99, 520, true, true),
    (drinks_id, 'Iced Tea', 'Freshly brewed sweet or unsweet', 2.99, 90, true, false),
    (drinks_id, 'Lemonade', 'Fresh-squeezed lemonade', 2.99, 120, true, false),
    (drinks_id, 'Coffee', 'Hot or iced coffee', 2.49, 5, true, false);

  -- Seed menu items - Desserts
  INSERT INTO public.menu_items (category_id, name, description, price, calories, is_available, is_popular) VALUES
    (desserts_id, 'Chocolate Brownie', 'Warm brownie with vanilla ice cream', 4.99, 480, true, true),
    (desserts_id, 'Apple Pie', 'Classic apple pie with cinnamon', 3.99, 320, true, false),
    (desserts_id, 'Ice Cream Sundae', 'Three scoops with your choice of toppings', 5.49, 400, true, false);
END $$;
