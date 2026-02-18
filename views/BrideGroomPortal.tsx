import React, { useMemo, useRef, useState } from "react";
import { View, WeddingBooking, Guest, AuditEntry } from "../types";
import { approveBooking } from "../services/bookingService";

interface BrideGroomPortalProps {
  onNavigate: (v: View) => void;
  wedding: WeddingBooking | null;
  onSave: (updated: WeddingBooking) => void;
  isAdminAccess: boolean;
}

type MenuItem = {
  id: string;
  name: string;
  desc?: string;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  supplementPrice?: number;
};

const PIZZA_OPTIONS: MenuItem[] = [
  { id: "p1", name: "Margherita", desc: "San Marzano Tomato Sauce, Italian Mozzarella, Cherry Tomatoes, Fresh Basil" },
  { id: "p2", name: "Northumberland Chicken Kiev", desc: "San Marzano Tomato Sauce, Italian Mozzarella, Roasted Northumberland Chicken Breast, Sautéed Garlic Button Mushrooms, Garlic Oil" },
  { id: "p3", name: "Hawaiian", desc: "San Marzano Tomato Sauce, Italian Mozzarella, Smokey Pancetta Lardons, Caramelized Pineapple" },
  { id: "p4", name: "Pepperoni", desc: "San Marzano Tomato Sauce, Italian Mozzarella, Sliced Pepperoni" },
  { id: "p5", name: "Veggie", desc: "San Marzano Tomato Sauce, Italian Mozzarella, Roasted Red Peppers, Cherry Tomatoes, Sweetcorn, Roasted Courgette, Pesto" },
  { id: "p6", name: "Chicken Fajita", desc: "San Marzano Tomato Sauce, Italian Mozzarella, Fajita Spiced Northumberland Chicken, Roasted Red Peppers, Red Onion, Sour Cream, Coriander" },
  { id: "p7", name: "Rocket & Goats Cheese", desc: "San Marzano Tomato Sauce, Italian Mozzarella, Crumbled Goats Cheese, Red Onion Marmalade, Rocket" },
  { id: "p8", name: "BBQ Pulled Pork", desc: "San Marzano Tomato Sauce, Italian Mozzarella, 24 hour cooked BBQ Pulled Pork, Red Onions, with or without Jalapenos, BBQ Sauce" },
  { id: "p9", name: "N’duja", desc: "San Marzano Tomato Sauce, Italian Mozzarella, Spicy N’duja, Red Onion" },
];

const STREET_FOOD_OPTIONS: MenuItem[] = [
  { id: "sf1", name: "Dirty Fries", desc: "BBQ Pulled Brisket, Cheese Sauce, Spring Onion. Dirty Fries, Cheese Sauce, Spring Onions (V)" },
  { id: "sf2", name: "Bao Bun", desc: "Korean BBQ Pulled Pork, Kimchi, Coriander. Bao Bun, Korean BBQ Jackfruit, Kimchi, Coriander (V)" },
  { id: "sf3", name: "Szechuan Noodles", desc: "With Satay Chicken. With Satay Tofu (V)" },
  { id: "sf4", name: "Proper Dog", desc: "Brioche Bun, Custom Garnishes, Mustard, Guacamole, Cheese, Jalapeno, Sour Cream" },
  { id: "sf5", name: "Nachos", desc: "Cheese Sauce, Sour Cream, Salsa, Guacamole, Coriander (V)" },
  { id: "sf6", name: "Belgian Waffles", desc: "Banoffee. Strawberry." },
];

const HOG_ROAST_INCLUDED = [
  "Hog Roast",
  "Seasoned Potato Wedges",
  "Stuffing",
  "Selection of Bread Buns",
  "Purple Slaw",
  "Mixed Leaf Salad",
  "Apple Sauce",
];

const HOG_ROAST_SIDES = [
  { id: "hrs1", name: "Onion Rings", price: 3 },
  { id: "hrs2", name: "French Fries", price: 3 },
  { id: "hrs3", name: "Seasoned Potato Wedges", price: 3 },
  { id: "hrs4", name: "Halloumi Fries", price: 3 },
];

const EVENING_FOOD_OPTIONS = [
  { id: "ef-1", name: "The Shack Wood fired pizza" },
  { id: "ef-2", name: "Hot Bacon & Cumberland Sausage Baps" },
  { id: "ef-3", name: "Traditional Northumbrian Finger Buffet" },
  { id: "ef-4", name: "Slow Roasted Hog Roast" },
  { id: "ef-5", name: "Street Food" },
];

const CHILDRENS_MENU = {
  starters: [
    { id: "ch-s1", name: "Seasonal Melon & Fruit Coulis", vegan: true },
    { id: "ch-s2", name: "Potato Skins", vegan: false },
    { id: "ch-s3", name: "Tomato Soup", vegan: true },
  ],
  mains: [
    { id: "ch-m1", name: "Half Portion of selected Adults Main Course", vegan: false },
    { id: "ch-m2", name: "Sausage & Mash with Gravy", vegan: false },
    { id: "ch-m3", name: "Chicken Goujons with Fries", vegan: false },
    { id: "ch-m4", name: "Fish Fingers with Fries", vegan: false },
  ],
  desserts: [
    { id: "ch-d1", name: "Chocolate Brownie with Vanilla Ice Cream", vegan: false },
    { id: "ch-d2", name: "Selection of Ice Cream", vegan: false },
    { id: "ch-d3", name: "Fresh Fruit Salad", vegan: true },
  ],
};

const VEGAN_MENU = {
  starters: [
    { id: "v-s1", name: "Chunky Vegetable Broth", vegan: true },
    { id: "v-s2", name: "Beetroot and Mediterranean Vegetable Carpaccio, Truffle Oil", vegan: true },
    { id: "v-s3", name: "Cherry Tomato & Shallot Tart au Tain, Leaf Salad Balsamic Glaze", vegan: true },
  ],
  mains: [
    { id: "v-m1", name: "Marinated Tofu, Courgette & Carrot Spaghetti, Beetroot gel, Sesame, Chilli, Soy Dressing", vegan: true },
    { id: "v-m2", name: "Nut Roast, Leeks, Mixed Bean and Wild Mushrooms, Redcurrant Sauce & Gravy", vegan: true },
    { id: "v-m3", name: "Wild Mushroom Risotto, Fresh Basil & Spinach", vegan: true },
  ],
  desserts: [{ id: "v-d1", name: "Chocolate and Hazelnut Mousse, Cinder Toffee Raspberry Gel", vegan: true }],
};

const VENUE_MENUS: Record<
  string,
  { canapes: MenuItem[]; starters: MenuItem[]; mains: MenuItem[]; desserts: MenuItem[] }
