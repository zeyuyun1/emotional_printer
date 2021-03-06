
let documentHeight = document.documentElement.clientHeight;
let documentWidth = document.documentElement.clientWidth;
console.log(documentWidth)
console.log(documentHeight)
function render(doc){
    let div = document.createElement("div");
    currentTop = Math.floor(Math.random() * documentHeight) + 1;
    currentLeft = Math.floor(Math.random() * documentWidth) + 1;
    
    div.style.top = currentTop + "px";
    div.style.left = currentLeft + "px";
    div.style.width = "25vw";
    // div.style.height = "25vw";
    // div.style.backgroundColor = "#f1f1f1";
    div.style.position = "absolute";
    div.style.fontSize = "20px";
    div.style.wordBreak = "break-all";
    div.innerHTML = doc;
    // console.log(doc)
    document.getElementById("main").appendChild(div);
}

db.collection('posts').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        // doc.data().post.document.div
        render(doc.data().post);
        // console.log(doc.data().post)
    });
});
