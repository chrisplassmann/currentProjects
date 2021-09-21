function wait(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function destroyPopup(popup) {
  popup.classList.remove('open');
  await wait(1000);
  // remove
  popup.remove();
  popup = null;
}

function ask(options) {
  return new Promise(async function (resolve) {
    // popup
    const popup = document.createElement('form');
    popup.classList.add('popup');
    popup.insertAdjacentHTML(
      'afterbegin',
      `
        <fieldset>
            <label>${options.title}</label>
            <input type="text" name="input"/>
            <button type="submit">Submit</button>
        </fieldset>
    `
    );

    console.log(popup);
    // cancel button
    if (options.cancel) {
      const skipButton = document.createElement('button');
      skipButton.type = 'button';
      skipButton.textContent = 'Cancel';
      popup.firstElementChild.appendChild(skipButton);
      // TODO : listen for click on cancel
      skipButton.addEventListener(
        'click',
        function () {
          resolve(null);
          destroyPopup(popup);
        },
        { once: true }
      );
    }
    // listen for submit events
    popup.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();
        console.log('submitted!');
        resolve(e.target.input.value);
        destroyPopup(popup);
      },
      { once: true }
    );
    // resolve input on submit

    // insert popup into the DOM
    document.body.appendChild(popup);
    // put a small timeout before open class
    await wait(50);
    popup.classList.add('open');
  });
}

// select all buttons with a question
async function askQuestion(e) {
  const button = e.currentTarget;
  const cancel = 'cancel' in button.dataset;

  const answer = await ask({
    title: button.dataset.question,
    cancel,
  });

  console.log(answer);
}

const buttons = document.querySelectorAll('[data-question]');
buttons.forEach((button) => button.addEventListener('click', askQuestion));

const questions = [
  { title: 'What is your name?' },
  { title: 'What is your age?', cancel: true },
  { title: 'What is your dogs name?' },
];

async function asyncMap(array, callback) {
  const results = [];
  for (const item of array) {
    const result = await callback(item);
    results.push(result);
  }
  return results;
}

async function go() {
  const answers = await asyncMap(questions, ask);
  console.log(answers);
}

go();

/* async function askMany() {
  for (const question of questions) {
    const answer = await ask(question);
    console.log(answer);
  }
}

askMany(); */

// Promise.all(questions.map(ask)).then((data) => {
//  console.log(data);
// });

// Promise.all([ask(questions[0]), ask(questions[1]), ask(questions[2])]).then(
//  (answers) => {
//    console.log(answers);
//  }
// );
