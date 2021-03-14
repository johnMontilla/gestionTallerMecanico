  
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
        path: '/index/',
        url: 'index.html'
      },
      {
        path: '/registro/',
        url: 'registro.html',
      },
      {
        path: '/inicio/',
        url: 'inicio.html'
      },
      {
        path: '/clientes/',
        url: 'clientes.html'
      },
      {
        path: '/autos/',
        url: 'autos.html'
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

var db = firebase.firestore();
var usuarios = db.collection('usuarios');
var clientes = db.collection('clientes');

var datosUsuario ;
var dni ;

var barra = true;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

$$(document).on('page:init', function (e) {   
    console.log(e);    
})

// ***INDEX***
$$(document).on('page:init', '.page[data-name="index"]', function(e) {  
  console.log(e);
  
  $$('#registro').on('click', function(){
    console.log('ingrese a page init ');
    mainView.router.navigate('/registro/');
  });

  $$('#ingreso').on('click', FnIngresar);
})

// ***REGISTRO***
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {    
    console.log(e);
    $$('#registrar-usuario').on('click', FnRegistrar);
})

// ***INICIO***
$$(document).on('page:init', '.page[data-name="inicio"]', function(e) {
  console.log(e);

  $$('#ingresar-cliente').on('click', function(){
    mainView.router.navigate('/clientes/');
    console.log('entre en ingresar cliente');
  })

  $$('#ingresar-auto').on('click', function(){
    mainView.router.navigate('/autos/');
    console.log('entre en ingresar auto');   
    barra = true;
  })  
})

// ***CLIENTES***
$$(document).on('page:init', '.page[data-name="clientes"]',function(e){
  console.log(e);
  $$('.convert-form-to-data').on('click', FnTomarDatosCliente);   
  $$('.volver-inicio' ).on('click', FnVolverInicio);
})

// ***AUTOS***
$$(document).on('page:init', '.page[data-name="autos"]',function(e){
  console.log(e);
  console.log(barra);
  $$('#datos').text(JSON.stringify(datosUsuario));
  $$('.convert-form-to-data').on('click', FnTomarDatosAuto);   
 
  $$('#registrar-auto').on('click', FnMostarForm);
  $$('.volver-inicio' ).on('click', FnVolverInicio);
  
  if(barra){
    $$('#barra-busqueda').removeClass('oculto');    
  }else{
    FncargardatosCliente();
  }
  $$('#buscar').on('click', FnBuscarPersona);
})

// mis funciones

function FnRegistrar(){
    var nombre = $$('#nombre').value();
    var apellido = $$('#apellido').value();
    var rol= $$('#rol').value();
    var email = $$('#email').value();
    var password= $$('#password').value();
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then( function() {
      alert("registro ok");
      datos = {
        Nombre : nombre,
        Apellido : apellido,
        Rol : rol,
      }      
      usuarios.doc(email).set(datos);
      mainView.router.navigate('/inicio/');

    })
    .catch(function(error) {                  
      var errorCode = error.code;
      var errorMessage = error.message; 
      if (errorCode == 'auth/weak-password') {
          console.log('Clave muy débil.');
      } else {
          console.log(errorCode + "|" + errorMessage);
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
    mainView.router.navigate('/inicio/');
  } )
}


function FnTomarDatosCliente (){
  barra = false;
  var formData = app.form.convertToData('#my-form');
  dni = formData.documento;
  formData.autos= [];
  clientes.doc(dni).set(formData)
  .then(()=>{
   clientes.where("documento", "==", `${dni}`).get()   
    .then(function(querySnapshot) {      
      querySnapshot.forEach(function(doc) {
        datosUsuario= doc.data();      
      });
     
      mainView.router.navigate('/autos/');
    })        
  })
  .catch((error)=> {                  
    console.error("Error writing document: ", error);
  });      
}

function FnTomarDatosAuto(){
  var auto = app.form.convertToData('#my-form-autos');  
  console.log(auto);  
  db.collection('clientes').doc(dni).collection('autos').doc(auto.patente).set(auto)
  .then(()=>{
    mainView.router.navigate('/inicio/');
  })
  .catch((error)=> {                  
    console.error("Error writing document: ", error);
  });    
}

function FncargardatosCliente(){
  $$('#nombreApellido').text(`${datosUsuario.nombre} ${datosUsuario.apellido}`);
  $$('#dni').text(`${datosUsuario.documento} `);
  $$('#telefono').text(`${datosUsuario.telefono} `);
  $$('#email').text(`${datosUsuario.email} `);
  $$('#direccion').text(`${datosUsuario.direccion} `);
}

function FnMostarForm(){
  $$('#contenedor-agregar-auto').addClass('oculto');
  $$('#my-form-autos').removeClass('oculto');
}

function FnBuscarPersona(){
  var datos = $$('#buscar-dni').val();
  clientes.where("documento", "==", `${datos}`).get()   
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        datosUsuario= doc.data(); 
        console.log(datosUsuario); 
        FncargardatosCliente();
        dni= datosUsuario.documento;    
      })                    
    })        
}

function FnVolverInicio(){
  app.form.removeFormData('#my-form-autos');
  app.form.removeFormData('#my-form');
  mainView.router.navigate('/inicio/');
}