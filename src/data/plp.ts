export type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
  isNew?: boolean;
  colors: string[];
};

export const plpProducts: Product[] = [
  {
    id: 1,
    name: "Wool Jacket",
    price: "$120",
    image: "https://images.unsplash.com/photo-1520975922284-8b456906c813?w=800",
    isNew: true,
    colors: ["#000", "#666", "#aaa"],
  },
  {
    id: 2,
    name: "Minimal Hoodie",
    price: "$95",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
    colors: ["#111", "#444"],
  },
  {
    id: 3,
    name: "Tailored Pants",
    price: "$80",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800",
    colors: ["#000"],
  },
  {
    id: 4,
    name: "Puffer Jacket",
    price: "$180",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800",
    isNew: true,
    colors: ["#556b2f"],
  },
  {
    id: 5,
    name: "Checked Shirt",
    price: "$70",
    image: "https://images.unsplash.com/photo-1520975918318-2b0f1c8f8f70?w=800",
    colors: ["#333", "#777"],
  },
  {
    id: 6,
    name: "Slim Jeans",
    price: "$90",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800",
    colors: ["#1e40af"],
  },
];

export const categoryFilters = ["Jackets", "Hoodies", "Pants", "Shirts"];

export const colorFilters = [
  "#000",
  "#444",
  "#888",
  "#c00",
  "#0a7",
  "#1e40af",
  "#556b2f",
];

export const sizeFilters = ["XS", "S", "M", "L", "XL", "XXL"];
