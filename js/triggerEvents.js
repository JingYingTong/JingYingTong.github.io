/**
 * 一些系统的回调事件
 */
window.onload=()=>{
    updateIterface();
    addSearchEvent();
}


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
function searchButtonClick() {
    //alert("这个功能还没有完成喵~");
    s=document.getElementsByClassName("search_text")[0].value;
    //console.log(activeEssays);

    //匹配文章
    a=[];
    for (let index = 0; index < activeEssays.length; index++) {
        const element = activeEssays[index];
        if (element.title.includes(s)) {
            a.push(element);
        }
        else if (element.text.includes(s)) {
            a.push(element);
        }
    }
    activeEssays=a;

    //更新博客列表
    updateActiveEssays();
}

function addSearchEvent() {//添加搜索框响应的事件监听
    let searchText=document.getElementsByClassName("search_text")[0];
    //添加聚焦的动画效果
    searchText.addEventListener("focus",()=>{
        //console.log("focus");
        document.getElementById("search_box").classList.add("search_box_focus");
    });
    searchText.addEventListener("blur",()=>{
        //console.log("blur");
        document.getElementById("search_box").classList.remove("search_box_focus");
    });
    //添加回车搜索
    searchText.addEventListener("keydown", (e)=> {
		// 判断按下的键是否是回车键（键码为13）
		if(e.keyCode === 13) {
			searchButtonClick();
		}
	});

}



//选择框点击
function selectClick(lable) {
    //初始化
    setAllAselectBackgroundWrite();
    //设置点击的为灰色
    document.getElementById("aselect_" + lable).classList.add("aselect-selected");
    var i = 0;
    //提取activeEssays
    activeEssays = [];
    for (let index = 0; index < essays.length; index++) {
        if (essays[index].lable == lable) {
            activeEssays.push(essays[index]);
        }
    }
    //根据activeEssays更新博客列表
    updateActiveEssays();
}

//选择框所有点击
function selectAllClick() {
    var blogs = document.getElementById("blogs");
    blogs.innerHTML = null;
    //updateBlogs();
    setAllAselectBackgroundWrite();
    document.getElementById("aselect_all").classList.add("aselect-selected");
    for (let index = 0; index < essays.length; index++) {
        var essay = createBlog(essays[index], index);
        blogs.appendChild(essay);
    }
    activeEssays = essays;
}

//监听滚动 （为了性能优化改的）
flag=true;
window.addEventListener('scroll',(e)=>{
if(flag){

    window.requestAnimationFrame(()=>{
        //console.log("scroll");
        scrollEvent();
        flag=true;
    });
    flag=false;
}   
} );
function scrollEvent() {
   setHeadBottomFixed(window.scrollY);
}

headbottom=document.getElementById("head_bottom");
headbottomOffsetTop=headbottom.offsetTop;
headbottomOffsetTopAddHeigth=headbottom.offsetTop+headbottom.offsetHeight;
function setHeadBottomFixed(windowScrollY) {
    if (windowScrollY > headbottomOffsetTopAddHeigth) {
        headbottom.classList.add("head_bottom_fixed");
       }
    else if (windowScrollY<headbottomOffsetTop) {
        headbottom.classList.remove("head_bottom_fixed");
    }
}