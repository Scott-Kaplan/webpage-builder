import './ExploreContainer.css';
import { useIonViewDidEnter } from '@ionic/react';
interface ContainerProps { }

function writeText() {
  var text = document.getElementById("boldStuff")!
  text.innerHTML = "left mouse click"
  var sheet = document.createElement('style')
  sheet.innerHTML = "div {color:blue;overflow:hidden;}";
  document.body.appendChild(sheet);
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
    <div className="container">
      <div id="boldStuff"></div>
      {/* <input type='button' onClick={changeText} value='Change Text' /> */}
    </div>
  );
};

export default ExploreContainer;
