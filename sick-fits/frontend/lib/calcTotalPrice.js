export default function calcTotalPrice(cart) {
  return cart.reduce((tally, cartItem) => {
    if (!cartItem.product) return tally; // products can be deleted but they could be in the cart still
    return tally + cartItem.product.price * cartItem.quantity;
  }, 0);
}
