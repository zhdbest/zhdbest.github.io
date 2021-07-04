/**
 * 执行搜索
 */
function do_search () {
    let keyword = document.getElementById("search_input").value;
    if (keyword != null && keyword.length > 0) {
        open_new_page("https://www.bing.com/search?q=" + keyword);
    }
}

/**
 * 初始化方法
 */
function init() {
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
                do_search();
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


