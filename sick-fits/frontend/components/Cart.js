import styled from 'styled-components';
import { useUser } from './User';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import Supreme from './styles/Supreme';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import { useCart } from '../lib/cartState';
import RemoveFromCart from './RemoveFromCart';
import Checkout from './Checkout';

const CartItemStyled = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--lightGrey);
  display: grid;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 1rem;
    width: 100px;
  }
  h3,
  p {
    margin: 0;
  }
`;

function CartItem({ item }) {
  const {
    product: { name, photo, price },
    quantity,
  } = item;

  return (
    <CartItemStyled>
      <img src={photo.image.publicUrlTransformed} alt="" />
      <div>
        <h3>{name}</h3>
        <p>
          {formatMoney(price * quantity)} -
          <em>
            {quantity} &times; {formatMoney(price)} each
          </em>
        </p>
      </div>
      <RemoveFromCart id={item.id} />
    </CartItemStyled>
  );
}

export default function Cart() {
  const user = useUser();
  const { cartOpen, closeCart } = useCart();

  if (!user) return null;

  return (
    <CartStyles open={cartOpen}>
      <header>
        <Supreme>{user.name}'s Cart</Supreme>
        <CloseButton onClick={closeCart}>X</CloseButton>
      </header>
      <ul>
        {user.cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calcTotalPrice(user.cart))}</p>
        <Checkout />
      </footer>
    </CartStyles>
  );
}
