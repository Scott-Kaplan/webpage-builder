import './ExploreContainer.css';
import { doc, setDoc } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';
import { useIonViewDidEnter } from '@ionic/react';
import { app } from '../firebase'
console.log(app) // do this or get run time error


interface ContainerProps { }

async function test(msg: HTMLElement) {
  // need this next line otherwise get HTMLDivElement object can't be saved to Firebase
  var divTree = msg.outerHTML
  //console.log(msg.dataset)
  // console.log(msg.getAttributeNames())
  // console.log(msg.getAttributeNS)
  // console.log(msg.getAttributeNode)
  // console.log(msg.DOCUMENT_NODE)
  // console.log(msg.childNodes)
  // console.log(msg.children)
  // console.log(msg.getElementsByClassName)
  // console.log(msg.getElementsByTagName)
  // console.log(msg.getElementsByTagNameNS)
  // console.log(msg.getRootNode())

  //var data1 = {divTree} // just adds divTree to string, still a string - doesn't help
  // without this next line, nothing comes out when read
  // with this line all it does is add divTree to the string
  // but it is still a string
  // var json1 = JSON.stringify(data1)
  // console.log(json1)

  // {"<div class=\"container\" id=\"main\"><div id=\"write_text\">left mouse click</div></div>"}  

  // convert divTree to object
  // var divTreeObj = JSON.parse(divTree) // error
  // console.log(typeof divTreeObj)
  // var divTreeArray = divTree.split('') // just puts '' around every character
  // console.log(typeof divTreeArray)
  // console.log(divTreeArray)

  //const myelement = (<div className="container" id="main"><div id="write_text">left mouse click</div></div>)

  const myelement = {
    // "main": {
      "html": "<div class=\"container\" id=\"main\"><div id=\"write_text\">left mouse click</div></div>"
    // }
  }

  await setDoc(doc(getFirestore(), "html", "cloudbuddy"), {
    //name: divTree // original
    //name: json1 // just puts divTree at the beginning, same as otherwise
    name: myelement
  });
}

function RightMousePrintHtml() {
  var d1 = document.getElementById('main')!
  //console.log(d1)
  //< div class="container" id = "main" > <div id="write_text">left mouse click</div></div >
  test(d1)
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


/*
  TODO
  left off here:  need to get rid of blank with line separator at the top
*/
