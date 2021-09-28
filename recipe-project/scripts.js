// recipe API script
const baseEndpoint = 'https://api.spoonacular.com/recipes/';
// const accessKey = '241b2bb4983e4d86a384c68ae45c82cf';
const accessKey = '3862ad42ea3a482d99d254cd1001bc04';

const rSearch = 'complexSearch';
const rInfo = 'information';

const initQuery = 'pizza';

let items = [];

const list = document.querySelector('form.display');
const recipesSaved = document.querySelector('.display');

const form = document.querySelector('form.search');
const recipesGrid = document.querySelector('.recipes');
// var recipesAdd = document.getElementById('favoriteBut').click();

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX RECIPE FUNCTIONS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

async function fetchRecipes(query) {
    const res = await fetch(`${baseEndpoint}/${rSearch}?query=${query}&apiKey=${accessKey}`)
    const data = await res.json();
    return data;
  }
  
  async function handleSubmit(event) {
    console.log('submit click')
    event.preventDefault();
    const el = event.currentTarget;
    console.log(form.query.value);
    fetchAndDisplay(form.query.value);
  }

  async function handleSaved(event) {
    console.log('saved click')
  }

  async function fetchAndDisplay(query) {
    // turn the form off
    form.submit.disabled = true;
    // submit the search
    const recipes = await fetchRecipes(query);
    console.log(recipes);
    form.submit.disabled = false;
    displayRecipes(recipes.results);
  }
  
  function displayRecipes(recipes) {
    console.log('Creating HTML');
    const html = recipes.map(
      recipe => `<div class="recipe">
          ${recipe.image &&
          `<img src="${recipe.image}" alt="${recipe.title}" width="200"/>`}
          <h2>${recipe.title}</h2>
          <a href="${recipe.id}">View Recipe →</a>
          <button onclick="handleStorageSubmit(${recipe.title}, ${recipe.id})" class="favadd" name="favadd" type="submit">Add to favorites</button>
        </div>`
    );
    recipesGrid.innerHTML = html.join('');
  }

  
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX LOCAL STORAGE SAVE XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  
  async function handleStorageSubmit(name, Aid) {
    // e.preventDefault();
    console.log('submitted!!');
    console.log(name)
    console.log(Aid)
    // if its empty, then dont submit it
    if (!name) return;
    var itemId = parseInt(Aid, 10)
    console.log('new ID')
    console.log(itemId)
  
    const item = {
      name,
      id: itemId,
    };
    // Push the items into our state
    items.push(item);
    console.log(`There are now ${items.length} in your state`);
    // fire off a custom event that will tell anyone else who cares that the items have been updated!
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
  
function displayItems() {
    console.log('items');
    console.log(items);
    const html = items
      .map(
        (item) => `<li class="shopping-item">
        <span class="itemName">${item.name}</span>
        <button
          aria-label="Remove ${item.name}"
          value="${item.id}"
          
        >&times;
        </button aria-label="Remove">
    </li>`
      )
      .join('');
    list.innerHTML = html;
  }
  
  function mirrorToLocalStorage() {
    console.info('Saving items to localstorage');
    localStorage.setItem('items', JSON.stringify(items));
  }
  
  function restoreFromLocalStorage() {
    console.info('Restoring from LS');
    // pull the items from LS
    const lsItems = JSON.parse(localStorage.getItem('items'));
    if (lsItems.length) {
      // items = lsItems;
      // lsItems.forEach(item => items.push(item));
      // items.push(lsItems[0], lsItems[1]);
      items.push(...lsItems);
      list.dispatchEvent(new CustomEvent('itemsUpdated'));
    }
  }
  
  function deleteItem(id) {
    console.log('DELETIENG ITEM', id);
    // update our items array without this one
    items = items.filter((item) => item.id !== id);
    console.log(items);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
  
  // Event Delegation: We listen or the click on the list <ul> but then delegate the click over to the button if that is what was clicked
  /*
  list.addEventListener('click', function (e) {
    const id = parseInt(e.target.value);
    if (e.target.matches('button')) {
      deleteItem(id);
    }
    if (e.target.matches('input[type="checkbox"]')) {
      markAsComplete(id);
    }
  });
  */
 
 // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX run on page load XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX 
 // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 
  /*
  list.addEventListener('click', function (e) {
    console.log('click event is');
    console.log(e.target);
    const id = parseInt(e.target.value);
    if (e.target.matches('button')) {
      deleteItem(id);
    }

  });
  */
  
  fetchAndDisplay(initQuery);
  restoreFromLocalStorage();

  document.querySelector('.favadd').addEventListener('click', () => console.log('hello'));
  
 
  recipesSaved.addEventListener('submit', handleStorageSubmit);
  list.addEventListener('itemsUpdated', displayItems);
  list.addEventListener('itemsUpdated', mirrorToLocalStorage);
  
  form.addEventListener('submit', handleSubmit);
  // recipesAdd.addEventListener('submit', handleAddFav);
  
  