const endpoint = 'http://api.currencylayer.com/live';
// const accessKey = process.env.CURRENCY_API_KEY;
const accessKey = '07f474a70321150767f24b6e14e28019';

export async function fetchRates() {
  const res = fetch(`${endpoint}?access_key=${accessKey}`);
  const origin = await (await res).json();
  const { quotes } = origin;
  return quotes;
}

export async function convert(amount, from, to) {
  // first check if we have the rates to convert
  console.log(`We dont have ${from} to convert to ${to}. Getting it now.`);
  const quotes = await fetchRates();
  console.log(quotes);
  const fromTo = [from, to].join('');
  console.log(fromTo);
  const rate = quotes[fromTo];
  console.log(rate);
  console.log(Object.values(quotes));
  // store for next time

  const convertedAmount = rate * amount;
  console.log(`${amount} ${from} is ${convertedAmount} in ${to}`);
  return convertedAmount;
}
