import "./App.css";
import List from "./List";

function App() {
  return (
    <>
      <div className="flex justify-center items-center flex-col gap-2">
        <h1 className="text-2xl">リスト並べ替え機能</h1>
        <ul className="flex flex-col items-start justify-center">
          <li className="list-[desc]">
            「sort」ボタンを掴んだ時のみドラッグが可能。
          </li>
          <li className="list-[desc]">
            「open」ボタンをクリックするとアコーディオンが開く。
          </li>
          <li className="list-[desc]">
            同列のカテゴリ同士のみ並び替えが可能。
          </li>
        </ul>
        <div className="flex justify-center items-center gap-2">
          <div>
            <List />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
