// recipe API script
const baseEndpoint = 'https://api.spoonacular.com/recipes/';
// const accessKey = '241b2bb4983e4d86a384c68ae45c82cf';
// const accessKey = '3862ad42ea3a482d99d254cd1001bc04';
const accessKey = '19bce0a4f7e1c943f40b9af098b236360ea389d3';

const rSearch = 'complexSearch';
const rInfo = 'information';

const initQuery = 'pizza';

let items = [];

const recipesSaved = document.querySelector('.saved');
const list = document.querySelector('.display');

const recipeSpec = document.querySelector('.specific');

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

    recipes.forEach((recipe) => {
      const divItem = document.createElement("div")
      divItem.setAttribute("class", "recipe")

      const h2Item = document.createElement("h2");
      h2Item.textContent = recipe.title

      const anchorItem = document.createElement("a")
      anchorItem.setAttribute("href", recipe.id)

      const buttonItem = document.createElement("button")
      buttonItem.textContent = "Add to Favorites"
      buttonItem.setAttribute("data-title", recipe.title)
      buttonItem.setAttribute("data-id", recipe.id)
      buttonItem.addEventListener("click", (e) => handleStorageSubmit(e.target.dataset.title, e.target.dataset.id))

      if(recipe.image){
        const imageItem = document.createElement("img")
        imageItem.setAttribute("src", recipe.image)
        imageItem.setAttribute("alt", recipe.title)
        imageItem.setAttribute("width", "260")
        divItem.appendChild(imageItem)
      }

      divItem.appendChild(h2Item)
      divItem.appendChild(anchorItem)
      divItem.appendChild(buttonItem)

      recipesGrid.appendChild(divItem)
    })
  }

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX VIEW RECIPE SPECIFICS  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  async function getSpecific(id) {
    const res = await fetch(`${baseEndpoint}${id}/information?includeNutrition=false&apiKey=${accessKey}`)
    const data = await res.json();
    return data;

  }

  async function displaySpecific(id) {
    const recipeSpecific = await getSpecific(id) 
    console.log(recipeSpecific)
    const recipeIng = await recipeSpecific.extendedIngredients
    console.log(recipeIng)

    recipeSpec.innerHTML = "";

    recipeIng.forEach((item) => {

      const divItem = document.createElement("div")
      divItem.setAttribute("class", "recipes")

      const spanItem = document.createElement("span")
      spanItem.setAttribute("class", "itemName")
      spanItem.textContent = item.name

      if(item.image){
        const imageItem = document.createElement("img")
        imageItem.setAttribute("src", recipe.image)
        imageItem.setAttribute("alt", recipe.title)
        imageItem.setAttribute("width", "100")
        divItem.appendChild(imageItem)
      }




      divItem.appendChild(spanItem)


      recipeSpec.appendChild(divItem)
    })
  }


  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX LOCAL STORAGE SAVE XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  async function handleStorageSubmit(name, Aid) {
    // e.preventDefault();
    console.log(items.some(e => e.name === name))
    // if its empty, then dont submit it
    if (!name) return;
    // if it matches then don't submit it
    if (items.some(e => e.name === name)) return;
    console.log('submitted!!');
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
    recipesSaved.innerHTML = "";

    /*
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
    */

    items.forEach((item) => {

      const divItem = document.createElement("div")
      divItem.setAttribute("class", "item")

      const spanItem = document.createElement("span")
      spanItem.setAttribute("class", "itemName")
      spanItem.textContent = item.name
      
      const spanItemS = document.createElement("span")
      spanItemS.setAttribute("class", "itemSName")
      spanItemS.textContent = " "

      const buttonItem = document.createElement("button")
      buttonItem.textContent = "x"
      buttonItem.setAttribute("class", "closebutton")
      buttonItem.setAttribute("data-name", item.name)
      buttonItem.setAttribute("data-id", item.id)
      buttonItem.addEventListener("click", (e) => deleteItem(item.id))

      const button2Item = document.createElement("button")
      button2Item.textContent = "View"
      button2Item.setAttribute("class", "viewbutton")
      button2Item.setAttribute("data-name", item.name)
      button2Item.setAttribute("data-id", item.id)
      button2Item.addEventListener("click", (e) => displaySpecific(item.id))

      divItem.appendChild(buttonItem)
      divItem.appendChild(button2Item)

      if(item.image){
        const imageItem = document.createElement("img")
        imageItem.setAttribute("src", item.image)
        imageItem.setAttribute("alt", item.name)
        imageItem.setAttribute("height", "50")
        divItem.appendChild(imageItem)
      }

      divItem.appendChild(spanItemS)
      divItem.appendChild(spanItem)

      recipesSaved.appendChild(divItem)
    })
  }

  function mirrorToLocalStorage() {
    console.info('------- Saving items to localstorage -------');
    localStorage.setItem('items', JSON.stringify(items));
  }

  function restoreFromLocalStorage() {
    console.info('Restoring from LS');
    // pull the items from LS
    const lsItems = JSON.parse(localStorage.getItem('items')) || [];
    if (lsItems.length) {
      // items = lsItems;
      // lsItems.forEach(item => items.push(item));
      // items.push(lsItems[0], lsItems[1]);
      items.push(...lsItems);
      list.dispatchEvent(new CustomEvent('itemsUpdated'));
      displayItems();
    }
  }

  function deleteItem(id) {
    console.log('DELETING ITEM', id);
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

 

  fetchAndDisplay(initQuery);
  restoreFromLocalStorage();


  recipesSaved.addEventListener('submit', handleStorageSubmit);
  list.addEventListener('itemsUpdated', displayItems);
  list.addEventListener('itemsUpdated', mirrorToLocalStorage);

  form.addEventListener('submit', handleSubmit);
  // recipesAdd.addEventListener('submit', handleAddFav);
















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
  
    // const html = recipes.map(
    //   recipe => `
    //     <div class="recipe">
    //       ${recipe.image &&
    //       `<img src="${recipe.image}" alt="${recipe.title}" width="200"/>`}
    //       <h2>${recipe.title}</h2>
    //       <a href="${recipe.id}">View Recipe →</a>
    //       <button onclick="handleStorageSubmit(${recipe.title}, ${recipe.id})" class="favadd" name="favadd" type="submit">Add to favorites</button>
    //     </div>`
    // );
    // recipesGrid.innerHTML = html.join('');