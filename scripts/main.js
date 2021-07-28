let threshold = thresholds[0];
let container = {'content' : ''}

function get_color(word) {
    long_code = data[word]
    if (long_code){
      return long_code
    }
    return "#000000"
  }

  function get_mask(word,threshold){
    cov = data_cov[word]
    // console.log(cov)
    if (cov){
    if (cov>=threshold){
      return 1
    } else{
      return 0
    }
  } else{
    if (threshold==0){
      return 1
    }
  }
  }

  function changeBodyBg(color){
    document.body.style.background = color;
    document.getElementById("content").style.backgroundColor = color;
    document.getElementById("myTextarea").style.backgroundColor = color;
    document.getElementById("content").style.borderColor = color;
    // document.getElementById("myTextarea").style.borderColor = color;
  }
  function changeBodyBack(){
    document.body.style.background = 'white';
    document.getElementById("content").style.backgroundColor = '#f1f1f1';
    document.getElementById("myTextarea").style.backgroundColor = 'white';
    document.getElementById("content").style.borderColor = '#f4e4e9';
  }
  function scroll_up() {
    document.body.style.background = 'red';
    document.body.scrollTop = 0;
  }
  function handleInput() {
    const block = []
    currentText = document.getElementById("myTextarea").value
    currentFontSize = document.getElementById("fsize").value
    const text_split_line = currentText.split("\n")
    text_split_line.forEach((line) =>{
      const text_split = line.split(/[ ,?!.]+/)
      text_split.forEach((element) => {
        element = element.toLowerCase()
        if (get_mask(element,threshold)){
          block.push("<span style='color:"+get_color(element)+";'>█</span>")
        } else {
          block.push("<span style='font-size:"+currentFontSize/3+"px';>"+element+" </span>")
        }
        // block.push(" ")
        changeBodyBg(get_color(element))
      })
      block.push("<br>")
    })
    container['content'] = block.join('')
    document.getElementById("content").innerHTML = container['content']
  }

  
  function submit() {
    db.collection('posts').add({
        post: container['content'],
    });
    // console.log(container['content'])
  }

  function generate_random_word() {
    db.collection('posts').add({
        post: container['content'],
    });
    // console.log(container['content'])
  }

  function attach_word() {
    const keys = Object.keys(data);
    document.getElementById("word").innerHTML = keys[keys.length * Math.random() << 0];
  }
  function changeSize(size) {
    document.getElementById("content").style.fontSize = size + "px";
  }
  function change_color(ths_idx) {
    threshold = thresholds[ths_idx]
    handleInput()
  }
  // Create a new color picker instance
// https://iro.js.org/guide.html#getting-started
// var colorPicker = new iro.ColorPicker(".colorPicker", {
//   // color picker options
//   // Option guide: https://iro.js.org/guide.html#color-picker-options
//   width: 280,
//   color: "rgb(255, 0, 0)",
//   borderWidth: 1,
//   borderColor: "#fff",
// });

// var values = document.getElementById("values");
// var hexInput = document.getElementById("hexInput");

// // https://iro.js.org/guide.html#color-picker-events
// colorPicker.on(["color:init", "color:change"], function(color){
//   // Show the current color in different formats
//   // Using the selected color: https://iro.js.org/guide.html#selected-color-api
//   values.innerHTML = [
//     "hex: " + color.hexString,
//     "rgb: " + color.rgbString,
//     "hsl: " + color.hslString,
//   ].join("<br>");
  
//   hexInput.value = color.hexString;
// });

// hexInput.addEventListener('change', function() {
//   colorPicker.color.hexString = this.value;
// });