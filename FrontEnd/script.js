document.addEventListener("DOMContentLoaded", function () {
  getCategories();
  getWorks();
});

//***************************WORKS PART***************************//

// get the works from API
function getWorks() {
  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then((works) => {

      works.forEach((work) => {
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

//***************************CATEGORY PART***************************//

// Récupération des catégories via l'API
function getCategories() {
  fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then((categories) => {

      const divCategory = document.querySelector(".category-buttons"); // on récupére la div des boutons pour le tri par catégorie
      const btnAll = document.createElement("button");  // on créé la variable pour le bouton ''Tous''
      const selectCategory = document.getElementById('category-add-select'); // on récupère la div category-add-select pour le menu déroulant de la modale add

      btnAll.innerHTML = "Tous"; // on créé le texte du bouton "Tous"
      btnAll.setAttribute('data-category', 0); // on ajoute l'attribut data-category à l'élément 'btnAll' et on lui ajoute la valeur 0.
      divCategory.appendChild(btnAll); // 'btnAll' est ajouté à l'élément divCategory

      categories.forEach((category) => { // on crée les boutons pour chaque catégorie

        const btn = document.createElement("button"); // on récupère les boutons pour le tri

        btn.innerHTML = category.name; // la propriété innerHTML du btn donne un contenu textuel au bouton pour chaque catégorie
        btn.setAttribute('data-category', category.id), // on donne l'attribut data-category à l'élément 'btn' et on lui donne la valeur correspondant à l'id de la catégorie
          btn.name = category.name; // la propriété 'name' du btn obtient un nom pour chaque catégorie

        divCategory.appendChild(btn); // 'btn' est ajouté à l'élément divCategory

        const option = document.createElement('option');
        option.value = category.id;
        option.text = category.name;

        selectCategory.appendChild(option);
      });
      setUpSorting()
    });
}

//***************************SORTING FUNCTION***************************//

function setUpSorting() {

  const categoryButtons = document.querySelectorAll('.category-buttons button');   // on récupère les boutons de la "category-buttons"

  categoryButtons.forEach(button => { // pour chaque bouton...
    button.addEventListener('click', () => {
      const categoryId = button.getAttribute('data-category');//...qui récupère l'id de catégorie associé au bouton
      filterImages(categoryId); // on appelle la fonction filterImages avec l'Id de catégorie, pour filtrer la liste d'images en fonction ed la catégorie sélectionnée
    });
  });
}

// CATEGORY & SET OBJECT

function filterImages(categoryId) {
  const works = document.querySelectorAll('.gallery figure');
  const categories = new Set();  // on stocke les catégories d'image sans doublons

  works.forEach(work => { // pour chaque work...
    const workCategory = work.querySelector('img').getAttribute('data-category'); //...on séléctioonne l'img pour lui donner l'attribut data-category

    categories.add(workCategory); // garantit que chaque catégorie d'image ne sera ajoutée à l'ensemble qu'une seule fois

    if (categoryId === '0' || workCategory === categoryId) { // on vérifie si la catégorie sélectionnée est 0 (tous) ou si la catégorie correspond à une catégorie de travail
      work.style.display = ''; //...si c'est le cas, alors l'élément s'affiche en utilisant display block
    }
    else {
      work.style.display = 'none'; // ...si ce n'est pas le cas alors les works se masquent en utilisant la valeur none
    }
  });
  console.log(categories);
}

//***************************INTERFACE LOGIN/LOGOUT***************************//

// on stock le token dans le localStorage
function getToken() {
  myToken = localStorage.getItem('token')
  console.log(myToken)
}

let myToken = null; // defined with a default value

document.addEventListener
  (
    "DOMContentLoaded", // DOMContentLoaded triggered when html page loaded
    function () 
    {
      const loginButton = document.getElementById('loginButton');
      getToken();

      if (myToken != null) { // if the token is not null
        loginButton.textContent = 'logout';
        document
          .querySelectorAll('.hidden') // we select the .hidden class
          .forEach
          (
            element => // for each element we remove the hidden element
            {
              element.classList.remove('hidden');
            }
          )
        document.querySelector('.category-buttons').classList.add('hidden');
      }
      else { // otherwise the elements remain hidden and the 'login' appears
        loginButton.textContent = 'login';
        document
          .querySelectorAll('.hidden')
          .forEach
          (
            element => 
            {
              element.classList.add('hidden');
            }
          )
        document.querySelector('.category-buttons').classList.remove('hidden');
      }

      // click event added to button to manage user login/logout
      loginButton.addEventListener('click', () => 
      {
        if (myToken) 
        {
          localStorage
            .removeItem('token');
          loginButton.textContent = 'login';
          window.location.href = "index.html"
        }
        else 
        {
          loginButton.textContent = 'logout';
          window.location.replace("login.html")
        }
      });
    }
  );

//***************************GALLERY MODALE***************************//

// get the elements <a>, xmark and modal  //

document.addEventListener('DOMContentLoaded', function () {
  const modalOpen = document.querySelector('.modal-open');
  const modalClose = document.querySelector('.modal-close');
  const modal = document.querySelector('#modal-gallery');
  const modalBackdrop = document.getElementById('modal-backdrop'); // background modal

  modalOpen.onclick = function () {
    modal.setAttribute('aria-hidden', 'false');
    modalBackdrop.style.display = 'block'; // show the background
    modal.style.display = 'flex';
    getModal();
  }

  modalClose.onclick = function () {
    modal.setAttribute('aria-hidden', 'true');
    modalBackdrop.style.display = 'none';
    modal.style.display = 'none';
    clearModal(); // call the function clearModal
  }
});

// INSER CODE FOR CLOSE MODALE WHEN CLICK OUTSIDE here ...





// GET THE WORKS AGAIN FROM API  //
function getModal() 
{
  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then((modal) => {

      modal.forEach((modal) => 
      {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');
        const trashIcon = document.createElement('i');
        const arrowIcon = document.createElement('i')

        img.src = modal.imageUrl;
        img.alt = modal.title;
        img.setAttribute('data-img', modal.categoryId);
        figcaption.innerText = "éditer";

        arrowIcon.className = "fa-solid fa-arrows-up-down-left-right arrow-icon";
        trashIcon.className = "fa-regular fa-trash-can trash-icon";

        figure.appendChild(img);
        figure.appendChild(trashIcon);
        figure.appendChild(figcaption);
        figure.appendChild(arrowIcon);

        trashIcon.addEventListener('click', () => {
          deleteImage(modal.id, figure); //call function deleteImage
        });

        document.querySelector('.modal-container').appendChild(figure);
      });
    })
}

// DELETE ITEM

function deleteImage(id, figure) //delete request to the server to delete the img with a specified id and figure
{

  fetch('http://localhost:5678/api/works/${id}',
    {
      method: 'DELETE',
      headers:
      {
        'Authorization': 'Bearer ' + myToken,
      }
    })
    // .then(data => data.json)
    // .then(jsondata => {
    //   console.log(jsondata.work);
    // })
    .then(response => {
      // alert('id = ' + id + ' , response = ' + response.status)

      if (response.ok) {
        alert('suppression');
        figure.remove(); // remove image from DOM
      }
    });
}

function clearModal() // empty the modal 
{
  const modalContainer = document.querySelector('.modal-container');
  while (modalContainer.firstChild) {
    modalContainer.removeChild(modalContainer.firstChild); // remove all children of the modalContainer element
    window.location.href = ('/index.html'); // Redirects to homepage
  }
}

//***************************MODAL ADD PHOTO***************************//

document.addEventListener('DOMContentLoaded', function () {
  const addModal = document.querySelector('#modal-add');
  const modalAddReturn = document.querySelector('.modal-add-return');
  const modalBackdrop = document.querySelector('#modal-backdrop');
  const btnAddPhoto = document.getElementById('btn-add-photo');
  const modalAddClose = document.querySelector('.modal-add-close .fa-xmark');

  btnAddPhoto.addEventListener('click', function () {
    addModal.setAttribute('aria-hidden', 'false');
    modalBackdrop.style.display = 'block'; // show the background
    addModal.style.display = 'block';
  });

  modalAddReturn.onclick = function () {
    addModal.setAttribute('aria-hidden', 'true');
    addModal.style.display = 'none';
  }

  modalAddClose.addEventListener('click', function () {
    addModal.setAttribute('aria-hidden', 'true');
    modalBackdrop.style.display = 'none';
    addModal.style.display = 'none';
    clearModal(); // call the function clearModal
    clearAddModal(); // call the function clearAddModal to clear the second modal
  });
});

function clearAddModal() // clear the add modal
{
  const modalAddContainer = document.querySelector('.modal-add-photo');
  while (modalAddContainer.firstChild) 
  {
    modalAddContainer.removeChild(modalAddContainer.firstChild);
  }

  const modalContainer = document.querySelector('.modal-container');
  while (modalContainer.firstChild) 
  {
    modalContainer.removeChild(modalContainer.firstChild);
  }
  window.location.href = ('index.html');
}

// send a new image to the back-end

document.addEventListener('DOMContentLoaded', function () 
{
  let selectedFile;
  let uploadedImage = document.getElementById('uploaded-image');

  document.getElementById('photo').addEventListener('change', function (event) 
  {
    selectedFile = event.target.files[0];
    uploadedImage.src = URL.createObjectURL(selectedFile);
    uploadedImage.style.display = 'block';
    document.querySelector('.icon-add-photo .fa-image').style.display = 'none';
    document.querySelector('label[for="photo"]').style.display = 'none';
    document.querySelector('.txt-add-photo').style.display = 'none';

    checkFields()
  });

  
  function checkFields() {
    const checkTitle = document.getElementById('title-add-form').value;
    const checkCategory = document.getElementById('category-add-select').value;
    const uploadedImageSrc = document.getElementById('uploaded-image').src;
    const btnValidate = document.getElementById('btn-validate'); // Ajout de cette ligne pour obtenir l'élément du DOM avec l'ID "btn-validate"
  
    // Vérifie si les champs titre, catégorie et uploadedImage sont remplis
    if (checkTitle !== '' && checkCategory !== '' && uploadedImageSrc !== '') {
      btnValidate.disabled = false; 
    } else {
      btnValidate.disabled = true; 
    }
  }

  document.getElementById('btn-validate').addEventListener('click', function () 
  {
    let formData = new FormData();
    formData.append('image', selectedFile); // Ajoute le fichier à l'objet FormData
    formData.append('title', document.getElementById('title-add-form').value); // Ajoute la valeur du champ de titre au FormData
    formData.append('category', document.getElementById('category-add-select').value); // Ajoute la valeur du champ de catégorie au FormData

    fetch('http://localhost:5678/api/works',
      {
        method: 'POST',
        body: formData,
        headers:
        {
          'Authorization': 'Bearer ' + myToken,
        }
      })
      .then(function (response) {
        console.log('Response:', response);
        alert('image ajoutée');
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
  });

});

