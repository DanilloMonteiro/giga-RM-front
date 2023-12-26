"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Api from "../../../../../services/api";
import GigaServices from "../../../../../services/giga";

export default function Page({ params }) {
  const [giga, setGiga] = useState([]);

  const handleSave = async () => {
    await GigaServices.update(giga[0]._id, giga)
      .then((response) => {
        console.log("Atualizacao de item no MongoDB feita com sucesso");
      })
      .catch((error) => {
        console.error(`Erro ao atualizar o item no banco de dados:`, error);
      });
  };

  const handleInputChange = (dindex, field, value) => {
    const newDados = [...giga];

    if (field == "description") {
      newDados[0].description[dindex] = value;
    }
    if (field == "x") {
      newDados[0].x[dindex] = value;
    }
    if (field == "y") {
      newDados[0].y[dindex] = value;
    }
    if (field == "led_pin") {
      newDados[0].led_pin[dindex] = value;
    }
    if (field == "enclave_pin") {
      newDados[0].enclave_pin[dindex] = value;
    }
    if (field == "holder_name") {
      newDados[0].holder_name[dindex] = value;
    }

    setGiga(newDados);
  };

  const handleUpload = async (event, type, idTeste, idConector) => {
    const file = event.target.files[0];
    console.log("File in handleUpload:", file);

    if (file) {
      try {
        const data = new FormData();

        data.append("file", file);
        data.append("idTeste", idTeste);
        data.append("idConector", idConector);
        data.append("type", type);

        Api.post("/upload", data);
      } catch (error) {
        console.error("Erro de rede:", error);
      }
    }
  };

  async function fetchGIGAAtual() {
    try {
      const response = await GigaServices.findById(params.itemId);

      if (response.statusText === "OK") {
        const giga = [response.data];

        setGiga(...[giga]);
      } else {
      }
    } catch (error) {
      console.error("Erro ao buscar dados do teste:", error);
    }
  }

  useEffect(() => {
    fetchGIGAAtual();
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col w-screen h-screen bg-blue-400 justify-center items-center">
          <div className="flex flex-col static w-[95vw] h-[95vh] bg-white rounded-xl drop-shadow-lg px-7 py-3">
            <div className="flex p-3">
              {giga.map((g, gindex) => (
                <>
                  <div className="flex w-full h-auto gap-5">
                    <h1 className="w-full h-auto text-2xl pt-1">
                      Código atual: {g.name}
                    </h1>
                  </div>
                </>
              ))}
            </div>
            <div className="flex flex-col p-2 gap-3 w-full h-full bg-slate-200 rounded-md overflow-auto overscroll-x-contain overscroll-y-contain">
              {giga.map((g, gindex) => (
                <>
                  <table className="table-auto">
                    <thead>
                      <tr className="bg-slate-300 h-[40px] text-center ">
                        <th className="w-[180px] border-x-[1px] border-slate-400">
                          Holder
                        </th>
                        <th className="w-[180px] border-x-[1px] border-slate-400">
                          Descrição
                        </th>
                        <th className="w-[180px] border-x-[1px] border-slate-400">
                          X
                        </th>
                        <th className="w-[180px] border-x-[1px] border-slate-400">
                          Y
                        </th>
                        <th className="w-[180px] border-x-[1px] border-slate-400">
                          Ponto LED
                        </th>
                        <th className="w-[180px] border-x-[1px] border-slate-400">
                          Ponto Enclave
                        </th>
                        <th className="w-[180px] border-x-[1px] border-slate-400">
                          Imagem Conector
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white h-[40px] text-center">
                      {g.led_pin.map((d, dindex) => (
                        <>
                          <tr
                            className={`${
                              dindex % 2 === 0 ? "bg-white" : "bg-slate-200"
                            }`}
                          >
                            <td className="border-x-[1px] border-slate-400">
                              <input
                                className="w-[100px] text-center"
                                placeholder="Nome do holder..."
                                onChange={(e) => {
                                  handleInputChange(
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
                                tabindex="-1"
                                className="text-center w-[100px]"
                                placeholder="Descrição..."
                                onChange={(e) => {
                                  handleInputChange(
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
                                tabindex="-1"
                                onChange={(e) => {
                                  handleInputChange(
                                    dindex,
                                    e.target.name,
                                    e.target.value
                                  );
                                }}
                                name="x"
                                value={g.x[dindex]}
                                className="text-center w-[100px]"
                                placeholder="Coordenada X batalha naval..."
                              ></input>
                            </td>
                            <td className="border-x-[1px] border-slate-400">
                              <input
                                tabindex="-1"
                                onChange={(e) => {
                                  handleInputChange(
                                    dindex,
                                    e.target.name,
                                    e.target.value
                                  );
                                }}
                                name="y"
                                value={g.y[dindex]}
                                className="text-center w-[100px]"
                                placeholder="Coordenada Y batalha naval..."
                              ></input>
                            </td>
                            <td className="border-x-[1px] border-slate-400">
                              <input
                                tabindex="-1"
                                onChange={(e) => {
                                  handleInputChange(
                                    dindex,
                                    e.target.name,
                                    e.target.value
                                  );
                                }}
                                name="led_pin"
                                value={d}
                                className="text-center w-[100px]"
                              ></input>
                            </td>
                            <td className="border-x-[1px] border-slate-400">
                              <input
                                tabindex="-1"
                                onChange={(e) => {
                                  handleInputChange(
                                    dindex,
                                    e.target.name,
                                    e.target.value
                                  );
                                }}
                                name="enclave_pin"
                                value={g.enclave_pin[dindex]}
                                className="text-center w-[100px]"
                              ></input>
                            </td>
                            <td className="border-x-[1px] border-slate-400">
                              <span>{g.c_src[dindex]}</span>
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleUpload(e, "giga", g._id, dindex)
                                }
                              />
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </>
              ))}
            </div>
            <div className="flex w-full h-auto">
              <Link href={`/ChangeCodeGIGA`}>
                <button className="mt-3 text-lg bg-red-400 text-white px-10 py-1 rounded-md hover:text-red-400 hover:bg-white border-[1px] border-red-400 font-semibold">
                  Voltar
                </button>
              </Link>
              <button
                className=" ml-auto mt-3 text-lg bg-blue-400 text-white px-10 py-1 rounded-md hover:text-blue-400 hover:bg-white border-[1px] border-blue-400 font-semibold"
                onClick={handleSave}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// {newGIGA && (
//   <>
//     <div className="flex absolute bg-slate-500 w-screen h-screen top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl opacity-50"></div>
//   </>
// )}
// {newGIGA && (
//   <>
//     <div className="flex flex-col absolute w-[70vw] h-[70vh] bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md p-5">
//       <div className="text-4xl font-semibold">Nova GIGA</div>

//       <div className="flex flex-col p-3">
//         <h1 className="text-xl font-semibold">Dados da GIGA</h1>
//         <div className="flex w-1/2 gap-5 p-2">
//           <h1 className="w-full h-auto text-lg align-middle pt-1">
//             Nome da GIGA:
//           </h1>
//           <input className="w-full border-[1px] border-slate-400 rounded-md "></input>
//         </div>
//         <div className="flex w-1/2 gap-5 p-2">
//           <h1 className="w-full h-auto text-lg align-middle pt-1">
//             Quantidade de holders:
//           </h1>
//           <input className="w-full border-[1px] border-slate-400 rounded-md "></input>
//         </div>
//       </div>
//       <div className="flex mt-auto">
//         <button className="text-lg bg-red-400 text-white px-4 py-1 rounded-md hover:text-red-400 hover:bg-white border-[1px] border-red-400 font-semibold">
//           Cancelar
//         </button>
//         <button className="ml-auto text-lg bg-blue-400 text-white px-4 py-1 rounded-md hover:text-blue-400 hover:bg-white border-[1px] border-blue-400 font-semibold">
//           Criar
//         </button>
//       </div>
//     </div>
//   </>
// )}
