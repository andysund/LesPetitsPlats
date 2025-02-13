document.addEventListener("DOMContentLoaded", function() {
  let recipes = [];

  // --- Chargement des recettes depuis le JSON ---
  fetch('recipes.json')
    .then(response => response.json())
    .then(data => {
      recipes = data;
      console.log("Recettes chargées :", recipes);

      // Affichage initial des recettes et des listes
      displayRecipes(recipes);
      displayIngredients(recipes);
      displayUstensils(recipes);
      displayAppliances(recipes);

      // Attacher les écouteurs pour les dropdowns (après chargement)
      attachDropdownEventListeners();
    })
    .catch(error => console.error("Erreur lors du chargement des recettes:", error));

  // --- Recherche principale (BannerSearchField) ---
  const bannerSearchField = document.getElementById("BannerSearchField");
  bannerSearchField.addEventListener("input", function() {
    const searchValue = this.value.trim();
    console.log("Recherche principale :", searchValue);

    if (searchValue.length === 0) {
      displayRecipes(recipes);
      displayIngredients(recipes);
      displayUstensils(recipes);
      displayAppliances(recipes);
    } else if (searchValue.length >= 3) {
      const results = searchRecipesByKeyword(recipes, searchValue);
      console.log("Résultats pour la recherche principale :", results);
      if (results.length > 0) {
        displayRecipes(results);
        displayIngredients(results);
        displayUstensils(results);
        displayAppliances(results);
      } else {
        document.getElementById("cards").innerHTML = "<p>No recipes found.</p>";
        document.getElementById("ingredients-list").innerHTML = "";
      }
    } else {
      displayRecipes(recipes);
      displayIngredients(recipes);
      displayUstensils(recipes);
      displayAppliances(recipes);
    }
  });

  // --- Fonction pour attacher les écouteurs des dropdowns ---
  function attachDropdownEventListeners() {
    // Dropdown Ingredients
    const ingredientSearchField = document.getElementById("ingredientSearchField");
    ingredientSearchField.addEventListener("input", function() {
      const searchValue = this.value.trim().toLowerCase();
      console.log("Recherche ingrédients :", searchValue);

      // Création d'une map associant chaque ingrédient aux recettes correspondantes
      let ingredientMap = {};
      recipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => {
          const ingredientName = ing.ingredient;
          if (!ingredientMap[ingredientName]) {
            ingredientMap[ingredientName] = [];
          }
          ingredientMap[ingredientName].push(recipe);
        });
      });
      console.log("Mapping ingrédients -> recettes :", ingredientMap);

      // On récupère la liste des ingrédients (les clés de la map)
      const allIngredients = Object.keys(ingredientMap);
      // Si l'utilisateur tape au moins 3 lettres, on filtre, sinon on affiche tous les ingrédients
      const filteredIngredients = (searchValue.length >= 3)
        ? allIngredients.filter(ingredient => ingredient.toLowerCase().includes(searchValue))
        : allIngredients;

       const ingredientsWithRecipes= filteredIngredients.map(ing => ({
          ingredient: ing,
          recipes: ingredientMap[ing]
        }));
  
      console.log("Ingrédients filtrés :", filteredIngredients.map(ing => ({
        ingredient: ing,
        recipes: ingredientMap[ing]
      })));



      updateDropdownList("ingredients-list", filteredIngredients, "ingredient-item");

      // Met à jour l'affichage des recettes selon les tags sélectionnés


       let combinedRecipes = [];
  ingredientsWithRecipes.forEach(item => {
    item.recipes.forEach(recipe => {
      if (!combinedRecipes.some(r => r.id === recipe.id)) {
        combinedRecipes.push(recipe);
      }
    });
  });

  // 5) Affichage des recettes finales
  displayRecipes(combinedRecipes);
});
   // Dropdown Appareils
