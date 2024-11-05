import "./App.css";
import List from "./List";

function App() {
  return (
    <>
      <div className="flex justify-center items-center flex-col gap-2">
        <h1 className="text-2xl">リスト並べ替え機能のモック</h1>
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
