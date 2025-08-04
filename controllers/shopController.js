// backend/controllers/shopController.js

// Здесь пока статичный массив товаров (можно сделать через БД, если потребуется)
const items = [
  {
    id: 1,
    name: "Soccer Ball",
    price: 20,
    image_url: "https://i.ebayimg.com/00/s/MTYwMFgxNjAw/z/OKEAAOSw0lJnCMhF/$_57.PNG?set_id=880000500F",
    description: "Ball for playing soccer",
  },
  {
    id: 2,
    name: "Sports Bag",
    price: 18,
    image_url: "https://images.66north.com/assets/74054.png?auto=format&fit=max&w=1920&q=50",
    description: "Convenient bag for workouts",
  },
  {
    id: 3,
    name: "Skateboard Stick",
    price: 12,
    image_url: "https://acdn-us.mitiendanube.com/stores/003/148/184/products/ini00141-ab83f3807edb93fe6a16951457804962-1024-1024.jpg",
    description: "Special stick for skateboards",
  },
  {
    id: 4,
    name: "Dumbbell Set",
    price: 25,
    image_url: "https://cdn.shopify.com/s/files/1/0574/1215/7598/t/16/assets/acf.Hex-DB---Studio---6-Edit.png?v=1699558969",
    description: "Set of dumbbells for workouts",
  },
  {
    id: 5,
    name: "Beach Ball",
    price: 10,
    image_url: "https://static.vecteezy.com/system/resources/thumbnails/023/886/946/small_2x/red-white-inflatable-beach-ball-or-volley-ball-for-summer-advertising-design-png.png",
    description: "Light ball for beach games",
  },
  {
    id: 6,
    name: "Training Backpack",
    price: 22,
    image_url: "https://i.ebayimg.com/images/g/bicAAOSwS7hmniRf/s-l1200.png",
    description: "Backpack for sports and everyday life",
  },
];

// Получить список товаров
exports.getShopItems = (req, res) => {
  res.json(items);
};

// Имитация покупки товара (реальной покупки нет, просто успешный ответ)
exports.purchaseItem = (req, res) => {
  const { itemId } = req.body;
  const item = items.find(i => i.id === itemId);

  if (!item) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }

  // Тут можно добавить запись о покупке в базу, если нужно
  res.json({ success: true, message: `You purchased "${item.name}" for ${item.price}$!` });
};
