document.addEventListener("DOMContentLoaded", function() {
    let recipes = [];
  
    // Fetch recipes from JSON
    fetch('recipes.json')
      .then(response => response.json())
      .then(data => {
        recipes = data;
        console.log(recipes)
        // Initially display all recipes and all ingredients
        displayRecipes(recipes);
        displayIngredients(recipes);
        displayUstensils(recipes);
        displayAppliances(recipes);
      })
      .catch(error => console.error('Error loading recipes', error));
  
    const searchField = document.getElementById("BannerSearchField");
  
    // Handle search input
    searchField.addEventListener("input", function() {
      const searchValue = this.value.trim();
  
      // If the input field is empty, display all recipes
      if (searchValue.length === 0) {
        displayRecipes(recipes);
        displayIngredients(recipes);
        displayUstensils(recipes);
        displayAppliances(recipes);
      }
      // If there are at least 3 characters, search and display matching recipes
      else if (searchValue.length >= 3) {
        const results = searchRecipesByKeyword(recipes, searchValue);
        console.log("test resulte avec valeur du champs" ,results)
        // If some recipes match, display them; otherwise, show a "no results" message.
        if (results.length > 0) {
          displayRecipes(results);
          displayIngredients(results);
          displayUstensils(results);
          displayAppliances(results);
        } else {
          document.getElementById("cards").innerHTML = "<p>No recipes found.</p>";
          // Optionally, you can clear the ingredients list as well:
          document.getElementById("ingredients-list").innerHTML = "";
        }
      }
      // (Optional) If you want to treat inputs with 1 or 2 characters as "no search", then:
      else {
        displayRecipes(recipes);
        displayIngredients(recipes);
        displayUstensils(recipes);
        displayAppliances(recipes);
      }
    });
  });
  
  /**
   * Filters recipes based on the search keyword.
   * Make sure the function returns the filtered array.
   */
  function searchRecipesByKeyword(recipes, searchValue) {
    const keywordLower = searchValue.toLowerCase();
    let results = [];
  
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      console.log("test recipe",recipe)
      let found = false;
  
      // Check in recipe name
      if (recipe.name.toLowerCase().indexOf(keywordLower) !== -1) {
        found = true;
      }
      // Check in recipe description
      if (!found && recipe.description.toLowerCase().indexOf(keywordLower) !== -1) {
        found = true;
      }
      // Check in recipe ingredients
      if (!found) {
        for (let j = 0; j < recipe.ingredients.length; j++) {
          const ingredientName = recipe.ingredients[j].ingredient;
          if (ingredientName.toLowerCase().indexOf(keywordLower) !== -1) {
            found = true;
            break;
          }
        }
      }
      // Check in appliance
      if (!found && recipe.appliance.toLowerCase().indexOf(keywordLower) !== -1) {
        found = true;
      }
      // Check in ustensils
      if (!found) {
        for (let k = 0; k < recipe.ustensils.length; k++) {
          if (recipe.ustensils[k].toLowerCase().indexOf(keywordLower) !== -1) {
            found = true;
            break;
          }
        }
      }
      // If a match is found, add the recipe to the results array
      if (found) {
        results.push(recipe);
      }
    }
  
    return results; // Return the filtered recipes
  }
  
  /**
   * Displays the given recipes in the <div id="cards">.
   */
  function displayRecipes(recipes) {
    const container = document.getElementById('cards');
    container.innerHTML = ''; // Clear previous content
  
    recipes.forEach(recipe => {
      const cardRecipe = document.createElement('div');
      cardRecipe.className = 'recipes-cards';

      const cardRecipeTimeImg = document.createElement('div');
      cardRecipeTimeImg.className = 'recipe-time-img';
      cardRecipe.appendChild(cardRecipeTimeImg);

      const cookingTime = document.createElement('div');
      cookingTime.className = 'cooking-time';
      cookingTime.textContent = `${recipe.time} min`;
      cardRecipeTimeImg.appendChild(cookingTime);
  
      const cardImage = document.createElement('img');
      cardImage.className = 'recipe-img';
      cardImage.src = `assests/${recipe.image}`;
      cardRecipeTimeImg.appendChild(cardImage);
  
      const title = document.createElement('h2');
      title.className = 'card-title';
      title.textContent = recipe.name;
      cardRecipe.appendChild(title);
  
      const recipeSubtitle = document.createElement('p');
      recipeSubtitle.className = 'recipe-subtitle';
      recipeSubtitle.textContent = "RECETTE";
      cardRecipe.appendChild(recipeSubtitle);
  
      const recipeTxt = document.createElement('div');
      recipeTxt.className = 'recipe-text';
      recipeTxt.textContent = recipe.description;
      cardRecipe.appendChild(recipeTxt);
  
      const recipeSubtitleIngredient = document.createElement('p');
      recipeSubtitleIngredient.className = 'recipe-subtitle-ingredient';
      recipeSubtitleIngredient.textContent = "INGRÉDIENTS";
      cardRecipe.appendChild(recipeSubtitleIngredient);
  
      const allIngredientsDiv = document.createElement('div');
      allIngredientsDiv.className = 'all-ingredients';
  
      recipe.ingredients.forEach(ingredient => {
        const ingredientContainerDiv = document.createElement('div');
        ingredientContainerDiv.className = 'ingredient-container-div';
  
        const ingredientNameDiv = document.createElement('div');
        ingredientNameDiv.className = 'ingredient-name-div';
        const ingredientName = document.createElement('p');
        ingredientName.className = 'ingredient-name';
        ingredientName.textContent = ingredient.ingredient;
        ingredientNameDiv.appendChild(ingredientName);
  
        const ingredientInfoDiv = document.createElement('div');
        ingredientInfoDiv.className = 'ingredient-info-div';
        const ingredientInfo = document.createElement('p');
        ingredientInfo.className = 'ingredient-info';
  
        let ingredientText = "";
        if (ingredient.quantity) ingredientText += `${ingredient.quantity}`;
        if (ingredient.unit) ingredientText += ` ${ingredient.unit}`;
        ingredientInfo.textContent = ingredientText;
  
        ingredientInfoDiv.appendChild(ingredientInfo);
  
        ingredientContainerDiv.appendChild(ingredientNameDiv);
        ingredientContainerDiv.appendChild(ingredientInfoDiv);
        allIngredientsDiv.appendChild(ingredientContainerDiv);
      });
  
      cardRecipe.appendChild(allIngredientsDiv);
      container.appendChild(cardRecipe);
    });
  }
  /**
   * Displays a list of ingredients extracted from the given recipes.
   */
  function displayIngredients(recipes) {
    const allIngredients = [];
  
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        if (!allIngredients.includes(ingredient.ingredient)) {
          allIngredients.push(ingredient.ingredient);
        }
      });
    });
  
    const list = document.getElementById('ingredients-list');
    list.innerHTML = ''; // Clear previous list
  
    allIngredients.forEach(ingredient => {
      const ingredientItem = document.createElement('li');
      ingredientItem.className = 'ingredient-item';
      ingredientItem.textContent = ingredient;
      list.appendChild(ingredientItem);
    });
  }

  function displayAppliances(recipes) {
    const allAppliances = [];
  
    recipes.forEach(recipe => {
      // recipe.appliance is a string; add it directly if not already in the array
      if (!allAppliances.includes(recipe.appliance)) {
        allAppliances.push(recipe.appliance);
      }
    });
  
    const list = document.getElementById('appliances-list');
    list.innerHTML = ''; // Clear previous list
  
    allAppliances.forEach(appliance => {
      const applianceItem = document.createElement('li');
      applianceItem.className = 'appliance-item';
      applianceItem.textContent = appliance;
      list.appendChild(applianceItem);
    });
  }
  
  
   
  function displayUstensils(recipes) {
    const allUstensils = [];
  
    recipes.forEach(recipe => {
      console.log (recipe.ustensils)
      recipe.ustensils.forEach(ustensil => {
        if (!allUstensils.includes(ustensil)) {
          allUstensils.push(ustensil);
        }
      });
    });
  
    const list = document.getElementById('ustensiles-list');
    list.innerHTML = ''; // Clear previous list
  
    allUstensils.forEach(ustensil => {
      const ustensilItem = document.createElement('li');
      ustensilItem.className = 'ustensile-item';
      ustensilItem.textContent = ustensil;
      console.log("test ustensil:", ustensil)

      console.log(ustensilItem)
      list.appendChild(ustensilItem);
    });
  }
  
 