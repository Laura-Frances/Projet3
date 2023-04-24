document.addEventListener("DOMContentLoaded", function () {

  let myToken = null; // defined with a default value
  let selectedFile = undefined;
  // #region constantes
  const uploadedImage = document.getElementById('uploaded-image');
  const loginButton = document.getElementById('loginButton');
  const modalOpen = document.querySelector('.modal-open');
  const modalClose = document.querySelector('.modal-close');
  const modal = document.querySelector('#modal-gallery');
  const addModal = document.querySelector('#modal-add');
  const modalAddReturn = document.querySelector('.modal-add-return');
  const modalBackdrop = document.querySelector('#modal-backdrop');
  const btnAddPhoto = document.getElementById('btn-add-photo');
  const modalAddClose = document.querySelector('.modal-add-close .fa-xmark');
  const successMsgForm = document.getElementById('success-message');
  const errorMsgForm = document.getElementById('error-message');
  const btnValidate = document.getElementById('btn-validate');
  // #endregion

  getCategories();
  getWorks();
  getToken();
  getInterface();

  //***************************WORKS PART***************************//
  // #region WORKS

  // get the works from API
  function getWorks() {
    fetch('http://localhost:5678/api/works')
      .then(response => response.json()) // processes the request response by transforming it into JSON format
      .then((works) => { //get json datas stored inside "works" constante

        const gallery = document.querySelector('.gallery');
        while (gallery.firstChild) {
          gallery.removeChild(gallery.firstChild); // remove all children of the gallery element to prepare the gallery adding works from API
        }

        works.forEach((work) => { // on each work we call the function addNewWork with 3 proprieties ...
          addNewWork(work.title, work.imageUrl, work.categoryId); //...allows new works from the API to be added to the gallery
        });
      })
  }

  function addNewWork(title, imageUrl, categoryId) {
    const figure = document.createElement('figure'); //...get the figure
    const img = document.createElement('img'); // and the image
    const figcaption = document.createElement('figcaption'); // and the caption of the image

    img.src = imageUrl; // sets the src attribute of the img to the imageUrl
    img.alt = title; // sets the alt attribute of the img to the title
    img.setAttribute('data-category', categoryId); // sets an attribute data-category on img, assigns the value of categoryId
    figcaption.innerText = title; // sets the inner text content of figcaption to the value of the title

    figure.appendChild(img); // add the element img as a child of the figure
    figure.appendChild(figcaption); // add the element figcaption as a child of the figure

    document.querySelector('.gallery').appendChild(figure); // add figure as a child of gallery
  }
  // #endregion works

  //***************************CATEGORY PART***************************//
  // #region category

  // get categories from API
  function getCategories() {
    fetch('http://localhost:5678/api/categories')
      .then(response => response.json())
      .then((categories) => {

        const divCategory = document.querySelector(".category-buttons");
        const btnAll = document.createElement("button");
        const selectCategory = document.getElementById('category-add-select'); // we get the 'category-add-select' for the scorlling menu of the addModal

        btnAll.innerHTML = "Tous"; // we create the "all" button 
        btnAll.setAttribute('data-category', 0); // we set the attribute data-categopry to the btnAll and set the 0 value
        divCategory.appendChild(btnAll); // btnAll is a child of divCategory element

        categories.forEach((category) => { // we create all the category buttons

          const btn = document.createElement("button"); // we get the buttons

          btn.innerHTML = category.name; // give some txt to the btn for each category
          btn.setAttribute('data-category', category.id), // set the data-category to the 'btn', and give the id value of the category
            btn.name = category.name; // give a name to each category buttons

          divCategory.appendChild(btn); // btn is a child of the element parent divCategory

          // get categories for the scrolling menu inside the addModal
          const option = document.createElement('option'); // create the element option for the scrolling menu
          option.value = category.id; // set the id category for the value of the scrolling options
          option.text = category.name; // give a category name for the txt of each option inside the scrolling menu

          selectCategory.appendChild(option); // option is a child of the element selectCategory
        });
        setUpSorting() // call the function setUpSorting
      });
  }

  //***************************SORTING FUNCTIONS***************************//
  // #region sorting

  function setUpSorting() {

    const categoryButtons = document.querySelectorAll('.category-buttons button');
    

    categoryButtons.forEach(button => { //...for each button

      const categoryId = button.getAttribute('data-category');
     
      button.addEventListener('click', () => { //...we listen the click
        filterImages(categoryId); // ...and we call the function filterImages with id category, to filter the images depends on a category
      });
    });
  }

  // CATEGORY & SET OBJECT

  function filterImages(categoryId) {
    const works = document.querySelectorAll('.gallery figure'); // get all the elements figure inside the element .gallery
    const categories = new Set();  // create a new object Set to store the img categories without duplicates

    works.forEach(work => { // for each work...
      const workCategory = work.querySelector('img').getAttribute('data-category'); //...we get the img to give the value of the attribute 'data-category'

      categories.add(workCategory); // add 'workCategory' to the categories. Each category will be add once

      if (categoryId === '0' || workCategory === categoryId) { // we check if the value of categoryId is 0 ("tous") or if workCategory has an id
        work.style.display = ''; //...if yes, so 'work' (the img) is displayed block
      }
      else {
        work.style.display = 'none'; //...if no, so 'work' (the img) is hide
      }
    });
    console.log(categories);
  }
  // #endregion

  //***************************INTERFACE LOGIN/LOGOUT***************************//
  // #region LOGIN/LOGOUT

  // get the interface login or logout with the token
  function getInterface() {
    if (myToken != null) { // if the token is not null
      loginButton.textContent = 'logout';
      document.querySelectorAll('.hidden').forEach(element => {
        element.classList.remove('hidden');
      })
      document.querySelector('.category-buttons').classList.add('hidden');
    } else { // otherwise the elements remain hidden and the 'login' appears
      loginButton.textContent = 'login';
      document.querySelectorAll('.hidden').forEach(element => {
        element.classList.add('hidden');
      }
      )
      document.querySelector('.category-buttons').classList.remove('hidden');
    }
  }

  // we get the token inside the localStorage
  function getToken() {
    myToken = localStorage.getItem('token')
    console.log(myToken)
  }

  // click event added to button to manage user login/logout
  loginButton.addEventListener('click', () => {
    if (myToken) {
      logout()
    } else {
      loginButton.textContent = 'logout';
      window.location.replace("login.html")
    }
  });

  // remove the token to logout
  function logout() {
    const loginButton = document.getElementById('loginButton');
    localStorage.removeItem('token');
    loginButton.textContent = 'login';
    window.location.href = "index.html"
  }
  // #endregion

  //***************************GALLERY MODALE***************************//
  // #region first modal

  // get the elements <a>, xmark and modal  //
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
    clearModal();
    clearAddModal();
  }

  // CLOSE MODALE WHEN CLICK OUTSIDE 
  modalBackdrop.addEventListener('click', function () {
    closeModals();
  })

  // GET THE WORKS AGAIN FROM API  //
  function getModal() {
    fetch('http://localhost:5678/api/works')
      .then(response => response.json())
      .then((works) => {

        works.forEach((work) => {
          const figure = document.createElement('figure');
          const img = document.createElement('img');
          const figcaption = document.createElement('figcaption');
          const trashIcon = document.createElement('i');
          const arrowIcon = document.createElement('i')

          img.src = work.imageUrl;
          img.alt = work.title;
          img.setAttribute('data-img', work.categoryId);
          figcaption.innerText = "éditer";

          arrowIcon.className = "fa-solid fa-arrows-up-down-left-right arrow-icon";
          trashIcon.className = "fa-regular fa-trash-can trash-icon";

          figure.appendChild(img);
          figure.appendChild(trashIcon);
          figure.appendChild(figcaption);
          figure.appendChild(arrowIcon);

          trashIcon.addEventListener('click', (event) => {
            deleteImage(event, work.id, figure); //call function deleteImage
          });

          document.querySelector('.modal-container').appendChild(figure);
        });
      })
  }

  // DELETE ITEM
  function deleteImage(event, id, figure) {
    event.preventDefault();

    fetch(`http://localhost:5678/api/works/${id}`,
      {
        method: 'DELETE',
        headers:
        {
          'Authorization': `Bearer ${myToken}`
        }
      })

      .then(response => {
        if (response.ok) {
          figure.remove();
          getWorks();

        }
        // remove image from DOM

      });
  }

  function clearModal() // empty the modal 
  {
    const modalContainer = document.querySelector('.modal-container');
    while (modalContainer.firstChild) {
      modalContainer.removeChild(modalContainer.firstChild); // remove all children of the modalContainer element
    }
  }
  // #endregion

  //***************************MODAL ADD PHOTO***************************//
  // #region second modal
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
    closeModals();
  });

  function closeModals() {

    const addModal = document.querySelector('#modal-add');
    const modalBackdrop = document.querySelector('#modal-backdrop');
    const modal = document.querySelector('#modal-gallery');
    const errorMsgForm = document.getElementById('error-message');

    addModal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    modalBackdrop.style.display = 'none';
    addModal.style.display = 'none';
    errorMsgForm.style.display = 'none';
    clearModal(); // call the function clearModal
    clearAddModal(); // call the function clearAddModal to clear the second modal
  }

  // clear the add modal
  function clearAddModal() {
    document.getElementById('title-add-form').value = "";
    document.getElementById('category-add-select').selectedIndex = 0;

    let uploadedImage = document.getElementById('uploaded-image');

    const successMsgForm = document.getElementById('success-message');
    successMsgForm.style.display = 'none';

    uploadedImage.style.display = 'none';
    selectedFile = undefined;

    document.querySelector('.icon-add-photo .fa-image').style.display = 'block';
    document.querySelector('label[for="photo"]').style.display = 'inline-block';
    document.querySelector('.txt-add-photo').style.display = 'block';

    const btnValidate = document.getElementById('btn-validate');

    btnValidate.classList.remove('green');
  }

  document.getElementById('photo').addEventListener('change', function (event) {
    selectedFile = event.target.files[0];
    uploadedImage.src = URL.createObjectURL(selectedFile);
    uploadedImage.style.display = 'block';
    document.querySelector('.icon-add-photo .fa-image').style.display = 'none';
    document.querySelector('label[for="photo"]').style.display = 'none';
    document.querySelector('.txt-add-photo').style.display = 'none';

    checkFields()
  });

  document.getElementById("category-add-select").addEventListener('change', function () {
    checkFields();
  });

  document.getElementById('title-add-form').addEventListener('input', function () {
    checkFields();
  });

  function checkFields() {
    const checkTitle = document.getElementById('title-add-form').value;
    const checkCategory = document.getElementById('category-add-select').value;

    // Vérifie si les champs titre, catégorie et uploadedImage sont remplis
    if (selectedFile && checkTitle !== '' && checkCategory !== '') {
      btnValidate.classList.add('green');
      errorMsgForm.style.display = 'none';
      return true;
    } else {
      btnValidate.classList.remove('green');
      return false;
    }

  }

  document.getElementById('btn-validate').addEventListener('click', function () {
    let isValid = checkFields();
    if (isValid) {
      const imageUrl = URL.createObjectURL(selectedFile);
      const title = document.getElementById('title-add-form').value;
      const categoryId = document.getElementById('category-add-select').value;

      let formData = new FormData();
      formData.append('image', selectedFile); // Ajoute le fichier à l'objet FormData
      formData.append('title', title); // Ajoute la valeur du champ de titre au FormData
      formData.append('category', categoryId); // Ajoute la valeur du champ de catégorie au FormData

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
          if (response.ok) {
            addNewWork(title, imageUrl, categoryId);
            successMsgForm.style.display = 'flex';
            btnValidate.classList.remove('green');
            setTimeout(function () {
              closeModals();
            }, 2000)
          } else {
            errorMsgForm.style.display = 'flex';
          }
        })

    } else {
      errorMsgForm.style.display = 'flex';
    }
  });
  // #endregion
});

