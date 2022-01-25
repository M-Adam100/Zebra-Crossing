console.log("Running Script");

(async () => {

  const ARR = [];
  const coverArticles = async (pins) => {
    for (let i = 0; i < pins.length; i++) {
      console.log("Parsing Pin: ", i);
      const item = pins[i];
      const href = item.querySelector('a').href;
      const productResponse = await fetch(`${href}`);
      const productResponseText = await productResponse.text();
      let re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
      let match;
      let pinData;
      let j = 0;
      while ((match = re.exec(productResponseText))) {
        j++;
        let data = match[1].replace(/\s+/g, "");
        if (data.includes('isAuthenticated')) {
          pinData = JSON.parse(data);
        }
      }
      if (pinData?.props?.initialReduxState?.resources?.PinResource) {
        const key = Object.keys(pinData?.props?.initialReduxState?.resources?.PinResource) || [];
        if (key.length) {
          parsePinData(pinData, key[0]);
        }
      }


    }

    exportPosts(ARR);

  }

  const startWorking = (number) => {
    let PINS = [];
    const interval = setInterval(() => {
      let pins = [...document.querySelectorAll('div[data-grid-item]')];
      PINS = [...PINS, ...pins];
      if (PINS.length < number) {
        window.scrollBy(
          0,
          document.scrollingElement.scrollHeight - (window.scrollY + window.innerHeight)
        );
      } else {
        clearInterval(interval);
        PINS = PINS.slice(0, number);
        coverArticles(PINS);
      }

    }, 3000)
  }


  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  const exportPosts = (arr) => {
    const searchBoxInput = document.querySelector('[name="searchBoxInput"]')?.value || '';
    const items = arr;
    if (items.length) {
      const replacer = (key, value) => value === null ? '' : value
      const header = Object.keys(items[0])
      const csv = [
        header.join(','),
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
      ].join('\r\n')
  
      let link = document.querySelector(['[id="exportLink"]']) || document.createElement("a");
      link.id = 'exportLink';
      link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodeURI(csv));
      link.setAttribute("download", `${searchBoxInput}.csv`);
      link.addEventListener('click', () => {
        console.log("Downloaded!");
      })
      link.click();
    }
   
  }

  const parsePinData = (pinData, key) => {
    const searchBoxInput = document.querySelector('[name="searchBoxInput"]')?.value || '';

    const { data } = pinData?.props?.initialReduxState?.resources?.PinResource[key];
    const title =  data?.rich_metadata?.title || data?.title || ''
    const  description = data?.rich_metadata?.description || data?.description || '';
    const pinURL = data?.rich_metadata?.url || data?.domain || '';
    const filteredTitle = title.replaceAll('#', '');
    const filteredPinURL = pinURL.replaceAll('#', '');
    const filteredDescription = description?.replaceAll('#', '');
    const imageUrl = data?.images['orig'].url || '';
    const PinURL = pinData?.props?.context?.current_url || '';
    const saves = data?.aggregated_pin_data?.aggregated_stats?.saves || 0;
    let videoURL = '';

    if (data?.videos?.video_list) {
      const key = Object.keys(data.videos?.video_list);
      videoURL = data.videos?.video_list[key[0]]?.url;
    }

    ARR.push({ Title: filteredTitle, Description: filteredDescription, Saves: saves, Keywords: searchBoxInput, Thumbnail: imageUrl, 'Video URL': videoURL, Link: filteredPinURL, 'Pin URL': PinURL });

  }
  const addExtensionNode = () => {
    if (document.querySelector('#mainDiv')) {
      return;
    }
    const input = document.createElement('input');
    const startButton = document.createElement('button');
    startButton.addEventListener('click', () => {
      const inputNumber = document.querySelector('#inputPins').value;
      if (!inputNumber) alert("Invalid Number");
      else startWorking(inputNumber);
    })
    startButton.value = 'Start';
    startButton.innerText = 'Start';
    input.placeholder = 'Number of Pins';
    input.id = 'inputPins'
    const div = document.createElement('div');
    div.id = 'mainDiv';
    div.className = 'mainDiv';
    div.append(input, startButton);
    const searchBoxInput = document.querySelector('[id="searchBoxContainer"]');
    insertAfter(searchBoxInput, div);


  }

  addExtensionNode();
})()