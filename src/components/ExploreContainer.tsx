import './ExploreContainer.css';
import { useIonViewDidEnter } from '@ionic/react';
interface ContainerProps { }

function writeText() {

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

  const cssObj = window.getComputedStyle(text,null)
  console.log(cssObj.color) // prints "rgb(0, 0, 255)"
  console.log(cssObj.overflow) // prints "hidden"
}

const ExploreContainer: React.FC<ContainerProps> = () => {

  useIonViewDidEnter(() => {  // after the page initially loads
    // capture left mouse click
    document.addEventListener('click', function (e) {
      if (e.button === 0) {
        // console.log('left mouse click');
        writeText();
      }
    }, false);
  });

  return (
    <div className="container" id="main">
      {/* <input type='button' onClick={changeText} value='Change Text' /> */}
    </div>
  );
};

export default ExploreContainer;
