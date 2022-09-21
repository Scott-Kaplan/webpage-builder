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

// test
import React, { useState, useEffect } from 'react'
//import ReactDOM from "react-dom"
// end

import { doc, setDoc } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';
import { useIonViewDidEnter } from '@ionic/react';
import { app } from '../firebase'
import { workers } from 'cluster';
console.log(app) // do this or get run time error

var leftPopupPresent = false

interface ContainerProps { }

// async function writeToFirebase(msg: HTMLElement) {
//   // need this next line otherwise HTMLDivElement object can't be saved to Firebase
//   var divTree = msg.outerHTML

//   await setDoc(doc(getFirestore(), "html", "cloudbuddy"), {
//     name: divTree
//   });
// }

function RightMousePrintHtml() {
  // var d1 = document.getElementById('main')!
  //console.log(d1)
  //< div class="container" id = "main" > <div id="write_text">left mouse click</div></div >
  // writeToFirebase(d1)
}

// Hide the left mouse click popup when
// [a] left clicking an option
// or 
// [b] right clicking to bring up the right click popup
const documentClickHandler = function (e: any) {
  const menu = document.getElementById('menu')!;
  console.log(e.target.innerText) // prints the selection made

  // the user left clicked on "Cancel"
  if (e.target.innerText === 'Cancel') {
    menu.classList.add('container__menu--hidden');
    document.removeEventListener('click', documentClickHandler);
  }
  // the user left clicked on "First action"
  if (e.target.innerText === 'First action') {
    menu.classList.add('container__menu--hidden');
    document.removeEventListener('click', documentClickHandler);
  }
  // the user left clicked on "Second action"
  if (e.target.innerText === 'Second action') {
    menu.classList.add('container__menu--hidden');
    document.removeEventListener('click', documentClickHandler);
  }
}

// Hide the right popup when left clicking
const documentClickHandler1 = function (e: any) {

  // this works
  resizeCssTagNamed_container__trigger()

  const menu2 = document.getElementById('menu2')!;
  const menu = document.getElementById('menu')!;
  console.log(e.target.innerText) // prints the selection made

  // the user left clicked on "disable designer"
  if (e.target.innerText === 'disable designer') {
    menu2.classList.add('container__menu--hidden');
    document.removeEventListener('click', documentClickHandler1);
    // without these next 2 lines, the left popup opens up
    menu.classList.add('container__menu--hidden');
    document.removeEventListener('click', documentClickHandler1);
  }
  // the user left clicked on "enable designer"
  else if (e.target.innerText === 'enable designer') {
    //console.log('close the right click menu')
    menu2.classList.add('container__menu--hidden');
    document.removeEventListener('click', documentClickHandler1);
    // without these next 2 lines, the left popup opens up
    menu.classList.add('container__menu--hidden');
    document.removeEventListener('click', documentClickHandler1);
  }

  // use case:
  /*
  bring up right popup
  bring up left popup
  verify --> right popup should close
  passes
  */
  else {
    // close the right popup, because want the left popup only to appear
    // otherwise both popups will appear at the same time
    menu2.classList.add('container__menu--hidden');
    document.removeEventListener('click', documentClickHandler1);
  }
}

function initializeRightClickMenu() {
  const ele2 = document.getElementById('element')!;
  const menu2 = document.getElementById('menu2')!;

  // 'contextmenu' is for right click
  ele2.addEventListener('contextmenu', function (e) {
    console.log('right click menu')
    e.preventDefault();

    const rect = ele2.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set the position for menu
    menu2.style.top = `${y}px`;
    menu2.style.left = `${x}px`;

    // Show the menu
    menu2.classList.remove('container__menu--hidden');

    document.addEventListener('click', documentClickHandler1);

    // use case:
    /*
    bring up left popup
    launch right popup
    verify --> left popup should close
    passes
    */
    if (leftPopupPresent) {
      // close the left popup, because want the right popup only to appear
      // otherwise both popups will appear at the same time
      const menu = document.getElementById('menu')!;
      menu.classList.add('container__menu--hidden');
      document.removeEventListener('click', documentClickHandler);
      leftPopupPresent = false
    }
  });
  // // Hide the menu when clicking outside of it
  // const documentClickHandler1 = function (e: any) {
  //   console.log(e.target.innerText) // prints the selection made
  //   if (e.target.innerText === 'disable designer') {
  //     console.log('close the right click menu')
  //     menu2.classList.add('container__menu--hidden');
  //     document.removeEventListener('click', documentClickHandler1);
  //   }
  // }
}

function initializeLeftClickMenu() {

  // doesn't work.  get null with the last 2 lines
  //   var win = window,
  //   doc = document,
  //   docElem = doc.documentElement,
  //   body = doc.getElementsByTagName('body')[0],
  //   x = win.innerWidth || docElem.clientWidth || body.clientWidth,
  //   y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
  // //alert(x + ' × ' + y); 1024 x 1016
  // const theWidth = document.getElementById('container__trigger')!
  // const theHeight = document.getElementById('container__trigger')!
  // theWidth.style.width=`${x}`
  // theHeight.style.height=`${y}`



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

    leftPopupPresent = true

  });
  // // Hide the menu when clicking outside of it
  // const documentClickHandler = function (e: any) {
  //   console.log(e.target.innerText) // prints the selection made
  //   if (e.target.innerText === 'Cancel') {
  //     console.log('outside the box')
  //     menu.classList.add('container__menu--hidden');
  //     document.removeEventListener('click', documentClickHandler);
  //   }
  //   return
  //   const isClickedOutside = !menu.contains(e.target);
  //   if (isClickedOutside) {
  //     console.log('outside the box')
  //     menu.classList.add('container__menu--hidden');
  //     document.removeEventListener('click', documentClickHandler);
  //   }
  // };
}



