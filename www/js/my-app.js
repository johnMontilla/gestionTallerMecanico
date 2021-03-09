  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/registro/',
        url: 'registro.html',
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
    
})

$$(document).on('page:init', '.page[data-name="index"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  
  $$('#registro').on('click', function(){
    console.log('ingrese a page init ')
    mainView.router.navigate('/registro/');
  });

  $$('#ingreso').on('click', FnIngresar)
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="registrarse"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    $$('#reg-usua').on('click', FnRegistrar)
})

function FnRegistrar(){
  var email = $$('#email').value();
  var password= $$('#password').value();
 
  firebase.auth().createUserWithEmailAndPassword(email, password)
      .then( function() {
           alert("registro ok");

      })

      .catch(function(error) {          
      // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message; 
          if (errorCode == 'auth/weak-password') {
              alert('Clave muy débil.');
          } else {
              alert(errorCode + "|" + errorMessage);
          }
          console.log(error);
      });
}

function FnIngresar(){
  var email = $$('#email-ingreso').value();
  var password= $$('#pass-ingreso').value();

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(()=>{
    console.log('entre');
  } )

}