> = {
  "Shotton Grange": {
    canapes: [
      { id: "sg-c1", name: "Goat’s Cheese & Spinach Arancini, Red Onion Marmalade Dip", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-c2", name: "Sun Dried Tomato & Basil Cream Cheese, Black Olive Crumb in a Savoury Cone", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-c3", name: "Trio of Northumberland Cheese Tart, Tomato Chutney", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-c4", name: "Minted Lamb Slider Burger, Brioche Bun, Tzatziki", vegetarian: false, vegan: false, glutenFree: false, supplementPrice: 1 },
      { id: "sg-c5", name: "Mini Cottage Pie, Aged Cheddar", vegetarian: false, vegan: false, glutenFree: false },
      { id: "sg-c6", name: "Chicken Satay, Sweet Chilli Dipping Sauce", vegetarian: false, vegan: false, glutenFree: true },
      { id: "sg-c7", name: "Open Choux Bun, Smoked Salmon Mousse, Keta", vegetarian: false, vegan: false, glutenFree: false, supplementPrice: 1 },
      { id: "sg-c8", name: "Mini Fish, Chip & Mushy Peas", vegetarian: false, vegan: false, glutenFree: false },
      { id: "sg-c9", name: "Panko King Prawn, Sweet Chilli dip", vegetarian: false, vegan: false, glutenFree: false, supplementPrice: 1 },
      { id: "sg-c10", name: "Chocolate Dipped Strawberries", vegetarian: true, vegan: true, glutenFree: true },
    ],
    starters: [
      { id: "sg-s1", name: "Classic Minestrone Soup, Saffron Aioli, Parmesan, Croutons", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-s2", name: "Garden Pea Soup, Braised Ham, Pea Shoots", vegetarian: false, vegan: false, glutenFree: true },
      { id: "sg-s3", name: "Chicken, Wild Mushroom Terrine, Pine Nuts, Pesto, Red Pepper Gel", vegetarian: false, vegan: false, glutenFree: true },
      { id: "sg-s4", name: "British Charcuterie, Suffolk Salami, Suffolk Chorizo, Dry Cured Great Glen Venison, Balsamic Onions, Cornichons, Sun Dried Tomatoes, Olives & Artisan Breads", vegetarian: false, vegan: false, glutenFree: false, supplementPrice: 3 },
      { id: "sg-s5", name: "Duck & Orange Parfait, Brioche, Fig & Sultana Chutney", vegetarian: false, vegan: false, glutenFree: false },
      { id: "sg-s6", name: "Smoked Chicken Caesar Salad, Gem Lettuce, Anchovies, Parmesan Shavings, Pancetta Crisp, Herb Croutes & Caesar Dressing", vegetarian: false, vegan: false, glutenFree: false },
      { id: "sg-s7", name: "Hot Smoked Salmon Cream Cheese Mousse, Cucumber Gel, Cucumber Pearls, Confit Cherry Tomatoes, Lemon Balm", vegetarian: false, vegan: false, glutenFree: true },
      { id: "sg-s8", name: "Asian Crab Cake, Asian Slaw, Baby Watercress, Prawn Toast, Soy Honey Dressing", vegetarian: false, vegan: false, glutenFree: false },
      { id: "sg-s9", name: "A Salad of Roasted Honey Figs, Pear & Creamy Blue Cheese, Sesame Dressing", vegetarian: true, vegan: false, glutenFree: true },
      { id: "sg-s10", name: "Sun Dried Tomato & Pesto Arancini, Roasted Red Pepper Pesto, Rocket & Parmesan", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-s11", name: "Coquilles St. Jacques, Scallops served in a creamy white wine sauce, Gruyere glazed mash potatoes", vegetarian: false, vegan: false, glutenFree: true, supplementPrice: 3 },
      { id: "sg-s12", name: "Peppered, balsamic glazed beef carpaccio, rocket salad, Parmesan shavings, truffle oil", vegetarian: false, vegan: false, glutenFree: true, supplementPrice: 3 },
    ],
    mains: [
      { id: "sg-m1", name: "Chicken Supreme, Black Pudding Spring Roll, Red Cabbage Puree, Fondant Potato, Whisky Jus", vegetarian: false, vegan: false, glutenFree: false },
      { id: "sg-m2", name: "Marinated Lamb Rump, Garlic Mash, Creamy Spinach, Mint Jelly Redcurrant Jus", vegetarian: false, vegan: false, glutenFree: true },
      { id: "sg-m3", name: "Braised Daube of Beef, Glazed Roasted Root Vegetables, White Onion Puree, Fondant Potato, Thyme Jus", vegetarian: false, vegan: false, glutenFree: true },
      { id: "sg-m4", name: "Breast of Duck, Celeriac & Sweet Potato Dauphinoise, Roasted Beets, Cranberry Jus", vegetarian: false, vegan: false, glutenFree: true, supplementPrice: 4 },
      { id: "sg-m5", name: "Baked Salmon, Tomato White Bean Cassoulet, High Peak, Saffron Crème Fraiche", vegetarian: false, vegan: false, glutenFree: true },
      { id: "sg-m6", name: "Seabass, Lemon Herb Crushed Potatoes, Cauliflower Puree, Samphire, Lobster Bisque", vegetarian: false, vegan: false, glutenFree: true },
      { id: "sg-m7", name: "Beetroot Risotto, Goats’ Cheese, Crispy Rocket", vegetarian: true, vegan: true, glutenFree: true },
      { id: "sg-m8", name: "Mediterranean Tart, Feta Cheese, Cherry Tomato Compote, Balsamic Glaze", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-m9", name: "Haunch of Venison, Truffle Mash, Spiced Carrot Puree, Glazed Parsnips, Wild Mushroom & Redcurrant Jus", vegetarian: false, vegan: false, glutenFree: true, supplementPrice: 5 },
      { id: "sg-m10", name: "The Roast, British Topside of Beef, Yorkshire Pudding, Roasted Root Vegetables & Fondant Potato, Red Wine Gravy", vegetarian: false, vegan: false, glutenFree: false },
      { id: "sg-m11", name: "The Roast, Oven Roasted Chicken Supreme, Yorkshire Pudding, Roasted Root Vegetables & Fondant Potato, Thyme Jus", vegetarian: false, vegan: false, glutenFree: false },
      { id: "sg-m12", name: "The Roast, Hamsterley Forest Loin of Pork, Yorkshire Pudding, Roasted Root Vegetables & Fondant Potato, Sage & Onion Stuffing, Rich Gravy", vegetarian: false, vegan: false, glutenFree: false },
      { id: "sg-m13", name: "The Roast, British Sirloin of Beef, Yorkshire Pudding, Roasted Root Vegetables & Fondant Potato, Red Wine Gravy", vegetarian: false, vegan: false, glutenFree: false, supplementPrice: 3 },
      { id: "sg-m14", name: "The Roast, British Leg of Lamb, Yorkshire Pudding, Roasted Root Vegetables & Fondant Potato, Rosemary & Mint Stuffing, Redcurrant Jus", vegetarian: false, vegan: false, glutenFree: false, supplementPrice: 3 },
    ],
    desserts: [
      { id: "sg-d1", name: "Sticky Toffee Pudding, Butterscotch Sauce, Vanilla Ice Cream", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-d2", name: "Glazed Lemon Tart, Raspberry & Sorrel Sorbet", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-d3", name: "Chocolate & Hazelnut Terrine, Praline, Hazelnut & Tonka Bean Ice Cream", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-d4", name: "Raspberry Cheesecake, Prosecco Jelly, Raspberry Gel", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-d5", name: "Apple Delice, Crème Anglaise, Cinnamon Crumble Ice Cream", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-d6", name: "Pear & Apricot Crumble, Vanilla Custard", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-d7", name: "Rhubarb Crème Brulee, Shortbread Biscuit, Rhubarb Compote", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-d8", name: "Apple & Pear Crumble, Vanilla Custard", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-d9", name: "Milk Chocolate Pavé, Caramel Cream, White Chocolate Anglaise", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-d10", name: "Brioche Bread & Butter Pudding, Creamy Vanilla Custard", vegetarian: true, vegan: false, glutenFree: false },
      { id: "sg-d11", name: "Platter of Chocolate, Dark Chocolate & Hazelnut Terrine, White Chocolate Panna Cotta, Milk Chocolate & Caramel Dome, Chocolate & Sea Salt Ice Cream", vegetarian: true, vegan: false, glutenFree: false, supplementPrice: 3 },
      { id: "sg-d12", name: "A Selection of Local & International Cheeses, Celery, Grapes, Chutney & Cheese Biscuits", vegetarian: true, vegan: false, glutenFree: false, supplementPrice: 3 },
    ],
  },

  "The Parlour at Blagdon": {
    canapes: [
      { id: "pb-c0", name: "Churros filled with Manchego Cheese", vegetarian: true, vegan: false, glutenFree: false },
      { id: "pb-c1", name: "Goat’s Cheese & Beetroot Bonbons", vegetarian: true, vegan: false, glutenFree: false },
      { id: "pb-c2", name: "Bruschetta with Tomato & Mozzarella", vegetarian: true, vegan: false, glutenFree: false },
      { id: "pb-c3", name: "Panko King Prawn, Sweet Chilli Dip", vegetarian: false, vegan: false, glutenFree: false, supplementPrice: 1 },
      { id: "pb-c4", name: "Mini Fish, Chip & Mushy Peas", vegetarian: false, vegan: false, glutenFree: false, supplementPrice: 1 },
      { id: "pb-c5", name: "Spicy Fishcakes, Sweet Chilli Dip", vegetarian: false, vegan: false, glutenFree: false },
      { id: "pb-c6", name: "Belly Pork Lollipops, Teriyaki & Sesame Seeds", vegetarian: false, vegan: false, glutenFree: true, supplementPrice: 1 },
      { id: "pb-c7", name: "Lamb Koftas, Mint Yoghurt Dip", vegetarian: false, vegan: false, glutenFree: false },
      { id: "pb-c8", name: "Mini Cottage Pies", vegetarian: false, vegan: false, glutenFree: false },
      { id: "pb-c9", name: "Chicken Satay with Sweet Chilli Dipping Sauce", vegetarian: false, vegan: false, glutenFree: true },
    ],
    starters: [
      { id: "pb-s1", name: "Roast Vine Tomato, Basil Oil Soup", vegetarian: true, vegan: true, glutenFree: true },
      { id: "pb-s2", name: "Curried Sweet Potato Soup, Parsnip Crisps, Micro Coriander", vegetarian: true, vegan: true, glutenFree: true },
      { id: "pb-s3", name: "Chicken Liver Parfait, Red Onion Marmalade, Toasted Brioche", vegetarian: false, vegan: false, glutenFree: false },
      { id: "pb-s4", name: "Italian Antipasti, Mozzarella Pearls, Sunblushed Tomatoes, Rosemary Focaccia", vegetarian: false, vegan: false, glutenFree: false, supplementPrice: 2 },
      { id: "pb-s5", name: "Ham Hock Terrine, Pease Pudding, Pickled Carrots, Brioche", vegetarian: false, vegan: false, glutenFree: false },
      { id: "pb-s6", name: "Chicken Satay, Asian Noodle Salad, Sesame Dressing", vegetarian: false, vegan: false, glutenFree: false },
      { id: "pb-s7", name: "Simple Smoked Salmon, Shallots, Capers, Lemon, Brown Bread", vegetarian: false, vegan: false, glutenFree: false, supplementPrice: 2 },
      { id: "pb-s8", name: "Goat’s Cheese Panna Cotta, Beetroot Textures, Chive Oil", vegetarian: true, vegan: false, glutenFree: true },
      { id: "pb-s9", name: "Brie & Spinach Tart, Pear & Endive Salad, Raisin & Honey Dressing", vegetarian: true, vegan: false, glutenFree: false },
      { id: "pb-s10", name: "Chicken Caesar Salad, Gem Lettuce, Anchovies, Parmesan Shavings, Herb Croutes & Caesar Dressing", vegetarian: false, vegan: false, glutenFree: false },
      { id: "pb-s11", name: "Greenland Prawn Cocktail, Marie Rose Sauce, Buttered Brown Bread", vegetarian: false, vegan: false, glutenFree: false },
      { id: "pb-s12", name: "Panko Coated Fishcake, Crisp Leaves, Lemon Herb Mayonnaise", vegetarian: false, vegan: false, glutenFree: false },
    ],
    mains: [
      { id: "pb-m1", name: "Breast of Chicken in Lemon, Garlic & Herb Marinade, Double Dauphinoise Potato, Peas with Pancetta, Wild Mushroom Tarragon Cream", vegetarian: false, vegan: false, glutenFree: true },
      { id: "pb-m2", name: "Rolled Blade of Beef, Garlic Mash Potato, Bourguignon Garnish, Red Wine Thyme Jus", vegetarian: false, vegan: false, glutenFree: true },
      { id: "pb-m3", name: "Slow Braised Shank of Lamb, Sweet Potato Mash, Creamed Spinach, Rosemary Redcurrant Jus", vegetarian: false, vegan: false, glutenFree: true },
      { id: "pb-m4", name: "Pan Fried Seabass, Herb Crushed New Potatoes, King Prawn, Chive Velouté", vegetarian: false, vegan: false, glutenFree: true },
      { id: "pb-m5", name: "Lemon & Herb Crusted Salmon Fillet, Crushed New Potatoes, Green Beans, White Wine Chive Cream", vegetarian: false, vegan: false, glutenFree: false },
      { id: "pb-m6", name: "Mediterranean Tart, Feta Cheese, Cherry Tomato Compote, Balsamic Glaze", vegetarian: true, vegan: false, glutenFree: false },
      { id: "pb-m7", name: "Cauliflower Cheese & Spinach Cannelloni, Mixed Seeds & Herb Gratin", vegetarian: true, vegan: false, glutenFree: false },
      { id: "pb-m8", name: "Rump of Lamb, Garlic & Herb Mash, Sticky Red Cabbage Rosemary Jus", vegetarian: false, vegan: false, glutenFree: true, supplementPrice: 5 },
      { id: "pb-m9", name: "Oven Roasted Monkfish, Creamy Thai Mussels, Bombay Potatoes, Coriander", vegetarian: false, vegan: false, glutenFree: true, supplementPrice: 5 },
      { id: "pb-m10", name: "The Roast: British Topside of Beef, Yorkshire Pudding, Roasted Root Vegetables & Fondant Potato, Red Wine Gravy", vegetarian: false, vegan: false, glutenFree: false },
      { id: "pb-m11", name: "The Roast: Oven Roasted Chicken Supreme, Yorkshire Pudding, Roasted Root Vegetables & Fondant Potato, Thyme Jus", vegetarian: false, vegan: false, glutenFree: false },
      { id: "pb-m12", name: "The Roast: Hamsterley Forest Loin of Pork, Yorkshire Pudding, Roasted Root Vegetables & Fondant Potato, Sage & Onion Stuffing, Pan Gravy", vegetarian: false, vegan: false, glutenFree: false },
      { id: "pb-m13", name: "The Roast: British Sirloin of Beef, Yorkshire Pudding, Roasted Root Vegetables & Fondant Potato, Red Wine Gravy", vegetarian: false, vegan: false, glutenFree: false, supplementPrice: 3 },
      { id: "pb-m14", name: "The Roast: British Leg of Lamb, Yorkshire Pudding, Roasted Root Vegetables & Fondant Potato, Rosemary & Mint Stuffing, Redcurrant Jus", vegetarian: false, vegan: false, glutenFree: false, supplementPrice: 3 },
    ],
    desserts: [
      { id: "pb-d1", name: "Sticky Toffee Pudding, Toffee Sauce, Ginger Caramel Ice Cream", vegetarian: true, vegan: false, glutenFree: false },
      { id: "pb-d2", name: "Passionfruit Cheesecake, Manager & Mint Salsa, Lime Syrup", vegetarian: true, vegan: false, glutenFree: false },
      { id: "pb-d3", name: "Lemon Meringue Pie, Lemon Puree, Raspberry Sorrel Sorbet, Dehydrated Raspberry", vegetarian: true, vegan: false, glutenFree: false },
      { id: "pb-d4", name: "Strawberry Delice, Strawberry Jelly, Poppy Seed Tuile", vegetarian: true, vegan: false, glutenFree: false },
      { id: "pb-d5", name: "Apple & Pear Crumble, Vanilla Custard", vegetarian: true, vegan: false, glutenFree: false },
      { id: "pb-d6", name: "Milk Chocolate Pavé, Caramel Cream, White Chocolate Anglaise", vegetarian: true, vegan: false, glutenFree: false },
      { id: "pb-d7", name: "Brioche Bread & Butter Pudding, Creamy Vanilla Custard", vegetarian: true, vegan: false, glutenFree: false },
      { id: "pb-d8", name: "A Selection of Local & International Cheeses, Celery, Grapes, Chutney & Cheese Biscuits", vegetarian: true, vegan: false, glutenFree: false, supplementPrice: 3 },
      { id: "pb-d9", name: "Platter of Chocolate: Dark Chocolate & Hazelnut Terrine, White Chocolate Panna Cotta, Milk Chocolate & Caramel Dome, Chocolate & Sea Salt Ice Cream", vegetarian: true, vegan: false, glutenFree: false, supplementPrice: 3 },
    ],
  },

  "Marshall Meadows Manor": {
    canapes: [
      { id: "mm-c1", name: "Smoked Salmon Blinis", vegetarian: false, vegan: false, glutenFree: false },
      { id: "mm-c2", name: "Truffle Mac & Cheese Bites", vegetarian: true, vegan: false, glutenFree: false },
    ],
    starters: [
      { id: "mm-s1", name: "Lobster Bisque", vegetarian: false, vegan: false, glutenFree: true, supplementPrice: 6 },
      { id: "mm-s2", name: "Beetroot & Goat's Cheese Salad", vegetarian: true, vegan: false, glutenFree: true },
      { id: "mm-s3", name: "Seared Scallops", vegetarian: false, vegan: false, glutenFree: true, supplementPrice: 4 },
    ],
    mains: [
      { id: "mm-m1", name: "Fillet of Beef Wellington", vegetarian: false, vegan: false, glutenFree: false, supplementPrice: 10 },
      { id: "mm-m2", name: "Herb Crusted Rack of Lamb", vegetarian: false, vegan: false, glutenFree: false, supplementPrice: 8 },
      { id: "mm-m3", name: "Wild Mushroom Gnocchi", vegetarian: true, vegan: false, glutenFree: false },
    ],
    desserts: [
      { id: "mm-d1", name: "Classic Crème Brûlée", vegetarian: true, vegan: false, glutenFree: true },
      { id: "mm-d2", name: "Artisan Cheese Selection", vegetarian: true, vegan: false, glutenFree: false, supplementPrice: 5 },
    ],
  },
};

type MenuSelections = {
  canapesSelectedIds: string[];
  startersSelectedIds: string[];
  mainsSelectedIds: string[];
  dessertsSelectedIds: string[];
  childrenStarterId: string | null;
  childrenMainId: string | null;
  childrenDessertId: string | null;
  eveningFoodId: string | null;
  selectedPizzaIds: string[];
  selectedStreetFoodIds: string[];
  selectedHogRoastSideIds: string[];
};

const clampToThree = (ids: string[]) => ids.slice(0, 3);

const BrideGroomPortal: React.FC<BrideGroomPortalProps> = ({
  onNavigate,
  wedding,
  onSave,
  isAdminAccess,
}) => {
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);

  if (!wedding) return null;

  const isLocked = Boolean(wedding.locked) && !isAdminAccess;

  const venueMenu = VENUE_MENUS[wedding.venue] || {
    canapes: [],
    starters: [],
    mains: [],
    desserts: [],
  };

  const [activeTab, setActiveTab] = useState<string>("Menu Options");

  const [hasCanapes, setHasCanapes] = useState<boolean>(wedding.hasCanapes ?? true);
  const [hasChildren, setHasChildren] = useState<boolean>(wedding.hasChildren ?? false);

  const [adminReason, setAdminReason] = useState<string>("");

  const [localGuests, setLocalGuests] = useState<Guest[]>(Array.isArray(wedding.guests) ? wedding.guests : []);

  const [menuSelections, setMenuSelections] = useState<MenuSelections>({
    canapesSelectedIds: clampToThree(wedding.menuSelections?.canapesSelectedIds || []),
    startersSelectedIds: clampToThree(wedding.menuSelections?.startersSelectedIds || []),
    mainsSelectedIds: clampToThree(wedding.menuSelections?.mainsSelectedIds || []),
    dessertsSelectedIds: clampToThree(wedding.menuSelections?.dessertsSelectedIds || []),
    childrenStarterId: wedding.menuSelections?.childrenStarterId || null,
    childrenMainId: wedding.menuSelections?.childrenMainId || null,
    childrenDessertId: wedding.menuSelections?.childrenDessertId || null,
    eveningFoodId: wedding.menuSelections?.eveningFoodId || null,
    selectedPizzaIds: clampToThree(wedding.menuSelections?.selectedPizzaIds || []),
    selectedStreetFoodIds: clampToThree(wedding.menuSelections?.selectedStreetFoodIds || []),
    selectedHogRoastSideIds: wedding.menuSelections?.selectedHogRoastSideIds || [],
  });

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasSignature, setHasSignature] = useState<boolean>(false);
  const [isConfirmApprovalOpen, setIsConfirmApprovalOpen] = useState<boolean>(false);

  const confirmedGuests = useMemo(
    () => localGuests.filter((g) => g.rsvpStatus === "Confirmed"),
    [localGuests]
  );

  const vegetarianGuestsCount = useMemo(
    () => localGuests.filter((g) => g.dietary?.vegetarian || g.dietary?.vegan).length,
    [localGuests]
  );

  const veganGuestsCount = useMemo(
    () => localGuests.filter((g) => g.dietary?.vegan).length,
    [localGuests]
  );

  const gfGuestsCount = useMemo(
    () => localGuests.filter((g) => g.dietary?.glutenFree).length,
    [localGuests]
  );

  const selectedItems = useMemo(() => {
    const startersItems = venueMenu.starters.filter((s) => menuSelections.startersSelectedIds.includes(s.id));
    const mainsItems = venueMenu.mains.filter((m) => menuSelections.mainsSelectedIds.includes(m.id));
    const dessertsItems = venueMenu.desserts.filter((d) => menuSelections.dessertsSelectedIds.includes(d.id));

    const totalSupplements =
      startersItems.reduce((acc, item) => acc + (item.supplementPrice || 0), 0) +
      mainsItems.reduce((acc, item) => acc + (item.supplementPrice || 0), 0) +
      dessertsItems.reduce((acc, item) => acc + (item.supplementPrice || 0), 0);

    return { startersItems, mainsItems, dessertsItems, totalSupplements };
  }, [menuSelections, venueMenu]);

  const getSelectedChildItemName = (course: "starter" | "main" | "dessert") => {
    const field =
      course === "starter"
        ? "childrenStarterId"
        : course === "main"
        ? "childrenMainId"
        : "childrenDessertId";

    const id = menuSelections[field];
    const list =
      course === "starter"
        ? CHILDRENS_MENU.starters
        : course === "main"
        ? CHILDRENS_MENU.mains
        : CHILDRENS_MENU.desserts;

    return list.find((m) => m.id === id)?.name || "Not set";
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isLocked) return;
    setIsDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isLocked) return;

    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();

    const x =
      "touches" in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y =
      "touches" in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#3A2F28";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    setHasSignature(true);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const toggleUpToThree = (current: string[], id: string, errorMsg: string) => {
    if (current.includes(id)) return current.filter((x) => x !== id);
    if (current.length >= 3) {
      alert(errorMsg);
      return current;
    }
    return [...current, id];
  };

  const handleToggleMenu = (course: "canapes" | "starters" | "mains" | "desserts" | "pizzas", id: string) => {
    if (isLocked) return;

    setMenuSelections((prev) => {
      if (course === "pizzas") {
        return {
          ...prev,
          selectedPizzaIds: toggleUpToThree(prev.selectedPizzaIds, id, "Please select exactly 3 pizza varieties."),
        };
      }

      const field =
        course === "canapes"
          ? "canapesSelectedIds"
          : course === "starters"
          ? "startersSelectedIds"
          : course === "mains"
          ? "mainsSelectedIds"
          : "dessertsSelectedIds";

      return {
        ...prev,
        [field]: toggleUpToThree(prev[field], id, "You can only select up to 3 options."),
      };
    });
  };

  const handleUpdateGuestField = (guestId: string, field: keyof Guest, value: any) => {
    if (isLocked) return;

    setLocalGuests((prev) =>
      prev.map((g) => {
        if (g.id !== guestId) return g;
        let updated: Guest = { ...g, [field]: value };

        if (field === "isChild" && value === true) {
          updated = {
            ...updated,
            starterChoice: getSelectedChildItemName("starter"),
            mealChoice: getSelectedChildItemName("main"),
            dessertChoice: getSelectedChildItemName("dessert"),
          };
        }

        return updated;
      })
    );
  };

  const handleUpdateGuestDietary = (guestId: string, field: keyof Guest["dietary"], value: any) => {
    if (isLocked) return;

    setLocalGuests((prev) =>
      prev.map((g) => {
        if (g.id !== guestId) return g;
        return {
          ...g,
          dietary: { ...(g.dietary || {}), [field]: value },
        };
      })
    );
  };

  const handleSaveAll = async (approve: boolean = false) => {
    if (!wedding) return;

    if (approve && wedding.locked && !isAdminAccess) return;

    if (wedding.locked && isAdminAccess && !adminReason.trim()) {
      alert("Please provide a reason for overriding this finalized booking.");
      return;
    }

    const audit: AuditEntry[] = Array.isArray(wedding.audit) ? [...wedding.audit] : [];

    if (wedding.locked && isAdminAccess) {
      audit.push({
        at: Date.now(),
        by: "Admin",
        reason: adminReason.trim(),
        changes: "Manual override after final submission",
      });
    }

    if (approve) {
      if (!hasSignature) {
        alert("Please provide a digital signature.");
        return;
      }
    }

    const updatedBooking: WeddingBooking = {
      ...wedding,
      guests: localGuests,
      menuSelections,
      locked: approve ? true : wedding.locked,
      status: approve ? "APPROVED" : wedding.status,
      approvedAt: approve ? Date.now() : wedding.approvedAt,
      approvedBy: approve ? "Couple" : wedding.approvedBy,
      audit,
      hasCanapes,
      hasChildren,
    };

    onSave(updatedBooking);

    if (approve) {
      try {
        const res = await approveBooking(updatedBooking.id, "Couple");
        if (!res || !res.ok) {
          alert("Approval failed.");
          return;
        }
        alert("Your final choices have been submitted.");
      } catch {
        alert("Approval failed.");
        return;
      }
    } else {
      alert("Wedding hub details updated.");
    }

    setAdminReason("");
  };

  const handleAdminUnlock = () => {
    if (!wedding) return;

    if (!window.confirm("Unlock this booking? Guests will be able to edit again.")) return;

    onSave({ ...wedding, locked: false, status: "active" });
    setHasSignature(false);
    setTimeout(() => clearSignature(), 50);
  };

  const renderCourseGrid = (course: "canapes" | "starters" | "mains" | "desserts") => {
    const selectedField =
      course === "canapes"
        ? "canapesSelectedIds"
        : course === "starters"
        ? "startersSelectedIds"
        : course === "mains"
        ? "mainsSelectedIds"
        : "dessertsSelectedIds";

    const list = venueMenu[course] || [];

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-light text-cocoa tracking-tight capitalize">{course}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {list.map((item) => {
            const isSelected = menuSelections[selectedField].includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleToggleMenu(course, item.id)}
                className={[
                  "p-8 rounded-[2rem] border-2 transition-all cursor-pointer",
                  isSelected ? "bg-primary/5 border-primary shadow-xl" : "bg-white border-primary/5",
                  isLocked ? "pointer-events-none opacity-80" : "",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-bold text-cocoa text-sm">{item.name}</h4>
                  {item.supplementPrice ? (
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                      +£{item.supplementPrice}
                    </span>
                  ) : null}
                </div>
                {item.desc ? <p className="text-xs text-secondary mt-2">{item.desc}</p> : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.glutenFree ? <span className="text-[9px] px-2 py-1 rounded-full bg-green-50 text-green-700">GF</span> : null}
                  {item.vegan ? <span className="text-[9px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">Vegan</span> : null}
                  {item.vegetarian ? <span className="text-[9px] px-2 py-1 rounded-full bg-lime-50 text-lime-700">Veg</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === "Wedding Details") {
      return (
        <div className="bg-white p-10 rounded-3xl shadow-soft border border-primary/10">
          <h2 className="text-2xl font-light text-cocoa mb-6">Ceremony & Reception</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Venue</p>
              <p className="text-xl font-medium text-cocoa">{wedding.venue}</p>
              <div className="h-px bg-primary/10 w-full"></div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Date</p>
              <p className="text-xl font-medium text-cocoa">{new Date(wedding.weddingDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "Guest List") {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-soft border border-primary/10 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-background-light">
                <tr className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                  <th className="px-8 py-4">Guest</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Choices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {localGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-primary/5">
                    <td className="px-8 py-5 text-sm font-medium">
                      {g.name} {g.isChild ? "(Child)" : ""}
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-bold uppercase">{g.rsvpStatus}</span>
                    </td>
                    <td className="px-8 py-5 text-xs text-secondary">{g.mealChoice || "No selection"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isAdminAccess ? (
            <div className="bg-white rounded-3xl shadow-soft border border-primary/10 p-8">
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">Admin quick edits</p>
              <div className="grid md:grid-cols-3 gap-4 text-xs text-secondary">
                <div>Vegan: {veganGuestsCount}</div>
                <div>Veg: {vegetarianGuestsCount}</div>
                <div>GF: {gfGuestsCount}</div>
              </div>
              <p className="text-xs text-secondary mt-4">
                Guest editing UI is not expanded here to keep this portal stable. Add your full editor back in if needed.
              </p>
            </div>
          ) : null}
        </div>
      );
    }

    if (activeTab === "Menu Options") {
      return (
        <div className="space-y-12 pb-24">
          <div className="bg-cocoa p-10 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl">
            <div className="flex gap-16">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase mb-2">Confirmed</p>
                <p className="text-4xl font-light font-display">{confirmedGuests.length}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary uppercase mb-2">Vegetarian</p>
                <p className="text-4xl font-light font-display">{vegetarianGuestsCount}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-taupe uppercase mb-2">Portal Status</p>
              <p className={["text-lg font-black", wedding.locked ? "text-green-400" : "text-primary"].join(" ")}>
                {wedding.locked ? "SUBMITTED" : "DRAFT"}
              </p>
            </div>
          </div>

          {hasCanapes ? renderCourseGrid("canapes") : null}
          {renderCourseGrid("starters")}
          {renderCourseGrid("mains")}
          {renderCourseGrid("desserts")}

          <div className="bg-white p-10 rounded-3xl shadow-soft border border-primary/10">
            <h3 className="text-2xl font-light text-cocoa mb-6">Evening food</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {EVENING_FOOD_OPTIONS.map((opt) => {
                const isSelected = menuSelections.eveningFoodId === opt.id;
                return (
                  <button
                    key={opt.id}
                    disabled={isLocked}
                    onClick={() =>
                      setMenuSelections((p) => ({
                        ...p,
                        eveningFoodId: p.eveningFoodId === opt.id ? null : opt.id,
                      }))
                    }
                    className={[
                      "text-left p-8 rounded-[2rem] border-2 transition-all",
                      isSelected ? "bg-primary/5 border-primary shadow-xl" : "bg-white border-primary/5",
                      isLocked ? "opacity-80 cursor-not-allowed" : "cursor-pointer",
                    ].join(" ")}
                  >
                    <h4 className="font-bold text-cocoa text-sm">{opt.name}</h4>
                    <p className="text-xs text-secondary mt-2">Tap to select</p>
                  </button>
                );
              })}
            </div>

            {menuSelections.eveningFoodId === "ef-1" ? (
              <div className="mt-10">
                <h4 className="text-lg font-light text-cocoa mb-4">Select 3 pizza varieties</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  {PIZZA_OPTIONS.map((p) => {
                    const isSelected = menuSelections.selectedPizzaIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        disabled={isLocked}
                        onClick={() => handleToggleMenu("pizzas", p.id)}
                        className={[
                          "text-left p-8 rounded-[2rem] border-2 transition-all",
                          isSelected ? "bg-primary/5 border-primary shadow-xl" : "bg-white border-primary/5",
                          isLocked ? "opacity-80 cursor-not-allowed" : "cursor-pointer",
                        ].join(" ")}
                      >
                        <h5 className="font-bold text-cocoa text-sm">{p.name}</h5>
                        <p className="text-xs text-secondary mt-2">{p.desc}</p>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-secondary mt-4">Selected: {menuSelections.selectedPizzaIds.length} of 3</p>
              </div>
            ) : null}

            {menuSelections.eveningFoodId === "ef-5" ? (
              <div className="mt-10">
                <h4 className="text-lg font-light text-cocoa mb-4">Select up to 3 street food options</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  {STREET_FOOD_OPTIONS.map((sf) => {
                    const isSelected = menuSelections.selectedStreetFoodIds.includes(sf.id);
                    return (
                      <button
                        key={sf.id}
                        disabled={isLocked}
                        onClick={() =>
                          setMenuSelections((p) => ({
                            ...p,
                            selectedStreetFoodIds: toggleUpToThree(p.selectedStreetFoodIds, sf.id, "You can only select up to 3 options."),
                          }))
                        }
                        className={[
                          "text-left p-8 rounded-[2rem] border-2 transition-all",
                          isSelected ? "bg-primary/5 border-primary shadow-xl" : "bg-white border-primary/5",
                          isLocked ? "opacity-80 cursor-not-allowed" : "cursor-pointer",
                        ].join(" ")}
                      >
                        <h5 className="font-bold text-cocoa text-sm">{sf.name}</h5>
                        <p className="text-xs text-secondary mt-2">{sf.desc}</p>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-secondary mt-4">Selected: {menuSelections.selectedStreetFoodIds.length} of 3</p>
              </div>
            ) : null}

            {menuSelections.eveningFoodId === "ef-4" ? (
              <div className="mt-10 bg-background-light p-8 rounded-2xl border border-primary/10">
                <h4 className="text-lg font-light text-cocoa mb-3">Hog roast</h4>
                <p className="text-xs text-secondary mb-4">Included</p>
                <ul className="text-xs text-secondary space-y-1">
                  {HOG_ROAST_INCLUDED.map((x) => (
                    <li key={x}>• {x}</li>
                  ))}
                </ul>

                <div className="mt-6">
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">Optional sides £3 each</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {HOG_ROAST_SIDES.map((s) => {
                      const isSelected = menuSelections.selectedHogRoastSideIds.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          disabled={isLocked}
                          onClick={() =>
                            setMenuSelections((p) => ({
                              ...p,
                              selectedHogRoastSideIds: isSelected
                                ? p.selectedHogRoastSideIds.filter((id) => id !== s.id)
                                : [...p.selectedHogRoastSideIds, s.id],
                            }))
                          }
                          className={[
                            "text-left p-4 rounded-xl border transition-all",
                            isSelected ? "bg-primary/5 border-primary" : "bg-white border-primary/10",
                            isLocked ? "opacity-80 cursor-not-allowed" : "cursor-pointer",
                          ].join(" ")}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-cocoa">{s.name}</span>
                            <span className="text-xs font-black text-primary">£{s.price}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {hasChildren ? (
            <div className="bg-white p-10 rounded-3xl shadow-soft border border-primary/10">
              <h3 className="text-2xl font-light text-cocoa mb-6">Children’s menu</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {(["starter", "main", "dessert"] as const).map((course) => {
                  const field =
                    course === "starter"
                      ? "childrenStarterId"
                      : course === "main"
                      ? "childrenMainId"
                      : "childrenDessertId";

                  const list =
                    course === "starter"
                      ? CHILDRENS_MENU.starters
                      : course === "main"
                      ? CHILDRENS_MENU.mains
                      : CHILDRENS_MENU.desserts;

                  return (
                    <div key={course} className="bg-background-light p-6 rounded-2xl border border-primary/10">
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">{course}</p>
                      <div className="space-y-2">
                        {list.map((item) => {
                          const isSelected = menuSelections[field] === item.id;
                          return (
                            <button
                              key={item.id}
                              disabled={isLocked}
                              onClick={() => setMenuSelections((p) => ({ ...p, [field]: item.id }))}
                              className={[
                                "w-full text-left px-4 py-3 rounded-xl border transition-all",
                                isSelected ? "bg-primary/10 border-primary" : "bg-white border-primary/10",
                                isLocked ? "opacity-80 cursor-not-allowed" : "cursor-pointer",
                              ].join(" ")}
                            >
                              <span className="text-sm font-medium text-cocoa">{item.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-secondary mt-6">
                When a guest is marked as a child, their choices auto-fill from this selection.
              </p>
            </div>
          ) : null}
        </div>
      );
    }

    if (activeTab === "Summary and Approval") {
      return (
        <div className="space-y-8 pb-12">
          {!wedding.locked ? (
            <div className="bg-white p-10 rounded-3xl shadow-soft border border-primary/10">
              <h2 className="text-3xl font-light text-cocoa mb-8 italic">Final Review & Sign-Off</h2>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">
                    Wedding Breakfast Selections
                  </p>

                  {(["starters", "mains", "desserts"] as const).map((course) => {
                    const ids =
                      course === "starters"
                        ? menuSelections.startersSelectedIds
                        : course === "mains"
                        ? menuSelections.mainsSelectedIds
                        : menuSelections.dessertsSelectedIds;

                    return (
                      <div key={course} className="mb-4">
                        <p className="text-[9px] font-bold text-taupe uppercase mb-2 italic">{course}</p>
                        <div className="space-y-1">
                          {ids.map((id) => (
                            <div key={id} className="text-sm text-cocoa font-medium">
                              {(venueMenu as any)[course].find((c: MenuItem) => c.id === id)?.name}
                            </div>
                          ))}
                          {!ids.length ? <div className="text-xs text-secondary">No selections</div> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-background-light p-8 rounded-2xl flex flex-col h-fit sticky top-4">
                  <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-6">
                    Venue Calculations
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Confirmed Guests</span>
                      <span className="font-bold">{confirmedGuests.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Supplements (pp)</span>
                      <span className="font-bold text-primary">£{selectedItems.totalSupplements.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-12 bg-ivory rounded-[3rem] border-2 border-dashed border-primary/40 text-center flex flex-col items-center">
                <h4 className="text-lg font-light text-cocoa mb-6">Digital Signature Confirmation</h4>

                <div className="relative group bg-white border border-primary/20 rounded-2xl shadow-inner mb-6">
                  <canvas
                    ref={signatureCanvasRef}
                    width={400}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={endDrawing}
                    className="cursor-crosshair block"
                  />
                  {!hasSignature ? (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 italic text-sm text-secondary">
                      Draw signature here...
                    </div>
                  ) : null}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => clearSignature()}
                    disabled={isLocked}
                    className={[
                      "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border",
                      isLocked ? "opacity-60 cursor-not-allowed" : "hover:bg-primary/5",
                    ].join(" ")}
                  >
                    Clear
                  </button>

                  <button
                    onClick={() => setIsConfirmApprovalOpen(true)}
                    disabled={!hasSignature}
                    className={[
                      "px-10 py-4 rounded-3xl transition-all shadow-2xl",
                      hasSignature ? "bg-deep-cocoa text-white hover:bg-black" : "bg-secondary/20 text-secondary cursor-not-allowed",
                    ].join(" ")}
                  >
                    <span className="text-sm font-black tracking-[0.2em] uppercase">Sign & Finalise Selections</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="bg-green-50 rounded-[3rem] p-12 border border-green-200 text-center shadow-inner">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl animate-pulse">
                  <span className="material-icons text-5xl">favorite</span>
                </div>
                <h3 className="text-3xl font-light text-cocoa mb-2 italic tracking-tight">Your final choices have been submitted.</h3>
                <p className="text-[10px] font-bold text-green-700 uppercase tracking-[0.3em] mb-4">Submission Lock Active</p>
                <p className="text-sm text-secondary italic mb-8">
                  Confirmed on {new Date(wedding.approvedAt || Date.now()).toLocaleString()}
                </p>

                {isAdminAccess ? (
                  <button
                    onClick={handleAdminUnlock}
                    className="block mx-auto mt-2 px-10 py-3 bg-cocoa text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-black transition-all shadow-lg"
                  >
                    Unlock Portal
                  </button>
                ) : null}
              </div>

              <div className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-primary/10 overflow-hidden">
                <div className="flex items-center gap-4 mb-10 border-b border-primary/10 pb-6">
                  <h4 className="text-2xl font-light text-cocoa italic">Whole Booking Summary</h4>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-10">
                    <section>
                      <h5 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-4 border-b border-primary/10 pb-2">
                        Logistics
                      </h5>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-taupe uppercase text-[9px] font-bold mr-2">Venue:</span>
                          {wedding.venue}
                        </p>
                        <p>
                          <span className="text-taupe uppercase text-[9px] font-bold mr-2">Date:</span>
                          {new Date(wedding.weddingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </section>

                    <section>
                      <h5 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-4 border-b border-primary/10 pb-2">
                        Guest Counts
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background-light p-4 rounded-2xl">
                          <p className="text-[9px] font-bold text-taupe uppercase">Total Guests</p>
                          <p className="text-2xl font-light">{confirmedGuests.length}</p>
                        </div>
                        <div className="bg-background-light p-4 rounded-2xl">
                          <p className="text-[9px] font-bold text-taupe uppercase">Vegan/Veg</p>
                          <p className="text-2xl font-light">{vegetarianGuestsCount}</p>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-10">
                    <section>
                      <h5 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-4 border-b border-primary/10 pb-2">
                        Shortlist
                      </h5>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[9px] font-bold text-taupe uppercase mb-2">Starters</p>
                          <ul className="text-xs">
                            {selectedItems.startersItems.map((s) => (
                              <li key={s.id}>• {s.name}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-taupe uppercase mb-2">Mains</p>
                          <ul className="text-xs">
                            {selectedItems.mainsItems.map((m) => (
                              <li key={m.id}>• {m.name}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-taupe uppercase mb-2">Desserts</p>
                          <ul className="text-xs">
                            {selectedItems.dessertsItems.map((d) => (
                              <li key={d.id}>• {d.name}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col font-work text-deep-cocoa">
      {isConfirmApprovalOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-cocoa/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-primary/20 w-full max-w-sm p-10 text-center animate-in fade-in zoom-in-95">
            <h3 className="text-2xl font-light text-cocoa mb-4 italic">Are you sure?</h3>
            <p className="text-sm text-secondary mb-8">
              Once confirmed, your menu selections and guest numbers will be locked. Only the venue team can override this.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  handleSaveAll(true);
                  setIsConfirmApprovalOpen(false);
                }}
                className="w-full bg-primary text-white font-bold py-4 rounded-2xl text-xs tracking-[0.2em] uppercase shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                YES, FINALISE SELECTIONS
              </button>
              <button
                onClick={() => setIsConfirmApprovalOpen(false)}
                className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-secondary"
              >
                NO, GO BACK
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {wedding.locked && isAdminAccess ? (
        <div className="bg-primary/20 border-b border-primary/40 px-12 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-icons text-primary">admin_panel_settings</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Admin Override Active. Reason required for changes
            </span>
          </div>
          <input
            type="text"
            value={adminReason}
            onChange={(e) => setAdminReason(e.target.value)}
            placeholder="Reason for modification..."
            className="bg-white/50 border-none rounded-lg text-xs py-1.5 px-4 w-96 focus:ring-1 focus:ring-primary"
          />
        </div>
      ) : null}

      <header className="h-24 bg-white border-b border-primary/10 flex items-center justify-between px-12 z-50 shrink-0 shadow-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate(isAdminAccess ? View.ADMIN_DASHBOARD : View.COUPLE_PORTAL)}
            className="p-2.5 hover:bg-primary/10 rounded-full text-primary transition-all active:scale-90"
          >
            <span className="material-icons">arrow_back</span>
          </button>
          <div className="border-l border-primary/20 pl-6 h-10 flex flex-col justify-center">
            <h1 className="text-xl font-black text-cocoa tracking-tight uppercase italic">Bride & Groom Hub</h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {!isLocked ? (
            <button
              onClick={() => handleSaveAll(false)}
              className="px-12 py-3 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:bg-primary-vibrant transition-all"
            >
              SAVE CHANGES
            </button>
          ) : null}

          {wedding.locked ? (
            <div className="flex items-center gap-2 px-6 py-2.5 bg-green-50 text-green-700 rounded-full border border-green-200">
              <span className="material-icons text-sm">lock</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Locked & Submitted</span>
            </div>
          ) : null}
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        <aside className="w-80 bg-white border-r border-primary/10 flex flex-col py-12 overflow-y-auto no-scrollbar shrink-0 shadow-sm">
          <div className="px-8 mb-12">
            <p className="text-[10px] font-black text-taupe uppercase tracking-[0.5em] mb-8 opacity-50">
              Planning Studio
            </p>
            <nav className="space-y-3">
              {["Wedding Details", "Guest List", "Menu Options", "Summary and Approval"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={[
                    "w-full text-left px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all relative",
                    activeTab === tab ? "bg-primary/10 text-primary shadow-sm" : "text-secondary hover:bg-primary/5",
                  ].join(" ")}
                >
                  {activeTab === tab ? (
                    <div className="absolute left-0 top-4 bottom-4 w-1 bg-primary rounded-r-full"></div>
                  ) : null}
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-16 no-scrollbar bg-background-light">
          <div className="max-w-5xl mx-auto pb-20">{renderTabContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default BrideGroomPortal;
