
document.addEventListener("DOMContentLoaded", function () {
  getWorks()
  getCategories()
});


function getWorks() {
  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then((works) => {

      works.forEach((work) => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');
  
        img.src = work.imageUrl;
        img.alt = work.title;
        // img.setAttribute('data-category', 0)
        figcaption.innerText = work.title;
  
        figure.appendChild(img);
        figure.appendChild(figcaption);
  
        // ajouter l'élément à la galerie
        document.querySelector('.gallery').appendChild(figure);
        
      });
    })
    .catch(error => console.error(error));
  }

// PARTIE CATEGORIES


function getCategories() {
  fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then((categories) => {

      // récupérer la div pour les catégories
      const divCategory = document.querySelector("#category-buttons");

      // créer le bouton Tous
      const btnAll = document.createElement("button")
      btnAll.innerHTML = "Tous";
      btnAll.setAttribute('data-category', 0)
      divCategory.appendChild(btnAll);

      // créer les boutons pour chaque catégorie
      categories.forEach((category) => {

        const btn = document.createElement("button");
        btn.innerHTML = category.name;
        btn.setAttribute('data-category', category.id),
          btn.name = category.name;
        divCategory.appendChild(btn);
      });
      setUpSorting()
    });
}

// Fonction de tri

function setUpSorting() {
  // Récupérer tous les boutons de catégorie
  const categoryButtons = document.querySelectorAll('.category-buttons button');

  // Parcourir tous les boutons et add un événement de clic pour trier les images en fonction de la catégorie sélectionnée
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');
      filterImages(category);
    });
  });
}

// Fonction de tri des images en fonction de la catégorie sélectionnée
function filterImages(category) {
  images.forEach(image => {
    const imageCategory = image.querySelector('img').getAttribute('data-category');
    if (category === 'all' || imageCategory === category) {
      image.style.display = '';
    } else {
      image.style.display = 'none';
    }
  });
}


