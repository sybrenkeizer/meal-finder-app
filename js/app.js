const searchEl = document.getElementById('search-input');
const hudTextEl = document.getElementById('hud-text');
const mealsContainerEl = document.getElementById('meals-grid');
const mealEl = document.querySelector('.meal');
const sidebarEl = document.getElementById('sidebar');
const sidebarBackgroundEl = document.getElementById('sidebar-background');

// FUNCTIONS
const fetchMealBySearch = (e) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchEl.value}`)
    .then(response => response.json())
    .then(data => validateSearchInput(data))
    .catch(error => console.error(error));
}

const fetchMealById = (id) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(response => response.json())
    .then(data => populateSidebar(data))
    .catch(error => console.error(error));
}

const validateSearchInput = (data) => {
  if (data.meals === null) {
    hudTextEl.textContent = 'There are no search results, please try again.'
    mealsContainerEl.innerHTML = '';
  } else {
    hudTextEl.textContent = '';
    populateMealsGrid(data);
  }
}

const populateMealsGrid = (data) => {
  if (searchEl.value === '') {
    mealsContainerEl.innerHTML = '';
    hudTextEl.textContent = '';
    return
  }
  mealsContainerEl.innerHTML = data.meals.map(meal => 
  `
    <div class="meal">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="meal-info" data-mealID="${meal.idMeal}">
        <h3>${meal.strMeal}</h3>
      </div>
    </div>
  `
  )
  .join('');
}

const populateSidebar = (meal) => {
  const ingredients = [];
  meal = meal.meals[0];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }

  sidebarEl.innerHTML = 
  `
    <header class="sidebar-header">
      <h2>${meal.strMeal}</h2>
      <a href="#" id="close-sidebar-btn" class="close-sidebar-btn">
        <i class="fa-solid fa-right-from-bracket fa-xl"></i>
      </a>
    </header>
    <div class="image-container">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    </div>
    <div class="ingredient-container">
        <h3 class="ingredient-title">Ingredients</h3>
        <ul class="ingredient-list">
          ${ingredients.map(ing => `<li class="ingredient-list-item">${ing}</li>`).join('')}
        </ul>
      </div>
      <div class="instruction-container">
        <h3 class="instructions-title">Instructions</h3>
        <p class="instructions0-text">${meal.strInstructions}</p>
      </div>
      <div class="video-container">
        <h3 class="video-title">Video</h3>
        <video src="${meal.strYoutube}" controls>Video not found</video>
      </div>
  `
}

const selectMeal = (e) => {
  if (e.target.classList.contains('meal-info')) {
    const id = getMealId(e);
    fetchMealById(id);
    showSidebar();
  } 
}

const getMealId = (e) => e.target.dataset.mealid;

const showSidebar = () => {
  sidebarEl.classList.add('show');
  sidebarBackgroundEl.classList.add('darken-bg');

}

const hideSidebar = (e) => {
  if (e.target.parentElement.classList.contains('close-sidebar-btn')) {
    sidebarEl.classList.remove('show');
    sidebarBackgroundEl.classList.remove('darken-bg');
  }
}

// EVENT LISTENERS
searchEl.addEventListener('input', fetchMealBySearch);
mealsContainerEl.addEventListener('click', selectMeal);
sidebarEl.addEventListener('click', hideSidebar);