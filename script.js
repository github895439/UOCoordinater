const HEAD_EQUIP_TR_NOT_PART = [
    { name: "プロパ名", id: "prpty" },
    { name: "目標値", id: "goal" },
    { name: "差分値", id: "diff" },
];
const HEAD_EQUIP_TR_PART = [
    { name: "腕輪", id: "bracelet" },
    { name: "指輪", id: "ring" },
    { name: "耳", id: "ear" },
    { name: "頭", id: "head" },
    { name: "首", id: "neck" },
    { name: "手", id: "hand" },
    { name: "腕", id: "arm" },
    { name: "上半身L1", id: "upperL1" },
    { name: "上半身L2", id: "upperL2" },
    { name: "上半身L3", id: "upperL3" },
    { name: "上半身L4", id: "upperL4" },
    { name: "上半身L5", id: "upperL5" },
    { name: "下半身L1", id: "lowerL1" },
    { name: "下半身L2", id: "lowerL2" },
    { name: "下半身L3", id: "lowerL3" },
    { name: "手持ち左", id: "haveL" },
    { name: "手持ち右", id: "haveR" },
    { name: "タリスマン", id: "talisman" },
    { name: "靴", id: "shoes" },
];
const NOT_EQUIP = [
    "name",
    "部位",
    "除外",
    "略",
    "date",
    "url",
];
const NOT_CALC = [
    "耐久性",
    "装備STR",
    "備考",
];
const PRE_COLS = [
    "選択",
];
const SORT_DEFAULT = "btn_up_1";
const INDEX_PRPTY_NOT_NUMBER = [
    "name",
    "短命",
    "破滅",
    "BATTLE LUST",
    "補強不可",
    "詠唱集中",
    "瞑想可",
    "NIGHT SIGHT",
    "PRIZED",
    "SEARING",
    "詠唱可",
    "破片残留",
    "TOXIC WEAPON",
    "WARD REMOVAL",
    "片手",
    "両手",
    "基礎スキル",
    "4G",
    "url",
];
const HANDLERS = [
    btnHandlerHelp,
    btnHandlerImportItem,
    btnHandlerDebug,
    btnHandlerImportEquip,
    btnHandlerExportEquip,
    btnHandlerImportGoal,
    btnHandlerExportGoal,
];

var importCsvItem;
var nameItems;
var namePrprtys;
var isImport = false;
var colOther;
var colPart;
var colDisable;
var divs = {};
var tas = {};
var importCsvNameEquips;
var csvCurNameEquips;
var statusSort = SORT_DEFAULT;
var selectNamePart;
var csvParts;
var importCsvGoal;
var curCsvGoal;

window.addEventListener("load", function () {
    main();
    // this.document.querySelector("#td_select_head").addEventListener("click", function () { alert("A") });
    // this.document.querySelector("#td_name_head").addEventListener("click", function () { alert("B") });
    return;
});

function btnHandlerDebug(params) {
    // importCsvNameCrdnts = {
    //     head: "Hat of the Magi",
    //     arm: "Midnight Bracers",
    //     shoes: "Boots of Escaping",
    // };
    // csvCurNameCrdnts = JSON.parse(JSON.stringify(importCsvNameCrdnts));
    // init();
    return;
}

function main() {
    for (const element of document.querySelectorAll("div")) {
        divs[element.id] = element;
    }

    for (const element of document.querySelectorAll("textarea")) {
        tas[element.id] = element;
    }

    for (const handler of HANDLERS) {
        let id = handler.name;
        id = id.replace("Handler", "");
        let ctrl = document.querySelector(`#${id}`);

        if (ctrl != null) {
            ctrl.addEventListener("click", handler);
        }
    }

    tas.taOther.addEventListener("blur", function () { tas.taOther.value = ""; });
    init();

    if (document.querySelector("#cbAutoImportItem").checked) {
        btnHandlerImportItem();
    }

    if (document.querySelector("#cbAutoImportEquip").checked) {
        btnHandlerImportEquip();
    }

    if (document.querySelector("#cbAutoImportGoal").checked) {
        btnHandlerImportGoal();
    }

    return;
}

