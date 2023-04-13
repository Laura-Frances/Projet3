// SET THE TOKEN FOR USER CONNECTION //

// we create the variables
const apiUrl = 'http://localhost:5678/api/users/login';
const loginForm = document.querySelector('#login-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const errorMessage = document.querySelector('#error-message');

loginForm.addEventListener('submit', async (event) => 
{
  event.preventDefault(); // empêche la page de se recharger après la soumission du formulaire

  const email = emailInput.value; // on récupère les valeurs email et mdp
  const password = passwordInput.value;

  try // try-catch : execute une partie du code qui peut potentiellement échouer
  {
    const response = await fetch(apiUrl,
    {
      method: 'POST',//envoie la request POST afin de vérifier si l'user a entré les info de co valides
      headers: 
      {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) 
    {
      const data = await response.json(); // on stock les données extraites par la méthode json
      const token = data.token;

      localStorage.setItem('token', token); // on stock le token dans le localstorage
      window.location.href = 'http://127.0.0.1:5500/index.html'; // Redirects to homepage
    } 
    else 
    {
      const error = await response.text();
      errorMessage.textContent = 'Les informations de l\'utilisateur ne sont pas correctes';
    }
  } 
  catch (error) 
  {
    errorMessage.textContent = error.message;
  }
});