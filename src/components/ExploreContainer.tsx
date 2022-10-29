import './ExploreContainer.css';
import React, { useState, useEffect } from 'react'
import { doc, setDoc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';
import { useIonViewDidEnter } from '@ionic/react';
import { app } from '../firebase'
import { firestore } from '../firebase';
console.log(app) // do this or get run time error

var leftPopupPresent = false

var xStartPositionOfDiv: any;
var yStartPositionOfDiv: any;
//var widthOfLeftClickMenu: any; // made no difference

interface ContainerProps { }

async function writeToFirebase(msg: HTMLElement) {
  // need this next line otherwise HTMLDivElement object can't be saved to Firebase
  var divTree = msg.outerHTML

  await setDoc(doc(getFirestore(), "html", "cloudbuddy"), {
    name: divTree
  });
}

function RightMousePrintHtml() {
  // get all of the html for the whole page
  // var d1 = document.getElementById('main')!
  //var d1 = document.getElementById('element')!
  var d1 = document.getElementById('id_you_like')!

  console.log(d1)
  //< div class="container" id = "main" > <div id="write_text">left mouse click</div></div >
  writeToFirebase(d1)
}

// Hide the left mouse click popup when
// [a] left clicking an option
// or 
// [b] right clicking to bring up the right click popup
const documentClickHandler = function (e: any) {
  const menu = document.getElementById('menu')!;
  //console.log(e.target.innerText) // prints the selection made

  // the user left clicked on "Cancel"
  if (e.target.innerText === 'Cancel') {
    menu.classList.add('container__menu--hidden');
    document.removeEventListener('click', documentClickHandler);
  }
  // the user left clicked on "Create div"
  else if (e.target.innerText === 'Create div') {
    menu.classList.add('container__menu--hidden');
    document.removeEventListener('click', documentClickHandler);

    // prints all divs
    //var allDivTags = document.getElementsByTagName("div")
    //console.log('by tag name\n',allDivTags)
    //let divNodeList = document.querySelectorAll("div")
    //console.log('by query selector\n',divNodeList)
    //console.log(divNodeList.item(4).id)

    // get parent div
    var parentDiv = document.getElementById('element')!

    var testDiv = document.getElementById('main')

    var yPositionFromVerticalScroll = testDiv?.scrollTop
    var combinedYPositions = yStartPositionOfDiv + yPositionFromVerticalScroll
    var xPositionFromVerticalScroll = testDiv?.scrollLeft
    var combinedXPositions = xStartPositionOfDiv + xPositionFromVerticalScroll
    //console.log(`${combinedXPositions},${combinedYPositions}`)

    // get bottom div within the parent div
    var d1 = document.getElementById('element')!.firstChild
    //console.log('first child = ', d1)
    // create a new div
    var sp1 = document.createElement('div')
    // create an id for the div
    sp1.setAttribute("id", "id_you_like")
    // create a class for the div
    sp1.classList.add("foo")
    // create text to display in the div
    sp1.innerHTML = "Hello";
    // insert the newly created div before the bottom div in the parent div
    parentDiv.insertBefore(sp1, d1)
    // create class properties for the newly created div   
    let collection1 = document.getElementsByClassName("foo") as HTMLCollectionOf<HTMLElement>
    // these 3 lines create the new div at the position
    // where the upper left corner that the left menu popup is at
    collection1[0].style.position = "absolute"
    collection1[0].style.left = `${combinedXPositions}px`
    collection1[0].style.top = `${combinedYPositions}px`
    collection1[0].style.height = "100px"
    collection1[0].style.background = "red"
    collection1[0].style.color = "white"
    // display dimmensions of div
    var text = document.getElementById("id_you_like")!
    // console.log('height including padding and border: ', text.offsetHeight)
    // console.log('width including padding and border: ', text.offsetWidth)
  }
  // the user left clicked on "Second action"
  else if (e.target.innerText === 'Second action') {
    menu.classList.add('container__menu--hidden');
    document.removeEventListener('click', documentClickHandler);
  }
  else {
    // store the x and y coordinates in pixels of where the left popup menu starts
    xStartPositionOfDiv = e.clientX
    yStartPositionOfDiv = e.clientY
    // console.log('ELSE x position = ', e.clientX)
    // console.log('ELSE y position = ', e.clientY)
  }
}

// Hide the right popup when left clicking
const documentClickHandler1 = function (e: any) {

  const menu2 = document.getElementById('menu2')!;
  const menu = document.getElementById('menu')!;
  //console.log(e.target.innerText) // prints the selection made

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

  // Test case:
  // [1] bring up right popup
  // [2] bring up left popup
  // [3] verify --> the right popup should close
  // passes
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
    //console.log('right click menu')
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

    // Test case:
    // [1] bring up left popup
    // [2] launch right popup
    // [3] verify --> left popup should close
    //  passes
    if (leftPopupPresent) {
      // close the left popup, because want the right popup only to appear
      // otherwise both popups will appear at the same time
      const menu = document.getElementById('menu')!;
      menu.classList.add('container__menu--hidden');
      document.removeEventListener('click', documentClickHandler);
      leftPopupPresent = false
    }
  });
}

