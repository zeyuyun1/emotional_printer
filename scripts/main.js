function get_color(word) {
    long_code = data[word]
    return long_code
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
    // document.getElementById("myTextarea").style.borderColor = 'white';
  }
  
  let container = {'content' : ''}
  function handleInput(e) {
    currentText = e.target.value.toLowerCase()
    // log.textContent = e.target.value
    // console.log(currentText)
    const text_split = currentText.split(" ")
    const block = []
    // console.log(text_split)
    
  
    text_split.forEach((element) => {
      if (element.match("^.*[\n]")){
        element = element.match("([a-z]*)[\n]")[1]
        // block.push("<span style='color:rgb"+get_rbg_code(extracted)+";'>█</span>")
        block.push("<span style='color:"+get_color(element)+";'>█</span>")
        block.push("<br>")
        changeBodyBg(get_color(element))
        
      } else{
        // block.push("<span style='color:rgb"+get_rbg_code(element)+";'>█</span>")
        block.push("<span style='color:"+get_color(element)+";'>█</span>")
      }
      changeBodyBg(get_color(element))
      console.log(block)
    })
    container['content'] = block.join('')
    document.getElementById("content").innerHTML = container['content']
  }
  
  function submit() {
    db.collection('posts').add({
        post: container['content'],
    });
    console.log(container['content'])
  }