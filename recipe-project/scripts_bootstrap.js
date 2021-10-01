// recipe API script
const baseEndpoint = 'https://api.spoonacular.com/recipes/';
const imageEndpoint = 'https://spoonacular.com/cdn/ingredients_100x100/'
// const accessKey = '241b2bb4983e4d86a384c68ae45c82cf';
// const accessKey = '3862ad42ea3a482d99d254cd1001bc04';
// const accessKey = 'f891b877aa554799b7903f072ce87e6c';
const accessKey = 'a086e9f611c54ed3a42dfb440d3cc2e0';

// API info
const rSearch = 'complexSearch';
const rInfo = 'information';
const initQuery = 'pizza';

// init items array
let items = [];

// top box
const list = document.getElementById('toprefresh');
const recipesSaved = document.getElementById('toplist');

// mid box
const hideIng = document.querySelector('#midsubmit');
const recipeTitle = document.getElementById('midname');
const recipeSpec = document.getElementById('miding');
const recipeInst = document.getElementById('midinst');

// bottom box
const form = document.getElementById('botsubmit');
const recipesGrid = document.getElementById('botrow');



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
    console.log(form);
    console.log(form.query.value);
    fetchAndDisplay(form.query.value);
  }



  async function fetchAndDisplay(query) {
    // turn the form off
    form.submit.disabled = true;
    // submit the search
    const recipes = await fetchRecipes(query);
    console.log(recipes);
    // turn the form on
    form.submit.disabled = false;
    displayRecipes(recipes.results);
  }



  function displayRecipes(recipes) {
    console.log('Creating HTML');

    // clears the items before repopulating
    recipesGrid.innerHTML = "";

    // count the number of items
    console.log('recipes.length')
    console.log(recipes)

    // displays each recipe
    recipes.forEach((recipe) => {

      // create the divItem
      const divItem = document.createElement("div")
      divItem.setAttribute("class", "col-lg-6")

      // create a second divItem
      const div2Item = document.createElement("div");
      div2Item.setAttribute("class", "card bg-dark shadow-sm")

      // create a header that holds the recipe name
      const h2Item = document.createElement("h2");
      h2Item.setAttribute("class", "text-white")
      h2Item.textContent = recipe.title

      // create an element in the recipe that holds the ID
      const anchorItem = document.createElement("a")
      anchorItem.setAttribute("href", recipe.id)
      
      // create a line break? xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      const lineBreak = document.createElement("br")

      // create a button to add the recipe to favorites
      const buttonItem = document.createElement("button")
      buttonItem.textContent = "Add to Favorites"
      buttonItem.setAttribute("class", "btn btn-warning")
      buttonItem.setAttribute("data-title", recipe.title)
      buttonItem.setAttribute("data-id", recipe.id)
      buttonItem.addEventListener("click", (e) => handleStorageSubmit(e.target.dataset.title, e.target.dataset.id))
      
      // create a button to view the recipe
      const button2Item = document.createElement("button")
      button2Item.textContent = "View"
      button2Item.setAttribute("class", "btn btn-info")
      button2Item.setAttribute("data-title", recipe.title)
      button2Item.setAttribute("data-id", recipe.id)
      button2Item.addEventListener("click", (e) => displaySpecific(e.target.dataset.id))
      
      div2Item.appendChild(lineBreak)
      div2Item.appendChild(h2Item)
      divItem.appendChild(div2Item)
      
      // check if image exists, then add it
      if(recipe.image){
        const imageItem = document.createElement("img")
        imageItem.setAttribute("src", recipe.image)
        imageItem.setAttribute("alt", recipe.title)
        imageItem.setAttribute("class", "img-fluid ")
        div2Item.appendChild(imageItem)
      }

      // add the recipe info to the text
      div2Item.appendChild(lineBreak)
      div2Item.appendChild(anchorItem)
      div2Item.appendChild(buttonItem)
      div2Item.appendChild(button2Item)
      
      // count the number of items
      console.log('this location')
      console.log(recipes.indexOf(recipe))

      // add all the info to the div
      divItem.appendChild(lineBreak)
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
    // get the information for the recipe we'll be viewing
    const recipeSpecific = await getSpecific(id) 
    console.log(recipeSpecific)

    // grab the ingredients, name, and image of the viewed recipe
    const recipeName = recipeSpecific.title
    const recipeImage = recipeSpecific.image
    const recipeIng = recipeSpecific.extendedIngredients
    console.log(recipeIng)

    // clear the div of all info first
    recipeTitle.innerHTML = "";
    recipeSpec.innerHTML = "";
    recipeInst.innerHTML = "";
    
    // create the recipe name
    const h2Item = document.createElement("h2");
    h2Item.textContent = recipeName

    // check if the image exists, then add it
    if(recipeImage){
      const imageItem = document.createElement("img")
      imageItem.setAttribute("src", recipeImage)
      imageItem.setAttribute("alt", recipeTitle)
      imageItem.setAttribute("width", "600")

      recipeTitle.appendChild(imageItem)
    }
    // add the recipe name after the image
    recipeTitle.appendChild(h2Item)
    
    // loop the ingredients into the middle area
    recipeIng.forEach((item) => {

      // create the divItem 
      const divItem = document.createElement("div")
      divItem.setAttribute("class", "col-sm-4")
      
      // create a line break? xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      const lineBreak = document.createElement("br")

      // create a second divItem
      const div2Item = document.createElement("div");
      div2Item.setAttribute("class", "card bg-light shadow-sm")

      // create a span that holds the ingredient name
      const spanItem = document.createElement("span")
      spanItem.setAttribute("class", "itemName")
      spanItem.textContent = item.original
      
      // check if the image exists, then add it
      if(item.image){
        const imageItem = document.createElement("img")
        imageItem.setAttribute("src", `${imageEndpoint}${item.image}`)
        imageItem.setAttribute("alt", item.name)
        imageItem.setAttribute("class", "mx-auto")
        imageItem.setAttribute("width", "180")
        imageItem.setAttribute("height", "200")

        div2Item.appendChild(imageItem)
      }
      // add the ingredient name
      div2Item.appendChild(spanItem)

      // add all the info to the div
      divItem.appendChild(div2Item)
      divItem.appendChild(lineBreak)
      recipeSpec.appendChild(divItem)
    })

    // add the instructions at the bottom
    const spanInstruct = document.createElement("span")
    spanInstruct.setAttribute("class", "recipeInstructions")
    spanInstruct.innerHTML = recipeSpecific.instructions

    recipeInst.appendChild(spanInstruct)
  }



  async function hideIngredients() {
    recipeSpec.innerHTML = "";
  }



  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX LOCAL STORAGE SAVE XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX



  function handleStorageSubmit(name, Aid) {
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

    // make an object with the properties name and ID
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

    // clears the items before repopulating
    recipesSaved.innerHTML = "";

    // displays each favorited item
    items.forEach((item) => {
      // create the divItem
      const divItem = document.createElement("div")
      divItem.setAttribute("class", "row-md-10")
      
      // create a second divItem
      const div2Item = document.createElement("div");
      div2Item.setAttribute("class", "bg-light")
      
      // create a span that holds the item name
      const spanItem = document.createElement("span")
      spanItem.setAttribute("class", "itemName")
      spanItem.textContent = item.name
      
      // create a span that puts a space between the view button and the text
      const spanItemS = document.createElement("span")
      spanItemS.setAttribute("class", "itemSName")
      spanItemS.textContent = " "
      
      // create a button to remove the item from favorites
      const buttonItem = document.createElement("button")
      buttonItem.textContent = "x"
      buttonItem.setAttribute("class", "btn btn-danger")
      buttonItem.setAttribute("data-name", item.name)
      buttonItem.setAttribute("data-id", item.id)
      buttonItem.addEventListener("click", (e) => deleteItem(item.id))
      
      // create a button to view the recipe for the item
      const button2Item = document.createElement("button")
      button2Item.textContent = "View"
      button2Item.setAttribute("class", "btn btn-info")
      button2Item.setAttribute("data-name", item.name)
      button2Item.setAttribute("data-id", item.id)
      button2Item.addEventListener("click", (e) => displaySpecific(item.id))
      
      // add both buttons
      div2Item.appendChild(buttonItem)
      div2Item.appendChild(button2Item)
      
      // check if image exists, then add it
      if(item.image){
        const imageItem = document.createElement("img")
        imageItem.setAttribute("src", item.image)
        imageItem.setAttribute("alt", item.name)
        imageItem.setAttribute("height", "50")

        div2Item.appendChild(imageItem)
      }
      // add the item name text
      div2Item.appendChild(spanItemS)
      div2Item.appendChild(spanItem)
      
      // add all the info to the div
      divItem.appendChild(div2Item)
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


  
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX run on page load XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  
  
  
  fetchAndDisplay(initQuery);
  restoreFromLocalStorage();
  
  recipesSaved.addEventListener('submit', handleStorageSubmit);
  list.addEventListener('itemsUpdated', displayItems);
  list.addEventListener('itemsUpdated', mirrorToLocalStorage);
  
  hideIng.addEventListener('submit', hideIngredients);
  form.addEventListener('submit', handleSubmit);
  // recipesAdd.addEventListener('submit', handleAddFav);
  
  
  
  
  
  
  
  
  
  
  
  
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