function init() {
    for (const element of divs.divEquip.querySelectorAll("table")) {
        element.remove();
    }

    for (const element of divs.divEquip.querySelectorAll("input")) {
        element.remove();
    }

    makeTblListPart(csvCurNameEquips);
    let eleTblEquip = document.createElement("table");

    //インポートした、かつ、装備指定があるか
    if (isImport && (csvCurNameEquips != undefined)) {
        let eleInputButton = document.createElement("input");
        eleInputButton.setAttribute("type", "button");
        eleInputButton.setAttribute("value", "目標値適用");
        eleInputButton.addEventListener("click", btnHandlerApplyGoal);
        divs.divEquip.appendChild(eleInputButton);
        let eleTrHead = document.createElement("tr");
        let head = HEAD_EQUIP_TR_NOT_PART;
        head = head.concat([""]);
        head = head.concat(HEAD_EQUIP_TR_PART);

        //装備詳細のヘッダを作るループ
        for (let index = 0; index < head.length; index++) {
            const element = head[index];
            let eleTh = document.createElement("th");
            eleTh.setAttribute("class", "vertical");
            let name = element.name;

            if (name != undefined) {
                eleTh.innerText = name;
            }

            eleTrHead.appendChild(eleTh);
        }

        eleTblEquip.appendChild(eleTrHead);
        let equips = [];
        let maxCol = 0;

        //部位のアイテム抽出ループ
        for (const element of HEAD_EQUIP_TR_PART) {
            let find = csvCurNameEquips.find(
                (value) => {
                    return value[0] == element.id;
                }
            );

            //部位指定がないか
            if (find == undefined) {
                equips.push([]);
            } else {
                let indexItem = nameItems.indexOf(find[1]);
                equips.push(importCsvItem[indexItem]);
                let length = importCsvItem[indexItem].length;

                if (maxCol < length) {
                    maxCol = length;
                }
            }
        }

        let tmp = JSON.parse(JSON.stringify(equips));
        equips = new Array(maxCol);

        //縦横変換ループ
        for (let indexY = 0; indexY < equips.length; indexY++) {
            equips[indexY] = new Array(HEAD_EQUIP_TR_PART.length);

            for (let indexX = 0; indexX < HEAD_EQUIP_TR_PART.length; indexX++) {
                let value = tmp[indexX][indexY];

                if (value == undefined) {
                    continue;
                }

                equips[indexY][indexX] = value;
            }
        }

        //構成詳細表作成ループ
        for (let indexY = 2; indexY < equips.length; indexY++) {
            if (indexY > colOther) {
                continue;
            }

            let namePrpty = namePrprtys[indexY];

            if (NOT_EQUIP.includes(namePrpty)) {
                continue;
            }

            const element = equips[indexY];
            let eleTrData = document.createElement("tr");
            let innerTextTotal = "";
            let numberTotal = 0;

            if (NOT_CALC.includes(namePrpty)) {
                numberTotal = "*";
            }

            let eleTdDataDiff = document.createElement("td");
            eleTdDataDiff.setAttribute("class", "border");
            let numberGoal;
            let value;

            if (curCsvGoal != undefined) {
                let find = curCsvGoal.find(
                    (value) => {
                        return value[0] == namePrpty;
                    }
                );

                if (find != undefined) {
                    numberGoal = find[1];
                    value = numberGoal;
                }
            }

            if (numberGoal == undefined) {
                numberGoal = 0;
            }

            let eleTdNamePrpty = document.createElement("td");
            eleTdNamePrpty.setAttribute("class", "border");
            eleTdNamePrpty.setAttribute("id", `td_name_prpty_${indexY}`);
            eleTdNamePrpty.innerText = namePrpty;
            eleTrData.appendChild(eleTdNamePrpty);
            let eleTdGoal = document.createElement("td");
            eleTdGoal.setAttribute("class", "border");
            let eleInput = document.createElement("input");
            eleInput.setAttribute("type", "text");
            eleInput.setAttribute("size", "2");
            eleInput.setAttribute("id", `td_goal_${indexY}`);

            if (value != undefined) {
                eleInput.setAttribute("value", value);
            }

            eleTdGoal.appendChild(eleInput);
            eleTrData.appendChild(eleTdGoal);
            eleTrData.appendChild(eleTdDataDiff);
            let eleTdSlit = document.createElement("td");
            eleTdSlit.setAttribute("class", "border");
            eleTrData.appendChild(eleTdSlit);

            for (let indexX = 0; indexX < element.length; indexX++) {
                const element2 = element[indexX];
                let eleTdData = document.createElement("td");
                eleTdData.setAttribute("class", "border");

                //部位指定があるか
                if ((equips[indexY] != undefined) && (equips[indexY][indexX] != undefined)) {
                    eleTdData.innerText = equips[indexY][indexX];
                    innerTextTotal += eleTdData.innerText;

                    //備考か
                    if (namePrpty == "備考") {
                        if (eleTdData.innerText.length > 0) {
                            eleTdData.innerText = "※";
                            eleTdData.setAttribute("id", `td_prpty_other_${HEAD_EQUIP_TR_PART[indexX].id}`);
                            eleTdData.addEventListener("click", cellHandlerShowOther);
                        }
                    }
                }

                eleTrData.appendChild(eleTdData);

                //計算不要か
                if (numberTotal != "*") {
                    //値があるか
                    if (equips[indexY][indexX] != undefined) {
                        //計算不要か
                        if (equips[indexY][indexX] == "*") {
                            numberTotal = "*";
                        } else {
                            numberTotal += Number(equips[indexY][indexX]);
                        }
                    }
                }
            }

            //計算値があるか
            if (numberTotal != "*") {
                eleTdDataDiff.innerText = numberTotal - numberGoal;

                if (Number(eleTdDataDiff.innerText) < 0) {
                    let attrs = eleTdDataDiff.getAttribute("class").split(" ");
                    attrs.push("bgRed");
                    eleTdDataDiff.setAttribute("class", attrs.join(" "));
                }
            }

            //プロパティに値がある、または、目標値があるか
            if ((innerTextTotal.length > 0) || (value != undefined)) {
                eleTblEquip.appendChild(eleTrData);
            }
        }
    }





    divs.divEquip.appendChild(eleTblEquip);
    //###
    return;
}

