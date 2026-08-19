/* ━━━━━━━━━━━━━━━━━━━━━━
   変換ルール定義ファイル (rules.js)
   新しいボタンを増やしたい時は、ここに項目を追記するだけでOKです！
━━━━━━━━━━━━━━━━━━━━━━ */

const customTransformers = [
  {
    name: "句点改行",
    run: text => text.replace(/。(?!(\n|$))/g, "。\n")
  },
  {
    name: "句読点改行",
    run: text => text
      .replace(/。(?!(\n|$))/g, "。\n")
      .replace(/、(?!(\n|$))/g, "、\n")
  },
  {
    name: "会話文改行",
    run: text => text
      .replace(/([^\n])([「『])/g, "$1\n$2")
      .replace(/([」』])([^\n])/g, "$1\n$2")
  },
  {
    name: "空行整理",
    run: text => text
      .replace(/\r\n?/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
  },
  {
    name: "空行削除",
    run: text => text
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .filter(line => line.trim() !== "")
      .join("\n")
  },
  {
    name: "全角空白削除",
    run: text => text.replace(/　/g, "")
  },
  {
    name: "行末空白削除",
    run: text => text
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map(line => line.replace(/[ \t　]+$/g, ""))
      .join("\n")
  },
  {
    name: "HTMLタグ削除",
    run: text => text
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p\s*>/gi, "\n")
      .replace(/<[^>]*>/g, "")
  },
  {
    name: "pタグ化",
    run: text => text
      .replace(/\r\n?/g, "\n")
      .split(/\n+/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => `<p>${line}</p>`)
      .join("\n")
  },
  {
    name: "**太字** → strong",
    run: text => text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  },
  {
    name: "「」⇔『』",
    run: text => text
      .replace(/「/g, "%%%OPEN_A%%%")
      .replace(/」/g, "%%%CLOSE_A%%%")
      .replace(/『/g, "「")
      .replace(/』/g, "」")
      .replace(/%%%OPEN_A%%%/g, "『")
      .replace(/%%%CLOSE_A%%%/g, "』")
  },
  {
    name: "改行統一",
    run: text => text.replace(/\r\n?/g, "\n")
  },
  {
    name: "三点リーダ統一",
    run: text => text
      .replace(/・・・/g, "……")
      .replace(/\.{3}/g, "……")
  },
  {
    name: "連続スペース整理",
    run: text => text.replace(/[ ]{2,}/g, " ")
  }
];
