"use client";

import { useEffect, useState } from "react";
import TesteServices from "../../../../services/teste";

export default function Home() {
  const [codigoGIGA, setCodigoGIGA] = useState(false);
  const [codigoTEST, setCodigoTEST] = useState(false);
  const [newGIGA, setNewGIGA] = useState(false);
  const [menu, setMenu] = useState(true);

  const openCreateGIGA = () => {
    setMenu(false);
    setCodigoGIGA(true);
  };

  const openCreateTEST = () => {
    setMenu(false);
    setCodigoTEST(true);
  };

  async function fetchTesteAtual() {
    try {
      const response = await TesteServices.gigaFind();
      if (response.data.status === "ok") {
      } else {
      }
    } catch (error) {
      console.error("Erro ao buscar dados do teste:", error);
    }
  }

  return (
    <div className="flex w-full h-full">
      <div className="flex w-full h-full">
        <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
          <div className="flex flex-col static w-[95vw] h-[95vh] bg-white rounded-xl drop-shadow-lg px-7 py-3">
            <header>
              <div className="flex p-3">
                <h1 className="text-4xl font-semibold">
                  Criação de teste GIGA
                </h1>
              </div>
            </header>
            {menu && (
              <>
                <div className="flex flex-col p-3 gap-5 ">
                  <div className="flex w-[27vw]">
                    <h1 className="w-full text-xl">Qual teste deseja criar?</h1>
                  </div>
                  <div className="flex gap-5">
                    <div className="flex w-auto h-auto bg-blue-400 text-white px-4 py-2 rounded-md hover:text-blue-400 hover:bg-white border-[1px] border-blue-400 font-semibold">
                      <button
                        className="w-full text-xl"
                        onClick={() => {
                          openCreateTEST();
                        }}
                      >
                        Criar Teste
                      </button>
                    </div>
                    <div className="flex w-auto h-auto bg-blue-400 text-white px-4 py-2 rounded-md hover:text-blue-400 hover:bg-white border-[1px] border-blue-400 font-semibold">
                      <button
                        className="w-full text-xl"
                        onClick={() => {
                          openCreateGIGA();
                        }}
                      >
                        Criar GIGA
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {codigoGIGA && (
              <>
                <div className="flex w-full h-auto p-3">
                  <div className="flex w-full h-auto gap-5">
                    <h1 className="w-1/6 h-auto text-xl align-middle pt-1">
                      Qual GIGA deseja modificar?
                    </h1>
                    <input
                      className="w-2/6 border-[1px] border-slate-400 rounded-md"
                      onChange={() => {}}
                    ></input>
                    <span className=" h-auto text-xl align-middle pt-1">
                      OU
                    </span>
                    <button
                      onClick={() => {
                        setNewGIGA(true);
                      }}
                      className="w-1/6 text-lg bg-blue-400 text-white px-4 py-1 rounded-md hover:text-blue-400 hover:bg-white border-[1px] border-blue-400 font-semibold"
                    >
                      Criar GIGA
                    </button>
                  </div>
                </div>
                <div className="flex flex-col p-3 gap-3 w-full h-full bg-slate-200 rounded-md">
                  <div className="flex w-[27vw] gap-3">
                    <h1 className="w-full text-xl">GIGA atual: GIGA 1</h1>
                  </div>
                  <div className="">
                    <table className="table-auto">
                      <thead>
                        <tr className="bg-slate-300 h-[40px] text-center ">
                          <th className="w-[200px] border-x-[1px] border-slate-400">
                            Holder
                          </th>
                          <th className="w-[200px] border-x-[1px] border-slate-400">
                            Descrição
                          </th>
                          <th className="w-[200px] border-x-[1px] border-slate-400">
                            X
                          </th>
                          <th className="w-[200px] border-x-[1px] border-slate-400">
                            Y
                          </th>
                          <th className="w-[200px] border-x-[1px] border-slate-400">
                            Ponto LED
                          </th>
                          <th className="w-[200px] border-x-[1px] border-slate-400">
                            Ponto Enclave
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white h-[40px] text-center">
                        <tr>
                          <td className="border-x-[1px] border-slate-400">
                            Holder 1
                          </td>
                          <td className="border-x-[1px] border-slate-400"></td>
                          <td className="border-x-[1px] border-slate-400">A</td>
                          <td className="border-x-[1px] border-slate-400">
                            12
                          </td>
                          <td className="border-x-[1px] border-slate-400"></td>
                          <td className="border-x-[1px] border-slate-400"></td>
                        </tr>
                        <tr>
                          <td className="border-x-[1px] border-slate-400">
                            Holder 2
                          </td>
                          <td className="border-x-[1px] border-slate-400"></td>
                          <td className="border-x-[1px] border-slate-400">B</td>
                          <td className="border-x-[1px] border-slate-400">
                            15
                          </td>
                          <td className="border-x-[1px] border-slate-400"></td>
                          <td className="border-x-[1px] border-slate-400"></td>
                        </tr>
                        <tr>
                          <td className="border-x-[1px] border-slate-400">
                            Holder 3
                          </td>
                          <td className="border-x-[1px] border-slate-400"></td>
                          <td className="border-x-[1px] border-slate-400">C</td>
                          <td className="border-x-[1px] border-slate-400">
                            14
                          </td>
                          <td className="border-x-[1px] border-slate-400"></td>
                          <td className="border-x-[1px] border-slate-400"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {newGIGA && (
                  <>
                    <div className="flex absolute bg-slate-500 w-screen h-screen top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl opacity-50"></div>
                  </>
                )}
                {newGIGA && (
                  <>
                    <div className="flex flex-col absolute w-[70vw] h-[70vh] bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md p-5">
                      <div className="text-4xl font-semibold">Nova GIGA</div>

                      <div className="flex flex-col p-3">
                        <h1 className="text-xl font-semibold">Dados da GIGA</h1>
                        <div className="flex w-1/2 gap-5 p-2">
                          <h1 className="w-full h-auto text-lg align-middle pt-1">
                            Nome da GIGA:
                          </h1>
                          <input className="w-full border-[1px] border-slate-400 rounded-md "></input>
                        </div>
                        <div className="flex w-1/2 gap-5 p-2">
                          <h1 className="w-full h-auto text-lg align-middle pt-1">
                            Quantidade de holders:
                          </h1>
                          <input className="w-full border-[1px] border-slate-400 rounded-md "></input>
                        </div>
                      </div>
                      <div className="flex mt-auto">
                        <button className="text-lg bg-red-400 text-white px-4 py-1 rounded-md hover:text-red-400 hover:bg-white border-[1px] border-red-400 font-semibold">
                          Cancelar
                        </button>
                        <button className="ml-auto text-lg bg-blue-400 text-white px-4 py-1 rounded-md hover:text-blue-400 hover:bg-white border-[1px] border-blue-400 font-semibold">
                          Criar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            {codigoTEST && (
              <>
                <div className="flex p-3 gap-10 ">
                  <div className="flex w-[27vw] gap-3">
                    <h1 className="w-full text-xl">Qual teste deseja criar?</h1>
                    <input className="w-full border-[1px] border-slate-400 rounded-md px-3"></input>
                  </div>
                  <div className="flex w-[27vw] gap-3">
                    <h1 className="w-full text-xl">Qual GIGA usar?</h1>
                    <input
                      className="w-full border-[1px] border-slate-400 rounded-md px-3"
                      value={"GIGA 1"}
                    ></input>
                  </div>
                </div>
                <div className="flex flex-col p-3 gap-3 w-full h-full bg-slate-200 rounded-md">
                  <div className="flex w-[27vw] gap-3">
                    <h1 className="w-full text-xl">GIGA atual: GIGA 1</h1>
                  </div>
                  <div className="">
                    <table className="table-auto">
                      <thead>
                        <tr className="bg-slate-300 h-[40px] text-center">
                          <th className="w-[200px]">Laços</th>
                          <th className="w-[200px]">C1</th>
                          <th className="w-[200px]">C1 - IMAGE</th>
                          <th className="w-[200px]">C2</th>
                          <th className="w-[200px]">C2 - IMAGE</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white h-[40px] text-center">
                        <tr>
                          <td>L1 - Out 65 - In 66</td>
                          <td></td>
                          <td>Holder 1</td>
                          <td></td>
                          <td>Holder 2</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>L2 - Out 62 - In 60</td>
                          <td></td>
                          <td>Holder 3</td>
                          <td></td>
                          <td>Holder 4</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>L3 - Out 68 - In 64</td>
                          <td></td>
                          <td>Holder 5</td>
                          <td></td>
                          <td>Holder 6</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