function cellHandlerShowOther(cell) {
    let namePart = cell.target.id.split("_").pop();
    let find = csvCurNameEquips.find(
        (value) => {
            return value[0] == namePart;
        }
    );
    let indexItem = nameItems.indexOf(find[1]);
    let other = "";

    //備考集約ループ
    for (let index = colOther; index < importCsvItem[indexItem].length; index++) {
        let value = importCsvItem[indexItem][index];

        //中身があるか
        if (value != "") {
            other += (value + "\n");
        }
    }

    tas.taOther.value = other;
    tas.taOther.focus();
    return;
}

function makeTblListPart(csvNameEquips) {
    for (const element of divs.divListPart.querySelectorAll("table")) {
        element.remove();
    }

    let eleTblListPart = document.createElement("table");

    //部位一覧表作成ループ
    for (const element of HEAD_EQUIP_TR_PART) {
        let eleTr = document.createElement("tr");
        let eleTh = document.createElement("th");
        let eleInputButton = document.createElement("input");
        eleInputButton.setAttribute("type", "button");
        eleInputButton.setAttribute("id", `btn_part_${element.id}`);
        eleInputButton.setAttribute("value", element.name);
        eleInputButton.addEventListener("click", btnHandlerSelectItem);
        eleTh.appendChild(eleInputButton);
        eleTr.appendChild(eleTh);
        let eleTd = document.createElement("td");
        eleTd.setAttribute("class", "border");
        let name;

        if (csvNameEquips != undefined) {
            name = csvNameEquips.find(
                (value) => {
                    return value[0] == element.id;
                }
            );

            if (name != undefined) {
                name = name[1];
            }
        }

        //部位名があるか
        if (name != undefined) {
            eleTd.innerText = getNameAbb(name);
        }

        eleTr.appendChild(eleTd);
        eleTblListPart.appendChild(eleTr);
    }

    divs.divListPart.appendChild(eleTblListPart);
    return;
}

function getNameAbb(nameItem) {
    let rtn = nameItem;
    let indexItem = nameItems.indexOf(nameItem);
    let indexPrprty = namePrprtys.indexOf("略");
    let nameAbb = importCsvItem[indexItem][indexPrprty];

    //略語があるか
    if (nameAbb != "") {
        rtn = nameAbb;
    }

    return rtn;
}

