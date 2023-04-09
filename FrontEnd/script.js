

//code permettant de récupérer les éléments de travail de chaque fonction, et de les afficher sur la page web lorsque celle-ci est prête... 
//...en utilisant l'événement DOMContentLoaded afin de s'assurer que le DOM est prêt à être utilisé avant d'afficher les données.
document.addEventListener("DOMContentLoaded", function () {
  getCategories();
  getWorks();
});

// **********PARTIE WORKS**********

// Récupération des works via l'API
function getWorks() {
  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then((works) => {

      works.forEach((work) => { //pour chaque work de la catégorie travaux...
        const figure = document.createElement('figure'); //...on récupère la figure
        const img = document.createElement('img'); // puis l'image
        const figcaption = document.createElement('figcaption'); // puis l'élément de légende.

        img.src = work.imageUrl; //la propriété src de l'image obtient son url pour chaque objet (work)
        img.alt = work.title; //la propriété alt donne un titre pour chaque objet (work)
        img.setAttribute('data-category', work.categoryId); // on ajoute l'attribut data-category à l'élément 'img' ayant pour valeur l'id de la catégorie work
        figcaption.innerText = work.title; //la propriété innerText donne un contenu textuel visible à chaque work, extraite de la propriété 'title'

        figure.appendChild(img); // 'img' est ajouté à l'élément 'figure'
        figure.appendChild(figcaption); // 'figcaption' est ajouté à l'élément 'figure'

        document.querySelector('.gallery').appendChild(figure);// on sélectionne la galerie du html, et on y ajoute l'élement figure
      });
    })
}

//**********PARTIE CATEGORIES**********

// Récupération des catégories via l'API
function getCategories() {
  fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then((categories) => {

      const divCategory = document.querySelector("#category-buttons"); // on récupére la div des boutons pour le tri par catégorie
      const btnAll = document.createElement("button");  // on créé la variable pour le bouton ''Tous''

      btnAll.innerHTML = "Tous"; // on créé le texte du bouton "Tous"
      btnAll.setAttribute('data-category', 0); // on ajoute l'attribut data-category à l'élément 'btnAll' et on lui ajoute la valeur 0.
      divCategory.appendChild(btnAll); // 'btnAll' est ajouté à l'élément divCategory

      categories.forEach((category) => { // on crée les boutons pour chaque catégorie

        const btn = document.createElement("button"); // on récupère les boutons pour le tri

        btn.innerHTML = category.name; // la propriété innerHTML du btn donne un contenu textuel au bouton pour chaque catégorie
        btn.setAttribute('data-category', category.id), // on donne l'attribut data-category à l'élément 'btn' et on lui donne la valeur correspondant à l'id de la catégorie
          btn.name = category.name; // la propriété 'name' du btn obtient un nom pour chaque catégorie

        divCategory.appendChild(btn); // 'btn' est ajouté à l'élément divCategory
      });
      setUpSorting()
    });
}

//**********FONCTION DE TRI**********

function setUpSorting() {

  const categoryButtons = document.querySelectorAll('#category-buttons button');   // on récupère les boutons de la "category-buttons"

  categoryButtons.forEach(button => { // pour chaque bouton...
    button.addEventListener('click', () => { //on ajoute un événement de clic...

      const categoryId = button.getAttribute('data-category');//...qui récupère l'id de catégorie associé au bouton
      filterImages(categoryId); // on appelle la fonction filterImages avec l'Id de catégorie, pour filtrer la liste d'images en fonction ed la catégorie sélectionnée
    });
  });
}

// Fonction de tri des images par rapport à la catégorie sélectionnée

function filterImages(categoryId) {

  const works = document.querySelectorAll('.gallery figure'); // on récupère les figures dans la gallery de l'html

  works.forEach(work => { // pour chaque work...
    const workCategory = work.querySelector('img').getAttribute('data-category'); //...on séléctioonne l'img pour lui donner l'attribut data-category

    if (categoryId === '0' || workCategory === categoryId) { // on vérifie si la catégorie sélectionnée est 0 (tous) ou si la catégorie correspond à une catégorie de travail
      work.style.display = ''; //...si c'est le cas, alors l'élément s'affiche en utilisant display block
    } else {
      work.style.display = 'none'; // ...si ce n'est pas le cas alors les works se masquent en utilisant la valeur none
    }
  });
}

//**********AUTHENTIFICATION DE l'UTILISATEUR AVEC TOKEN**********

let myToken = null; // définie avec une valeur par défaut

//événement DOM pour vérifier si l'utilisateur est connecté ou non

document.addEventListener(
  "DOMContentLoaded", // DOMContentLoaded déclenché lorsque page html chargée
  function() 
  { 
    const loginButton = document.getElementById('loginButton');
    getToken();

    if (myToken != null) { // si le token se trouve dans le localstorage, alors nous sommes connectés, logout apparait
      loginButton.textContent = 'logout';
      document
        .querySelectorAll('.hidden')
        .forEach
        (
          element => 
          { // apparition de chaque élément invisible d'édition lors du login
            element.classList.remove('hidden');
          }
        )
    } else { // si le token ne se trouve pas dans le locastorage, alors nous ne sommes pas connectés
      loginButton.textContent = 'login';
    }

    // événement click ajouté au bouton pour gérer la connexion/déconnexion de l'user
    loginButton.addEventListener('click', () => {
      if (myToken) {
        localStorage.removeItem('token');
        loginButton.textContent = 'login';
        window.location.href = "http://127.0.0.1:5500/index.html"
      } else {
        loginButton.textContent = 'logout';
        window.location.replace("http://127.0.0.1:5500/login.html")

      }
    });
  }
);

// on stock le token dans le localStorage
function getToken() {
  myToken = localStorage.getItem('token')
  console.log(myToken)
}




