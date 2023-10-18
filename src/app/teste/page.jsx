"use client";

import { useContext, useEffect, useState } from "react";
import { TesteContext } from "../../../context/TesteContext";
import { io } from "socket.io-client";
import TesteServices from "../../../services/teste";

const socket = io("http://localhost:3001");

export default function Home() {
  // const { testes, testes0, fetchTeste, setTestes0 } = useContext(TesteContext);
  const [testes, setTestes] = useState([]);
  const [maxItens, setMaxItens] = useState(15);
  const [carregado, setCarregado] = useState(false);

  let teste1 = [];

  const progress =
    testes.length === 0 ? 100 : (testes[0].outputs.length / maxItens) * 100; // Defina MAX_ITEMS como o tamanho máximo do array

  function teste(data) {
    console.log(teste1, "teste1 aqui");
    if (data[0] == 0) {
      for (let i = 0; i < data[2]; i++) {
        const indexTira = teste1[0].inputs.indexOf(parseInt(data[i + 3]));
        console.log(
          indexTira,
          teste1[0].inputs,
          "index do que deve tirar aquyi"
        );
        if (indexTira == -1) {
        } else {
          teste1[0].outputs.splice(indexTira, 1);
          teste1[0].outputs_desc.splice(indexTira, 1);
          teste1[0].inputs.splice(indexTira, 1);
          teste1[0].inputs_desc.splice(indexTira, 1);
          console.log(teste1);
          setTestes([...teste1]);
          console.log(testes);
        }
      }
    } else if (data[0] == 1) {
      for (let i = 0; i < data[2]; i++) {
        const index = parseInt(data[4]);

        setTestes([...teste1]);
      }
    }
  }

  const fetchDados = async () => {
    const response = await TesteServices.index();
    if (response.data.length > 0) {
      teste1 = response.data;
      console.log(teste1, "auqi test1");
      setTestes(teste1);
    } else {
      setTestes([]);
      console.log("aqui dados2");
    }
  };

  useEffect(() => {
    setCarregado(true);
    fetchDados();
  }, []);

  useEffect(() => {
    socket.on("modificacao", (data) => {
      console.log("Modificação recebida:", data);
      teste(data);
    });

    return () => {
      socket.off("modificacao");
    };
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
                  {testes?.map((t, testIndex) => (
                    <div className="flex flex-col w-full" key={testIndex}>
                      <h3>CP: {t.product_code}</h3>
                      <div className="flex flex-col w-full">
                        <div className="grid grid-cols-6">
                          <div className="col-span-2">Saídas: </div>
                          <div className="col-span-2">Entradas: </div>
                          <div className="col-span-2">Error: </div>
                        </div>
                        {t.outputs_desc.map((d, innerDescIndex) => (
                          <div
                            key={innerDescIndex}
                            className={`grid grid-cols-6 ${
                              innerDescIndex % 2 === 0
                                ? "bg-slate-200"
                                : "bg-slate-300"
                            }`}
                          >
                            <div className="col-span-2 ml-2">
                              {t.outputs[innerDescIndex]} - {d.desc}
                            </div>

                            <div className="col-span-2 ml-2">
                              {t.inputs[innerDescIndex]} -
                              {t.inputs_desc[innerDescIndex]}
                            </div>

                            <div className="col-span-2 ml-2">Erros</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex mt-auto">
                <button
                  onClick={() => {
                    console.log(testes);
                  }}
                  className="w-[200px] h-[80px] rounded-md text-2xl bg-red-400 hover:bg-white hover:text-red-400 text-white font-bold border-[2px] border-red-400"
                >
                  Reprovar cabo
                </button>
                <button
                  onClick={() => {
                    reload();
                  }}
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
