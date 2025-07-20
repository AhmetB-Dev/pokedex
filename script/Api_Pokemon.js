const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const MAX_POKEMON_LIMIT = 200;

async function fetchPokemonData() {
    const allResponses = [];

    for (let id = 1; id <= MAX_POKEMON_LIMIT; id++) {
        const response = await fetch(BASE_URL + id);
        const data = await response.json();
        allResponses.push(data);
    }

    return transformPokemonData(allResponses);
}

function transformPokemonData(pokemonArray) {
    return pokemonArray.map(pokemon => ({
        name: pokemon.name,
        imgUrl: pokemon.sprites.other["official-artwork"].front_default,
        types: pokemon.types.map(type => type.type.name),
        abilities: pokemon.abilities.map(ability => ability.ability.name),
        stats: pokemon.stats.map(stat => ({
            base_stat: stat.base_stat,
            stat: { name: stat.stat.name }
        }))
    }));
}

async function loadAndRenderInitialPokemon() {
    allPokemon = await fetchPokemonData();
    currentLimit = 40;
    renderCurrentPokemonBatch();
    updateLoadMoreVisibility();
}

function renderCurrentPokemonBatch() {
    visiblePokemon = allPokemon.slice(0, currentLimit);
    renderCards(visiblePokemon);
}

function setupLoadMoreButton() {
    const button = document.getElementById("load-more");
    button.addEventListener("click", () => {
        currentLimit = Math.min(currentLimit + 20, MAX_POKEMON_LIMIT, allPokemon.length);
        renderCurrentPokemonBatch();
        updateLoadMoreVisibility();
    });
}

function updateLoadMoreVisibility() {
    const button = document.getElementById("load-more");
    const maxReached = currentLimit >= allPokemon.length || currentLimit >= MAX_POKEMON_LIMIT;
    button.classList.toggle("hidden", maxReached);
}

function hideLoadMoreButton() {
    document.getElementById("load-more").classList.add("hidden");
}

function setupSearchInput() {
    const input = document.getElementById("search");
    input.addEventListener("input", handleSearchInput);
}

function handleSearchInput(event) {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm.length < 3) {
        resetSearchView();
        return;
    }

    const filteredPokemon = allPokemon.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm)
    );

    showSearchResults(filteredPokemon);
}


function resetSearchView() {
    renderCurrentPokemonBatch();
    updateLoadMoreVisibility();
}

function showSearchResults(filteredPokemonList) {
    if (filteredPokemonList.length === 0) {
        showNoResults();
        hideLoadMoreButton();
    } else {
        visiblePokemon = filteredPokemonList;
        renderCards(filteredPokemonList);
        hideLoadMoreButton();
    }
}



function hideLoadingIndicator() {
    const loading = document.getElementById("loading");
    if (loading) loading.classList.add("hidden");
}

function showDefaultList() {
    renderCurrentPokemonBatch();
    updateLoadMoreVisibility();
}

function displaySearchResults(filteredList) {
    if (filteredList.length === 0) {
        showNoResults();
        hideLoadMoreButton();
    } else {
        visiblePokemon = filteredList;
        renderCards(filteredList);
        hideLoadMoreButton();
    }
}

function showNoResults() {
    const container = document.getElementById("pokemon-container");
    container.innerHTML = '<p class="no-result">No Pokémon found.</p>';
}

document.addEventListener("DOMContentLoaded", () => {
    showLoadingCards();
    setupSearchInput();
    setupLoadMoreButton();
    loadAndRenderInitialPokemon();
});