//TODO;
/*
google: 
continuously display container size when resizing window
https://www.pluralsight.com/guides/re-render-react-component-on-window-resize
running example: https://codesandbox.io/s/condescending-https-z6fmh
*/

// this works as written
// changes the css height and other fields of 'element' which is css attribute
// container__trigger
function resizeCssTagNamed_container__trigger() {
  var containerTriggerCss = document.getElementById('element')!
  containerTriggerCss.style.height = '100px'
  console.log('resizeCssTagNamed_container__trigger() executed')
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

  // these prevent 
  // Uncaught TypeError: Cannot read properties of null (reading 'toString')
  // in the pattern1 line below
  if (howdy.includes('enable designer')) return
  if (howdy.includes('disable designer')) return
  if (howdy.includes('First action')) return
  if (howdy.includes('Second action')) return
  if (howdy.includes('Cancel')) return

  //search for id="whatever", then trim to just get "whatever"
  var pattern1 = /id="[^"]*"/g
  var current = pattern1.exec(howdy)!
  let text9 = current.toString()
  let text1 = text9.substring(4)
  let text2 = text1.substring(0, text1.length - 1)
  console.log('high there', text2)

  // puts it to the direct right of the click me button
  var d1 = document.getElementById('element')!
  d1.insertAdjacentHTML('beforeend', '<div id="write_text"></div>')

  // puts it to the direct left of the click me button
  //var d1 = document.getElementById('element')!
  //d1.insertAdjacentHTML('afterbegin', '<div id="write_text"></div>')

  // puts it at the bottom, below the trigger window
  //var d1 = document.getElementById('element')!
  //d1.insertAdjacentHTML('afterend', '<div id="write_text"></div>')

  // doesn't put it anywhere
  //var d1 = document.getElementById('element')!
  //d1.insertAdjacentHTML('beforebegin', '<div id="write_text"></div>')

  //insertAjacentHTML documented here -
  // https://stackoverflow.com/questions/6304453/javascript-append-html-to-container-element-without-innerhtml
  // and https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML

  // puts it at the bottom, below the trigger window
  //var d1 = document.getElementById('main')!
  //d1.insertAdjacentHTML('beforeend', '<div id="write_text"></div>')

  //does nothing
  //var d1 = document.getElementById('main')!
  //d1.insertAdjacentHTML('afterbegin', '<div id="write_text"></div>')

  //both of these put in upper left corner
  //var d1 = document.getElementById('main')!
  //d1.insertAdjacentHTML('afterend', '<div id="write_text"></div>')
  //d1.insertAdjacentHTML('beforebegin', '<div id="write_text"></div>')


  // DON'T WORRY THAT THE click me BUTTON IS NOT CENTERED BECAUSE
  // IT WON'T BE THERE.  JUST A TEST FOR NOW.  ALL CHOICES WILL BE IN THE
  // LEFT POPUP AND RIGHT POPUP.
  var text = document.getElementById("write_text")!
  text.innerHTML = "<br><br><br><br><br>left mouse click"
  var sheet = document.createElement('style')
  sheet.innerHTML = "div {color:blue;overflow:hidden;}";
  document.body.appendChild(sheet);

  // this works great
  // const cssObj = window.getComputedStyle(text,null)
  // console.log(cssObj.color) // prints "rgb(0, 0, 255)"
  // console.log(cssObj.overflow) // prints "hidden"
}

const ExploreContainer: React.FC<ContainerProps> = () => {

  // test
  //
  function debounce(fn, ms) {
    let timer;
    return _ => {
      clearTimeout(timer);
      timer = setTimeout(_ => {
        timer = null;
        fn.apply(this, arguments);
      }, ms);
    };
  }

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  /* 
    Argument of type '() => (_: any) => void' is not assignable to parameter of type 'EffectCallback'.
    Type '(_: any) => void' is not assignable to type 'void | Destructor'.
    Type '(_: any) => void' is not assignable to type 'Destructor'.ts(2345)  
  */

    // LEFT OFF HERE.  FIX THIS ERROR
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }, 1000);

    window.addEventListener("resize", debouncedHandleResize);

    return (_: any) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });
  //
  // end


  useIonViewDidEnter(() => {  // after the page initially loads
    initializeLeftClickMenu()
    initializeRightClickMenu()

    // capture left mouse click
    document.addEventListener('click', function (e) {
      if (e.button === 0) {
        //console.log(e) prints the entire planet
        // console.log(this)
        //console.log('AT_TARGET',e.AT_TARGET);
        documentClickHandler1(e)
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
      <div className="container__trigger" id="element">

        {/* test */}
        <div>
          Rendered at {dimensions.width} x {dimensions.height}
        </div>
        {/* end */}


        {/* <div className="container__trigger" id="element">Right-click me</div> */}

        <input type='button' id="buttonid" value='click me' />
        <ul id="menu" className="container__menu container__menu--hidden">
          <li className="container__item">First action</li>
          <li className="container__item">Second action</li>
          <li className="container__divider"></li>
          <li className="container__item">Cancel</li>
        </ul>

        <ul id="menu2" className="container__menu container__menu--hidden">
          <li className="container__item">enable designer</li>
          <li className="container__divider"></li>
          <li className="container__item">disable designer</li>
        </ul>
      </div>
    </div>
  );
};

export default ExploreContainer;


/*
  TODO
  [1] need to get rid of blank with line separator at the top
*/
