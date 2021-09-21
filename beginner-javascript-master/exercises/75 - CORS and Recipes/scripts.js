const baseEndpoint = 'http://www.recipepuppy.com/api';
// const proxy = `https://cors-anywhere.herokuapp.com/`;
const proxy = `https://cors.bridged.cc/`;
const form = document.querySelector('form.search');
// ?

//
async function fetchRecipes(query) {
  const res = await fetch(`${proxy}${baseEndpoint}?q=${query}`);
  const data = await res.json();
  return data;
}

async function handleSubmit(event) {
  event.preventDefault();
  const el = event.currentTarget;
  console.log(form.query.value);
  el.submit.disabled = true;

  const recipes = await fetchRecipes(el.query.value);

  console.log(recipes);
  el.submit.disabled = false;
  displayRecipes(recipes.results);
}

function displayRecipes(recipes) {
  console.log('creating HTML');
  const html = recipes.map(
    (recipe) => `<div>
      <h2>${recipe.title}</h2>
      <p>${recipe.ingredients}</p>
      ${
        recipe.thumbnail &&
        `<img src="${recipe.thumbnail}" alt="${recipe.title}">`
      }
      <a href="${recipe.href}">View Recipe -></a>
      </div>`
  );
}

form.addEventListener('submit', handleSubmit);
fetchRecipes('pizza');