function btnHandlerSelectItem(btn) {
    if (!isImport) {
        return;
    }

    let eleInputButton = document.createElement("input");
    eleInputButton.setAttribute("type", "button");
    eleInputButton.setAttribute("value", "中止");
    eleInputButton.addEventListener("click", btnHandlerCanselSelect);
    divs.divPartSelector.appendChild(eleInputButton);
    let eleBr = document.createElement("br");
    divs.divPartSelector.appendChild(eleBr);
    selectNamePart = btn.target.id.split("_").pop();
    let find = HEAD_EQUIP_TR_PART.find(
        (value) => {
            return value.id == selectNamePart;
        }
    );
    let namePart = find.name;
    csvParts = importCsvItem.filter(
        (value) => {
            return (value[colDisable] == "") && ((value[colPart] == namePart) || (value[colPart] == ""));
        }
    );
    csvParts.sort();
    let eleLabel = document.createElement("label");
    eleLabel.innerText = `${csvParts.length}件`;
    divs.divPartSelector.appendChild(eleLabel);
    makeTblSelectItem();
    return;
}

function btnHandlerCanselSelect(btn) {
    for (const element of divs.divPartSelector.querySelectorAll("table")) {
        element.remove();
    }

    for (const element of divs.divPartSelector.querySelectorAll("input")) {
        element.remove();
    }

    for (const element of divs.divPartSelector.querySelectorAll("br")) {
        element.remove();
    }

    for (const element of divs.divPartSelector.querySelectorAll("label")) {
        element.remove();
    }

    return;
}

function makeTblSelectItem() {
    let eleTblSelectItem = divs.divPartSelector.querySelector("table");

    //テーブル作成済みか
    if (eleTblSelectItem != null) {
        eleTblSelectItem.remove();
    }

    let eleTbl = document.createElement("table");
    let eleTr = document.createElement("tr");
    let head = PRE_COLS.concat(importCsvItem[0]);
    let outHead = [];

    //除外プロパティ抽出ループ
    for (let indexX = PRE_COLS.length; indexX < head.length; indexX++) {
        switch (head[indexX]) {
            case "部位": {
                outHead.push(indexX);
                continue;
            }
            case "除外": {
                outHead.push(indexX);
                continue;
            }
            case "略": {
                outHead.push(indexX);
                continue;
            }
            default:
                break;
        }

        let isOut = true;

        for (let indexY = 0; (indexY < csvParts.length) && isOut; indexY++) {
            const element = csvParts[indexY][indexX - PRE_COLS.length];

            if (element == undefined) {
                break;
            }

            if (element.length > 0) {
                isOut = false;
                continue;
            }
        }

        if (isOut) {
            outHead.push(indexX);
        }
    }

    //ヘッダ作成ループ
    for (let index = 0; index < head.length; index++) {
        if (outHead.includes(index)) {
            continue;
        }

        const element = head[index];
        let eleTh = document.createElement("th");
        eleTh.setAttribute("id", `th_item_${index}`);
        eleTh.setAttribute("class", "vertical");
        eleTh.innerText = element;

        if (index >= 1) {
            let eleInputUp = document.createElement("input");
            eleInputUp.setAttribute("type", "button");
            eleInputUp.setAttribute("id", `btn_up_${index}`);
            eleInputUp.addEventListener("click", btnHandlerSort);
            eleInputUp.value = "昇";
            let eleInputDown = document.createElement("input");
            eleInputDown.setAttribute("type", "button");
            eleInputDown.setAttribute("id", `btn_down_${index}`);
            eleInputDown.addEventListener("click", btnHandlerSort);
            eleInputDown.value = "降";
            eleTh.appendChild(eleInputUp);
            eleTh.appendChild(eleInputDown);
        }

        eleTr.appendChild(eleTh);
    }

    let eleInputButton = eleTr.querySelector(`#${statusSort}`);
    eleInputButton.disabled = true;
    eleInputButton.parentNode.setAttribute("class", "vertical bgLime");
    eleTbl.appendChild(eleTr);

    //インポートしたか
    if (isImport) {
        //アイテム選択表作成ループ
        for (let indexY = 0; indexY < csvParts.length; indexY++) {
            const element = csvParts[indexY];
            eleTr = document.createElement("tr");

            for (let indexX = 0; indexX < element.length; indexX++) {
                if (outHead.includes(indexX + PRE_COLS.length)) {
                    continue;
                }

                const tmpElement = element[indexX];
                let eleTd;

                if (indexX == 0) {
                    let eleTdSelect = document.createElement("td");
                    eleTdSelect.setAttribute("class", "border");
                    let eleInputButton = document.createElement("input");
                    eleInputButton.setAttribute("type", "button");
                    eleInputButton.setAttribute("id", `btn_item_${indexY}`);
                    eleInputButton.setAttribute("value", "適用");
                    eleInputButton.addEventListener("click", btnHandlerApplyItem);
                    eleTdSelect.appendChild(eleInputButton);
                    eleTr.appendChild(eleTdSelect);
                    // let eleTdPrty = document.createElement("td");
                    // eleTdPrty.setAttribute("class", "border");
                    // let eleInputCheck = document.createElement("input");
                    // eleInputCheck.setAttribute("type", "checkbox");
                    // eleTdPrty.appendChild(eleInputCheck);
                    // eleTr.appendChild(eleTdPrty);
                }

                eleTd = document.createElement("td");
                eleTd.setAttribute("class", "border");
                eleTd.setAttribute("id", `td_item_${indexY}_${indexX + 1}`);

                if (indexX >= PRE_COLS.length) {
                    // eleTd.addEventListener("click", cellHandlerShowPst);
                }

                eleTd.innerText = tmpElement;
                eleTr.appendChild(eleTd);
            }

            eleTbl.appendChild(eleTr);
        }

        let colNumber = statusSort.split("_")[2];
        let colSorts = eleTbl.querySelectorAll("td");

        //ソートハイライトループ
        for (const element of colSorts) {
            let ids = element.id.split("_");

            if (element.id.split("_")[3] != colNumber) {
                continue;
            }

            let attrs = element.getAttribute("class").split(" ");
            attrs.push("bgLime");
            element.setAttribute("class", attrs.join(" "));
        }
    }

    divs.divPartSelector.appendChild(eleTbl);
    return;
}