const appliancesSearchField = document.getElementById("appliancesSearchField");
appliancesSearchField.addEventListener("input", function() {
  const searchValue = this.value.trim().toLowerCase();
  console.log("Recherche appareils :", searchValue);

  // 1) Créer la map { appareil -> [recettes] }
  let applianceMap = {};
  recipes.forEach(recipe => {
    const applianceName = recipe.appliance;
    if (!applianceMap[applianceName]) {
      applianceMap[applianceName] = [];
    }
    applianceMap[applianceName].push(recipe);
  });

  console.log("Mapping appareils -> recettes :", applianceMap);

  // 2) Récupérer la liste des appareils (clés de la map)
  const allAppliances = Object.keys(applianceMap);

  // 3) Filtrer selon l'input utilisateur (>=3 caractères)
  const filteredAppliances = (searchValue.length >= 3)
    ? allAppliances.filter(appliance => appliance.toLowerCase().includes(searchValue))
    : allAppliances;

  // 4) Créer un tableau d'objets { appliance, recipes }
  const appliancesWithRecipes = filteredAppliances.map(app => ({
    appliance: app,
    recipes: applianceMap[app]
  }));

  console.log("Appareils filtrés :", appliancesWithRecipes);

  // 5) Fusionner toutes les recettes correspondantes et supprimer les doublons
  let combinedRecipes = [];
  appliancesWithRecipes.forEach(item => {
    item.recipes.forEach(recipe => {
      if (!combinedRecipes.some(r => r.id === recipe.id)) {
        combinedRecipes.push(recipe);
      }
    });
  });

  // 6) Mettre à jour la liste du dropdown et afficher les recettes fusionnées
  updateDropdownList("appliances-list", filteredAppliances, "appliance-item");
  displayRecipes(combinedRecipes);
});


    // Dropdown Ustensiles
