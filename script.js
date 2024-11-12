document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("searchBar");
    const searchButton = document.getElementById("searchButton");
    const fishList = document.getElementById("fishList");

    async function fetchFish() {
        try {
            const response = await fetch("https://fish-species.p.rapidapi.com/fish_api/fishes", {
                method: "GET",
                headers: {
                    "X-RapidAPI-Host": "fish-species.p.rapidapi.com",
                    "X-RapidAPI-Key": "927b5be43dmsh846b16eb3c60193p140499jsna98a80121d27"
                }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setupSearch(data);
            } else {
                console.error("Dados inválidos recebidos da API");
            }
        } catch (error) {
            console.error("Erro ao buscar peixes:", error);
        }
    }

    function setupSearch(fishes) {
        searchButton.addEventListener("click", () => {
            const searchTerm = searchBar.value.toLowerCase().trim();

            if (searchTerm === "") {
                fishList.innerHTML = "<li>Digite um termo para iniciar a busca</li>";
                return;
            }

            const isNumber = !isNaN(searchTerm);
            const filteredFish = fishes.filter(fish => {
                if (isNumber) {
                    return fish.id === parseInt(searchTerm);
                } else {
                    return (
                        (fish.name && fish.name.toLowerCase().includes(searchTerm)) ||
                        (fish.meta?.scientific_classification?.genus && fish.meta.scientific_classification.genus.toLowerCase().includes(searchTerm)) ||
                        (fish.synonyms && fish.synonyms.toLowerCase().includes(searchTerm))
                    );
                }
            });

            fishList.innerHTML = filteredFish.length > 0 
                ? filteredFish.map(fish => 
                    `<li>
                        <strong>ID:</strong> ${fish.id} <br>
                        <img src="${fish.img_src_set['1.5x']}" alt="${fish.name}">
                        <a href="${fish.url}" target="_blank"><strong>Nome:</strong> ${fish.name}</a> <br>
                        <strong>Espécie Tipo:</strong> ${fish.type_species || "informação não encontrada"} <br>
                        <strong>Sinônimos:</strong> ${fish.synonyms || "informação não encontrada"} <br>
                        <strong>Família:</strong> ${fish.meta?.scientific_classification?.family || "informação não encontrada"} <br>
                        <strong>Gênero:</strong> ${fish.meta?.scientific_classification?.genus || "informação não encontrada"} <br>
                        <strong>Ordem:</strong> ${fish.meta?.scientific_classification?.order || "informação não encontrada"}
                    </li>`
                ).join("")
                : "<li>Nenhum peixe encontrado</li>";
        });
    }

    fetchFish();
});
