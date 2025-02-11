// ==UserScript==
// @name         BetterACGO
// @namespace    https://github.com/Codete2/BetterACGO-Tampermonkey
// @version      2025-02-07
// @description  try to take over the world!
// @author       You
// @match        https://www.acgo.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在题目页面
    function isInProblemPage() {
        return location.href.includes('/problemset/info/');
    }

    // 添加一个标志来跟踪是否已经初始化了按钮
    let buttonsInitialized = false;

    // 修改添加按钮到顶部工具栏的部分
    function initializeButtons() {
        console.log('initializeButtons called, initialized status:', buttonsInitialized);

        if (buttonsInitialized) {
            console.log('Buttons already initialized, returning');
            return;
        }

        const topBarToolBar = document.querySelector('.xmccode-topBarToolBar');
        if (!topBarToolBar) {
            console.log('Toolbar not found, returning');
            return;
        }

        console.log('Starting button initialization');

        // 先移除所有已存在的自定义按钮
        const existingButtons = topBarToolBar.querySelectorAll('[data-custom-btn="true"]');
        console.log('Found existing buttons:', existingButtons.length);
        existingButtons.forEach(btn => btn.remove());

        // 移除已存在的菜单和文件输入
        const existingMenu = document.querySelector('.template-menu');
        if (existingMenu) existingMenu.remove();
        const existingFileInput = document.querySelector('input[type="file"][data-custom-input="true"]');
        if (existingFileInput) existingFileInput.remove();

        // 创建下载按钮
        const downloadBtn = document.createElement('span');
        downloadBtn.className = 'xmccode-configSelector';
        downloadBtn.setAttribute('data-custom-btn', 'true');
        downloadBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#7aa2f7" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
        `;
        downloadBtn.title = '下载代码';
        downloadBtn.style.cursor = 'pointer';
        downloadBtn.style.marginRight = '4px';

        // 创建上传按钮
        const uploadBtn = document.createElement('span');
        uploadBtn.className = 'xmccode-configSelector';
        uploadBtn.setAttribute('data-custom-btn', 'true');
        uploadBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#7aa2f7" d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>
            </svg>
        `;
        uploadBtn.title = '上传代码';
        uploadBtn.style.cursor = 'pointer';
        uploadBtn.style.marginRight = '4px';

        // 创建模板按钮
        const templateBtn = document.createElement('span');
        templateBtn.className = 'xmccode-configSelector';
        templateBtn.setAttribute('data-custom-btn', 'true');
        templateBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#7aa2f7" d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 16H5V4h14v14z M7 7h10v2H7V7z M7 11h10v2H7v-2z"/>
            </svg>
        `;
        templateBtn.title = '插入模板';
        templateBtn.style.cursor = 'pointer';
        templateBtn.style.marginRight = '4px';

        // 创建格式化按钮
        const formatBtn = document.createElement('span');
        formatBtn.className = 'xmccode-configSelector';
        formatBtn.setAttribute('data-custom-btn', 'true');
        formatBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#7aa2f7" d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 7h14v2H5V7zm0 4h14v2H5v-2zm0 4h14v2H5v-2z"/>
            </svg>
        `;
        formatBtn.title = '格式化代码';
        formatBtn.style.cursor = 'pointer';
        formatBtn.style.marginRight = '4px';

        // 创建统计按钮
        const statsBtn = document.createElement('span');
        statsBtn.className = 'xmccode-configSelector';
        statsBtn.setAttribute('data-custom-btn', 'true');
        statsBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#7aa2f7" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
            </svg>
        `;
        statsBtn.title = '代码统计';
        statsBtn.style.cursor = 'pointer';
        statsBtn.style.marginRight = '4px';

        // 添加按钮的事件处理
        downloadBtn.onclick = () => {
            const editor = document.querySelector('.cm-content');
            if (editor) {
                const code = editor.innerText;
                const blob = new Blob([code], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'code.cpp';
                a.click();
                window.URL.revokeObjectURL(url);
            }
        };

        // 创建文件输入元素
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.cpp,.c,.py';
        fileInput.style.display = 'none';
        fileInput.setAttribute('data-custom-input', 'true');
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const editor = document.querySelector('.cm-content');
                    if (editor) {
                        const inputEvent = new InputEvent('input', {
                            bubbles: true,
                            cancelable: true,
                            data: e.target.result
                        });
                        editor.textContent = e.target.result;
                        editor.dispatchEvent(inputEvent);
                    }
                };
                reader.readAsText(file);
            }
        };
        uploadBtn.onclick = () => fileInput.click();

        // 添加悬停效果
        [downloadBtn, uploadBtn, templateBtn, formatBtn, statsBtn].forEach(btn => {
            btn.addEventListener('mouseover', () => {
                btn.querySelector('svg path').setAttribute('fill', '#c0caf5');
            });
            btn.addEventListener('mouseout', () => {
                btn.querySelector('svg path').setAttribute('fill', '#7aa2f7');
            });
        });

        // 格式化代码的功能
        formatBtn.onclick = () => {
            const editor = document.querySelector('.cm-content');
            if (editor) {
                const code = editor.innerText;
                let indent = 0;
                let formattedLines = code.split('\n').map(line => {
                    line = line.trim();
                    if (!line) return '';

                    // 处理右花括号，需要减少缩进
                    if (line.startsWith('}')) {
                        indent = Math.max(0, indent - 1);
                    }

                    // 添加当前缩进
                    const currentLine = '    '.repeat(indent) + line;

                    // 处理左花括号，增加下一行的缩进
                    if (line.endsWith('{')) {
                        indent++;
                    }
                    // 处理单行的右花括号
                    else if (line.endsWith('}')) {
                        indent = Math.max(0, indent - 1);
                    }

                    return currentLine;
                });

                // 移除多余的空行
                formattedLines = formattedLines.filter((line, index, arr) => {
                    if (index === 0 || index === arr.length - 1) return true;
                    return !(line === '' && arr[index - 1] === '');
                });

                const formattedCode = formattedLines.join('\n');

                // 更新编辑器内容
                editor.textContent = formattedCode;
                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    data: formattedCode
                });
                editor.dispatchEvent(inputEvent);
            }
        };

        // 统计功能
        statsBtn.onclick = () => {
            const editor = document.querySelector('.cm-content');
            if (editor) {
                const code = editor.innerText;
                const stats = {
                    lines: code.split('\n').filter(line => line.trim()).length,
                    chars: code.length,
                    words: code.split(/\W+/).filter(word => word).length,
                    functions: (code.match(/\w+\s*\([^)]*\)\s*{/g) || []).length
                };

                // 创建统计弹窗
                const popup = document.createElement('div');
                popup.style.position = 'fixed';
                popup.style.top = '50%';
                popup.style.left = '50%';
                popup.style.transform = 'translate(-50%, -50%)';
                popup.style.backgroundColor = '#1a1b26';
                popup.style.border = '1px solid #414868';
                popup.style.borderRadius = '8px';
                popup.style.padding = '20px';
                popup.style.zIndex = '1000';
                popup.style.color = '#c0caf5';
                popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';

                popup.innerHTML = `
                    <h3 style="margin:0 0 15px 0;color:#7aa2f7">代码统计</h3>
                    <p>有效代码行数: ${stats.lines}</p>
                    <p>字符数: ${stats.chars}</p>
                    <p>单词数: ${stats.words}</p>
                    <p>函数数量: ${stats.functions}</p>
                    <button style="
                        background:#24283b;
                        border:1px solid #414868;
                        color:#7aa2f7;
                        padding:5px 15px;
                        border-radius:4px;
                        cursor:pointer;
                        margin-top:10px;
                    ">关闭</button>
                `;

                document.body.appendChild(popup);
                popup.querySelector('button').onclick = () => popup.remove();
            }
        };

        // 创建模板菜单
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.display = 'none';
        menu.style.backgroundColor = '#1a1b26';
        menu.style.border = '1px solid #414868';
        menu.style.borderRadius = '6px';
        menu.style.padding = '8px 0';
        menu.style.zIndex = '1000';
        menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        menu.style.maxHeight = '400px';  // 设置最大高度
        menu.style.overflowY = 'auto';   // 允许垂直滚动
        menu.style.overflowX = 'hidden'; // 禁止水平滚动

        // 添加滚动条样式
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .template-menu::-webkit-scrollbar {
                width: 8px;
            }
            .template-menu::-webkit-scrollbar-track {
                background: #1a1b26;
                border-radius: 4px;
            }
            .template-menu::-webkit-scrollbar-thumb {
                background: #414868;
                border-radius: 4px;
            }
            .template-menu::-webkit-scrollbar-thumb:hover {
                background: #565f89;
            }
        `;
        document.head.appendChild(styleSheet);
        menu.className = 'template-menu';

        // 添加模板选项
        const templates = {
            '快速排序': {
                desc: '时间复杂度 O(nlogn)，原地排序算法',
                code: `void quickSort(int arr[], int left, int right) {
    if (left >= right) return;
    int i = left, j = right;
    int pivot = arr[left];  // 选择第一个元素作为基准
    while (i < j) {
        while (i < j && arr[j] >= pivot) j--;
        if (i < j) arr[i] = arr[j];
        while (i < j && arr[i] <= pivot) i++;
        if (i < j) arr[j] = arr[i];
    }
    arr[i] = pivot;
    quickSort(arr, left, i - 1);
    quickSort(arr, i + 1, right);
}`
            },
            '归并排序': {
                desc: '时间复杂度 O(nlogn)，稳定排序算法',
                code: `void merge(int arr[], int left, int mid, int right) {
    vector<int> temp(right - left + 1);
    int i = left, j = mid + 1, k = 0;
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else temp[k++] = arr[j++];
    }
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    for (int p = 0; p < k; p++) arr[left + p] = temp[p];
}

void mergeSort(int arr[], int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}`
            },
            '二分查找': {
                desc: '时间复杂度 O(logn)，用于在有序数组中查找元素',
                code: `int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;  // 未找到返回-1
}`
            },
            '最大公约数': {
                desc: '欧几里得算法，时间复杂度 O(log(min(a,b)))',
                code: `int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a;
}`
            },
            '最小公倍数': {
                desc: '基于最大公约数计算',
                code: `int lcm(int a, int b) {
    return a / gcd(a, b) * b;  // 先除后乘防止溢出
}`
            },
            '并查集': {
                desc: '用于处理动态连通性问题，近乎 O(1) 的时间复杂度',
                code: `class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        return parent[x] == x ? x : (parent[x] = find(parent[x]));
    }

    void unite(int x, int y) {
        x = find(x), y = find(y);
        if (x == y) return;
        if (rank[x] < rank[y]) swap(x, y);
        parent[y] = x;
        if (rank[x] == rank[y]) rank[x]++;
    }

    bool same(int x, int y) {
        return find(x) == find(y);
    }
};`
            },
            '线段树': {
                desc: '用于区间查询和修改，时间复杂度 O(logn)',
                code: `class SegmentTree {
    vector<int> tree, lazy;
    int n;
public:
    SegmentTree(vector<int>& arr) {
        n = arr.size();
        tree.resize(4 * n);
        lazy.resize(4 * n);
        build(arr, 0, 0, n - 1);
    }

    void build(vector<int>& arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }
        int mid = (start + end) / 2;
        build(arr, 2 * node + 1, start, mid);
        build(arr, 2 * node + 2, mid + 1, end);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    void updateRange(int node, int start, int end, int l, int r, int val) {
        if (lazy[node] != 0) {
            tree[node] += (end - start + 1) * lazy[node];
            if (start != end) {
                lazy[2 * node + 1] += lazy[node];
                lazy[2 * node + 2] += lazy[node];
            }
            lazy[node] = 0;
        }
        if (start > end || start > r || end < l) return;
        if (l <= start && end <= r) {
            tree[node] += (end - start + 1) * val;
            if (start != end) {
                lazy[2 * node + 1] += val;
                lazy[2 * node + 2] += val;
            }
            return;
        }
        int mid = (start + end) / 2;
        updateRange(2 * node + 1, start, mid, l, r, val);
        updateRange(2 * node + 2, mid + 1, end, l, r, val);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    int queryRange(int node, int start, int end, int l, int r) {
        if (start > end || start > r || end < l) return 0;
        if (lazy[node] != 0) {
            tree[node] += (end - start + 1) * lazy[node];
            if (start != end) {
                lazy[2 * node + 1] += lazy[node];
                lazy[2 * node + 2] += lazy[node];
            }
            lazy[node] = 0;
        }
        if (l <= start && end <= r) return tree[node];
        int mid = (start + end) / 2;
        return queryRange(2 * node + 1, start, mid, l, r) +
               queryRange(2 * node + 2, mid + 1, end, l, r);
    }
};`
            }
        };

        // 修改菜单项的创建
        Object.entries(templates).forEach(([name, {desc, code}]) => {
            const item = document.createElement('div');
            item.style.padding = '8px 16px';
            item.style.cursor = 'pointer';
            item.style.color = '#c0caf5';
            item.style.transition = 'all 0.2s ease';
            item.style.borderBottom = '1px solid #414868';

            // 创建标题和描述
            const title = document.createElement('div');
            title.textContent = name;
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '4px';

            const description = document.createElement('div');
            description.textContent = desc;
            description.style.fontSize = '12px';
            description.style.color = '#565f89';

            item.appendChild(title);
            item.appendChild(description);

            item.addEventListener('mouseover', () => {
                item.style.backgroundColor = '#24283b';
            });
            item.addEventListener('mouseout', () => {
                item.style.backgroundColor = 'transparent';
            });

            item.onclick = () => {
                // 复制代码到剪贴板
                navigator.clipboard.writeText(code).then(() => {
                    // 显示提示消息
                    const toast = document.createElement('div');
                    toast.textContent = '代码已复制到剪贴板';
                    toast.style.position = 'fixed';
                    toast.style.bottom = '20px';
                    toast.style.left = '50%';
                    toast.style.transform = 'translateX(-50%)';
                    toast.style.backgroundColor = '#7aa2f7';
                    toast.style.color = '#1a1b26';
                    toast.style.padding = '8px 16px';
                    toast.style.borderRadius = '4px';
                    toast.style.zIndex = '1001';
                    toast.style.opacity = '0';
                    toast.style.transition = 'opacity 0.3s ease';

                    document.body.appendChild(toast);
                    setTimeout(() => toast.style.opacity = '1', 0);
                    setTimeout(() => {
                        toast.style.opacity = '0';
                        setTimeout(() => toast.remove(), 300);
                    }, 2000);
                });
                menu.style.display = 'none';
            };

            menu.appendChild(item);
        });

        // 点击按钮显示菜单
        templateBtn.onclick = (e) => {
            const rect = templateBtn.getBoundingClientRect();
            // 计算菜单位置，确保不会超出视窗
            const menuWidth = 300;  // 设置一个固定的菜单宽度
            const menuLeft = Math.min(
                rect.left,
                window.innerWidth - menuWidth - 20  // 预留20px边距
            );

            menu.style.top = `${rect.bottom + 5}px`;
            menu.style.left = `${menuLeft}px`;
            menu.style.width = `${menuWidth}px`;  // 固定菜单宽度
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            e.stopPropagation();
        };

        // 调整菜单样式
        menu.style.position = 'fixed';  // 改用fixed定位
        menu.style.maxWidth = '300px';  // 限制最大宽度
        menu.style.minWidth = '250px';  // 设置最小宽度

        // 点击其他地方关闭菜单
        document.addEventListener('click', () => {
            menu.style.display = 'none';
        });

        // 添加按钮和菜单到页面
        console.log('Adding buttons to toolbar');
        topBarToolBar.insertBefore(statsBtn, topBarToolBar.firstChild);
        topBarToolBar.insertBefore(formatBtn, topBarToolBar.firstChild);
        topBarToolBar.insertBefore(templateBtn, topBarToolBar.firstChild);
        topBarToolBar.insertBefore(uploadBtn, topBarToolBar.firstChild);
        topBarToolBar.insertBefore(downloadBtn, topBarToolBar.firstChild);
        document.body.appendChild(menu);

        console.log('Setting buttonsInitialized to true');
        buttonsInitialized = true;  // 标记按钮已初始化
    }

    // 定义样式更新函数
    function updateStyles() {
        console.log('updateStyles called');

        // 等待元素加载完成
        if (!document.getElementsByClassName('index_active__fdXFh')[0]) {
            console.log('Required element not found, retrying in 100ms');
            setTimeout(updateStyles, 100);
            return;
        }

        console.log('Required element found, calling initializeButtons');
        initializeButtons();

        // 修改收藏按钮
        const oldBtn = document.querySelector('.Collect_collectBtn__13hc0');
        if (oldBtn) {
            // 保留原始按钮，只修改内部样式
            const span = oldBtn.querySelector('span');
            if (span) {
                span.style.color = '#7aa2f7 !important';
            }
            const icon = oldBtn.querySelector('i');
            if (icon) {
                icon.style.color = '#7aa2f7 !important';
            }
            oldBtn.style.backgroundColor = '#1a1b26';  // 更暗的背景色
            oldBtn.style.border = '1px solid #292e42';  // 更暗的边框
            oldBtn.style.padding = '6px 12px';
            oldBtn.style.borderRadius = '6px';
            oldBtn.style.display = 'flex';
            oldBtn.style.alignItems = 'center';
            oldBtn.style.gap = '5px';
            oldBtn.style.cursor = 'pointer';
            oldBtn.style.transition = 'all 0.2s ease';

            // 添加悬停效果
            oldBtn.addEventListener('mouseover', () => {
                oldBtn.style.backgroundColor = '#24283b';  // 悬停时变亮
                oldBtn.style.borderColor = '#414868';
            });
            oldBtn.addEventListener('mouseout', () => {
                oldBtn.style.backgroundColor = '#1a1b26';  // 恢复原色
                oldBtn.style.borderColor = '#292e42';
            });

            // 添加内联样式来确保文字颜色
            oldBtn.style.color = '#7aa2f7';
            oldBtn.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const span = document.createElement('span');
                    span.textContent = node.textContent;
                    span.style.color = '#7aa2f7';
                    node.parentNode.replaceChild(span, node);
                }
            });
        }

        if (!isInProblemPage()) {
            // 恢复原始样式
            document.body.style.backgroundColor = 'white';
            document.body.style.color = '#2c3040';
            document.getElementsByClassName('index_active__fdXFh')[0].style.backgroundColor = '#fff';
            document.getElementsByClassName('index_active__fdXFh')[0].style.border = '1px solid #e0e0e0';
            document.getElementsByClassName('index_active__fdXFh')[0].style.color = '#2c3040';
            document.getElementsByClassName('info_detailWrap__x5tim')[0].style.backgroundColor = 'white';
            document.getElementsByClassName('info_detailWrap__x5tim')[0].style.border = '1px solid #e0e0e0';
            document.getElementsByClassName('info_detailWrap__x5tim')[0].style.scrollbarColor = '';
            const oldStyle = document.getElementsByClassName('BetterACGOStyle01')[0];
            if (oldStyle) oldStyle.remove();
            console.log('已恢复原始样式');
            return;
        }

        // 应用暗色主题
        document.body.style.backgroundColor = '#1a1b26';  // 更深的蓝黑色背景
        document.body.style.color = '#a9b1d6';  // 柔和的浅蓝色文字
        document.getElementsByClassName('index_active__fdXFh')[0].style.backgroundColor = '#24283b';  // 稍浅的蓝黑色
        document.getElementsByClassName('index_active__fdXFh')[0].style.border = '1px solid #414868';  // 深灰色边框
        document.getElementsByClassName('index_active__fdXFh')[0].style.color = '#c0caf5';  // 亮蓝色文字
        document.getElementsByClassName('info_detailWrap__x5tim')[0].style.backgroundColor = '#24283b';
        document.getElementsByClassName('info_detailWrap__x5tim')[0].style.border = '1px solid #414868';
        document.getElementsByClassName('info_detailWrap__x5tim')[0].style.scrollbarColor = '#414868 #24283b';

        // 添加其他元素的样式
        const style = document.createElement('style');
        style.className = 'BetterACGOStyle01';
        style.textContent = `
            .info_detailWrap__x5tim p {
                color: #c0caf5;
            }
            .info_detailWrap__x5tim h4 {
                color: #7aa2f7;  // 突出的蓝色标题
            }
            .info_detailWrap__x5tim h1 {
                color: #7aa2f7;
            }
            .info_detailWrap__x5tim span {
                color: #c0caf5;
            }
            .info_exampleList__RLYZK p {
                color: #9aa5ce;  // 稍暗的示例文字
            }
            .katex {
                color: #bb9af7;  // 紫色数学公式
            }
            .Example_exampleContent__2sQ_8 {
                background-color: #1f2335;  // 深色示例背景
                border: 1px solid #414868;
                padding: 15px;  // 增加内边距
                border-radius: 8px;  // 圆角边框
                font-family: 'Consolas', monospace;  // 等宽字体
                color: #c0caf5;  // 浅色文字
            }
            .Example_example__S1A0A {
                margin: 10px 0;  // 增加示例之间的间距
                background-color: transparent !important;  // 移除背景色
            }
            .Example_exampleTitle__s4V_F {
                background-color: #24283b;  // 标题背景色
                padding: 8px 15px;  // 标题内边距
                border-radius: 8px 8px 0 0;  // 上方圆角
                border: 1px solid #414868;
                border-bottom: none;
                color: #7aa2f7;  // 标题文字颜色
                background-image: none !important;  // 移除背景图片
            }
            .Example_exampleTitle__s4V_F p {
                color: #7aa2f7 !important;  // 强制标题文字颜色
                margin: 0;
            }
            .Example_exampleContent__2sQ_8 {
                background-color: #1f2335 !important;  // 强制使用我们的背景色
                border: 1px solid #414868;
                border-radius: 0 0 8px 8px;  // 下方圆角
                margin-top: 0;
                white-space: pre-wrap;  // 保留换行和空格
                padding: 15px;
                font-family: 'Consolas', monospace;
                color: #c0caf5;
            }
            .index_link-btn__cw6N1 {
                background-color: #24283b !important;  // 按钮背景色
                border: 1px solid #414868 !important;
                color: #7aa2f7 !important;  // 按钮文字颜色
            }
            .index_link-btn__cw6N1:hover {
                background-color: #2f334d !important;  // 悬停时的背景色
            }
            .Example_example__S1A0A{
                background: none !important;
                border: 1px solid #414868 !important;
            }
            .Collect_collectBtn__13hc0 {
                background-color: #24283b !important;
                border: 1px solid #414868 !important;
                padding: 6px 12px !important;
                border-radius: 6px !important;
                display: flex !important;
                align-items: center !important;
                gap: 5px !important;
                transition: all 0.2s ease !important;
                cursor: pointer !important;
            }
            .Collect_collectBtn__13hc0:hover {
                background-color: #2f334d !important;
                border-color: #565f89 !important;
            }
            .Collect_collectBtn__13hc0 i {
                color: #7aa2f7 !important;
                font-size: 14px !important;
            }
            .Collect_collectBtn__13hc0 * {
                color: #7aa2f7 !important;  // 确保按钮内所有文字都是亮蓝色
            }

            // 题目导航按钮样式
            .index_default-btn__uc9VX {
                background-color: #1a1b26 !important;  // 更暗的背景色
                border: 1px solid #292e42 !important;  // 更暗的边框
                color: #7aa2f7 !important;
                padding: 6px 12px !important;
                border-radius: 6px !important;
                transition: all 0.2s ease !important;
            }

            .index_default-btn__uc9VX:hover:not([disabled]) {
                background-color: #24283b !important;  // 悬停时变亮
                border-color: #414868 !important;
            }

            .index_default-btn__uc9VX[disabled] {
                background-color: #16161e !important;  // 禁用时更暗
                border-color: #1a1b26 !important;
                color: #565f89 !important;
                cursor: not-allowed !important;
            }

            .index_default-btn__uc9VX i {
                color: #7aa2f7 !important;
            }

            // 题目导航文字样式
            .Catalogue_wrap__kYUm_ {
                color: #c0caf5 !important;
            }

            .Catalogue_title__w_ldR {
                color: #7aa2f7 !important;
            }

            .Catalogue_rightWrap__Fcwz6 {
                color: #a9b1d6 !important;
            }
        `;
        document.head.appendChild(style);
        console.log('样式已更新于: ' + location.href);

        // 修改导航按钮
        const navBtns = document.querySelectorAll('.index_default-btn__uc9VX');
        navBtns.forEach(btn => {
            // 设置基础样式
            btn.style.backgroundColor = '#1a1b26';
            btn.style.border = '1px solid #292e42';
            btn.style.padding = '6px 12px';
            btn.style.borderRadius = '6px';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.gap = '5px';
            btn.style.cursor = 'pointer';
            btn.style.transition = 'all 0.2s ease';
            btn.style.color = '#7aa2f7';

            // 根据按钮类型设置文本
            if (btn.classList.contains('Catalogue_prevBtn__AgNJL')) {
                btn.textContent = '上一题';
            } else if (btn.classList.contains('Catalogue_nextBtn__tCMcH')) {
                btn.textContent = '下一题';
            } else if (btn.classList.contains('Catalogue_listBtn__GG6AM')) {
                btn.textContent = '题目列表';
            }

            // 设置禁用状态样式
            if (btn.hasAttribute('disabled')) {
                btn.style.backgroundColor = '#16161e';
                btn.style.borderColor = '#1a1b26';
                btn.style.color = '#565f89';
                btn.style.cursor = 'not-allowed';
            }

            // 添加悬停效果
            btn.addEventListener('mouseover', () => {
                if (!btn.hasAttribute('disabled')) {
                    btn.style.backgroundColor = '#24283b';
                    btn.style.borderColor = '#414868';
                }
            });
            btn.addEventListener('mouseout', () => {
                if (!btn.hasAttribute('disabled')) {
                    btn.style.backgroundColor = '#1a1b26';
                    btn.style.borderColor = '#292e42';
                }
            });
        });

        // 修改导航文字样式
        const catalogueWrap = document.querySelector('.Catalogue_wrap__kYUm_');
        if (catalogueWrap) {
            catalogueWrap.style.color = '#c0caf5';
            const title = catalogueWrap.querySelector('.Catalogue_title__w_ldR');
            if (title) {
                title.style.color = '#7aa2f7';
            }
            const rightWrap = catalogueWrap.querySelector('.Catalogue_rightWrap__Fcwz6');
            if (rightWrap) {
                rightWrap.style.color = '#a9b1d6';
            }
        }
    }

    // 添加函数提示
    const functionHints = {
        // 算法库函数
        'sort': {
            header: '<algorithm>',
            syntax: 'sort(first, last)',
            desc: '对范围 [first, last) 内的元素进行排序',
            complexity: '时间复杂度: O(N·log(N))'
        },
        'stable_sort': {
            header: '<algorithm>',
            syntax: 'stable_sort(first, last)',
            desc: '稳定排序，保持相等元素的相对顺序',
            complexity: '时间复杂度: O(N·log(N))'
        },
        'lower_bound': {
            header: '<algorithm>',
            syntax: 'lower_bound(first, last, value)',
            desc: '返回指向范围内不小于 value 的第一个元素的迭代器',
            complexity: '时间复杂度: O(log(N))'
        },
        'upper_bound': {
            header: '<algorithm>',
            syntax: 'upper_bound(first, last, value)',
            desc: '返回指向范围内大于 value 的第一个元素的迭代器',
            complexity: '时间复杂度: O(log(N))'
        },
        'binary_search': {
            header: '<algorithm>',
            syntax: 'binary_search(first, last, value)',
            desc: '检查范围内是否存在等于 value 的元素',
            complexity: '时间复杂度: O(log(N))'
        },
        'max_element': {
            header: '<algorithm>',
            syntax: 'max_element(first, last)',
            desc: '返回指向范围内最大元素的迭代器',
            complexity: '时间复杂度: O(N)'
        },
        'min_element': {
            header: '<algorithm>',
            syntax: 'min_element(first, last)',
            desc: '返回指向范围内最小元素的迭代器',
            complexity: '时间复杂度: O(N)'
        },
        'reverse': {
            header: '<algorithm>',
            syntax: 'reverse(first, last)',
            desc: '反转范围内的元素顺序',
            complexity: '时间复杂度: O(N)'
        },
        // 数学函数
        'abs': {
            header: '<cstdlib>',
            syntax: 'abs(x)',
            desc: '返回整数的绝对值',
            complexity: '时间复杂度: O(1)'
        },
        'pow': {
            header: '<cmath>',
            syntax: 'pow(base, exponent)',
            desc: '返回 base 的 exponent 次幂',
            complexity: '时间复杂度: O(log(exponent))'
        },
        'sqrt': {
            header: '<cmath>',
            syntax: 'sqrt(x)',
            desc: '返回 x 的平方根',
            complexity: '时间复杂度: O(1)'
        },
        'ceil': {
            header: '<cmath>',
            syntax: 'ceil(x)',
            desc: '返回不小于 x 的最小整数',
            complexity: '时间复杂度: O(1)'
        },
        'floor': {
            header: '<cmath>',
            syntax: 'floor(x)',
            desc: '返回不大于 x 的最大整数',
            complexity: '时间复杂度: O(1)'
        },
        // 字符串函数
        'substr': {
            header: '<string>',
            syntax: 'str.substr(pos, len)',
            desc: '返回从 pos 开始长度为 len 的子串',
            complexity: '时间复杂度: O(len)'
        },
        'find': {
            header: '<string>',
            syntax: 'str.find(substr)',
            desc: '查找子串第一次出现的位置',
            complexity: '时间复杂度: O(N·M)'
        },
        'length': {
            header: '<string>',
            syntax: 'str.length()',
            desc: '返回字符串的长度',
            complexity: '时间复杂度: O(1)'
        },
        // 容器操作
        'push_back': {
            header: '<vector>/<string>',
            syntax: 'container.push_back(value)',
            desc: '在容器末尾添加元素',
            complexity: '均摊时间复杂度: O(1)'
        },
        'pop_back': {
            header: '<vector>/<string>',
            syntax: 'container.pop_back()',
            desc: '移除容器末尾的元素',
            complexity: '时间复杂度: O(1)'
        },
        'size': {
            header: '容器类',
            syntax: 'container.size()',
            desc: '返回容器中的元素个数',
            complexity: '时间复杂度: O(1)'
        },
        'empty': {
            header: '容器类',
            syntax: 'container.empty()',
            desc: '检查容器是否为空',
            complexity: '时间复杂度: O(1)'
        },
        'clear': {
            header: '容器类',
            syntax: 'container.clear()',
            desc: '清空容器中的所有元素',
            complexity: '时间复杂度: O(N)'
        },
        // 输入输出
        'cin': {
            header: '<iostream>',
            syntax: 'cin >> var',
            desc: '从标准输入读取数据',
            complexity: '取决于数据类型'
        },
        'cout': {
            header: '<iostream>',
            syntax: 'cout << var',
            desc: '向标准输出写入数据',
            complexity: '取决于数据类型'
        },
        'printf': {
            header: '<cstdio>',
            syntax: 'printf(format, ...)',
            desc: '格式化输出到标准输出',
            complexity: '取决于输出长度'
        },
        'scanf': {
            header: '<cstdio>',
            syntax: 'scanf(format, ...)',
            desc: '格式化输入从标准输入',
            complexity: '取决于输入长度'
        },
        // STL 容器操作
        'front': {
            header: '容器类',
            syntax: 'container.front()',
            desc: '返回容器中第一个元素的引用',
            complexity: '时间复杂度: O(1)'
        },
        'back': {
            header: '容器类',
            syntax: 'container.back()',
            desc: '返回容器中最后一个元素的引用',
            complexity: '时间复杂度: O(1)'
        },
        'begin': {
            header: '容器类',
            syntax: 'container.begin()',
            desc: '返回指向容器第一个元素的迭代器',
            complexity: '时间复杂度: O(1)'
        },
        'end': {
            header: '容器类',
            syntax: 'container.end()',
            desc: '返回指向容器尾部的迭代器（越过最后一个元素）',
            complexity: '时间复杂度: O(1)'
        },
        // 优先队列
        'priority_queue': {
            header: '<queue>',
            syntax: 'priority_queue<Type> pq',
            desc: '优先队列（默认大根堆）',
            complexity: '插入/删除: O(log N)'
        },
        // 集合操作
        'insert': {
            header: 'set/map',
            syntax: 'container.insert(value)',
            desc: '插入元素',
            complexity: '时间复杂度: O(log N)'
        },
        'erase': {
            header: 'set/map',
            syntax: 'container.erase(value/iterator)',
            desc: '删除元素',
            complexity: '时间复杂度: O(log N)'
        },
        'count': {
            header: 'set/map',
            syntax: 'container.count(key)',
            desc: '返回等于 key 的元素个数',
            complexity: '时间复杂度: O(log N)'
        },
        // 字符串处理
        'to_string': {
            header: '<string>',
            syntax: 'to_string(value)',
            desc: '将数值转换为字符串',
            complexity: '时间复杂度: O(log value)'
        },
        'stoi': {
            header: '<string>',
            syntax: 'stoi(str)',
            desc: '将字符串转换为整数',
            complexity: '时间复杂度: O(N)'
        },
        'stoll': {
            header: '<string>',
            syntax: 'stoll(str)',
            desc: '将字符串转换为长整数(long long)',
            complexity: '时间复杂度: O(N)'
        },
        // 位运算
        '__builtin_popcount': {
            header: 'GCC内置',
            syntax: '__builtin_popcount(x)',
            desc: '返回整数x的二进制表示中1的个数',
            complexity: '时间复杂度: O(1)'
        },
        '__builtin_ctz': {
            header: 'GCC内置',
            syntax: '__builtin_ctz(x)',
            desc: '返回整数x的二进制末尾0的个数',
            complexity: '时间复杂度: O(1)'
        },
        // 数学函数
        'gcd': {
            header: '<numeric>',
            syntax: 'gcd(a, b)',
            desc: '返回a和b的最大公约数',
            complexity: '时间复杂度: O(log min(a,b))'
        },
        'lcm': {
            header: '<numeric>',
            syntax: 'lcm(a, b)',
            desc: '返回a和b的最小公倍数',
            complexity: '时间复杂度: O(log min(a,b))'
        },
        // 随机数
        'rand': {
            header: '<cstdlib>',
            syntax: 'rand()',
            desc: '返回一个伪随机数',
            complexity: '时间复杂度: O(1)'
        },
        'srand': {
            header: '<cstdlib>',
            syntax: 'srand(seed)',
            desc: '设置随机数生成器的种子',
            complexity: '时间复杂度: O(1)'
        }
    };

    // 存储自定义函数
    let customFunctions = new Map();

    // 监听编辑器内容变化
    const editor = document.querySelector('.cm-content');
    if (editor) {
        let currentHint = null;
        let hintTimeout = null;

        // 解析自定义函数
        const parseCustomFunctions = (text) => {
            const functionRegex = /(\w+)\s*\([^)]*\)\s*{/g;
            let match;
            while ((match = functionRegex.exec(text)) !== null) {
                const funcName = match[1];
                if (!customFunctions.has(funcName)) {
                    // 尝试解析函数的参数和返回类型
                    const beforeFunc = text.substring(0, match.index).trim();
                    const returnType = beforeFunc.split(/\s+/).pop();
                    const params = text.substring(match.index + funcName.length)
                        .match(/\((.*?)\)/)[1];

                    customFunctions.set(funcName, {
                        header: '当前文件',
                        syntax: `${funcName}(${params})`,
                        desc: `返回类型: ${returnType}`,
                        complexity: '用户自定义函数'
                    });
                }
            }
        };

        // 监听输入事件
        editor.addEventListener('input', (e) => {
            if (e.data === '(') {
                // 获取光标位置
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const text = range.startContainer.textContent;
                const offset = range.startOffset;

                // 获取函数名
                let start = offset - 1;
                while (start > 0 && /[\w_]/.test(text[start - 1])) start--;
                const funcName = text.substring(start, offset - 1);

                // 更新自定义函数列表
                parseCustomFunctions(editor.textContent);

                // 显示提示
                const hint = functionHints[funcName] || customFunctions.get(funcName);
                if (hint) {
                    if (currentHint) {
                        currentHint.remove();
                    }
                    currentHint = createHint(hint);
                    document.body.appendChild(currentHint);

                    // 计算提示框位置
                    const rect = range.getBoundingClientRect();
                    currentHint.style.top = `${rect.bottom + 5}px`;
                    currentHint.style.left = `${rect.left}px`;

                    // 3秒后自动消失
                    clearTimeout(hintTimeout);
                    hintTimeout = setTimeout(() => {
                        currentHint.remove();
                        currentHint = null;
                    }, 3000);
                }
            }
        });

        // 监听右括号和回车，立即关闭提示
        editor.addEventListener('keydown', (e) => {
            if (e.key === ')' || e.key === 'Enter') {
                if (currentHint) {
                    clearTimeout(hintTimeout);
                    currentHint.remove();
                    currentHint = null;
                }
            }
        });

        // 点击其他地方关闭提示
        document.addEventListener('click', (e) => {
            if (currentHint && !currentHint.contains(e.target)) {
                currentHint.remove();
                currentHint = null;
            }
        });
    }

    // 创建提示框
    const createHint = (info) => {
        const hint = document.createElement('div');
        hint.style.position = 'fixed';
        hint.style.backgroundColor = '#1a1b26';
        hint.style.border = '1px solid #414868';
        hint.style.borderRadius = '6px';
        hint.style.padding = '12px';
        hint.style.zIndex = '1000';
        hint.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        hint.style.maxWidth = '300px';
        hint.style.fontSize = '12px';
        hint.style.color = '#c0caf5';

        const header = document.createElement('div');
        header.textContent = `头文件: ${info.header}`;
        header.style.color = '#7aa2f7';
        header.style.marginBottom = '8px';

        const syntax = document.createElement('div');
        syntax.textContent = `语法: ${info.syntax}`;
        syntax.style.fontFamily = 'monospace';
        syntax.style.marginBottom = '8px';

        const desc = document.createElement('div');
        desc.textContent = info.desc;
        desc.style.marginBottom = '8px';

        const complexity = document.createElement('div');
        complexity.textContent = info.complexity;
        complexity.style.color = '#bb9af7';

        hint.appendChild(header);
        hint.appendChild(syntax);
        hint.appendChild(desc);
        hint.appendChild(complexity);

        return hint;
    };

    // 等待页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateStyles);
    } else {
        updateStyles();
    }

    // 监听URL变化时重置初始化标志
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            console.log('URL changed from', lastUrl, 'to', location.href);
            lastUrl = location.href;
            console.log('Resetting buttonsInitialized');
            buttonsInitialized = false;
            updateStyles();
        }
    }).observe(document, {subtree: true, childList: true});

})();
