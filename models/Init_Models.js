const { User } = require('./User_model');
const { Product } = require('./Product_model');
const { ProductInCart } = require('./ProductInCart_model');
const { ProductImg } = require('./ProductImg_model');
const { Order } = require('./Order_model');
const { Category } = require('./Category_model');
const { Cart } = require('./Cart_model');

const initModels = () => {
  // 1 user ---------- m orders
  User.hasMany(Order, { foreignKey: 'userId' });
  Order.belongsTo(User);

  // 1 user ----------- M products
  User.hasMany(Product, { foreignKey: 'userId' });
  Product.belongsTo(User);

  // 1 product -------- M Product Imgs
  Product.hasMany(ProductImg, { foreignKey: 'productId' });
  ProductImg.belongsTo(Product);

  //1 cart ---------- M products in cart
  Cart.hasMany(ProductInCart, { foreignKey: 'cartId' });
  ProductInCart.belongsTo(Cart);

  //1 cart --------- 1 order
  Cart.hasOne(Order, { foreignKey: 'cartId' });
  Order.belongsTo(Cart);

  // 1 user --------- 1 cart
  User.hasOne(Cart, { foreignKey: 'userId' });
  Cart.belongsTo(User);

  // 1 product in cart --- m products
  ProductInCart.hasMany(Product, { foreignKey: 'productId' });
  Product.belongsTo(ProductInCart);

  // 1 category ------ 1 product
  Product.hasOne(Category, { foreignKey: 'categoryId' });
  Category.belongsTo(Product);
};

module.exports = { initModels };
