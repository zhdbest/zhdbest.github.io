/**
 * 选择选项卡
 * @param ele 当前点击的button
 * @returns {boolean}
 */
function select_option(ele) {
    let btn_array = document.getElementById("option").getElementsByTagName("button");
    if (btn_array == null || btn_array.length === 0) {
        return false;
    }
    ele.classList.add("selected");
    ele.classList.remove("option_btn");
    for (let i = 0; i < btn_array.length; i++) {
        let btn = btn_array[i];
        if (ele !== btn) {
            btn.classList.add("option_btn");
            btn.classList.remove("selected");
        }
    }
    let input = document.getElementById("search_input");
    /* 切换选项卡后，调整输入框提示信息 */
    input.setAttribute("placeholder", "Search on " + ele.name + "...");
    /* 切换选项卡后，将鼠标聚焦到输入框 */
    input.focus();
}

/**
 * 执行查询
 * @returns {boolean}
 */
function go() {
    let keyword = document.getElementById("search_input").value;
    if (keyword == null || keyword.length === 0) {
        return false;
    }
    let btn_array = document.getElementById("option").getElementsByTagName("button");
    if (btn_array == null || btn_array.length === 0) {
        return false;
    }

    let url = "";
    for (let i = 0; i < btn_array.length; i++) {
        let btn = btn_array[i];
        let btn_class = btn.className;
        if (btn_class !== "" && btn_class.indexOf("selected") !== -1) {
            url = get_search_url(btn.id, keyword)
        }
    }
    if (url != null && url !== "") {
        open_new_page(url);
    }
}

/**
 * 获取搜索的URL
 * @param from 该搜索的来源：bing、google_translate、youdao_translate
 * @param keyword 关键词
 * @returns {string} 计算出的URL
 */
function get_search_url(from, keyword) {
    if (from == null || keyword == null || keyword.length === 0) {
        return "";
    }
    /* bing */
    if (from === "bing_btn") {
        return "https://www.bing.com/search?q=" + keyword;
    }
    /* 谷歌翻译 */
    if (from === "google_translate_btn") {
        /* 利用正则匹配是否是汉字 */
        let zh_Array = keyword.match(/[^\x00-\x80]/g);
        /* 目标语言默认取中文 */
        let tl = "zh-CN";
        /* 如果正则匹配出汉字，则目标语言取英文 */
        if (zh_Array != null) {
            tl = "en";
        }
        return "https://translate.google.cn/?sl=auto&tl=" + tl + "&text=" + keyword + "&op=translate";
    }
    /* 有道翻译 */
    if (from === "youdao_translate_btn") {
        return "https://www.youdao.com/w/" + keyword + "/#keyfrom=dict2.top";
    }
    /* Maven仓库 */
    if (from === "maven_btn") {
        return "https://mvnrepository.com/search?q=" + keyword;
    }
    /* stackoverflow */
    if (from === "stackoverflow_btn") {
        return "https://stackoverflow.com/search?q=" + keyword;
    }
    return "";
}

/**
 * 初始化方法
 */
function init() {
    /* 设置默认选中的选项卡：必应 */
    select_option(document.getElementById("bing_btn"));
    /* 绑定搜索框的Enter按键 */
    bind_search_enter();
    let url = "data.json";
    let request = new XMLHttpRequest();
    /* 设置请求方法与路径 */
    request.open("get", url);
    /* 不发送数据到服务器 */
    request.send(null);
    /* XHR对象获取到返回信息后执行 */
    request.onload = function () {
        /* 返回状态为200，即为数据获取成功 */
        if (request.status === 200) {
            /* 拿到JSON对象 */
            let json = JSON.parse(request.responseText);
            /* 处理常用链接行 */
            let commonLine = json.commonLine;
            if (commonLine != null && commonLine.length > 0) {
                init_common_line(commonLine);
            }
            /* 处理常用链接块 */
            let blockConfig = json.blockConfig;
            let blockList = blockConfig.blockList;
            if (blockList != null && blockList.length > 0) {
                init_block(blockConfig);
            }
        }
    }
}

/**
 * 绑定搜索框的Enter按键搜索
 */
function bind_search_enter() {
    document.getElementById("search_input")
        .addEventListener("keydown", function (event) {
            if (event === undefined) {
                return false;
            }
            if (event.key !== undefined && event.key === "Enter") {
                go();
            }
    }, true);
}

/**
 * 打开指定URL的新页面
 * @param url 指定地址
 */
function open_new_page(url) {
    window.open(url);
}

/**
 * 初始化常用行
 * @param common_line 常用行的JSON对象
 */
function init_common_line(common_line) {
    let all_btn_html = "";
    common_line.forEach(function (btn) {
        /* 创建一个button */
        let btn_html = "<button id='" + btn.name + "' type='button' onClick='open_new_page(\"" + btn.url + "\")'>" + btn.name + "</button>"
        all_btn_html = all_btn_html + btn_html;
    });
    /* 设置所有button到 common_btn_line div下*/
    document.getElementById("common_btn_line").innerHTML = all_btn_html;
}

/**
 * 初始化常用块
 * @param block_config 常用块配置
 */
function init_block(block_config) {
    let size_per_line = block_config.sizePerLine;

    let current_size = 0;
    let all_block_html = "";
    block_config.blockList.forEach(function (block) {
        if (current_size === 0 || current_size === size_per_line) {
            all_block_html = all_block_html + "<tr>"
        }
        all_block_html = all_block_html + "<td><div class=\"block\" onclick=\"open_new_page('" + block.url + "')\">";
        all_block_html = all_block_html + "<p><img alt='" + block.name + "' src='" + block.svg +"'></p>";
        all_block_html = all_block_html + "<p>" + block.name +"</p>";
        all_block_html = all_block_html + "</div></td>";
        current_size++;
        if (current_size === size_per_line) {
            all_block_html = all_block_html + "</tr>"
        }
    });
    if (!all_block_html.endsWith("</tr>")) {
        all_block_html = all_block_html + "</tr>"
    }
    document.getElementById("block_table").innerHTML = all_block_html;
}