function initializeLeftClickMenu() {
  const ele = document.getElementById('element')!;
  const menu = document.getElementById('menu')!;

  // This function is executed when the user moves the left popup.
  // proceedurally the user moves the cursor from its previous position and left clicks.
  // This function is not executed when the user selects an option from the left popup.
  ele.addEventListener('click', function (e) {
    // console.log('moved popup')
    e.preventDefault();

    const rect = ele.getBoundingClientRect();

    /* CALCULATE & START THE LEFT CLICK MENU AT THIS X COORDINATE */
    var xPositionOfCursor = e.clientX
    var widthOfLeftClickMenu = menu.offsetWidth
    var widthOfBrowserWindow = rect.width
    /*
      If the first left click done by the user is too close to outside the
      viewable window, the menu will appear at least partially off the screen.
      This is because since the menu hasn't been put up yet to this point,
      it's value is zero.
      So just give it a default length.
      In general, if wanted to calculate this programatically, mutiply each
      character of the longest string that appears in the menu by 10, 
      then add 5 at the end.  The units of the numbers are in pixels
      Note: this may not work on a different monitor other than my 2048x1152 one
    */
    if (widthOfLeftClickMenu === 0)
      widthOfLeftClickMenu = 130

    // Set the x position of the left click menu
    if ((xPositionOfCursor + widthOfLeftClickMenu) >= widthOfBrowserWindow)
      menu.style.left = `${xPositionOfCursor - widthOfLeftClickMenu}px`;
    else
      menu.style.left = `${xPositionOfCursor}px`
    /* END */

    /* CALCULATE & START THE LEFT CLICK MENU AT THIS Y COORDINATE */
    var yPositionOfCursor = e.clientY
    var heightOfLeftClickMenu = menu.offsetHeight
    var heightOfBrowserWindow = window.innerHeight
    var y = yPositionOfCursor - rect.top;

    // Set the y position of the left click menu
    if ((yPositionOfCursor + heightOfLeftClickMenu) >= heightOfBrowserWindow)
      menu.style.top = `${y - heightOfLeftClickMenu}px`;
    else
      menu.style.top = `${y}px`
    /* END */

    // Show the menu
    menu.classList.remove('container__menu--hidden');

    document.addEventListener('click', documentClickHandler);
    leftPopupPresent = true
  });
}

// This function changes the css height & width of container where the popup can appear.
// it matches the size of the browser window.  If the browser window is made larger
// or smaller the container size will match it.
// This function though does not impact the vertical scroll bar
// which is defined in ExploreContainer.css, the height property in .container__trigger
function resizeCssTagNamed_container__trigger() {
  document.getElementById('element')!.style.height = window.innerHeight.toString()
  document.getElementById('element')!.style.width = window.innerWidth.toString()
  //console.log('resized container')
}

function leftMouseWriteText() {
  // this prevents  <div id="tag"></div>  from being created more than once
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

  //console.log('length', elements.length)
  //console.log('first', first)
  //console.log('last', last)

  // convert element to a string
  let howdy = last.outerHTML

  // these prevent 
  // Uncaught TypeError: Cannot read properties of null (reading 'toString')
  // in the pattern1 line below
  if (howdy.includes('enable designer')) return
  if (howdy.includes('disable designer')) return
  if (howdy.includes('Create div')) return
  if (howdy.includes('Second action')) return
  if (howdy.includes('Cancel')) return

  //search for id="whatever", then trim to just get "whatever"
  var pattern1 = /id="[^"]*"/g
  var current = pattern1.exec(howdy)!
  let text9 = current.toString()
  let text1 = text9.substring(4)
  let text2 = text1.substring(0, text1.length - 1)
  //console.log('high there', text2)

  // Display text directly to the right of the click me button
  // Note: the following attempts were unfavorable
  //   'afterbegin' -- displayed text directly to the left of the click me button
  //   'afterend' -- displayed text at the very bottom of the page (after the trigger window) 
  //   'beforebegin' -- doesn't display the text anywhere
  var d1 = document.getElementById('element')!
  // insertAjacentHTML is documented here -
  // https://stackoverflow.com/questions/6304453/javascript-append-html-to-container-element-without-innerhtml
  // and https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
  d1.insertAdjacentHTML('beforeend', '<div id="write_text"></div>')

  // DON'T WORRY THAT THE click me BUTTON IS NOT CENTERED BECAUSE
  // IT WON'T BE THERE.  JUST A TEST FOR NOW.  ALL CHOICES WILL BE IN THE
  // LEFT POPUP AND RIGHT POPUP FROM WHERE TO SELECT FROM.
  var text = document.getElementById("write_text")!
  text.innerHTML = "<br><br><br><br><br>left mouse click"
  var sheet = document.createElement('style')
  sheet.innerHTML = "div {color:blue;overflow:hidden;}";
  // sheet.innerHTML = "div {float: right;color:blue;overflow:hidden;}";
  document.body.appendChild(sheet);

  // this works great
  // const cssObj = window.getComputedStyle(text,null)
  // console.log(cssObj.color) // prints "rgb(0, 0, 255)"
  // console.log(cssObj.overflow) // prints "hidden"
}

