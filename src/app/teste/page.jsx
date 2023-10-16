"use client";

import { useContext, useEffect, useState } from "react";
import { TesteContext, TesteProvider } from "../../../context/TesteContext";

export default function Home() {
  const { testes, testes0, fetchTeste } = useContext(TesteContext);
  const [carregado, setCarregado] = useState(false);
  const [testes1, setTestes1] = useState(testes0);

  const [maxItens, setMaxItens] = useState(234);

  const progress =
    testes1.length === 0 ? 100 : (testes1[0].outputs.length / maxItens) * 100; // Defina MAX_ITEMS como o tamanho máximo do array

  function teste() {
    const out = testes0[0].outputs; // Verifica se já atingiu o fim do array
    console.log(out.length);
    if (out.length <= 0) {
      clearInterval(interval); // Para o setInterval
      return;
    }

    // Lógica para modificar testes1 de acordo com os dados de testes0
    const novoTestes1 = [...testes0];
    const i = novoTestes1[0];
    i.outputs.shift();
    i.outputs_desc.shift();
    i.inputs.shift();
    i.inputs_desc.shift();

    setTestes1(novoTestes1);
  }

  let interval = null;

  // Chame a função a cada meio segundo
  function iniciarTeste() {
    interval = setInterval(teste, 50); // 500 milissegundos = meio segundo
  }

  function looding() {
    iniciarTeste();
  }

  function tes() {
    setCarregado(true);
    console.log(testes0);
    setTestes1(testes0);
    console.log(testes1);
  }

  useEffect(() => {
    setCarregado(true);
  }, []);
  return (
    <div className="flex w-full h-full">
      <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
        <div className="flex w-[90vw] h-[90vh] gap-10 bg-white rounded-xl drop-shadow-lg p-7">
          <div className="flex flex-col w-4/6 h-full">
            <div className="flex flex-col w-full h-full bg-slate-400 gap-2 pt-10 p-2 rounded-2xl">
              <div className="flex flex-col w-full h-auto gap-4 mb-4">
                <h1 className="text-5xl font-bold bg-slate-300 rounded-lg p-2">
                  Teste: GIGA
                </h1>
                <div className="flex ml-auto w-full h-full bg-slate-300 rounded-lg items-center justify-around p-1">
                  <span className="text-2xl">Dia: 12/10/2023 </span>
                  <span className="text-2xl">Horário: 12:34 </span>
                </div>
              </div>
              <div className="progress-container">
                <div className="progress" style={{ width: `${progress}%` }}>
                  {progress === 100
                    ? "Aguardando teste"
                    : `${progress.toFixed(2)}%`}
                </div>
              </div>
              {carregado === true && (
                <div className="flex w-full overflow-y-auto max-h-full">
                  {testes1?.map((t, testIndex) => (
                    <div className="flex flex-col w-full" key={testIndex}>
                      <h3>CP: {t.product_code}</h3>
                      <div className="flex flex-col w-full">
                        <div className="grid grid-cols-4">
                          <div className="col-span-2">Saídas: </div>
                          <div className="col-span-2">Entradas: </div>
                        </div>
                        {t.outputs_desc.map((d, innerDescIndex) => (
                          <div
                            key={innerDescIndex}
                            className="grid grid-cols-4"
                          >
                            <div className="col-span-2 ml-2">
                              {t.outputs[innerDescIndex]} - {d}
                            </div>

                            <div className="col-span-2 ml-2">
                              {t.inputs[innerDescIndex]} -{" "}
                              {t.inputs_desc[innerDescIndex]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex mt-auto">
                <button
                  onClick={() => looding()}
                  className="w-[200px] h-[80px] rounded-md text-2xl bg-red-400 hover:bg-white hover:text-red-400 text-white font-bold border-[2px] border-red-400"
                >
                  Reprovar cabo
                </button>
                <button
                  onClick={() => tes()}
                  className="w-[200px] h-[80px] rounded-md text-2xl bg-red-400 hover:bg-white hover:text-red-400 text-white font-bold border-[2px] border-red-400"
                >
                  Testar
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-2/6 h-full gap-8">
            <div className="flex w-full h-[120px] bg-green-400 items-center p-3 gap-2 rounded-lg">
              <label className="text-3xl font-semibold md:text-lg">
                Cabos Aprovados:
              </label>
              <input
                className="w-[90px] h-[60px] text-3xl text-center rounded-lg p-5 md:w-[50px] md:text-lg"
                placeholder="0"
              ></input>
            </div>
            <div className="flex w-full h-[120px] bg-red-400 items-center p-3 gap-2 rounded-lg">
              <label className="text-3xl font-semibold md:text-lg">
                Cabos Reprovados:
              </label>
              <input
                className="w-[90px] h-[60px] text-3xl text-center rounded-lg p-5 md:w-[50px] md:text-lg"
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
