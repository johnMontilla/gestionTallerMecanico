  
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
        path: '/clientes-registo/',
        url: 'clientes-registo.html'
      },
      {
        path: '/clientes/',
        url: 'clientes.html'
      },
      {
        path: '/autos/',
        url: 'autos.html'
      },
      {
        path: '/turnos/',
        url: 'turnos.html'
      },
      {
        path: '/horarios/',
        url: 'horarios.html',        
      },
      {
        path: '/registro-auto/',
        url: 'registro-auto.html',        
      },
    ]
    // ... other parameters
});

var mainView = app.views.create('.view-main');

var db = firebase.firestore();
var usuarios = db.collection('usuarios');
var clientes = db.collection('clientes');
var turnos = db.collection('turnos');
var autos = db.collection('autos');
var diagnostico= db.collection('diagnostico');
var presupuesto= db.collection('presupuesto');

var datosUsuario ;
var dni ;
var datosAuto;
var dniAuto;
var idDato;

var barra = true;

var calendar;
var consulta;
var hora;
var dia;
var arrHorarios = ['09:00','09:20','09:40','10:00','10:20','10:40','11:00','11:20','12:00','12:20','12:40','13:00','13:20','13:40', '14:00','14:20','14:40','15:00','15:20','15:40', '16:00', '16:20', '16:40','17:00',]

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

$$(document).on('page:init', function (e) {   
    console.log(e);    
     
    let dia = new Date()    
    key = dia.getDate().toString() +'-' + (dia.getMonth() + 1).toString() + '-' + dia.getFullYear().toString(); 
    turnos.doc(key).get()          
    .then((doc) => {
      if (doc.exists){            
        consulta = doc.data();                
      }
    })
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
  
  $$('#turnos').on('click', function(){
    mainView.router.navigate('/turnos/');
    console.log('entre en turnos');    
  })

  $$('#diagnostico').on('click', function () {
    db.collection('clientes').doc('11111').collection('autos').doc('qwe123').get().then((doc)=>{if (doc.exists){console.log(doc.data())}})
  })
})

// ***CLIENTES-REGISTO***
$$(document).on('page:init', '.page[data-name="clientes-registo"]',function(e){
  console.log(e);
  $$('.convert-form-to-data').on('click', FnTomarDatosCliente);   
  $$('.volver-inicio' ).on('click', FnVolverInicio);
})
// ***CLIENTES***
$$(document).on('page:init', '.page[data-name="clientes"]',function(e){
  console.log(e);
  $$('#nuevo-cliente').on('click', function(){    
    mainView.router.navigate('/clientes-registo/');
  });

  $$('#btn-buscar-cliente' ).on('click',function(){
    $$('#barra-busqueda-cliente' ).removeClass('oculto');
    $$('#barra-busqueda-cliente' ).addClass('barra-cliente-visible');
    $$('#nuevo-cliente-btn-buscar-cliente').addClass('oculto')
  });

  $$('#buscar-cliente').on('click', function(){
    
    var datos = $$('#inp-buscar-cliente').val();
    FnBuscarPersona(datos);
    FnBuscarCargarAuto();
  });
})

// ***AUTOS***
$$(document).on('page:init', '.page[data-name="autos"]',function(e){
  console.log(e);  
  console.log(barra);        
 
  $$('#nuevo-auto').on('click', function () {
    barra = true;
    mainView.router.navigate('/registro-auto/');
  });  
  
  $$('#btn-buscar').on('click', function(){
    console.log('entre en buscar')
    $$('#barra-busqueda-auto ').removeClass('oculto');  
    $$('#barra-busqueda-auto').addClass('display-flex');
    $$('#nuevo-auto-btn-buscar').addClass('oculto');
  }) 
  
  $$('#buscar-auto').on('click', FnBuscarAuto);
  $$('.agregar-datos').on('click', function(){
    FnAgregarDatos(this.id);
  }) 

  $$('#aceptar-auto').on('click', FnCargarDiagPres); 
  $$('#cancelar-auto').on('click', FnVolverDiagPres); 
  $$('#hoja-ruta').on('click', FnHojaRuta)
  
})

