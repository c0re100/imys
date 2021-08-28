# 愛麗絲秘跡！〜少女們編織夢的秘境〜

## TLDR

一個為了解決台服愛麗絲網頁停駐問題而誕生的(偽)瀏覽器

![](https://raw.githubusercontent.com/c0re100/imys/master/preview.jpg)

## 為什麼需要用這個？

相信大家都知道愛麗絲配置得好的隊伍，大部分關卡都可以用自動模式完成

這段期間，我們會無事可做的吧？

然後，大家都會選擇轉TAB繼續上網或者最小化將遊戲放在背景掛著就完事。

但這個動作會令到遊戲進入一個緩慢更新狀態，你會感覺到遊戲停駐了。

我們只能眼睜睜在這個網頁上掛著，等它結束😢

因為瀏覽器的限制，當切換TAB或者將瀏覽器最小化時，瀏覽器就會將該網頁的 [requestAnimationFrame](https://developer.mozilla.org/zh-TW/docs/Web/API/window/requestAnimationFrame) 暫停，每隔一段時間才會更新一次。

經多番嘗試後，發現Chrome解除限制的方法太麻煩 ，最後只有Electron能直接解除這個限制令遊戲繼續運行，所以這幾行程式碼就此誕生。

~~注意: 這是R18版本，雖然主線也沒幾個18+劇情，除非你自己跑去開回想來看~~

## 使用方法

1. 到 [Release](https://github.com/c0re100/imys/releases) 下載最新版本並解壓
2. 打開imys.exe
3. 然後，不用教了吧.........

## 額外功能

1. 右鍵截圖/儲存圖片

## 開發相關

`yarn install`

`yarn start`

---

## 嗚謝

1. [@kitce](https://github.com/kitce), [@pokeGuys](https://github.com/pokeguys), [@nodegin](https://github.com/nodegin)
2. [Force preserveDrawingBuffer to true](https://github.com/greggman/webgl-helpers/blob/master/webgl-force-preservedrawingbuffer.js)
3. [Context menu enabler](https://greasyfork.org/scripts/23772-absolute-enable-right-click-copy/code/Absolute%20Enable%20Right%20Click%20%20Copy.user.js)

AUGUST，你們快點回來做Galgame啦🥺
