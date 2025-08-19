// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const voiceSearchBtn = document.querySelector('.voice-search');
const filterBtns = document.querySelectorAll('.filter-btn');
const timerBtn = document.querySelector('.timer-btn');
const recipeModal = document.getElementById('recipe-modal');
const videoModal = document.getElementById('video-modal');
const loginModal = document.getElementById('login-modal');
let youtubePlayer = null;

// Mock data for development with real video IDs
const mockRecipes = [
    {
        id: 1,
        title: "Spicy Thai Curry",
        time: 30,
        difficulty: "Medium",
        image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=500&h=300&fit=crop",
        description: "A delicious Thai curry with coconut milk and fresh vegetables",
        ingredients: ["2 cups coconut milk", "1 tbsp curry paste", "1 cup mixed vegetables"],
        instructions: ["Heat coconut milk", "Add curry paste", "Add vegetables"],
        servings: 4,
        nutrition: {
            calories: 350,
            protein: 15,
            carbs: 45,
            fat: 12
        },
        video: {
            id: "1vYwJx8pUc0",
            title: "How to Make Spicy Thai Curry",
            description: "Learn to make authentic Thai curry with our step-by-step video guide"
        }
    },
    {
        id: 2,
        title: "Classic Margherita Pizza",
        time: 45,
        difficulty: "Easy",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&h=300&fit=crop",
        description: "Traditional Italian pizza with fresh basil and mozzarella",
        ingredients: ["Pizza dough", "Fresh mozzarella", "Tomato sauce", "Fresh basil"],
        instructions: ["Roll out the dough", "Add sauce and cheese", "Bake at 450°F"],
        servings: 4,
        nutrition: {
            calories: 280,
            protein: 12,
            carbs: 35,
            fat: 10
        },
        video: {
            id: "sv3TXMSv6Lw",
            title: "Perfect Margherita Pizza Recipe",
            description: "Master the art of making authentic Italian Margherita pizza"
        }
    },
    {
        id: 3,
        title: "Sushi Roll Platter",
        time: 60,
        difficulty: "Hard",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&h=300&fit=crop",
        description: "Fresh and colorful sushi rolls with various fillings",
        ingredients: ["Sushi rice", "Nori sheets", "Fresh fish", "Vegetables", "Wasabi"],
        instructions: ["Prepare sushi rice", "Lay nori sheet", "Add fillings", "Roll and slice"],
        servings: 4,
        nutrition: {
            calories: 320,
            protein: 18,
            carbs: 55,
            fat: 8
        },
        video: {
            id: "joweUxpHaqc",
            title: "Sushi Making Masterclass",
            description: "Professional sushi chef shows you how to make perfect sushi rolls"
        }
    },
    {
        id: 4,
        title: "Taco Fiesta",
        time: 25,
        difficulty: "Easy",
        image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&h=300&fit=crop",
        description: "Flavorful Mexican tacos with fresh toppings",
        ingredients: ["Tortillas", "Ground beef", "Lettuce", "Tomatoes", "Cheese"],
        instructions: ["Cook seasoned beef", "Warm tortillas", "Assemble tacos"],
        servings: 4,
        nutrition: {
            calories: 380,
            protein: 22,
            carbs: 40,
            fat: 15
        },
        video: {
            id: "1vYwJx8pUc0",
            title: "Quick & Easy Taco Recipe",
            description: "Learn to make delicious tacos in under 30 minutes"
        }
    }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupEventListeners();
    loadFeaturedRecipes();
    setupRecipeSearch();
    initYouTubePlayer();
});

// Theme Toggle
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Event Listeners
function setupEventListeners() {
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => filterRecipes(btn));
    });
}

// Recipe Filtering
function filterRecipes(selectedBtn) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    selectedBtn.classList.add('active');
    
    const category = selectedBtn.textContent.toLowerCase();
    loadRecipes(category);
}

// Recipe Search
function setupRecipeSearch() {
    const searchInput = document.querySelector('.nav-search input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length >= 2) {
                searchRecipes(searchTerm);
            }
        });
    }
}

function searchRecipes(searchTerm) {
    const filteredRecipes = mockRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredRecipes.length > 0) {
        displayRecipes(filteredRecipes);
        showRecipeVideo(filteredRecipes[0].id);
    }
}

// Recipe Loading
async function loadFeaturedRecipes() {
    try {
        displayFeaturedRecipes(mockRecipes);
    } catch (error) {
        console.error('Error loading featured recipes:', error);
        showError('Failed to load featured recipes');
    }
}

async function loadRecipes(category) {
    try {
        const filteredRecipes = category === 'all' 
            ? mockRecipes 
            : mockRecipes.filter(recipe => recipe.category === category);
        displayRecipes(filteredRecipes);
    } catch (error) {
        console.error('Error loading recipes:', error);
        showError('Failed to load recipes');
    }
}

