import wait from './node_modules/waait';
// import data from "./node_modules/waait" assert { type: "json" };

async function go() {
  console.log('Going!');
  await wait(200);
  console.log('Ending!');
}

go();