const ustensilesSearchField = document.getElementById("ustensilesSearchField");
ustensilesSearchField.addEventListener("input", function() {
  const searchValue = this.value.trim().toLowerCase();
  console.log("Recherche ustensiles :", searchValue);

  // 1) Créer la map { ustensil -> [recettes] }
  let ustensilMap = {};
  recipes.forEach(recipe => {
    recipe.ustensils.forEach(u => {
      if (!ustensilMap[u]) {
        ustensilMap[u] = [];
      }
      ustensilMap[u].push(recipe);
    });
  });

  console.log("Mapping ustensiles -> recettes :", ustensilMap);

  // 2) Récupérer la liste des ustensiles (clés de la map)
  const allUstensils = Object.keys(ustensilMap);

  // 3) Filtrer selon l'input utilisateur (>=3 caractères)
  const filteredUstensils = (searchValue.length >= 3)
    ? allUstensils.filter(ustensil => ustensil.toLowerCase().includes(searchValue))
    : allUstensils;

  // 4) Créer un tableau d'objets { ustensil, recipes }
  const ustensilsWithRecipes = filteredUstensils.map(ust => ({
    ustensil: ust,
    recipes: ustensilMap[ust]
  }));

  console.log("Ustensiles filtrés :", ustensilsWithRecipes);

  // 5) Fusionner toutes les recettes correspondantes et supprimer les doublons
  let combinedRecipes = [];
  ustensilsWithRecipes.forEach(item => {
    item.recipes.forEach(recipe => {
      if (!combinedRecipes.some(r => r.id === recipe.id)) {
        combinedRecipes.push(recipe);
      }
    });
  });

  // 6) Mettre à jour la liste du dropdown et afficher les recettes fusionnées
  updateDropdownList("ustensiles-list", filteredUstensils, "ustensile-item");
  displayRecipes(combinedRecipes);

});
  }

  // --- Fonction générique pour mettre à jour le contenu d'un dropdown ---
  function updateDropdownList(listElementId, items, itemClass) {
    const listElement = document.getElementById(listElementId);
    listElement.innerHTML = "";
    items.forEach(item => {
      const li = document.createElement("li");
      li.className = itemClass;
      li.textContent = item;
      listElement.appendChild(li);
    });
  }

  /**
   * Filtre les recettes en fonction d'un mot-clé.
   */
  function searchRecipesByKeyword(recipes, searchValue) {
    const keywordLower = searchValue.toLowerCase();
    let results = [];
    recipes.forEach(recipe => {
      let found = false;
      if (recipe.name.toLowerCase().includes(keywordLower)) {
        found = true;
      }
      if (!found && recipe.description.toLowerCase().includes(keywordLower)) {
        found = true;
      }
      if (!found) {
        for (let i = 0; i < recipe.ingredients.length; i++) {
          if (recipe.ingredients[i].ingredient.toLowerCase().includes(keywordLower)) {
            found = true;
            break;
          }
        }
      }
      if (!found && recipe.appliance.toLowerCase().includes(keywordLower)) {
        found = true;
      }
      if (!found) {
        for (let i = 0; i < recipe.ustensils.length; i++) {
          if (recipe.ustensils[i].toLowerCase().includes(keywordLower)) {
            found = true;
            break;
          }
        }
      }
      if (found) {
        results.push(recipe);
      }
    });
    return results;
  }

  /**
   * Filtre les recettes en fonction des tags sélectionnés dans les dropdowns.
   */
  function filterRecipesByDropdowns(recipes) {
    console.log("Recettes à filtrer :", recipes); // Pour vérifier les recettes à filtrer

    const selectedIngredients = Array.from(document.querySelectorAll(".ingredient-tag")).map(tag => tag.textContent.toLowerCase());
    const selectedAppliances = Array.from(document.querySelectorAll(".appliance-tag")).map(tag => tag.textContent.toLowerCase());
    const selectedUstensils = Array.from(document.querySelectorAll(".ustensile-tag")).map(tag => tag.textContent.toLowerCase());

    return recipes.filter(recipe => {
      // Vérifie si la recette contient tous les ingrédients sélectionnés
      const hasAllIngredients = selectedIngredients.every(ingredient =>
        recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(ingredient))
      );

      // Vérifie si la recette contient l'appareil sélectionné
      const hasAppliance = selectedAppliances.length === 0 || selectedAppliances.includes(recipe.appliance.toLowerCase());

      // Vérifie si la recette contient tous les ustensiles sélectionnés
      const hasAllUstensils = selectedUstensils.every(ustensil =>
        recipe.ustensils.some(u => u.toLowerCase().includes(ustensil))
      );

      return hasAllIngredients && hasAppliance && hasAllUstensils;
    });
  }

  /**
   * Affiche les recettes dans le <div id="cards">.
   */
  function displayRecipes(recipes) {
    console.log("Recettes affichées :", recipes); // Pour vérifier les recettes à afficher 
    const container = document.getElementById('cards');
    container.innerHTML = "";
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
    const recipeCount = document.getElementById('recipe-count'); 
    recipeCount.textContent = `${recipes.length} Recettes`;
    
  }

  /**
   * Affiche la liste des ingrédients uniques dans le dropdown.
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
    list.innerHTML = "";
    allIngredients.forEach(ingredient => {
      const ingredientItem = document.createElement('li');
      ingredientItem.className = 'ingredient-item';
      ingredientItem.textContent = ingredient;
      list.appendChild(ingredientItem);
    });
  }

  /**
   * Affiche la liste des appareils uniques dans le dropdown.
   */
  function displayAppliances(recipes) {
    const allAppliances = [];
    recipes.forEach(recipe => {
      if (!allAppliances.includes(recipe.appliance)) {
        allAppliances.push(recipe.appliance);
      }
    });
    const list = document.getElementById('appliances-list');
    list.innerHTML = "";
    allAppliances.forEach(appliance => {
      const applianceItem = document.createElement('li');
      applianceItem.className = 'appliance-item';
      applianceItem.textContent = appliance;
      list.appendChild(applianceItem);
    });
  }

  /**
   * Affiche la liste des ustensiles uniques dans le dropdown.
   */
  function displayUstensils(recipes) {
    const allUstensils = [];
    recipes.forEach(recipe => {
      recipe.ustensils.forEach(ustensil => {
        if (!allUstensils.includes(ustensil)) {
          allUstensils.push(ustensil);
        }
      });
    });
    const list = document.getElementById('ustensiles-list');
    list.innerHTML = "";
    allUstensils.forEach(ustensil => {
      const ustensilItem = document.createElement('li');
      ustensilItem.className = 'ustensile-item';
      ustensilItem.textContent = ustensil;
      list.appendChild(ustensilItem);
    });
  }
});