//***TURNOS***
$$(document).on('page:init', '.page[data-name="turnos"]',function(e){
  console.log(e);
  $$('#horarios2').empty();
  FnMostrarTurnos();
  Fncalendario();  
  $$('.back-inicio').on('click', function () {
    mainView.router.navigate('/inicio/')
    $$('#horarios').empty();
  })
})

// ***HORARIOS***
$$(document).on('page:init', '.page[data-name="horarios"]', function (e) {
    
  FnMostrarTurnos();  

  $$('.disponible').on('click', function(){
  console.log('entre en calendario'); 
  FnCambiarHora(this.id);  
  })

  $$('.popup-about').on('popup:closed', function (e) {
    console.log('About popup open');    
    app.form.removeFormData('#my-form-turno');
  });  

  $$('#agendar-turno').on('click', FnAgendarTurno);

  $$('.back-turnos').on('click', function () {
    mainView.router.navigate('/turnos/')
    $$('#horarios').empty();
  })  
})

// ***REGISTRO AUTO***
$$(document).on('page:init', '.page[data-name="registro-auto"]',function(e){
  console.log(e);  
  console.log(barra);   
  $$('.convert-form-to-data').on('click', FnTomarDatosAuto);   
 
  $$('#registrar-auto').on('click', FnMostarForm);
  $$('.volver-inicio' ).on('click', FnVolverInicio);
  
  if(barra){
    $$('#barra-busqueda').removeClass('oculto');  
    $$('#barra-busqueda').addClass('display-flex');
    $$('#datos-cliente').addClass('oculto');  
  }
  else{
    FncargardatosCliente();
  }
  $$('#buscar').on('click', function(){
    var datos = $$('#buscar-dni').val();
    FnBuscarPersona(datos)
  });
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
    app.form.removeFormData('#my-form'); 
    mainView.router.navigate('/inicio/');
  } )
}

function FnTomarDatosCliente (){
  barra = false;
  var formData = app.form.convertToData('#my-form');
  dni = formData.documento;  
  clientes.doc(dni).set(formData)
  .then(()=>{
   datosUsuario= formData;   
   app.form.removeFormData('#my-form');        
   mainView.router.navigate('/registro-auto/');
  }) 
  .catch((error)=> {                  
    console.error("Error writing document: ", error);
  });      
}

function FnTomarDatosAuto(){
  var auto = app.form.convertToData('#my-form-autos'); 
  auto.dni = dni ;
  auto.fecha = new Date();
  console.log(auto);  
  console.log(dni)
  autos.doc(auto.patente).set(auto)
  .then(()=>{
    app.form.removeFormData('#my-form-autos');
    mainView.router.navigate('/inicio/');
  })
  .catch((error)=> {                  
    console.error("Error writing document: ", error);
  });    
}

function FncargardatosCliente(){
  $$('#datos-cliente,#resultado-cliente ').removeClass('oculto');
  $$('#contenedor-agregar-auto').removeClass('oculto');  
  $$('#nombreApellido, #nombreApellido-busqueda').text(`Nombre: ${datosUsuario.nombre} ${datosUsuario.apellido}`);
  $$('#dni , #dni-busqueda').text(`DNI: ${datosUsuario.documento} `);
  $$('#telefono,#telefono-busqueda').text(`Telefono: ${datosUsuario.telefono} `);
  $$('#email,#email-busqueda').text(`Email: ${datosUsuario.email} `);
  $$('#direccion, #direccion-busqueda').text(`Direccion: ${datosUsuario.direccion} `);
  dni = datosUsuario.documento;
  console.log(dni)
}

function FnMostarForm(){
  $$('#contenedor-agregar-auto').addClass('oculto');
  $$('#my-form-autos').removeClass('oculto');
}

