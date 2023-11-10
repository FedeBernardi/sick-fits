import { Elements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';
import SickButton from './styles/SickButton';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default function Checkout() {
  const handleSubmit = (e) => {
    // 1. turn on loader
    e.preventDefault();

    // 2. start page transition
    // 3. create payment method via stripe (token comes back here is successful)
    // 4. handle any errors from stripe
    // 5. send the token to our server using a custom mutation
    // 6. change the page to view the order
    // 7. close cart
    // 8. turn the loader off
  };

  return (
    <Elements stripe={stripeLib}>
      <CheckoutFormStyles onSubmit={handleSubmit}>
        <CardElement />
        <SickButton>Check Out Now</SickButton>
      </CheckoutFormStyles>
    </Elements>
  );
}
