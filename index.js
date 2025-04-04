//更新标题字样
var update_title_num = 0;
timer= setInterval(() => {
    update_title_num++;
    s = "加载中";
    for (let index = 0; index < update_title_num; index++) {
        s += ".";
    }
    update_title_num++;
    if (update_title_num == 6) {
        update_title_num = 0;
    }
    document.getElementsByTagName("title")[0].innerHTML = s;
}, 2000)

//根据窗口活跃性更改button的颜色

function desktopClick(){
    var gray="#bbb";
    document.getElementById("button_red").style.backgroundColor = gray;
    document.getElementById("button_green").style.backgroundColor = gray;
    document.getElementById("button_yellow").style.backgroundColor = gray;
} 
function windowClick(){
    document.getElementById("button_red").style.backgroundColor = "#ff5555";
    document.getElementById("button_green").style.backgroundColor = "#03a903";
    document.getElementById("button_yellow").style.backgroundColor = "#ffb046";
}

//窗口拖动
// 来自 https://blog.csdn.net/qq_42755240/article/details/118528645
let title = document.querySelector("#title_bar");
let addForm = document.querySelector("#window");

title.addEventListener("mousedown", function (e) {
    windowClick();
    //记录初始（点击时）鼠标和窗体位置差
    let x = e.pageX - addForm.offsetLeft;
    let y = e.pageY - addForm.offsetTop;
    //鼠标移动事件监听
    document.addEventListener("mousemove", move);
    function move(e1) {
        //移动窗口
        addForm.style.left = e1.pageX - x + 'px';
        addForm.style.top = e1.pageY - y + 'px';
    }
    //鼠标松开事件监听
    document.addEventListener("mouseup", function (e) {
        document.removeEventListener("mousemove", move);
    })
})
text = document.getElementById("text");

//输入字符
document.addEventListener('keydown', function(event) {
    // 如果按下的键是数字
    if ((event.key.length===1)) {
        // console.log("put"+event.key);
        text.lastElementChild.innerHTML+=event.key;
    }
    else if(event.key=="Enter"){
        var div= document.createElement("pre");
        div.innerHTML = " ";
        div.style=s.style;
        text.appendChild(div);
    }
  });


//刷新text部分

var XHR = new XMLHttpRequest();
XHR.onreadystatechange = () => {
    if (XHR.readyState == 4 && XHR.status === 200) {
        //console.log(jsonPath+"完成加载");
        tdata = JSON.parse(XHR.responseText);
        //console.log(tdata);
        updateText();
    }
}
XHR.open("GET", "./text.json", true);
XHR.send();

index = 0;
function updateText() {
    if (index < tdata.length) {

        s = tdata[index];

        var div= document.createElement("pre");
        div.innerHTML = s.text;
        div.style=s.style;
        text.appendChild(div);
        text.scrollTop = text.scrollHeight;//滚动条滚动到底部
        
        console.log(s.text);

        //进行后续加载
        index++;
        setTimeout(() => {
            updateText();
        }, s.deltime);
    }
    else {
        clearInterval(timer);
        document.getElementsByTagName("title")[0].innerHTML = "加载完成了 喵~";
    }
}




