// CODE JS POUR LA CONNEXION DE L'UTILISATEUR //

const apiUrl = 'http://localhost:5678/api/users/login';
const loginForm = document.querySelector('#login-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const errorMessage = document.querySelector('#error-message');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;

      localStorage.setItem('token', token);

      window.location.href = 'http://127.0.0.1:5500/index.html'; // Redirige vers la page d'accueil
    } else {
      const error = await response.text();
      errorMessage.textContent = 'Les informations de l\'utilisateur ne sont pas correctes'; // Afficher un message d'erreur
    }
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});