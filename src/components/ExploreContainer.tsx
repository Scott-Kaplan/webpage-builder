import './ExploreContainer.css';
import { useIonViewDidEnter } from '@ionic/react';
interface ContainerProps { }

function RightMousePrintHtml() {
  var d1 = document.getElementById('main')!
  // this is correct
  //console.log(d1)
  //< div class="container" id = "main" > <div id="write_text">left mouse click</div></div >

/*
  left off here:  need to get rid of blank with line separator at the top
*/ 

}

function leftMouseWriteText() {

  // this prevents <div id="tag"></div> from being created more than once
  if (document.getElementById("write_text"))
    return

  var d1 = document.getElementById('main')!
  //insertAjacentHTML documented here -
  // https://stackoverflow.com/questions/6304453/javascript-append-html-to-container-element-without-innerhtml
  // and https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
  d1.insertAdjacentHTML('beforeend', '<div id="write_text"></div>')
  var text = document.getElementById("write_text")!
  text.innerHTML = "left mouse click"
  var sheet = document.createElement('style')
  sheet.innerHTML = "div {color:blue;overflow:hidden;}";
  document.body.appendChild(sheet);

  // this works great
  // const cssObj = window.getComputedStyle(text,null)
  // console.log(cssObj.color) // prints "rgb(0, 0, 255)"
  // console.log(cssObj.overflow) // prints "hidden"
}

const ExploreContainer: React.FC<ContainerProps> = () => {

  useIonViewDidEnter(() => {  // after the page initially loads
    // capture left mouse click
    document.addEventListener('click', function (e) {
      if (e.button === 0) {
        // console.log('left mouse click');
        leftMouseWriteText();
      }
    }, false);

    // capture right mouse click
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      console.log('right mouse click');
      RightMousePrintHtml();
    }, false);
  });

  return (
    <div className="container" id="main">
      {/* <input type='button' onClick={changeText} value='Change Text' /> */}
    </div>
  );
};

export default ExploreContainer;