function FnBuscarPersona(datos){  
  clientes.doc(datos).get()
  .then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        datosUsuario= doc.data(); 
        FncargardatosCliente();        
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
  })
}

function FnBuscarCargarAuto(){
  var datos = $$('#inp-buscar-cliente').val();
  autos.where('dni', '==', datos).get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      $$('#lista-autos').append(`<li>
      <div class="item-content">
        <!-- <div class="item-media">
          <img src="https://cdn.framework7.io/placeholder/people-160x160-1.jpg" width="80" />
        </div> -->
        <div class="item-inner">
          <div class="item-title-row">
            <div class="item-title">Patente: ${doc.data().patente}</div>
            
          </div>
          <div class="item-subtitle">Color: ${doc.data().color}</div>
          <div class="item-subtitle">Marca: ${doc.data().marca}</div>
          <div class="item-subtitle">vercion: ${doc.data().vercion}</div>
          <div class="item-subtitle">modelo: ${doc.data().modelo}</div>
          
        </div>
      </div>
      <div class="sortable-handler"></div>
    </li>`)
    });
  })
}

function FnBuscarAuto(){
  $$('#diagnostico-presupuesto').addClass('oculto');
  var datos = $$('#buscar-patente').val();
  console.log(datos)
  autos.doc(datos).get()
  .then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        datosAuto= doc.data(); 
        $$('#datos-auto ,#btn-diag-presu').removeClass('oculto');
        FncargardatosAuto();        
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
  })
}

function FncargardatosAuto(){
  $$('#patente').text(`Patente: ${datosAuto.patente} `);
  $$('#color').text(`Color: ${datosAuto.color} `);
  $$('#kilometraje').text(`Km: ${datosAuto.kilometraje} `);
  $$('#marca').text(`Marca: ${datosAuto.marca} `);
  $$('#modelo').text(`Modelo: ${datosAuto.modelo} `);
  dniAuto = datosAuto.dni;  
  console.log(dniAuto);
}

function FnHojaRuta() {
  // $$('#btn-diag-presu').addClass('oculto');
  let array = []
  autos.doc(datosAuto.patente).get()
  .then((doc)=>{
    if(doc.exists){
      xxx = doc.data();
       xxx.fecha =doc.data().fecha.toDate(); 
       array.push(xxx); console.log(array[0].fecha.getTime())   
    }
    presupuesto.where('patente','==','pha990').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        xxx = doc.data(); xxx.fecha =doc.data().fecha.toDate(); array.push(xxx);
          
      });
      diagnostico.where('patente','==','pha990').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          xxx = doc.data(); xxx.fecha =doc.data().fecha.toDate(); array.push(xxx);
            
        });
        console.log(array.sort(function(a, b) { return new Date(a.fecha).getTime() - new Date(b.fecha).getTime()})) 
        let meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
        console.log(array[2].fecha.getHours(), array[2].fecha.getSeconds(),  )   
        for(let i = 0; i<array.length;i++){
          $$('#hoja-ruta-lista').append(
            `<div class="timeline-item">
              <div class="timeline-item-date">${array[i].fecha.getDate()} <small>${meses[array[i].fecha.getMonth()]}</small></div>
              <div class="timeline-item-divider"></div>
              <div class="timeline-item-content">
                <div class="timeline-item-inner">
                  <div class="timeline-item-time">${array[i].fecha.getHours()}:${array[i].fecha.getMinutes()}</div>
                  <div class="timeline-item-title">${array[i].estado}</div>
                  
                  <div class="timeline-item-text">${array[i].descripcion}</div>
                </div>
              </div>
            </div>`
          )
        }    
      })
    })    
  })
}

function FnAgregarDatos(id){  
  $$('#hoja-ruta-lista').empty();
  $$('#diagnostico-presupuesto').removeClass('oculto');
  $$('#btn-diag-presu').addClass('oculto');
  idDato= id.charAt(0).toUpperCase() + id.slice(1);
  $$('#titulo-dato').text(idDato);   
  console.log(idDato)
}

