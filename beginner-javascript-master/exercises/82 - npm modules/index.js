// const wait = (amount = 0) =>
//  new Promise((resolve) => setTimeout(resolve, amount));
import wait from 'waait';
// import data from "./node_modules/waait" assert { type: "json" };

async function go() {
  console.log(wait);
  console.log('Going!');
  await wait(2000);
  console.log('Ending!');
}

go();
