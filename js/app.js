// TODO - BUG: Meal selection not working if h3 inside the .meal-info is clicked. Need to find an elegant way around it without multiplying the meal id on various elements inside .meal, in order to fetch correct meal data.
// TODO - ENHANCEMENT: Make bottom meal items in meal container faded out. Upon scrolling have them fade in.
// TODO - BUG: Look into youtube video embedding. Error: Cross-Origin Read Blocking (CORB).



const searchEl = document.getElementById('search-input');
const hudTextEl = document.getElementById('hud-text');
const mealsContainerEl = document.getElementById('meals-grid');
const mealEl = document.querySelector('.meal');
const sidebarEl = document.getElementById('sidebar');
const sidebarBackgroundEl = document.getElementById('sidebar-background');
const brandImgEl = document.getElementById('brand-img');

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
    showLogo();
  } else {
    hudTextEl.textContent = '';
    hideLogo();
    populateMealsGrid(data);
  }
}

const populateMealsGrid = (data) => {
  if (searchEl.value === '') {
    mealsContainerEl.innerHTML = '';
    hudTextEl.textContent = '';
    showLogo();
    return
  }
  mealsContainerEl.innerHTML = data.meals.map(meal => 
  `
    <div class="meal" data-mealID="${meal.idMeal}">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="meal-info">
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
        <p class="instructions-text">${meal.strInstructions}</p>
      </div>
      <div class="video-container">
        <h3 class="video-title">Video</h3>
        <video src="${meal.strYoutube}" controls>Video not found</video>
      </div>
  `
}

const selectMeal = (e) => {
  if (e.target.parentElement.classList.contains('meal')) {
    const id = getMealId(e);
    fetchMealById(id);
    showSidebar();
  }
}

const getMealId = (e) => e.target.parentElement.dataset.mealid;

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

const hideLogo = () => brandImgEl.classList.add('hide');
const showLogo = () => brandImgEl.classList.remove('hide');

// EVENT LISTENERS
searchEl.addEventListener('input', fetchMealBySearch);
mealsContainerEl.addEventListener('click', selectMeal);
sidebarEl.addEventListener('click', hideSidebar);