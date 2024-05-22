/**
 * 已经丢弃的js，确认无问题后将删除
 * 自1.3.0版本后所有代码迁移新文件，不再维护该文件
 */


//系统监听的事件 包括点击事件
window.onload = () => {
    //一些用于初始化的函数
    getDataFromServer(() => {
        updateHead();
        updateContentBlock();
        updateBlogs();
        updataSelects();
    })
    updateNumbers();

    //其他初始化命令
    
    //设置网页进入时selects的样式
    document.getElementById("aselect_all").style.backgroundColor = "#eee";
}

//文章点击
/*
 依赖于全局变量activeEssays activeEssays数组中的变量与blogs中的内容一一对应
 index参数为序号 表示点击的是activeEssays中的第index个
 blogs的块的html中包含对应activeEssays的index变量
 */
function essaysClick(index) {
    //console.log(activeEssays);
    //console.log("博客点击\n序号：" + index);
    //console.log(activeEssays[index].mode);
    switch (activeEssays[index].mode) {
        case "htmlmode":
            window.open("./essays/" + activeEssays[index].id + "/index.html", "_blank");
            break;
        case "bilimode":
            window.open("./essays/bilimodeview.html?" + "id=" + activeEssays[index].id, "_blank");
            break;
        case "amode":
            window.open("./essays/" + activeEssays[index].id + "/index.html", "_blank");
            break;
        default:
            console.error("文章类型错误，无法打开");
            break;
    }

}
//搜索
function buttonclick() {
    alert("这个功能还没有完成喵~");
}

//选择框点击
function selectClick(lable) {
    //初始化
    var blogs = document.getElementById("blogs");
    blogs.innerHTML = null;//清空所有essays
    setAllAselectBackgroundWrite();
    //设置点击的为灰色
    document.getElementById("aselect_" + lable).style.backgroundColor = "#eee";
    var i = 0;
    //根据标签更新activeEssays
    activeEssays = [];
    for (let index = 0; index < essays.length; index++) {
        if (essays[index].lable == lable) {
            activeEssays.push(essays[index]);
        }
    }
    //更新blogs的内容
    for (let index = 0; index < activeEssays.length; index++) {
        const element = activeEssays[index];
        var essay = createBlog(element, index);
        blogs.appendChild(essay);
    }
}

//选择框所有点击
function selectAllClick() {
    var blogs = document.getElementById("blogs");
    blogs.innerHTML = null;
    //updateBlogs();
    setAllAselectBackgroundWrite();
    document.getElementById("aselect_all").style.backgroundColor = "#eee";
    for (let index = 0; index < essays.length; index++) {
        var essay = createBlog(essays[index], index);
        blogs.appendChild(essay);
    }
    activeEssays = essays;
}
//1.1更新 异步加载服务端json的方法 主页的所有json加载均应在此完成
/*
加载服务器端json文件。参数为一个函数，用于更新标签的函数。
*/
function getDataFromServer(loadingCompletely) {
    //console.log("开始加载服务器端json文件");
    window.datasCompelety = new Object();


    //console.log("abounts.json开始加载");
    var aboutsXHR = new XMLHttpRequest();
    window.aboutsCompletely = false;//是否加载完成的标记
    window.abouts;//加载的json数据
    aboutsXHR.onreadystatechange = () => {
        if (aboutsXHR.readyState === 4 && aboutsXHR.status === 200) {
            //console.log("abouts.json加载完成");
            abouts = JSON.parse(aboutsXHR.responseText);
            //console.log(abouts);
            aboutsCompletely = true;
            whenGetCompletely();
        }
    }
    aboutsXHR.open("GET", "./json/abouts.json", true);
    aboutsXHR.send();

    //console.log("contentBlocks开始加载");
    var contentBlocksXHR = new XMLHttpRequest();
    window.contentBlocksCompletely = false;
    window.contentBlocks;
    contentBlocksXHR.onreadystatechange = () => {
        if (contentBlocksXHR.readyState == 4 && contentBlocksXHR.status === 200) {
            //console.log("contentBlocks完成加载");
            contentBlocks = JSON.parse(contentBlocksXHR.responseText);
            //console.log(contentBlocks);
            contentBlocksCompletely = true;
            whenGetCompletely();
        }
    }
    contentBlocksXHR.open("GET", "./json/contentBlocks.json", true);
    contentBlocksXHR.send();

    //console.log("essays开始加载");
    var essaysXHR = new XMLHttpRequest();
    window.essaysCompletely = false;
    window.essays;
    essaysXHR.onreadystatechange = () => {
        if (essaysXHR.readyState === 4 && essaysXHR.status === 200) {
            //console.log("essays加载完成");
            essays = JSON.parse(essaysXHR.responseText);
            //console.log(essays);
            essaysCompletely = true;
            whenGetCompletely();
        }
    }
    essaysXHR.open("GET", "./json/essays.json", true);
    essaysXHR.send();


    function getData(dataXHR, dataCompletely, data, way) {
        dataXHR.onreadystatechange = () => {
            if (dataXHR.readyState == 4 && dataXHR.status === 200) {
                //console.log(way + "完成加载");
                data = JSON.parse(dataXHR.responseText);
                //console.log(data);
                dataCompletely = true;
                whenGetCompletely();
            }
        }
        dataXHR.open("GET", way, true);
        dataXHR.send();
    }

    //每次get数据后执行一次，如果所有json加载完成则执行下一步
    function whenGetCompletely() {
        console.log("get完成一个");
        if (contentBlocksCompletely && aboutsCompletely && essaysCompletely) {
            console.log("get动作完成");
            loadingCompletely();
        }
    }
}

//更新html界面的方法

