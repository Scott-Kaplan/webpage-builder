import './ExploreContainer.css';
import React, { useState, useEffect } from 'react'
import {
  doc,
  collection,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { useIonViewDidEnter } from '@ionic/react';

import { app } from '../firebase'
app.automaticDataCollectionEnabled = false // need this line or get run time error.  console.log(app) also resolves it but annoying to see this output in the chrome console.

var mouseHover: any = {} // mouseHover[idX] = true | false
var globalDiv: any = {}
var divIdAddedToLeftMenu = 'none'
var alistItemHasBeenAddedDynamically = false
var lastDivHoveredOver = ''
var idNum = 0
var leftPopupPresent = false
var xStartPositionOfDiv: any
var yStartPositionOfDiv: any
var divNumber = 0 // global counter for quantity of divs

interface ContainerProps { }

// eslint-disable-next-line
async function writeToFirebase(msg: HTMLElement) {
  // need this next line otherwise HTMLDivElement object can't be saved to Firebase
  var divTree = msg.outerHTML
  await setDoc(doc(getFirestore(), "html", `div${divNumber++}`), {
    tag: divTree
  });
}

function RightMousePrintHtml() {
  // get all of the html for the whole page
  // var d1 = document.getElementById('main')!
  //var d1 = document.getElementById('element')!
  var d1 = document.getElementById('id_you_like')!

  console.log(d1)
  //< div class="container" id = "main" > <div id="write_text">left mouse click</div></div >
  //writeToFirebase(d1)
}

// Hide the left mouse click popup when
// [a] left clicking an option
// or 
// [b] right clicking to bring up the right click popup
const documentClickHandler = function (e: any) {
  console.log('documentClickHandler')
  //console.log((window as any).newIdIsMouseHover)  
  const leftMenu = document.getElementById('leftMenu')!;
  //console.log(e.target.innerText) // prints the selection made

  // the user left clicked on "Cancel"
  if (e.target.innerText === 'Cancel') {
    leftMenu.classList.add('container__menu--hidden');
    document.removeEventListener('click', documentClickHandler);
  }
  // the user left clicked on "Create div"
  else if (e.target.innerText === 'Create div') {
    leftMenu.classList.add('container__menu--hidden');
    document.removeEventListener('click', documentClickHandler);

    // prints all divs
    // var allDivTags = document.getElementsByTagName("div")
    // console.log('by tag name\n',allDivTags)
    // let divNodeList = document.querySelectorAll("div")
    // console.log('by query selector\n',divNodeList)
    // console.log('item 4 = ',divNodeList.item(4).id)
    //console.log('item 4 = ',divNodeList.item(4).tagName)

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
    var newDiv = document.createElement('div')
    // create an id for the div
    var newId = `id${idNum++}`
    newDiv.setAttribute("id", newId)
    // create a class for the div
    newDiv.classList.add("foo")
    // create text to display in the div
    newDiv.innerHTML = "Hello";
    // insert the newly created div before the bottom div in the parent div
    parentDiv.insertBefore(newDiv, d1)
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

    // when bringing up the left menu anytime in the future, need to know
    // whether hovering over this new id.  If yes, will need to
    // display an option in the left menu so the user can do something with it
    var test = document.getElementById(newId)!
    test.addEventListener("mouseleave", function (event) {
      mouseHover[newId] = false
    }, false);
    test.addEventListener("mouseover", function (event) {
      mouseHover[newId] = true
    }, false);
    //writeToFirebase(test)

    // display dimmensions of div
    // console.log('height including padding and border: ', text.offsetHeight)
    // console.log('width including padding and border: ', text.offsetWidth)
  }
  // the user left clicked on "Second action"
  else if (e.target.innerText === 'Second action') {
    leftMenu.classList.add('container__menu--hidden');
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

const modifyDiv = function (e: any) {

  // left off here
  // first how to put up modifydiv menu?
  // documentClickHandler might be putting up the left & right menu
  // try commenting out where this occurs and see if it has an impact

  // display all edit options for div that user left clicked on
  /*
  make it similar to leftMenu.  Create empty leftMenu equivalent to start
  it will be the same layout as leftMenu but be 2 column
  Name: asfds
  Text: adfsdf
  CSS class name: fasdf
  CSS Properties
    position: absolute
    left: 441px
    ...
  */
  console.log('the user wants to modify this', e.target.innerText)
  // find the div to be edited
  for (let i in globalDiv) {
    if (globalDiv[i].idOfNewDiv === e.target.innerText) {
      console.log('newDiv = ', globalDiv[i].idOfNewDiv)
      console.log('classNameOfNewDiv = ', globalDiv[i].classNameOfNewDiv)
      console.log('textOfNewDiv = ', globalDiv[i].textOfNewDiv)
      console.log('Css Attributes = ', globalDiv[i].cssAttributes)
    }
  }
}

// Hide the right popup when left clicking
const handleLeftMouseClick = function (e: any) {
  // console.log('left clicked')
  const rightMenu = document.getElementById('rightMenu')!;
  const leftMenu = document.getElementById('leftMenu')!;
  //console.log(e.target.innerText) // prints the selection made

  var hoveringOverSomethingNow = false

  /* 
  if hovering over a div when left clicking,
  give the user the option to do something with it
  by putting it at the top of the list
  */
  for (let divId in mouseHover) {
    //console.log('div id=', divId, 'value=', mouseHover[divId])
    if (mouseHover[divId] === true) {
      hoveringOverSomethingNow = true
      console.log('----------')
      console.log('hovering over div id =', divId)

      // when selected the dynamically added item in the list (the top item)
      // display options for the user for that item so the user can modify it
      for (let i in globalDiv) {
        //console.log(`globalDiv[${i}] = `,globalDiv[i])
        //console.log('idOfNewDiv =', globalDiv[i].idOfNewDiv)
        if (globalDiv[i].idOfNewDiv === divId) {
          divIdAddedToLeftMenu = globalDiv[i].idOfNewDiv
          //console.log('newDiv = ',globalDiv[i].idOfNewDiv)
          //console.log('classNameOfNewDiv = ',globalDiv[i].classNameOfNewDiv)
          //console.log('textOfNewDiv = ',globalDiv[i].textOfNewDiv)
          //console.log('Css Attributes = ',globalDiv[i].cssAttributes)
        }
      }

      // prevent the same id from being added to the menu on this left click
      // if was previously hovering over it when last left clicked
      if (divId === lastDivHoveredOver) {
        // console.log(`was previously hovering over ${divId} when last left clicked.  So don't add it again to the left menu`)
        return
      }

      // delete the previously dynamically added list item from the top of menu
      // because we want to replace it with that of the current div id that is
      // being hovered over now
      // then set the lastDivHoveredOver flag to the current divId that is now being hovered over
      else if ((lastDivHoveredOver !== '') && (alistItemHasBeenAddedDynamically === true)) {
        // console.log(`try to remove ${lastDivHoveredOver}`)
        var items = document.querySelectorAll("#leftMenu li")
        leftMenu.removeChild(items[0])
        lastDivHoveredOver = divId
      }

      // set the lastDivHoveredOver flag to the current divId that is now being hovered over
      else {
        lastDivHoveredOver = divId
        //console.log(`the last id hovered over is ${divId}`)
      }

      // Create a new list item
      var newListItem = document.createElement("li")
      // Assign it text that the user will see
      //var node: any = document.createTextNode("Just added")
      var node: any = document.createTextNode(divId)
      // Have it match the className as the hard coded ones, so it doesn't look different
      newListItem.classList.add("container__item")
      // Add the item
      newListItem.appendChild(node)
      // The next 3 lines place this new option at the beggining of the list in the menu
      var element = document.getElementById("leftMenu")
      var child = document.getElementById("lM1")
      element?.insertBefore(newListItem, child)
      /*
      end
      */
      // since just added a list item to the menu,
      // set the dynamically added list item flag to true
      alistItemHasBeenAddedDynamically = true
    }
    else
      console.log('----------')
    console.log('divIdAddedToLeftMenu', divIdAddedToLeftMenu)
    console.log('e.target.innerText', e.target.innerText)

    // The user left clicked on the previously added dynamic id
    // because the user wants to modify it
    if (divIdAddedToLeftMenu === e.target.innerText) {
      // console.log('the user wants to modify this', divIdAddedToLeftMenu)
      modifyDiv(e)
    }
    // the user left clicked on "disable designer"
    else if (e.target.innerText === 'disable designer') {
      rightMenu.classList.add('container__menu--hidden');
      document.removeEventListener('click', handleLeftMouseClick);
      // without these next 2 lines, the left popup opens up
      leftMenu.classList.add('container__menu--hidden');
      document.removeEventListener('click', handleLeftMouseClick);
    }
    // the user left clicked on "enable designer"
    else if (e.target.innerText === 'enable designer') {
      //console.log('close the right click menu')
      rightMenu.classList.add('container__menu--hidden');
      document.removeEventListener('click', handleLeftMouseClick);
      // without these next 2 lines, the left popup opens up
      leftMenu.classList.add('container__menu--hidden');
      document.removeEventListener('click', handleLeftMouseClick);
    }

    // Test case:
    // [1] bring up right popup
    // [2] bring up left popup
    // [3] verify --> the right popup should close
    // passes
    else {
      // close the right popup, because want the left popup only to appear
      // otherwise both popups will appear at the same time
      rightMenu.classList.add('container__menu--hidden');
      document.removeEventListener('click', handleLeftMouseClick);
    }
  }

  // Remove the dynamic added list item from the top of the menu and reset the counters
  if ((hoveringOverSomethingNow === false) && (alistItemHasBeenAddedDynamically === true)) {
    //console.log(`remove the dynamically added ${lastDivHoveredOver}`)
    var items1 = document.querySelectorAll("#leftMenu li")
    leftMenu.removeChild(items1[0])
    // console.log('items1[0]', items1[0])
    lastDivHoveredOver = ''
    alistItemHasBeenAddedDynamically = false
  }
}

function initializeRightClickMenu() {
  const ele2 = document.getElementById('element')!;
  const rightMenu = document.getElementById('rightMenu')!;

  // 'contextmenu' is for right click
  ele2.addEventListener('contextmenu', function (e) {
    //console.log('right click menu')
    e.preventDefault();

    const rect = ele2.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set the position for menu
    rightMenu.style.top = `${y}px`;
    rightMenu.style.left = `${x}px`;

    // Show the menu
    rightMenu.classList.remove('container__menu--hidden');

    document.addEventListener('click', handleLeftMouseClick);

    // Test case:
    // [1] bring up left popup
    // [2] launch right popup
    // [3] verify --> left popup should close
    //  passes
    if (leftPopupPresent) {
      // close the left popup, because want the right popup only to appear
      // otherwise both popups will appear at the same time
      const leftMenu = document.getElementById('leftMenu')!;
      leftMenu.classList.add('container__menu--hidden');
      document.removeEventListener('click', documentClickHandler);
      leftPopupPresent = false
    }
  });
}

function initializeEditDivMenu() {
  const ele = document.getElementById('element')!
  const editDivMenu = document.getElementById('editDivMenu')!;
  ele.addEventListener('click', function (e) {
    e.preventDefault()
    const rect = ele.getBoundingClientRect();
    var xPositionOfCursor = e.clientX
    var widthOfEditDivMenu = editDivMenu.offsetWidth
    var widthOfBrowserWindow = rect.width
    if (widthOfEditDivMenu === 0)
      widthOfEditDivMenu = 130
    if ((xPositionOfCursor + widthOfEditDivMenu) >= widthOfBrowserWindow)
      editDivMenu.style.left = `${xPositionOfCursor - widthOfEditDivMenu}px`;
    else
      editDivMenu.style.left = `${xPositionOfCursor}px`
    var yPositionOfCursor = e.clientY
    var heightOfEditDivMenu = editDivMenu.offsetHeight
    var heightOfBrowserWindow = window.innerHeight
    var y = yPositionOfCursor - rect.top;
    if ((yPositionOfCursor + heightOfEditDivMenu) >= heightOfBrowserWindow)
      editDivMenu.style.top = `${y - heightOfEditDivMenu}px`;
    else
      editDivMenu.style.top = `${y}px`
    editDivMenu.classList.remove('container__menu--hidden');
    document.addEventListener('click', documentClickHandler);
    leftPopupPresent = true
  })
}

function initializeLeftClickMenu() {
  const ele = document.getElementById('element')!;
  const leftMenu = document.getElementById('leftMenu')!;

  // This function is executed when the user moves the left popup.
  // proceedurally the user moves the cursor from its previous position and left clicks.
  // This function is not executed when the user selects an option from the left popup.
  ele.addEventListener('click', function (e) {

    /* this prints the hover status over each div */
    // for (let key in mouseHover) {
    //   console.log('key=', key, 'value=', mouseHover[key])
    // }

    // console.log('moved popup')
    e.preventDefault();

    const rect = ele.getBoundingClientRect();

    /* CALCULATE & START THE LEFT CLICK MENU AT THIS X COORDINATE */
    var xPositionOfCursor = e.clientX
    var widthOfLeftClickMenu = leftMenu.offsetWidth
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
      leftMenu.style.left = `${xPositionOfCursor - widthOfLeftClickMenu}px`;
    else
      leftMenu.style.left = `${xPositionOfCursor}px`
    /* END */

    /* CALCULATE & START THE LEFT CLICK MENU AT THIS Y COORDINATE */
    var yPositionOfCursor = e.clientY
    var heightOfLeftClickMenu = leftMenu.offsetHeight
    var heightOfBrowserWindow = window.innerHeight
    var y = yPositionOfCursor - rect.top;

    // Set the y position of the left click menu
    if ((yPositionOfCursor + heightOfLeftClickMenu) >= heightOfBrowserWindow)
      leftMenu.style.top = `${y - heightOfLeftClickMenu}px`;
    else
      leftMenu.style.top = `${y}px`
    /* END */

    // Show the menu
    leftMenu.classList.remove('container__menu--hidden');

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

function getStringBetween(str: string, start: string, end: string) {
  const result = str.match(new RegExp(start + "(.*)" + end));
  return result![1];
}

/*
function leftMouseWriteText() {
  // this prevents  <div id="tag"></div>  from being created more than once
  if (document.getElementById("write_text"))
    return

  // assuming there is button already on the screen
  // dynamically change the background color of the button
     // 1 get boundry of button
     // 2 is cursor within the boundry
     // 3 yes - get element

  // steps of how to get here
  // hover over the click me button
  // left click
  // the last element is "buttonid"
  // try the 132 answer with green checkmark to try and get "buttonid"
  //https://stackoverflow.com/questions/5684811/in-queryselector-how-to-get-the-first-and-get-the-last-elements-what-traversal
  var elements = document.querySelectorAll(':hover');
  //console.log('hover = ', elements)
  //var first = elements[0]
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
  //var pattern1 = /id="[^"]*"/g
  //var current = pattern1.exec(howdy)!
  //let text9 = current.toString()
  //let text1 = text9.substring(4)
  //let text2 = text1.substring(0, text1.length - 1)
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
*/

function listenForHoverOverId(newId: string) {
  var test = document.getElementById(newId)!
  test.addEventListener("mouseleave", function (event) {
    mouseHover[newId] = false
  }, false);
  test.addEventListener("mouseover", function (event) {
    mouseHover[newId] = true
  }, false);
}

/*
globalDiv in the below function stores this
  parentDiv -- this is always 'element'  --- does not have to be stored
    bottomDivWithinParent --- does not have to be stored
    newDiv - nothing unique here, just the next new div
    idOfNewDiv
    classNameofNewDiv
    textOfNewDiv
    classPropertiesOfNewDiv
      position: "absolute",
      left: "441px",
      ...
into an array of objects
*/
var readFromFirebaseCounter = 0

const readFromFirebase = async () => {
  // https://firebase.google.com/docs/firestore/query-data/get-data
  const querySnapshot = await getDocs(collection(getFirestore(), "html"));
  querySnapshot.forEach((doc) => { // for every divX document in firebase
    // console.log(doc.id, " => ", doc.data().tag);
    globalDiv[readFromFirebaseCounter] = {}

    var parentDiv = document.getElementById('element')!
    var bottomDivWithinParentDiv = document.getElementById('element')!.firstChild
    var newDiv = document.createElement('div')
    // extract id1 in this example (idOfNewDiv)
    // '<div id="id1" class="foo" style="position: absolute; left: 268px; top: 181px; height: 100px; background: red; color: white;">Hello</div>'
    var idOfNewDiv = getStringBetween(doc.data().tag, 'id="', '" class')
    globalDiv[readFromFirebaseCounter].idOfNewDiv = idOfNewDiv
    newDiv.setAttribute("id", idOfNewDiv)
    var classNameOfNewDiv = getStringBetween(doc.data().tag, 'class="', '" style')
    globalDiv[readFromFirebaseCounter].classNameOfNewDiv = classNameOfNewDiv
    newDiv.classList.add(classNameOfNewDiv)
    var textOfNewDiv = getStringBetween(doc.data().tag, ';">', '</div>')
    globalDiv[readFromFirebaseCounter].textOfNewDiv = textOfNewDiv
    newDiv.innerHTML = textOfNewDiv
    parentDiv.insertBefore(newDiv, bottomDivWithinParentDiv)

    // create class properties for the newly created div
    let collection = document.getElementsByClassName(classNameOfNewDiv) as HTMLCollectionOf<HTMLElement>

    // extract all CSS properties {name: value} pairs
    // the entire string before started with this
    // "<div id=\"id_you_like\" class=\"foo\" style=\"position: absolute; left: 131px; top: 66px; height: 100px; background: red; color: white;\">Hello</div>"
    // after these 2 lines are executed
    // var stylesExtracted = getStringBetween(docSnap.data().name, 'style="', '">')
    // console.log('stylesExtracted = ', stylesExtracted)
    // the following is left
    // position: absolute; left: 441px; top: 178px; height: 100px; background: red; color: white;
    // then after these lines
    var re = /([\w-]+): ([^;]+)/g;
    var m: any
    var map = {} as any
    while ((m = re.exec(doc.data().tag)) != null) {
      map[m[1]] = m[2];
    }
    // we then have an object equal to the css property of name value pairs, like -
    // Object { position: "absolute", left: "441px", top: "178px", height: "100px", background: "red", color: "white" }
    // and these lines extract each property & value from the object and applies them
    var allCssAttributesOfDiv: any = []
    // the next line ignores this warning
    // Array.prototype.map() expects a return value from arrow function  array-callback-return
    // eslint-disable-next-line  
    Object.entries(map).map(obj => {
      const key = obj[0];
      const value: any = obj[1];
      allCssAttributesOfDiv.push({ key: key, value: value })
      collection[0].style.setProperty(key, value)
    });
    globalDiv[readFromFirebaseCounter].cssAttributes = allCssAttributesOfDiv
    readFromFirebaseCounter++
    listenForHoverOverId(idOfNewDiv)
  });
}

const ExploreContainer: React.FC<ContainerProps> = () => {

  // runs only on the first render
  // https://www.w3schools.com/react/react_useeffect.asp
  useEffect(() => {
    readFromFirebase()
  }, []);

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

  // suppress this compiler error 
  // dimensions is assigned a value but never used by adding the next line
  // eslint-disable-next-line
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
    resizeCssTagNamed_container__trigger()
    initializeLeftClickMenu()
    initializeEditDivMenu()
    initializeRightClickMenu()

    // capture left mouse click
    document.addEventListener('click', function (e) {
      if (e.button === 0) {
        handleLeftMouseClick(e)
        //leftMouseWriteText();
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
        {/* {apiResponse1} */}

        {/* <input type='button' id="buttonid" value='click me' /> */}
        <ul id="leftMenu" className="container__menu container__menu--hidden">
          <li id="lM1" className="container__item">Create div</li>
          <li id="lM2" className="container__item">Second action</li>
          <li id="lM3" className="container__divider"></li>
          <li id="lM4" className="container__item">Cancel</li>
        </ul>

        <ul id="editDivMenu" className="container__menu container__menu--hidden">
        </ul>

        <ul id="rightMenu" className="container__menu container__menu--hidden">
          <li className="container__item">enable designer</li>
          <li className="container__divider"></li>
          <li className="container__item">disable designer</li>
        </ul>
      </div>
    </div>
  );
};

export default ExploreContainer;

// left off here

// Want to do the first page, similar to the one when I log on to Figma
// 0 delete the 2nd div
// 1 modify the 1st div to match just the hero section of the Figma page
//
// 2 on mobile, one div appears off the page to the right
//     adjust the css so they are relative to the screen size.       
// 3 left click down, if off the screen apply a correction initially like did for x coordinate
// 4 do the same as above if first click is for the right menu

/*
  // https://code-boxx.com/add-remove-list-items-javascript/
*/

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