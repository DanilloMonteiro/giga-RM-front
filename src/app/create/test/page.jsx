"use client";

import { useEffect, useState } from "react";
import TesteServices from "../../../../services/teste";

export default function Home() {
  const [codigoGIGA, setCodigoGIGA] = useState(false);
  const [codigoTEST, setCodigoTEST] = useState(false);
  const [newGIGA, setNewGIGA] = useState(false);
  const [menu, setMenu] = useState(true);
  const [GIGASearch, setGIGASearch] = useState("");
  const [GIGAData, setGIGAData] = useState([]);
  const [GIGACarregada, setGIGACarregada] = useState(false);

  const [testeSearch, setTesteSearch] = useState("");
  const [testeGIGA, setTesteGIGA] = useState([]);
  const [testeCarregada, setTesteCarregada] = useState(false);

  const [dados, setDados] = useState(GIGAData); // Supondo que GIGAData seja um array de objetos com seus dados
  const [dados2, setDados2] = useState(testeGIGA); // Supondo que GIGAData seja um array de objetos com seus dados

  // Função para atualizar os valores dos campos de entrada
  const handleInputChange = (gindex, dindex, field, value) => {
    const newDados = [...GIGAData];
    console.log(newDados[gindex]);
    if (field == "description") {
      newDados[gindex].description[dindex] = value;
    }
    if (field == "x") {
      newDados[gindex].x[dindex] = value;
    }
    if (field == "y") {
      newDados[gindex].y[dindex] = value;
    }
    if (field == "led_pin") {
      newDados[gindex].led_pin[dindex] = value;
    }
    if (field == "enclave_pin") {
      newDados[gindex].enclave_pin[dindex] = value;
    }
    if (field == "holder_name") {
      newDados[gindex].holder_name[dindex] = value;
    }

    setDados(newDados);
  };

  const handleInputChange2 = (gindex, dindex, field, value) => {
    const newDados = [...testeGIGA];
    console.log(newDados[gindex]);
    if (field == "o_c_name") {
      newDados[gindex].outputs_c[dindex].c_name = value;
    }
    if (field == "i_c_name") {
      newDados[gindex].inputs_c[dindex].c_name = value;
    }

    setDados2(newDados);
  };

  // Função para salvar as modificações no banco de dados (simulada)
  const handleSave = async () => {
    await TesteServices.gigaUpdate(GIGAData[0]._id, dados)
      .then((response) => {
        console.log("Atualizacao de item no MongoDB feita com sucesso");
      })
      .catch((error) => {
        console.error(`Erro ao atualizar o item no banco de dados:`, error);
      });
  };

  const handleSave2 = async () => {
    await TesteServices.testeGIGAUpdate(testeGIGA[0]._id, dados2)
      .then((response) => {
        console.log("Atualizacao de item no MongoDB feita com sucesso");
      })
      .catch((error) => {
        console.error(`Erro ao atualizar o item no banco de dados:`, error);
      });
  };

  const openCreateGIGA = () => {
    setMenu(false);
    setCodigoGIGA(true);
  };

  const openCreateTEST = () => {
    setMenu(false);
    setCodigoTEST(true);
  };

  async function fetchGIGAAtual(search) {
    try {
      console.log("search aqui", search);
      const response = await TesteServices.gigaFind(search);
      if (response.data.status === "ok") {
        const giga1 = [response.data.giga];

        setGIGAData(...[giga1]);
        setGIGACarregada(true);
      } else {
        setGIGACarregada(false);
      }
    } catch (error) {
      setGIGACarregada(false);
      console.error("Erro ao buscar dados do teste:", error);
    }
  }

  async function fetchTesteAtualGIGA(searchTeste) {
    try {
      const response = await TesteServices.find(searchTeste);
      if (response.data.status === "ok") {
        const teste1 = [response.data.teste];
        console.log(teste1);
        setTesteGIGA(...[teste1]);
        setTesteCarregada(true);
      } else {
        setTesteCarregada(false);
      }
    } catch (error) {
      setTesteCarregada(false);
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
                    <div className="flex w-2/6  rounded-md">
                      <input
                        className="w-full h-full rounded-l-md border-[1px] border-slate-400 px-3"
                        onChange={(e) => {
                          setGIGASearch(e.target.value);
                        }}
                      ></input>
                      <button
                        onClick={() => {
                          fetchGIGAAtual(GIGASearch);
                        }}
                        className="ml-auto px-3 bg-blue-400 text-xl font-semibold rounded-r-md text-white hover:bg-white hover:text-blue-400 border-[1px] border-blue-400"
                      >
                        Procurar
                      </button>
                    </div>

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
                <div className="flex flex-col p-3 gap-3 bg-slate-200 rounded-md w-auto h-full overflow-auto overscroll-x-contain overscroll-y-contain">
                  <div className="flex w-[27vw] gap-3">
                    <h1 className="w-full text-xl">GIGA atual: GIGA 1</h1>
                  </div>
                  <div className="flex">
                    {GIGACarregada &&
                      GIGAData.map((g, gindex) => (
                        <>
                          <table className="table-auto">
                            <thead>
                              <tr className="bg-slate-300 h-[40px] text-center ">
                                <th className="w-[200px] border-x-[1px] border-slate-400">
                                  Holder
                                </th>
                                <th className="w-[200px] border-x-[1px] border-slate-400">
                                  Descrição
                                </th>
                                <th className="w-[260px] border-x-[1px] border-slate-400">
                                  X
                                </th>
                                <th className="w-[260px] border-x-[1px] border-slate-400">
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
                              {g.led_pin.map((d, dindex) => (
                                <>
                                  <tr>
                                    <td className="border-x-[1px] border-slate-400">
                                      <input
                                        className="text-center"
                                        placeholder="Nome do holder..."
                                        onChange={(e) => {
                                          handleInputChange(
                                            gindex,
                                            dindex,
                                            e.target.name,
                                            e.target.value
                                          );
                                        }}
                                        name="holder_name"
                                        value={g.holder_name[dindex]}
                                      ></input>
                                    </td>

                                    <td className="border-x-[1px] border-slate-400">
                                      <input
                                        className="text-center"
                                        placeholder="Descrição..."
                                        onChange={(e) => {
                                          handleInputChange(
                                            gindex,
                                            dindex,
                                            e.target.name,
                                            e.target.value
                                          );
                                        }}
                                        name="description"
                                        value={g.description[dindex]}
                                      ></input>
                                    </td>
                                    <td className="border-x-[1px] border-slate-400">
                                      <input
                                        onChange={(e) => {
                                          handleInputChange(
                                            gindex,
                                            dindex,
                                            e.target.name,
                                            e.target.value
                                          );
                                        }}
                                        name="x"
                                        value={g.x[dindex]}
                                        className="text-center"
                                        placeholder="Coordenada X batalha naval..."
                                      ></input>
                                    </td>
                                    <td className="border-x-[1px] border-slate-400">
                                      <input
                                        onChange={(e) => {
                                          handleInputChange(
                                            gindex,
                                            dindex,
                                            e.target.name,
                                            e.target.value
                                          );
                                        }}
                                        name="y"
                                        value={g.y[dindex]}
                                        className="text-center"
                                        placeholder="Coordenada Y batalha naval..."
                                      ></input>
                                    </td>
                                    <td className="border-x-[1px] border-slate-400">
                                      <input
                                        onChange={(e) => {
                                          handleInputChange(
                                            gindex,
                                            dindex,
                                            e.target.name,
                                            e.target.value
                                          );
                                        }}
                                        name="led_pin"
                                        value={d}
                                        className="text-center"
                                      ></input>
                                    </td>
                                    <td className="border-x-[1px] border-slate-400">
                                      <input
                                        onChange={(e) => {
                                          handleInputChange(
                                            gindex,
                                            dindex,
                                            e.target.name,
                                            e.target.value
                                          );
                                        }}
                                        name="enclave_pin"
                                        value={g.enclave_pin[dindex]}
                                        className="text-center"
                                      ></input>
                                    </td>
                                  </tr>
                                </>
                              ))}
                            </tbody>
                          </table>
                        </>
                      ))}
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
                <button
                  className=" mt-3 text-lg bg-blue-400 text-white px-4 py-1 rounded-md hover:text-blue-400 hover:bg-white border-[1px] border-blue-400 font-semibold"
                  onClick={handleSave}
                >
                  Salvar
                </button>
              </>
            )}
            {codigoTEST && (
              <>
                <div className="flex p-3 gap-10 ">
                  <div className="flex w-full h-auto gap-5">
                    <h1 className="w-1/6 h-auto text-xl align-middle pt-1">
                      Qual Teste deseja modificar?
                    </h1>
                    <div className="flex w-2/6  rounded-md">
                      <input
                        className="w-full h-full rounded-l-md border-[1px] border-slate-400 px-3"
                        onChange={(e) => {
                          setTesteSearch(e.target.value);
                        }}
                      ></input>
                      <button
                        onClick={() => {
                          fetchTesteAtualGIGA(testeSearch);
                        }}
                        className="ml-auto px-3 bg-blue-400 text-xl font-semibold rounded-r-md text-white hover:bg-white hover:text-blue-400 border-[1px] border-blue-400"
                      >
                        Procurar
                      </button>
                    </div>

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
                    {testeCarregada &&
                      testeGIGA.map((g, gindex) => (
                        <>
                          <table className="table-auto">
                            <thead>
                              <tr className="bg-slate-300 h-[40px] text-center ">
                                <th className="w-[200px] border-x-[1px] border-slate-400">
                                  Laço
                                </th>
                                <th className="w-[200px] border-x-[1px] border-slate-400">
                                  C1
                                </th>
                                <th className="w-[260px] border-x-[1px] border-slate-400">
                                  C1 - imagem
                                </th>
                                <th className="w-[260px] border-x-[1px] border-slate-400">
                                  C2
                                </th>
                                <th className="w-[200px] border-x-[1px] border-slate-400">
                                  C2 - imagem
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white h-[40px] text-center">
                              {g.outputs.map((d, dindex) => (
                                <>
                                  <tr>
                                    <td className="border-x-[1px] border-slate-400">
                                      <input
                                        className="text-center"
                                        value={`O- ${d} I- ${g.inputs[dindex]}`}
                                      ></input>
                                    </td>

                                    <td className="border-x-[1px] border-slate-400">
                                      <input
                                        className="text-center"
                                        placeholder="Conector 1..."
                                        onChange={(e) => {
                                          handleInputChange2(
                                            gindex,
                                            dindex,
                                            e.target.name,
                                            e.target.value
                                          );
                                        }}
                                        name="o_c_name"
                                        value={g.outputs_c[dindex].c_name}
                                      ></input>
                                    </td>
                                    <td className="border-x-[1px] border-slate-400">
                                      <input
                                        className="text-center"
                                        placeholder="Imagem do conector 1..."
                                        name=""
                                      ></input>
                                    </td>
                                    <td className="border-x-[1px] border-slate-400">
                                      <input
                                        className="text-center"
                                        placeholder="Conector 2..."
                                        onChange={(e) => {
                                          handleInputChange2(
                                            gindex,
                                            dindex,
                                            e.target.name,
                                            e.target.value
                                          );
                                        }}
                                        name="i_c_name"
                                        value={g.inputs_c[dindex].c_name}
                                      ></input>
                                    </td>
                                    <td className="border-x-[1px] border-slate-400">
                                      <input
                                        className="text-center"
                                        placeholder="Imagem do conector 2..."
                                        name=""
                                      ></input>
                                    </td>
                                  </tr>
                                </>
                              ))}
                            </tbody>
                          </table>
                        </>
                      ))}
                  </div>
                </div>
                <button
                  className=" mt-3 text-lg bg-blue-400 text-white px-4 py-1 rounded-md hover:text-blue-400 hover:bg-white border-[1px] border-blue-400 font-semibold"
                  onClick={handleSave2}
                >
                  Salvar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