// left off here
// [1] fix part 1 of 3 below so it returns the div previously stored in the database
// [2] calculate and start the right click menu for x & y coordinates

//part 1 of 3
// const callRestApi = async () => {
//   const restEndpoint = 'https://v1.nocodeapi.com/test_api1/fbsdk/bXQhFqXiYUlVtBtI/firestore/allDocuments?collectionName=html'
//   const response = await fetch(restEndpoint)
//   const jsonResponse = await response.json()
//   var data = jsonResponse[0]._fieldsProto.name.stringValue 
//   return document.getElementById("root")!.innerHTML = data
// }

const ExploreContainer: React.FC<ContainerProps> = () => {

  // left off here 2 - this works. so now put into useState, useEffect terms
  async function readFromFirebase() {
    const docRef = doc(getFirestore(), "html", "cloudbuddy")
    const docSnap = await getDoc(docRef)
  
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }
  
  // const [entries, setEntries] = useState<Entry[]>([]);
  // useEffect(() => {
  //   // console.log('userId',userId);
  //   const entriesRef = firestore.collection('users').doc(userId)
  //     .collection('entries');
  //   return entriesRef.orderBy('date', 'desc').limit(7)
  //     .onSnapshot(({ docs }) => setEntries(docs.map(toEntry)))
  // }, [userId]);

  //part 2 of 3
  // const [apiResponse, setApiResponse] = useState("*** now loading ***");
  // useEffect(() => {
  //   callRestApi().then(
  //     result => setApiResponse(result));
  // }, []);

  function debounce(this: any, fn: any, ms: any) {
    var _this = this;
    var timer: any;
    return function (_: any) {
      clearTimeout(timer);
      timer = setTimeout(function (_) {
        timer = null;
        fn.apply(_this, arguments);
      }, ms);
    };
  }

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  });

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }, 100); // updates 100 ms

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
      resizeCssTagNamed_container__trigger()
    };
  });

  useIonViewDidEnter(() => {  // after the page initially loads
    //readFromFirebase()
    resizeCssTagNamed_container__trigger()
    initializeLeftClickMenu()
    initializeRightClickMenu()

    // menu.offsetWidth is initially zero.  The 2nd time and on it is fine
    //const menu = document.getElementById('menu')!;
    // made no differencevar widthOfLeftClickMenu = menu.offsetWidth
    //widthOfLeftClickMenu = menu.offsetWidth
    //console.log('initial widthOfLeftClickMenu = ',widthOfLeftClickMenu)

    // capture left mouse click
    document.addEventListener('click', function (e) {
      if (e.button === 0) {
        documentClickHandler1(e)
        leftMouseWriteText();
      }
    }, false);

    // capture right mouse click
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      //console.log('right mouse click');
      RightMousePrintHtml();
    }, false);
  });

  return (
    <div className="container" id="main">
      <div className="container__trigger" id="element">

        {/* <div className="renderedInfoClass" id="rendered info">
          Rendered at {dimensions.width} x {dimensions.height}
        </div> */}

        {/* part 3 of 3*/}
        {/* {apiResponse} */}

        {/* <input type='button' id="buttonid" value='click me' /> */}
        <ul id="menu" className="container__menu container__menu--hidden">
          <li className="container__item">Create div</li>
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
  when left click, bring up a menu -
  https://htmldom.dev/show-a-custom-context-menu-at-clicked-position/
  then click the code folder button and see the entire source code.
*/

/*
  Display container size while resizing the window
  https://www.pluralsight.com/guides/re-render-react-component-on-window-resize
  running example: https://codesandbox.io/s/condescending-https-z6fmh
*/
