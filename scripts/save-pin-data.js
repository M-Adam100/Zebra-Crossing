console.log("Running Script");

(async () => {
  const pins = [...document.querySelectorAll('div[data-grid-item]')];
  pins.forEach(async item => { 
    const href = item.querySelector('a').href;
    const productResponse = await fetch(`${href}`);
    const productResponseText = await productResponse.text();
    let re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
    let match;
    let pinData;
    let i = 0;
    while ((match = re.exec(productResponseText))) {
      i++;
      let data = match[1].replace(/\s+/g, "");
      if (data.includes('isAuthenticated')) {
        pinData = JSON.parse(data);
      }
    }
    console.log(pinData);
    
   
  })
//   const addExtensionNode = () => {
//     if (document.querySelector('#startProblem')) {
//       return;
//     }
//     const stopwatch = document.createElement('div');
//     stopwatch.className = 'mainDiv';
//     const startProblem = document.createElement('div');
//     startProblem.innerText = 'Start Practice';
//     startProblem.id = 'startProblem';
//     startProblem.innerHTML = `<button id="startProblem" class="start">Start Problem</button>`;
//     stopwatch.innerHTML = `<div id="stopwatch">
//         00:00:00
//     </div>
// `
//     const navBar = document.querySelector('div[class^="navbar-right-container"]');
//     navBar.insertBefore(stopwatch, navBar.firstChild);
//     stopwatch.append(startProblem);
//     document.getElementById('stopwatch').style.display = 'none';
//     document.querySelector('button#startProblem').addEventListener('click', () => {
//       getAudio('problemSolvingAudio');
//       startProblem.innerHTML = `<div class="stepDiv"><span>Problem Solving</span><input id="problemSolving" type="checkbox"></input></div>`;
//       document.querySelector('input#problemSolving').addEventListener('change', () => {
//         mediaRecorder.stop();
//         getAudio('codingAudio');
//         startProblem.innerHTML = `<div class="stepDiv"><span>Coding</span><input id="coding" type="checkbox"></input></div>`
//         problemSolvingTime = document.getElementById('stopwatch').innerText;
//         document.querySelector('input#coding').addEventListener('change', () => {
//           mediaRecorder.stop();
//           getAudio('debuggingAudio');
//           startProblem.innerHTML = `<div class="stepDiv"><span>Debugging</span><input id="debugging" type="checkbox"></input></div>`;
//           codingTime = document.getElementById('stopwatch').innerText;

//           document.querySelector('input#debugging').addEventListener('click', () => {
//             debuggingTime = document.getElementById('stopwatch').innerText;
//             mediaRecorder.stop();
//             chrome.storage.local.set({
//               'times': {
//                 problemSolvingTime,
//                 codingTime,
//                 debuggingTime
//               }
//             })

//             stopwatch.remove();
//             stopAudio();

//             chrome.runtime.sendMessage({
//               type: "timerData",
//             });
//           })
//         })
//       })

//       startTimer();
//     })


//   }

//   addExtensionNode();
})()