function FnCargarDiagPres() {
  let descripcion = $$('#descripcion').val();
  console.log(descripcion)
  var fechaEnMiliseg = Date.now();
  let doc = idDato.toLowerCase();
  db.collection(`${doc}`).doc(datosAuto.patente + '-' + fechaEnMiliseg ).set({ descripcion: descripcion, fecha: new Date(), patente: datosAuto.patente, estado:idDato})
  .then(()=>{
    FnVolverDiagPres()
  })
}

function FnVolverDiagPres() {
  $$('#diagnostico-presupuesto').addClass('oculto');
    $$('#btn-diag-presu').removeClass('oculto');
    $$('#descripcion').val('');
}

function FnVolverInicio(){
  app.form.removeFormData('#my-form-autos');
  app.form.removeFormData('#my-form');  
  mainView.router.navigate('/inicio/');
}

function FnCambiarHora(id){
  console.log(id)
  hora = id;
  hora = hora.replace('h','');  
  $$('#horario-turno').text('horario de: ' + hora)
  console.log(hora)
    
}

function FnAgendarTurno() {
  var formData = app.form.convertToData('#my-form-turno');
  console.log(formData);
  let horario = { cliente : formData.cliente, documento:formData.documento, libre: false}  ;
  let key = FnFecha(calendar);
  switch (hora) {
  case '09:00':
    turnos.doc(key).update({'09:00': horario});
    break;
  case '09:20':
    turnos.doc(key).update({'09:20': horario});
    break;
  case '09:40':
    turnos.doc(key).update({'09:40': horario});
    break;
  case '10:00':
    turnos.doc(key).update({'10:00': horario});
    break;
  case '10:20':
    turnos.doc(key).update({'10:20': horario});
    break;
  case '10:40':
    turnos.doc(key).update({'10:40': horario});
    break;
  case '11:00':
    turnos.doc(key).update({'11:00': horario});
    break;
  case '11:20':
    turnos.doc(key).update({'11:20': horario});
    break;
  case '11:40':
    turnos.doc(key).update({'11:40': horario});
    break;
  case '12:00':
    turnos.doc(key).update({'12:00': horario});
    break;
  case '12:20':
    turnos.doc(key).update({'12:20': horario});
    break;
  case '12:40':
    turnos.doc(key).update({'12:40': horario});
    break;
  case '13:00':
    turnos.doc(key).update({'13:00': horario});
    break;
  case '13:20':
    turnos.doc(key).update({'13:20': horario});
    break;
  case '13:40':
    turnos.doc(key).update({'13:40': horario});
    break;
  case '14:00':
    turnos.doc(key).update({'14:00': horario});
    break;
  case '14:20':
    turnos.doc(key).update({'14:20': horario});
    break;
  case '14:40':
    turnos.doc(key).update({'14:40': horario});
    break;
  case '15:00':
    turnos.doc(key).update({'15:00': horario});
    break;
  case '15:20':
    turnos.doc(key).update({'15:20': horario});
    break;
  case '15:40':
    turnos.doc(key).update({'15:40': horario});
    break;
  case '16:00':
    turnos.doc(key).update({'16:00': horario});
    break;
  case '16:20':
    turnos.doc(key).update({'16:20': horario});
    break;
  case '16:40':
    turnos.doc(key).update({'16:40': horario});
    break;
  case '17:00':
    turnos.doc(key).update({'17:00': horario});
    break;
  default:
    console.log('no hay turnos')
    break;

  } 
  mainView.router.navigate(`/turnos/`); 
}

function FnFecha(calendar) {
 dia = calendar.getValue() ; 
return dia[0].getDate().toString() +'-' + (dia[0].getMonth() + 1).toString() + '-' + dia[0].getFullYear().toString(); 
}

