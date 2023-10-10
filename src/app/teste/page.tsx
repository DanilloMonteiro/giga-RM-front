import Image from "next/image";

export default function Home() {
  return (
    <div className="flex w-full h-full">
      <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
        <div className="flex w-[90vw] h-[90vh] gap-10 bg-white rounded-xl drop-shadow-lg p-7">
          <div className="flex flex-col w-1/2 h-full">
            <div className="flex flex-col w-full h-[150px] gap-4 mb-4">
              <h1 className="text-5xl font-bold">Teste: GIGA</h1>
              <div className="flex ml-auto w-full h-full bg-slate-300 rounded-lg items-center justify-around">
                <span className="text-2xl">Dia: 12/10/2023 </span>
                <span className="text-2xl">Horário: 12:34 </span>
              </div>
            </div>
            <div className="flex flex-col w-full h-full bg-slate-400 gap-8 pt-10 p-3 rounded-2xl">
              <div className="flex w-full h-auto justify-between gap-2">
                <label className="text-4xl w-[256px] text-center font-bold">
                  Saída:
                </label>
                <input className="bg-slate-200 w-1/4 h-auto rounded-sm"></input>
                <input className="bg-white w-3/4 h-auto rounded-sm"></input>
              </div>
              <div className="flex w-full h-auto justify-between gap-2">
                <label className="text-4xl w-[256px] text-center font-bold">
                  Entrada:
                </label>
                <input className="bg-slate-200 w-1/4 h-auto rounded-sm"></input>
                <input className="bg-white w-3/4 h-auto rounded-sm"></input>
              </div>
              <div className="flex w-full h-auto justify-between gap-2">
                <label className="text-4xl w-[256px] text-center font-bold">
                  Laço errado:
                </label>
                <input className="bg-slate-200 w-1/4 h-auto rounded-sm"></input>
                <input className="bg-white w-3/4 h-auto rounded-sm"></input>
              </div>
              <div className="flex mt-auto">
                <button className="w-[200px] h-[80px] rounded-md text-2xl bg-red-400 hover:bg-white hover:text-red-400 text-white font-bold border-[2px] border-red-400">
                  Reprovar cabo
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/2 h-full gap-8">
            <div className="flex w-full h-[120px] bg-green-400 items-center p-3 gap-2 rounded-lg">
              <label className="text-3xl font-semibold">Cabos Aprovados:</label>
              <input
                className="w-[110px] h-[60px] text-3xl text-center rounded-lg p-5"
                placeholder="0"
              ></input>
            </div>
            <div className="flex w-full h-[120px] bg-red-400 items-center p-3 gap-2 rounded-lg">
              <label className="text-3xl font-semibold">
                Cabos Reprovados:
              </label>
              <input
                className="w-[90px] h-[60px] text-3xl text-center rounded-lg p-5"
                placeholder="0"
              ></input>
            </div>
            <div className="flex w-full h-full justify-center items-center bg-slate-200">
              <h1 className="text-5xl">IMAGE</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
