/* ━━━━━━━━━━━━━━━━━━━━━━
   和風 執筆ノ間：ノード操作マネージャー (node_manager.js)
━━━━━━━━━━━━━━━━━━━━━━ */

let uidCounter = 0;

function generateId() {
    return 'n' + (++uidCounter);
}

function escapeHtml(s) {
    if (!s) return "";
    return s.replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[c]));
}

function preventDrag(e) {
    e.preventDefault();
}

function resize(ta) {
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
}

function addNode(text = "", parentUl = null, color = "", memo = "") {
    const ul = parentUl || document.getElementById('rootList');
    const li = document.createElement('li');
    li.className = 'node';
    li.id = generateId();
    li.innerHTML = `
        <div class="node-box" data-color="${color}">
            <div class="node-content" onclick="handleNodeClick(this)">
                <div class="check-circle"></div>
                <div style="padding:4px;color:#ccc;cursor:grab;" ontouchstart="preventDrag(event)">
                    <svg class="icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                </div>
                <textarea class="row-text" rows="1" oninput="resize(this);updateCount()" onblur="pushHistory()">${escapeHtml(text)}</textarea>
                <div style="padding:4px;color:#ccc;" onclick="toggleMemo(this)">
                    <svg class="icon" style="width:16px;" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </div>
            </div>
            <div class="node-memo ${memo ? 'show' : ''}"><textarea class="memo-input" placeholder="メモ..." oninput="pushHistory()">${escapeHtml(memo)}</textarea></div>
        </div><ul></ul>`;
    ul.appendChild(li);
    resize(li.querySelector('.row-text'));
    return li;
}

function buildTree(ul, data) {
    if (!data) return;
    data.forEach(d => {
        const li = addNode(d.text, ul, d.color, d.memo);
        if (d.children) buildTree(li.querySelector('ul'), d.children);
    });
}

function serializeTree(ul) {
    return Array.from(ul.children).map(li => ({
        text: li.querySelector('.row-text').value,
        color: li.querySelector('.node-box').getAttribute('data-color') || "",
        memo: li.querySelector('.memo-input').value,
        children: serializeTree(li.querySelector('ul'))
    }));
}

function getSel() {
    return Array.from(document.querySelectorAll('.node-box.selected')).map(b => b.closest('li'));
}

function getFocusedLi() {
    const ae = document.activeElement;
    return (ae && ae.classList.contains('row-text')) ? ae.closest('li') : null;
}

function moveIndent(d) {
    const t = getSel().length ? getSel() : [getFocusedLi()];
    t.forEach(li => {
        if (!li) return;
        if (d === 1) {
            const p = li.previousElementSibling;
            if (p) {
                p.querySelector('ul').appendChild(li);
                p.querySelector('ul').style.display = 'block';
            }
        } else {
            const p = li.parentElement.closest('li');
            if (p) p.after(li);
        }
    });
    if (typeof pushHistory === 'function') pushHistory();
}

function moveItem(d) {
    const t = getSel();
    if (!t.length) return;
    (d === 1 ? t.reverse() : t).forEach(li => {
        if (d === -1 && li.previousElementSibling) {
            li.parentElement.insertBefore(li, li.previousElementSibling);
        }
        if (d === 1 && li.nextElementSibling) {
            li.parentElement.insertBefore(li, li.nextElementSibling.nextElementSibling);
        }
    });
    if (typeof pushHistory === 'function') pushHistory();
}

function mergeNodes() {
    const t = getSel();
    if (t.length < 2) {
        alert("2つ以上選択してください");
        return;
    }
    const f = t[0];
    let txt = f.querySelector('.row-text').value;
    for (let i = 1; i < t.length; i++) {
        txt += "\n" + t[i].querySelector('.row-text').value;
        Array.from(t[i].querySelector('ul').children).forEach(k => f.querySelector('ul').appendChild(k));
        t[i].remove();
    }
    f.querySelector('.row-text').value = txt;
    resize(f.querySelector('.row-text'));
    toggleSelectMode();
    if (typeof pushHistory === 'function') pushHistory();
}

function setNodeColorMenu() {
    const t = getSel();
    if (!t.length) return;
    const c = prompt("色(red,blue,green,yellow,purple,空白):", "red");
    t.forEach(li => li.querySelector('.node-box').setAttribute('data-color', c));
    toggleSelectMode();
    if (typeof pushHistory === 'function') pushHistory();
}

function toggleMemo(b) {
    b.closest('.node-box').querySelector('.node-memo').classList.toggle('show');
}