function FnHorarios(key , obj) {  
  console.log(arrHorarios[0])  
  turnos.doc(key).set({
    '09:00':obj, '09:20':obj,'09:40':obj,'10:00':obj,'10:20':obj,'10:40':obj,'11:00':obj,'11:20':obj,'11:40':obj,'12:00':obj,'12:20':obj,'12:40':obj,'13:00':obj,'13:20':obj,'13:40':obj,'14:00':obj,'14:20':obj,'14:40':obj,'15:00':obj,'15:20':obj,'15:40':obj,'16:00':obj,'16:20':obj,'16:40':obj,'17:00':obj,
  });
  
}

function Fncalendario(){
  calendar = app.calendar.create({
    inputEl: '#demo-calendar-date-format',
    dateFormat: { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' },
    closeOnSelect: true,
    minDate:new Date(),   
   
    // disabled: [new Date(2021, 02, 17), new Date(2021, 02, 18)],
    // events:[
    //   {
    //     date: new Date(2021, 02, 25),
    //     color: '#2196f3',
    //     cssClass: 'azul',
    //     background: 'blue',
    //   },
    //   // same date but different color, one more dot will be added to this day
    //   {
    //     date: new Date(2021, 02, 18),
    //     color: '#4caf50',
    //     background: 'aqua',
    //   },
    // ],
    
    // rangesClasses: [
    //   //Add "day-october' class for all october dates
    //   {
    //       // string CSS class name for this range in "cssClass" property
    //       // cssClass: 'azul', //string CSS class
    //       // Date Range in "range" property
    //       range: function (date) {
    //           return date.getDate() === 25
    //       }
    //   },
    //   //Add "day-holiday" class for 1-10th January 2016
    //   {
    //     cssClass: 'azul',
        
    //     range: {
    //       // from: new Date(2021, 02, 17),
    //       // to: new Date(2021, 02, 17)
    //       date: new Date(2021, 02, 22),
    //     },
          
    //   }
    // ],
    
    on: {
      closed: function () {
        $$('#horarios').empty();
        FnCargarTurnos();
               
      }      
    }
  })
  calendar.setValue([Date.now()])
}

function FnCargarTurnos() {
  let key = FnFecha(calendar);  
  
  turnos.doc(key).get()          
  .then((doc) => {
    if (doc.exists){            
      consulta = doc.data();            
      mainView.router.navigate(`/horarios/`);
       
    } else {            
      console.log("No such document!");
      let obj= {'cliente': '', 'documento':'' , 'libre': true , }            
      FnHorarios(key, obj);
      turnos.doc(key).get()          
      .then((doc) => {
        if (doc.exists){            
          consulta = doc.data(); 
          console.log('cree el doc '+consulta);
          mainView.router.navigate(`/horarios/`);
        }              
      })
    }           
  })
}

function FnMostrarTurnos() {
   
  let objeto = consulta
  for(let i = 0 ; i< arrHorarios.length; i++){
    for (let property in objeto) {      
      if(property == arrHorarios[i]  ){
        if(objeto[property].libre == false){
          $$('#horarios'  ).append(`<li class='disponible popup-open' data-popup=".popup-about" id='h${arrHorarios[i]}'>${property} <br> Cliente: ${objeto[property].cliente} <br> Documento: ${objeto[property].documento} </li>`);
          $$('#horarios2'  ).append(`<li class=' popup-open' data-popup=".popup-about" id='h${arrHorarios[i]}'>${property} <br> Cliente: ${objeto[property].cliente} <br> Documento: ${objeto[property].documento} </li>`);      
        }
        else{
          $$('#horarios'  ).append(`<li class='disponible popup-open' data-popup=".popup-about" id='h${arrHorarios[i]}'>${property} <br>libre</li>`);
          $$('#horarios2'  ).append(`<li class=' popup-open' data-popup=".popup-about" id='h${arrHorarios[i]}'>${property} <br>libre</li>`);
        }
      }
      
    }
  }
}