import wait from 'waait';

async function go() {
  console.log('Going!');
  await wait(200);
  console.log('Ending!');
}

go();
