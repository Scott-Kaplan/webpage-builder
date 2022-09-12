/*
  left click creates and element and right click saves it to the database
  if add functionality to reload it from the database (at startup)
  it wipes everything else out
  so, lets say add a button with regular ionic code and want to change
  the css on it.  how would one do that?
  how would one change the background color below or above the button?
*/

/*
  when left click, bring up a menu -
  https://htmldom.dev/show-a-custom-context-menu-at-clicked-position/
  // click the code folder button and see the entire source code.

  [1] delete
  [2] modify
  when right click, bring up a menu with these two options -
  [1] put into designer mode
  [2] put into regular mode
  [3] write to firebase
*/

import './ExploreContainer.css';
import { doc, setDoc } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';
import { useIonViewDidEnter } from '@ionic/react';
import { app } from '../firebase'
import { workers } from 'cluster';
console.log(app) // do this or get run time error

interface ContainerProps { }

// async function writeToFirebase(msg: HTMLElement) {
//   // need this next line otherwise HTMLDivElement object can't be saved to Firebase
//   var divTree = msg.outerHTML

//   await setDoc(doc(getFirestore(), "html", "cloudbuddy"), {
//     name: divTree
//   });
// }

function RightMousePrintHtml() {
  var d1 = document.getElementById('main')!
  //console.log(d1)
  //< div class="container" id = "main" > <div id="write_text">left mouse click</div></div >
  // writeToFirebase(d1)
}

function initializeMenuPopup() {
  const ele = document.getElementById('element')!;
  const menu = document.getElementById('menu')!;

  // 'contextmenu' is for right click
  //ele.addEventListener('contextmenu', function (e) {
  // this function is executed when move the cursor from its previous position and left clicking
  // so as not to select an option in the popup
  ele.addEventListener('click', function (e) {
    console.log('moved popup')
    e.preventDefault();

    const rect = ele.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set the position for menu
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;

    // Show the menu
    menu.classList.remove('container__menu--hidden');

    document.addEventListener('click', documentClickHandler);
  });
  // Hide the menu when clicking outside of it
  const documentClickHandler = function (e: any) {
    console.log(e.target.innerText) // prints the selection made
    if (e.target.innerText === 'Cancel') {
      console.log('outside the box')
      menu.classList.add('container__menu--hidden');
      document.removeEventListener('click', documentClickHandler);
    }

    return
    const isClickedOutside = !menu.contains(e.target);
    if (isClickedOutside) {
      console.log('outside the box')
      menu.classList.add('container__menu--hidden');
      document.removeEventListener('click', documentClickHandler);
    }
  };
}

function leftMouseWriteText() {
  // this prevents <div id="tag"></div> from being created more than once
  if (document.getElementById("write_text"))
    return

  // assuming there is button already on the screen
  // dynamically change the background color of the button
  /*
     1 get boundry of button
     2 is cursor within the boundry
     3 yes - get element
  */

  // steps of how to get here
  // hover over the click me button
  // left click
  // the last element is "buttonid"
  // try the 132 answer with green checkmark to try and get "buttonid"
  //https://stackoverflow.com/questions/5684811/in-queryselector-how-to-get-the-first-and-get-the-last-elements-what-traversal
  var elements = document.querySelectorAll(':hover');
  var first = elements[0]
  var last = elements[elements.length - 1]

  console.log('length', elements.length)
  console.log('first', first)
  console.log('last', last)

  // convert element to a string
  let howdy = last.outerHTML

  //search for id="whatever", then trim to just get "whatever"
  var pattern1 = /id="[^"]*"/g
  var current = pattern1.exec(howdy)!
  let text9 = current.toString()
  let text1 = text9.substring(4)
  let text2 = text1.substring(0, text1.length - 1)
  console.log('high there',text2)



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
    initializeMenuPopup()
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
      <div className="container__trigger" id="element"></div>
      {/* <div className="container__trigger" id="element">Right-click me</div> */}

      <input type='button' id="buttonid" value='click me' />
      <ul id="menu" className="container__menu container__menu--hidden">
        <li className="container__item">First action</li>
        <li className="container__item">Second action</li>
        <li className="container__divider"></li>
        <li className="container__item">Cancel</li>
        {/*  
        LEFT OFF HERE
        modify right click to enable or cancel designer mode

        */}
      </ul>
    </div>
  );
};

export default ExploreContainer;


/*
  TODO
  left off here:  need to get rid of blank with line separator at the top
*/
