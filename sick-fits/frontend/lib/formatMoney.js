export default function formatMoney(amount = 0) {
  const option = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  };

  // check if its a clean dollar amount
  if (amount % 100 === 0) {
    option.minimumFractionDigits = 0;
  }

  const formatter = Intl.NumberFormat('en-US', option);

  return formatter.format(amount / 100);
}