//更新head展示的数值
function updateNumbers() {
    //coplit生成
    let currentDate = new Date();
    let targetDate = new Date('2024-01-07');
    let timeDiff = Math.floor((currentDate - targetDate) / (86400000));
    document.getElementById("run_day").innerHTML = timeDiff;
}

//更新head的部分的方法
function updateHead() {
    data = abouts;
    //console.log("abouts:\n"+data);
    document.getElementById("avatar").src = "./rec/" + data.avatar;
    document.getElementById("name").innerHTML = data.name;
    document.getElementById("motto").innerHTML = data.motto;
    //document.getElementById("head_back").style.backgroundImage = "url(./rec/" + data.background + ")";
}

//更新博客部分的方法
function updateBlogs() {

    //有用的全局变量
    //console.log("essays:\n"+data);
    window.activeEssays = essays;
    for (let index = 0; index < activeEssays.length; index++) {
        var essay = createBlog(activeEssays[index], index);
        blogs.appendChild(essay);
        // console.log("插入了一个文章")
    }
    //var newHTML="<div class=\"ablog\" id=\"blog_"+"0\"><img src=\""+"\" ><div><h3>"+"</h3><p>"+"</p></div><div style=\"margin: 10px;margin-left: auto;\">分类："+"</div></div> "

}

//更新右侧信息面板的方法
function updateContentBlock() {

    var data = contentBlocks;
    //console.log("contentBlocks:\n"+data);
    var cotentBlocks = document.getElementById("mbody_right");
    for (let index = 0; index < data.length; index++) {
        var cotentBlock = createContentBlock(data[index]);
        cotentBlocks.appendChild(cotentBlock);
    }

}

//更新选择框
function updataSelects() {//这里用到了更新blog时更新的全局变量essays 因此这个函数应当在更新blogs的方法之后引用

    var data = essays;
    //console.log(data);
    var lables = new Set();
    //console.log(data);
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.lable != null) {
            lables.add(element.lable);
        }
    }
    var selects = document.getElementById("selects");
    console.log(lables)
    lables.forEach((lable) => {
        selects.append(createAselectLable(lable));
    })
}




//创造一些html块的方法

//创造博客html
//blog为博客内容 index为索引值，一般与当前显示的文章相对应，用于点击打开文章时确定点击的哪个
function createBlog(blog, index) {
    /**示例
     * 
        <div class="ablog" id="blog_text" onclick="essaysClick(0)">
            <img src="./rec/1.png" alt="">
            <div class="blog_text"> 
                <div class="blog_title">
                    <h3>关于本站</h3>
                    <div class="blog_lable">标签：无</div>
                </div>
                <p>本站的内容简介</p>
            </div>
        </div>
     */

    var essay = document.createElement("div");
    h="";

    //创建图片 如果空则不创建
    if (blog.picture != null) {
        h += "<img src=\"./rec/" + blog.picture + "\" >";
    }
    else {
        h += "<div class=\"nullimg\"></div>";
    }

    //创建文本内容
    h += "<div class=\"blog_text\"> <div class=\"blog_title\"><h3>" + blog.title + "</h3>";
    if (blog.lable != null) {
        h += "<div class=\"blog_lable\">标签：" + blog.lable + "</div>";
    }
    else {
        h += "<div class=\"blog_lable\"></div>";
    }
    h += "</div><p>" + blog.text + "</p></div>";

    //console.log(h);

    //设置属性
    essay.innerHTML = h;
    essay.className = "ablog";
    essay.id = "blog_" + index;

    //essay.onclick=essaysClick;    //正确的
    //essay.onclick=essaysClick();  一个错误示例 这里onclick=essaysclick() 相当于先调用方法 再让onclick等于方法的返回值
    //所以onclick不能加括号 这类似cpp里面的函数指针

    essay.setAttribute("onclick", "essaysClick(" + index + ")");//直接设置onclick属性不会传参
    return essay;
}

//创造博客分类选择的
//lable为博客的标签 是索引 同时也是内容
function createAselectLable(lable) {
    /*示例
        <li onclick="selectAllClick()">
           <div class="aselect" id="aselect_all">
                全部
            </div>
        </li>
     */
    var li = document.createElement("li");
    li.innerHTML = "<div class=\"aselect\" id=\"aselect_" + lable + "\"> " + lable + " </div>";
    li.setAttribute("onclick", "selectClick(\"" + lable + "\")");
    return li;
}

//创造消息框
function createContentBlock(cotentBlock) {
    /*示例
        <div class="content_block" id="abouts">
           <div style="height: 50px;width: 100%;font-size: 20px;">我的信息</div>
           <div style="height: 1px;width: 100%;background-color: #eee;"></div>
           <div class="about">生日：3月15日</div>
           <div class="about">学校：不知道奥</div>
           <div class="about">爱好：无</div>
        </div>
     */
    //console.log("一个消息块：\n"+cotentBlock);
    var div = document.createElement("div");

    div.id = cotentBlock.id; div.className = "content_block";
    div.innerHTML = "<div style=\"height: 50px;width: 100%;font-size: 20px;\">" + cotentBlock.title + "</div>"
    div.innerHTML += " <div style=\"height: 1px;width: 100%;background-color: #eee;\"></div>";
    for (let index = 0; index < cotentBlock.items.length; index++) {
        const element = cotentBlock.items[index];
        div.innerHTML += element + "<br>";
    }
    return div;
}



//其它方法

//将所有的asekect初始化为未选中的状态
function setAllAselectBackgroundWrite() {
    var aselects = document.getElementsByClassName("aselect");
    //console.log(aselects);
    for (let index = 0; index < aselects.length; index++) {
        const element = aselects[index];
        element.style.backgroundColor = "#ffffff"
    }
}