function btnHandlerApplyItem(btn) {
    let indexY = btn.target.id.split("_").pop();
    let find;

    if (csvCurNameEquips != undefined) {
        find = csvCurNameEquips.find(
            (value) => {
                return value[0] == selectNamePart;
            }
        );
    } else {
        csvCurNameEquips = [["部位", "名前"]];
    }

    if (find == undefined) {
        csvCurNameEquips.push([selectNamePart, csvParts[indexY][0]]);
    } else {
        find[1] = csvParts[indexY][0];
    }

    init();
    btnHandlerCanselSelect();
    return;
}

function btnHandlerSort(btn) {
    document.querySelector(`#${statusSort}`).disabled = false;
    btn.target.disabled = true;
    statusSort = btn.target.id;
    let tmpSplit = btn.target.id.split("_");
    let indexX = tmpSplit.pop() - PRE_COLS.length;
    let dir = tmpSplit.pop();

    //数値ソートではないか
    if (INDEX_PRPTY_NOT_NUMBER.includes(importCsvItem[0][indexX])) {
        csvParts.sort(
            (a, b) => {
                let rtn;

                if (dir == "up") {
                    rtn = b[indexX] > a[indexX] ? -1 : 1;
                } else {
                    rtn = a[indexX] > b[indexX] ? -1 : 1;
                }

                return rtn;
            }
        );
    } else {
        csvParts.sort(
            (a, b) => {
                let rtn;

                if (dir == "up") {
                    rtn = a[indexX] - b[indexX];
                } else {
                    rtn = b[indexX] - a[indexX];
                }

                return rtn;
            }
        );
    }

    makeTblSelectItem();
    return;
}

function cellHandlerShowPst(cell) {
    let pst = cell.target.id.split("_");
    let pstX = pst.pop();
    let pstY = pst.pop();
    let trs = divs.divPartSelector.querySelectorAll("tr");
    let tds = trs[pstY].querySelectorAll("td");
    let ths = divs.divPartSelector.querySelectorAll("th");
    alert([tds[PRE_COLS.length].innerText, importCsvItem[0][pstX]].join("\n"));
    return;
}

