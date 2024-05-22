/*
用于更新界面的方法
*/

function updateIterface() {//网页加载时调用，应当在onload事件中调用
    //一些用于初始化的函数
    updateOne("./json/abouts.json", updateHead);
    updateOne("./json/contentBlocks.json", updateContentBlock);
    updateOne("./json/essays.json", updateEssays);
    updateOne("./json/essays.json", updataSelects);
    updateOne("./json/footer.json",updateFooter);
    updateOne("./json/theme.json",updateApperance);


    updateNumbers();

    //设置网页进入时selects的样式
    document.getElementById("aselect_all").classList.add("aselect-selected");
} 

function updateOne(jsonPath, updateFunction) {
    //console.log(jsonPath+"开始加载");
    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = () => {
        if (XHR.readyState == 4 && XHR.status === 200) {
            //console.log(jsonPath+"完成加载");
            data = JSON.parse(XHR.responseText);
            //console.log(data);
            updateFunction(data);
        }
    }
    XHR.open("GET", jsonPath, true);
    XHR.send();
}


//更新html界面的方法////////////////////////////////////////////////////////////

//更新head展示的数值
function updateNumbers() {
    //coplit生成
    let currentDate = new Date();
    let targetDate = new Date('2024-01-07');
    let timeDiff = Math.floor((currentDate - targetDate) / (86400000));
    document.getElementById("run_day").innerHTML = timeDiff;
}

//更新head的部分的方法
function updateHead(data) {
    abouts = data;
    //console.log("abouts:\n"+data);
    //document.getElementById("avatar1").src = "./rec/" + data.avatar;
    //document.getElementById("name1").innerHTML = data.name;
    document.getElementById("motto").innerHTML = data.motto;

    //背景图由css主题管理了
    //document.getElementById("head_back").style.backgroundImage = "url(./rec/" + data.background + ")";

    a=document.getElementsByName("avatar");
    a.forEach(element => {
        element.src = "./rec/" + data.avatar;
    });

    n=document.getElementsByName("name");
    n.forEach(element => {
        element.innerHTML = data.name;
    });
}

//更新博客部分的方法
function updateEssays(data) {

    //有用的全局变量
    //console.log("essays:\n"+data);
    essays = data;
    activeEssays = data;
    updateActiveEssays();
    //var newHTML="<div class=\"ablog\" id=\"blog_"+"0\"><img src=\""+"\" ><div><h3>"+"</h3><p>"+"</p></div><div style=\"margin: 10px;margin-left: auto;\">分类："+"</div></div> "

}
    

//更新右侧信息面板的方法
function updateContentBlock(data) {

    contentBlocks = data;
    //console.log("contentBlocks:\n"+data);
    var cotentBlocks = document.getElementById("mbody_right");
    for (let index = 0; index < data.length; index++) {
        var cotentBlock = createContentBlock(data[index]);
        cotentBlocks.appendChild(cotentBlock);
    }

}

//更新选择框
function updataSelects(data) {//这里用到了更新blog时更新的全局变量essays 因此这个函数应当在更新blogs的方法之后引用

    //console.log(data);
    var lables = new Set();
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.lable != null) {
            lables.add(element.lable);
        }
    }
    var selects = document.getElementById("selects");
    //console.log(lables)
    lables.forEach((lable) => {
        selects.append(createAselectLable(lable));
    })
}

//更新页脚
function updateFooter(data) {
    //console.log("contentBlocks:\n"+data);
    var footer = document.getElementById("foot");
    for (let index = 0; index < data.length; index++) {
        var one = createFooter(data[index]);
        footer.appendChild(one);
    }
}

//更新外观
function updateApperance(data) {
    document.getElementById("theme").href = data.theme;
}



//创造一些html块的方法///////////////////////////////////////////////////////////////////////////

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
    h = "";

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
           <div class="split_line"></div>
           <div class="about">生日：3月15日</div>
           <div class="about">学校：不知道奥</div>
           <div class="about">爱好：无</div>
        </div>
     */
    //console.log("一个消息块：\n"+cotentBlock);
    var div = document.createElement("div");

    div.id = cotentBlock.id; div.className = "content_block";
    div.innerHTML = "<div style=\"height: 50px;width: 100%;font-size: 20px;\">" + cotentBlock.title + "</div>"
    div.innerHTML += " <div class=\"split_line\"></div>";
    for (let index = 0; index < cotentBlock.items.length; index++) {
        const element = cotentBlock.items[index];
        div.innerHTML += element + "<br>";
    }
    return div;
}

//创造一个页尾
function createFooter(footer) {
    /*示例
        <a class="footer_line" href="beian.miit.gov.cn" target="_blank">
            <img src="./rec/avatar.png">
            &#32;
            您的备案号
        </a>
    */
    var a = document.createElement("a");
    a.className = "footer_line"; // 添加类名
    a.href = footer.a; // 设置链接地址
    a.target = "_blank"; // 在新窗口中打开链接
    var str="";
    if (footer.icon != "") {
        str += "<img src=\"" + footer.icon + "\">"
    }
    str += "&#32;";
    str += footer.text;
    a.innerHTML = str;
    return a;
}

//一些比较基础的，多次使用的方法//////////////////////////////////////////////

//按照activeEssays的顺序创建博客
function updateActiveEssays() {
    var blogs = document.getElementById("blogs");
    blogs.innerHTML = null;//清空所有essays
    //console.log("activeEssays:\n"+activeEssays);
    for (let index = 0; index < activeEssays.length; index++) {
        var essay = createBlog(activeEssays[index], index);
        blogs.appendChild(essay);
        // console.log("插入了一个文章")
    }
}

//将所有的asekect初始化为未选中的状态
function setAllAselectBackgroundWrite() {
    var aselects = document.getElementsByClassName("aselect");
    //console.log(aselects);
    for (let index = 0; index < aselects.length; index++) {
        const element = aselects[index];
        element.classList.remove("aselect-selected");
    }
}