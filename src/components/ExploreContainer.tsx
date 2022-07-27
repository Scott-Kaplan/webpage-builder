import './ExploreContainer.css';
import { useIonViewDidEnter } from '@ionic/react';
interface ContainerProps { }

// this doesn't work in the browser
// import fs from 'fs';
// fs.writeFileSync("hello", "world"); 

// download raw html
// function downloadRawHtml() {
//   const html = document.querySelector('html').innerHTML;
//   const blob = new Blob([html], { type: 'text/html' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = 'index.html';
//   link.click();
// }

// function to write create a bold message on the web page
function writeBoldMessage() {
  var text = document.getElementById("boldStuff")!
  // text.innerHTML = "left mouse click";
  var error = `
  .error {
    color: red;
    font-size: 24px;
  }
  `
  text.innerHTML = "<div class='error'>left mouse click</span>"
}


// function changeText() {
//   var text = document.getElementById("boldStuff")!
//   text.innerHTML = "Hello World";
//   displayCorrectButtonWhenPageLoads();
// }

function reqListener(this: any) {
  console.log(this.responseText)
}

function displayCorrectButtonWhenPageLoads() {
  var oReq = new XMLHttpRequest()
  oReq.addEventListener("load", reqListener)
  oReq.open("GET", "http://localhost:8100/home")
  oReq.send();
}

const ExploreContainer: React.FC<ContainerProps> = () => {
  
  /*
  left off here
  https://stackoverflow.com/questions/707565/how-do-you-add-css-with-javascript
  https://reactjs.org/docs/faq-styling.html
  https://blog.bitsrc.io/understanding-render-props-in-react-1edde5921314
  https://stackoverflow.com/questions/28458208/using-a-css-stylesheet-with-javascript-innerhtml
  */
  
  useIonViewDidEnter(() => { // after the page initially loads, display the correct button
    console.log('ionViewDidEnter event fired');
    displayCorrectButtonWhenPageLoads()
  });

  // capture left mouse click
  document.addEventListener('click', function (e) {
    if (e.button === 0) {
      console.log('left mouse click');
      writeBoldMessage();
    }
  }, false);

  return (
    <div className="container">

      <p><b id='boldStuff'></b> </p>
      {/* <input type='button' onClick={changeText} value='Change Text' /> */}

      {/* <strong>Ready to create an app?</strong>
      <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p> */}


    </div>
  );
};

export default ExploreContainer;