function btnHandlerImportItem(params) {
    importCsvItem = tas.taDataItem.value;

    //アイテムデータが無いか
    if (importCsvItem.length == 0) {
        alert("アイテムデータがありません。");
        return;
    }

    importCsvItem = importCsvItem.replace(/"/g, "");
    importCsvItem = importCsvItem.split("\n");
    let maxCol = 0;

    //配列化ループ
    for (let indexY = 0; indexY < importCsvItem.length; indexY++) {
        importCsvItem[indexY] = importCsvItem[indexY].split(",");

        //列長更新か
        if (importCsvItem[indexY].length > maxCol) {
            maxCol = importCsvItem[indexY].length;
        }
    }

    nameItems = importCsvItem.map(
        (value) => {
            return value[0];
        }
    );
    namePrprtys = importCsvItem[0];
    colOther = namePrprtys.indexOf("備考");
    colPart = namePrprtys.indexOf("部位");
    colDisable = namePrprtys.indexOf("除外");
    isImport = true;
    document.querySelector("#lImportItemStatus").innerText = "インポート済み";
    return;
}

function btnHandlerImportEquip(params) {
    if (!isImport) {
        alert("アイテムをインポートしていません。");
        return;
    }

    if (importCsvNameEquips != undefined) {
        if (!confirm("再インポートしますか？")) {
            return;
        }
    }

    let tmp = tas.taDataEquip.value.replace(/"/g, "");
    importCsvNameEquips = [];

    for (const element of tmp.split("\n")) {
        importCsvNameEquips.push(element.split(","));
    }

    csvCurNameEquips = JSON.parse(JSON.stringify(importCsvNameEquips));
    init();
    document.querySelector("#lImportEquipStatus").innerText = "インポート済み";
    return;
}

function btnHandlerExportEquip(params) {
    if (csvCurNameEquips == undefined) {
        alert("エクスポートするデータがありません。");
        return;
    }

    if (tas.taDataEquip.value != "") {
        if (!confirm("再エクスポートしますか？")) {
            return;
        }
    }

    tas.taDataEquip.value = "";

    for (const element of csvCurNameEquips) {
        tas.taDataEquip.value += `${element.join(",")}\n`;
    }

    return;
}

function btnHandlerImportGoal(params) {
    if (!isImport) {
        alert("アイテムをインポートしていません。");
        return;
    }

    if (importCsvGoal != undefined) {
        if (!confirm("再インポートしますか？")) {
            return;
        }
    }

    let tmp = tas.taDataGoal.value.replace(/"/g, "");
    importCsvGoal = [];

    for (const element of tmp.split("\n")) {
        importCsvGoal.push(element.split(","));
    }

    curCsvGoal = JSON.parse(JSON.stringify(importCsvGoal));
    init();
    document.querySelector("#lImportGoalStatus").innerText = "インポート済み";
    return;
}

function btnHandlerExportGoal(params) {
    if (curCsvGoal == undefined) {
        alert("エクスポートするデータがありません。");
        return;
    }

    if (tas.taDataGoal.value != "") {
        if (!confirm("再エクスポートしますか？")) {
            return;
        }
    }

    tas.taDataGoal.value = "";

    for (const element of curCsvGoal) {
        tas.taDataGoal.value += `${element.join(",")}\n`;
    }

    return;
}

function btnHandlerApplyGoal(params) {
    let goals = divs.divEquip.querySelectorAll("input[id^=td_goal_]");
    curCsvGoal = [["プロパ名", "目標値"]];

    for (const element of goals) {
        if (element.value == "") {
            continue;
        }

        let number = element.id.split("_").pop();
        let namePrpty = divs.divEquip.querySelector(`#td_name_prpty_${number}`).innerText;
        curCsvGoal.push([namePrpty, element.value]);
    }

    init();
    return;
}

function btnHandlerHelp(params) {
    alert("\
１．　アイテムの「インポート」ボタン押下\n\
　アイテムのテキストエリアのcsvが読み込まれる。\n\
２．　各部位ボタン押下\n\
　下に選択表が表示される。\n\
３．　選択表のアイテムの「適用」ボタン押下\n\
　アイテムが装備詳細に適用される。\n\
        ");

}