// Recipe Display
function displayFeaturedRecipes(recipes) {
    const recipeGrid = document.querySelector('#featured-recipes');
    if (recipeGrid) {
        recipeGrid.innerHTML = recipes.map(recipe => `
            <div class="recipe-card" onclick="window.showRecipeDetails(${recipe.id})">
                <div class="recipe-image">
                    <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
                    <div class="recipe-overlay">
                        <span class="recipe-time"><i class="fas fa-clock"></i> ${recipe.time} mins</span>
                        <span class="recipe-difficulty"><i class="fas fa-fire"></i> ${recipe.difficulty}</span>
                    </div>
                </div>
                <div class="recipe-info">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description}</p>
                </div>
            </div>
        `).join('');
    }
}

function displayRecipes(recipes) {
    const recipeGrid = document.querySelector('.recipe-grid');
    if (recipeGrid) {
        recipeGrid.innerHTML = recipes.map(recipe => `
            <div class="recipe-card" onclick="window.showRecipeDetails(${recipe.id})">
                <div class="recipe-image">
                    <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
                    <div class="recipe-overlay">
                        <span class="recipe-time"><i class="fas fa-clock"></i> ${recipe.time} mins</span>
                        <span class="recipe-difficulty"><i class="fas fa-fire"></i> ${recipe.difficulty}</span>
                    </div>
                </div>
                <div class="recipe-info">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description}</p>
                </div>
            </div>
        `).join('');
    }
}

// Recipe Details
function showRecipeDetails(recipeId) {
    if (recipeModal) {
        recipeModal.classList.add('active');
        loadRecipeDetails(recipeId);
    }
}

async function loadRecipeDetails(recipeId) {
    try {
        const recipe = mockRecipes.find(r => r.id === recipeId);
        if (recipe) {
            displayRecipeDetails(recipe);
        } else {
            showError('Recipe not found');
        }
    } catch (error) {
        console.error('Error loading recipe details:', error);
        showError('Failed to load recipe details');
    }
}

function displayRecipeDetails(recipe) {
    if (recipeModal) {
        recipeModal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <div class="recipe-header">
                    <div class="recipe-image-large">
                        <img src="${recipe.image}" alt="${recipe.title}">
                    </div>
                    <div class="recipe-title-section">
                        <h2>${recipe.title}</h2>
                        <div class="recipe-meta">
                            <span><i class="fas fa-clock"></i> ${recipe.time} mins</span>
                            <span><i class="fas fa-fire"></i> ${recipe.difficulty}</span>
                            <span><i class="fas fa-utensils"></i> ${recipe.servings} servings</span>
                        </div>
                    </div>
                </div>
                <div class="recipe-content">
                    <div class="ingredients">
                        <h3>Ingredients</h3>
                        <ul>
                            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="instructions">
                        <h3>Instructions</h3>
                        <ol>
                            ${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}
                        </ol>
                    </div>
                    <div class="video-section">
                        <h3>Cooking Video</h3>
                        <button class="watch-video-btn" onclick="showRecipeVideo(${recipe.id})">
                            <i class="fas fa-play-circle"></i> Watch Tutorial
                        </button>
                    </div>
                </div>
            </div>
        `;

        const closeBtn = recipeModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                recipeModal.classList.remove('active');
            });
        }
    }
}

function showRecipeVideo(recipeId) {
    const recipe = mockRecipes.find(r => r.id === recipeId);
    if (recipe && recipe.video) {
        const videoModal = document.getElementById('video-modal');
        const videoTitle = videoModal.querySelector('.video-title');
        const videoDescription = videoModal.querySelector('.video-description');

        videoTitle.textContent = recipe.video.title;
        videoDescription.textContent = recipe.video.description;

        if (youtubePlayer) {
            youtubePlayer.loadVideoById(recipe.video.id);
        }

        videoModal.classList.add('active');

        const closeBtn = videoModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                videoModal.classList.remove('active');
                if (youtubePlayer) {
                    youtubePlayer.stopVideo();
                }
            });
        }
    }
}

// YouTube Player
function initYouTubePlayer() {
    if (typeof YT !== 'undefined' && YT.Player) {
        youtubePlayer = new YT.Player('youtube-player', {
            height: '400',
            width: '100%',
            videoId: '',
            playerVars: {
                'playsinline': 1,
                'controls': 1,
                'rel': 0
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }
}

function onYouTubeIframeAPIReady() {
    initYouTubePlayer();
}

function onPlayerReady(event) {
    console.log('YouTube player is ready');
}

function onPlayerStateChange(event) {
    console.log('Player state changed:', event.data);
}

// Utility Functions
function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Make functions available globally
window.showRecipeDetails = showRecipeDetails;
window.showRecipeVideo = showRecipeVideo;
window.toggleTheme = toggleTheme;
window.filterRecipes = filterRecipes; 