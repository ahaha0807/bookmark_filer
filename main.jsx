/*
 *  content['title']  タイトルを保持する
 *  content['link']   リンクを保持する
 *  content['id']     idを保持する
 *  content['time']   登録日時を保持する
 *  cnt               id用のカウンタ
 *  contentsList[]    コンテンツオブジェクト保持用配列
 *
 */

//  変数・配列宣言
var contentsList = [];
var cnt = 0;

// === Reactコンポーネント定義 ===
const ContentsList = props => {     //コンテンツリストコンポーネント定義
  return(
    <ul className="contents">
      {props.contentsList.map((content, index)=> <Content content={content} index={index} />)}
    </ul>
  )
}

const Content = props => {      //コンテンツコンポーネント定義
  var content = props.content;
  return (
    <li id={"content_" + (props.index)} className="content">
      <ContentLink link={content.link} index={props.index} />
      <br />
      <ContentTitle title={content.title} index={props.index} />
      <ContentTime time={content.time} index={props.index} />
      <ContentNumber index={props.index} />
    </li>
  )
}

const ContentTitle = props => {   //タイトルコンポーネント定義
  return (
    <h1 id={"title_" + props.index}>
      {props.title}
    </h1>
  )
}

const ContentLink = props => {    //リンクコンポーネント定義
  return (
    <h2 id={"link_" + props.index} className="link">
      <a href={props.link}>{props.link}</a>
    </h2>
  )
}

const ContentTime = props => {   //登録時刻コンポーネント定義
  return (
    <span id={"time_" + props.index} className="time">
      {props.time}
    </span>
  )
}

const ContentNumber = props => {  //シリアルナンバーコンポーネント定義
  return (
    <span id={"number_" + props.index} className="number">
      {" " + props.index}
    </span>
  )
}

const MenuContentsList = props => {   //メニューリストコンポーネント定義
  return (
    <ul>
      {props.menuList.map(menuItem => <MenuContent item={menuItem}/>)}
    </ul>
  )
}

const MenuContent = props => {    //メニューボタンコンポーネント定義
  return (
    <li className="menu_item">
      <button id={props.item.id} className="menu_item" onClick={props.item.clickHandler}>{props.item.id}</button>
    </li>
  )
}

const ModalWindow = props => {
  return (
    <div id="modal_content">
      {modal_textbox(props.mode)}
      <button onClick={props.modalList[props.mode].clickHandler}>{props.modalList[props.mode].btnName}</button>
      <button onClick="modal_close();">閉じる</button>
    </div>
  )
}

// === ＪＳ関数定義 ===

var set_date = () => { //日付・時刻の取得
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  if (minute < 10) {
    minute = "0" + minute;
  }
  date = year + "/" + month + "/" + day + " ";
  date += hour + ":" + minute;

  return date;
}

var data_registor = () => {  //データの登録・描画
  var content = {
    link  : "",
    title : "",
    id    : 0,
    time  : ""
  };
  content['link']  = document.querySelector('#textbox_1').value;
  content['title'] = document.querySelector('#textbox_2').value;
  content['id']    = cnt++;
  content['time']  = set_date();

  contentsList.push(content);

  ReactDOM.render(
    <ContentsList contentsList={contentsList} />,
    document.querySelector('#container')
  );
}
var data_export = () => {   //データの書き出し
  //blob を使って Chrome 内のバッファ内にバイナリデータ （json） を保持し、それをローカルに落としこむ。
  var data = {data: "testdata"};//get_fab_data();
  var blob = new Blob([data], {type : "text/json"});
  var file_title;
  console.log(document.querySelector('#textbox_1').value);
  if(document.querySelector('#textbox_1').value != ''){file_title = document.querySelector('#textbox_1').value + ".json";}
  if(file_title != undefined){
    if(window.navigator.msSaveBlob){
      window.navigator.msSaveBlob(blob, file_title);
      window.navigator.msSaveOrOpenBlob(blob, file_title);
    }
    else
    {
      window.URL = window.URL || window.webkitURL;
      var links = document.querySelector('#download_links');
      var temp = document.createElement("a");
      temp.innerHTML = file_title;
      temp.href = window.URL.createObjectURL(blob);
      temp.setAttribute("download", file_title);
      links.appendChild(temp);
    }
  }
}

var data_inport = () => {   //データの読み込み

}

var modal_textbox = _mode => {
  var box_ret = [];
  switch (_mode) {
    // TODO: ここを関数・テンプレートで表示できるようにしたい
    case 0:
      box_ret.push(<label for="regist_url">URL</label>);
      box_ret.push(<input name="regist_url" type="text" id="textbox_1"></input>);
      box_ret.push(<br />);
      box_ret.push(<label for="regist_title">タイトル・登録名</label>);
      box_ret.push(<input name="regist_title" type="text" id="textbox_2"></input>);
      box_ret.push(<br />);
      break;
    case 1:
      box_ret.push(<div id="download_links"></div>);
      box_ret.push(<lavel for="export_name">書き出しファイル名</lavel>);
      box_ret.push(<input name="export_name" type="text" id="textbox_1"></input>);
      box_ret.push(<br />);
      break;
    case 2:
      box_ret.push(<lavel for="inport_name">読み込みファイル</lavel>);
      box_ret.push(<input name="inport_name" type="file" id="file_1"></input>);
      box_ret.push(<br />);
      break;
    default:
      break;
    }
    return box_ret;
}


var modal_display = _mode => { //モーダル表示
  ReactDOM.render(
    <ModalWindow modalList={modalList} mode={_mode} />,
    document.querySelector('#modal')
  );
  //  モーダルのセンタリング
  var width   = $(window).width();
  var height  = $(window).height();
  var cont_width  = $('#modal').width();
  var cont_height = $('#modal').outerHeight();
  var cont_left = ((width - cont_width) / 2);
  var cont_top = ((height - cont_height) / 2);
  $('#modal').css({"left": cont_left + "px"});
  $('#modal').css({"top": cont_top + "px"});
}

//  データリスト配列
var menuList = [    //メニューボタン要素オブジェクト
  {
    id: "ADD",
    clickHandler: () => {return modal_display(0)}//data_registor
  },
  {
    id: "EXPORT",
    clickHandler: () => {return modal_display(1)}//data_export
  },
  {
    id: "INPORT",
    clickHandler: () => {return modal_display(2)}//data_inport
  }
];

var modalList = [
  {
    btnName:"登録",
    clickHandler: data_registor
  },
  {
    btnName:"書き出し",
    clickHandler: data_export
  },
  {
    btnName:"読み込み",
    clickHandler: data_inport
  }
];

// 一括レンダー関数
var render = () => {
  ReactDOM.render(
    <MenuContentsList menuList={menuList} />,
    document.querySelector('#menu')
  );
}

render();
