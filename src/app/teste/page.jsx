"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import TesteServices from "../../../services/teste";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import Link from "next/link";
import Image from "next/image";

const socket = io("http://localhost:3001");

export default function Home() {
  const numLinhas = 7;

  const tabela = [];

  const letras = ["A", "B", "C", "D", "E", "F", "G"];
  const numColunas = 58;

  const [reprovados, setReprovados] = useState(0);
  const [aprovados, setAprovados] = useState(0);
  const [teste, setTeste] = useState([]);
  const [testeCopia, setTesteCopia] = useState([]);
  const [maxItens, setMaxItens] = useState(0);
  const [carregado, setCarregado] = useState(false);
  const [time, setTime] = useState(new Date());

  const [batalhaScreen, setBatalhaScreen] = useState(false);
  const [testeScreen, setTesteScreen] = useState(false);

  const [testePontos, setTestePontos] = useState(false);

  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState(false);

  const [RE, setRE] = useState("");
  const [REError, setREError] = useState(false);

  const [reprovado, setReprovado] = useState(false);
  const [aprovado, setAprovado] = useState(false);

  const [testeGIGA, setTesteGIGA] = useState([]);
  const [testeGIGACopia, setTesteGIGACopia] = useState([]);
  const [maxItensGIGA, setMaxItensGIGA] = useState(256);

  const [batalha, setBatalha] = useState([]);

  const [coordenadas, setCoordenadas] = useState([]);
  const [images, setImages] = useState([]);
  const [laco, setLaco] = useState([]);
  const [coord, setCoord] = useState([]);
  const [bataIndex, setBataIndex] = useState([]);

  let teste1 = [];
  let teste2 = [];

  const handleChangeTeste = (teste) => {
    setSearch(teste);
  };

  const handleChangeRE = (RE) => {
    setRE(RE);
    setREError(false);
  };

  const formatCurrentDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  async function startTeste() {
    try {
      const response = await TesteServices.start();
    } catch (error) {
      console.error("Erro ao iniciar teste:", error);
      setCarregado(false); // Define carregado como false em caso de erro
    }
  }

  async function stopTeste() {
    try {
      const response = await TesteServices.stop();
    } catch (error) {
      console.error("Erro ao iniciar teste:", error);
      setCarregado(false); // Define carregado como false em caso de erro
    }
  }

  const incrementReprovados = () => {
    setReprovados(reprovados + 1);
  };

  const incrementAprovados = () => {
    setAprovados(aprovados + 1);
  };

  async function Reprovar() {
    try {
      incrementReprovados();
      setTeste(...[testeCopia]);

      const response = await TesteServices.reprove();

      setReprovado(true);
      setTimeout(() => {
        setReprovado(false);
      }, 3000);
    } catch (error) {
      console.error("Erro ao iniciar teste:", error);
      // Define carregado como false em caso de erro
    }
  }

  async function Aprovar() {
    try {
      incrementAprovados();
      setTeste(...[testeCopia]);

      const response = await TesteServices.aprove();

      setAprovado(true);
      setTimeout(() => {
        setAprovado(false);
      }, 3000);
    } catch (error) {
      console.error("Erro ao iniciar teste:", error);
      // Define carregado como false em caso de erro
    }
  }

  async function fetchTesteAtual(testeCode, re) {
    try {
      if (re == "") {
        setREError(true);
        return;
      }
      const response = await TesteServices.find(testeCode);
      if (response.data.status === "ok") {
        teste1 = [response.data.teste];
        setTesteCopia(...[teste1]);
        setTeste(...[teste1]);

        let coor = [];

        for (let i = 0; i < teste1[0].outputs_c.length; i++) {
          coor.push(teste1[0].outputs_c[i].c_name);
          coor.push(teste1[0].inputs_c[i].c_name);
        }

        setCoordenadas(coor);

        setMaxItens(teste1[0].outputs.length);

        for (let i = 0; i < letras.length; i++) {
          const letra = letras[i];

          for (let j = 1; j <= numColunas; j++) {
            const coordenada = `${letra}${j}`;
            tabela.push({
              co: coordenada,
              x: letra,
              y: j.toString(),
              status: null,
            });
          }
        }

        carregarBatalha(tabela, coor);

        let images = [];
        let laco = [];
        let coord = [];
        let index11 = [];

        for (let i = 0; i < teste1[0].outputs_c.length; i++) {
          images.push(teste1[0].outputs_c[i].c_src);
          laco.push(`Saída ${teste1[0].outputs[i]}`);
          coord.push(teste1[0].outputs_c[i].c_name);
          images.push(teste1[0].inputs_c[i].c_src);
          laco.push(`Entrada ${teste1[0].inputs[i]}`);
          coord.push(teste1[0].inputs_c[i].c_name);

          for (let j = 0; j < tabela.length; j++) {
            if (tabela[j].co == teste1[0].outputs_c[i].c_name) {
              index11.push(j);
              break;
            }
          }

          for (let j = 0; j < tabela.length; j++) {
            if (tabela[j].co == teste1[0].inputs_c[i].c_name) {
              index11.push(j);
              break;
            }
          }
        }
        console.log("imagessssssssssssssss", index11);

        setBataIndex(index11);
        setCoord(coord);
        setLaco(laco);
        setImages(images);

        setBatalha(tabela);

        setCarregado(true); // Define carregado como true para exibir os dados
        setBatalhaScreen(true);
        setSearchError(false);
      } else {
        setSearchError(true);
        setBatalhaScreen(false);
        setCarregado(false); // Define carregado como false em caso de erro
      }
    } catch (error) {
      console.error("Erro ao buscar dados do teste:", error);
      setCarregado(false); // Define carregado como false em caso de erro
    }
    console.log(teste1, teste2);
  }

  async function fetchTesteAtualGIGA(testeCode, re) {
    try {
      if (re == "") {
        setREError(true);
        return;
      }
      const response = await TesteServices.find(`Teste 4 placas`);
      if (response.data.status === "ok") {
        teste1 = [response.data.teste];

        setTesteGIGACopia(...[teste1]);
        setTesteGIGA(...[teste1]);

        setMaxItensGIGA(teste1[0].outputs.length);
        setTestePontos(true);
      } else {
        setTestePontos(false); // Define setTestePontos como false em caso de erro
      }
    } catch (error) {
      console.error("Erro ao buscar dados do teste:", error);
      setTestePontos(false); // Define TestePontos como false em caso de erro
    }
  }

  async function concluirBatalha() {
    setBatalhaScreen(false);
    setTesteScreen(true);
  }

  const progress =
    teste.length === 0
      ? 100
      : ((maxItens - teste[0].outputs.length) / maxItens) * 100; // Defina MAX_ITEMS como o tamanho máximo do array

  const progress1 =
    teste.length === 0
      ? 100
      : ((maxItens - teste[0].outputs.length) / maxItensGIGA) * 100; // Defina MAX_ITEMS como o tamanho máximo do array

  function TesteFunction(data) {
    // console.log(data);
    if (teste != []) {
      if (data[0] == 0) {
        // for (let i = 1; i < data.length; i++) {
        const indexTira = teste[0].inputs.indexOf(parseInt(data[1]));
        if (indexTira != -1) {
          setTeste((prevTeste) => {
            const newTeste = { ...prevTeste[0] }; // Clone o objeto teste[0]

            // Use o método filter para criar novos arrays que excluem o elemento específico
            newTeste.outputs = newTeste.outputs.filter(
              (element, i) => i !== indexTira
            );
            newTeste.outputs_desc = newTeste.outputs_desc.filter(
              (element, i) => i !== indexTira
            );
            newTeste.inputs = newTeste.inputs.filter(
              (element, i) => i !== indexTira
            );
            newTeste.inputs_desc = newTeste.inputs_desc.filter(
              (element, i) => i !== indexTira
            );

            return [newTeste];
          });
        } else {
          // Atualize o estado do 'teste' usando setTeste
          return;
        }
        // }
      } else if (data[0] == 1) {
        let datatama = data.length;
        setTeste((prevTeste) => {
          const newTeste = { ...prevTeste[0] }; // Clone o objeto teste[0]
          const objetoEncontrado = newTeste.inputs.indexOf(data[datatama - 2]);
          if (objetoEncontrado != -1) {
            newTeste.outputs_desc[objetoEncontrado].error = data[datatama - 1];
            return [newTeste];
          } else {
            return [newTeste];
          }
        });
      } else if (data[0] == 2) {
        // limpa a tela cabo desconectado
        let datatama = data.length;
        setTeste((prevTeste) => {
          const newTeste = { ...prevTeste[0] }; // Clone o objeto teste[0]
          const objetoEncontrado = newTeste.inputs.indexOf(data[1]);

          if (objetoEncontrado != -1) {
            newTeste.outputs_desc[objetoEncontrado].error = "";
            return [newTeste];
          } else {
            return [newTeste];
          }
        });
      } else if (data[0] == 3) {
        // testeGIGA
        let datatama = data.length;
        setTeste((prevTeste) => {
          const newTeste = { ...prevTeste[0] }; // Clone o objeto teste[0]
          const objetoEncontrado = newTeste.inputs.indexOf(data[2]);

          if (objetoEncontrado != -1) {
            newTeste.outputs_desc[objetoEncontrado].error = "";
            return [newTeste];
          } else {
            return [newTeste];
          }
        });
      } else if (data[0] == 4) {
        for (let i = 0; i < batalha.length; i++) {
          if (batalha[i].co == data[2]) {
            setBatalha((prevTeste) => {
              const newTeste = [...prevTeste]; // Clone o objeto teste[0]

              newTeste[i].status = false;

              return newTeste;
            });
          }
        }
      } else if (data[0] == 5) {
        for (let i = 0; i < batalha.length; i++) {
          for (let j = 2; j < data.length; j++) {
            if (batalha[i].co == data[j]) {
              setBatalha((prevTeste) => {
                const newTeste = [...prevTeste]; // Clone o objeto teste[0]

                newTeste[i].status = true;

                return newTeste;
              });
            }
          }
        }
      }
    } else {
    }
  }

  const carregarBatalha = async (table, coor) => {
    for (let i = 0; i < table.length; i++) {
      for (const item of coor) {
        if (table[i].co == item) {
          setBatalha(() => {
            const newTeste = [...table]; // Clone o objeto teste[0]

            newTeste[i].status = true;

            return newTeste;
          });
        }
      }
    }
  };

  // Crie um array com valores para preencher as células da tabela
  const valores = Array.from(
    { length: numLinhas * numColunas },
    (_, index) => index + 1
  );

  useEffect(() => {
    socket.on("modificacao", (data) => {
      TesteFunction(data);
    });

    return () => {
      socket.off("modificacao");
    };
  }, [teste]);

  useEffect(() => {
    stopTeste();
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000); // Atualizar a cada segundo (1000 ms)

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex w-full h-full">
      <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
        <div className="flex static w-[97vw] h-[94vh] gap-10 bg-white rounded-xl drop-shadow-lg p-7">
          {carregado === false && (
            <>
              <div className="flex flex-row w-full justify-center h-full bg-white items-center rounded-md">
                <Image
                  src="/1529355861725-removebg-preview.png" // Caminho para a imagem na pasta "public"
                  alt="Minha Imagem" // Texto alternativo para acessibilidade
                  width={300} // Largura da imagem (ajuste conforme necessário)
                  height={300} // Altura da imagem (ajuste conforme necessário)
                />
                <div className="flex flex-col w-[600px] bg-slate-300 px-20 pb-20">
                  <div className="flex items-center mt-10 justify-between">
                    <label className="flex bg-slate-400 text-white font-semibold w-[200px] h-[40px] border-[2px] justify-center items-center border-slate-400 rounded-sm">
                      RE:
                    </label>
                    <input
                      className="border-[1px] rounded-sm p-2"
                      placeholder="Digite o RE"
                      onChange={(e) => handleChangeRE(e.target.value)}
                    ></input>
                  </div>
                  <div className="flex">
                    {REError && (
                      <span className="w-full h-4 text-red-500 ml-3">
                        Esse campo é obrigatorio*
                      </span>
                    )}

                    <span className="w-full h-4 text-red-500"></span>
                  </div>
                  <div className="flex items-center mt-6 justify-between">
                    <button
                      onClick={() => fetchTesteAtual(search, RE)}
                      className="bg-blue-400 text-white font-semibold w-[200px] h-[40px] border-[2px] border-blue-400 rounded-sm hover:text-blue-400 hover:bg-white"
                    >
                      Iniciar Teste
                    </button>
                    <input
                      className="border-[1px] rounded-sm p-2"
                      placeholder="Digite o código do teste"
                      onChange={(e) => handleChangeTeste(e.target.value)}
                    ></input>
                  </div>
                  <div className="flex">
                    {searchError && (
                      <span className="w-full h-4 text-red-500 ml-3">
                        Teste não encontrado*
                      </span>
                    )}

                    <span className="w-full h-4 text-red-500"></span>
                  </div>

                  <div className="flexjustify-start mt-6">
                    <button className="bg-blue-400 text-white font-semibold w-[200px] h-[40px] rounded-sm border-[2px] border-blue-400 hover:text-blue-400 hover:bg-white">
                      <Link href={`/create/test`}>Criar Teste GIGA</Link>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {carregado == true && (
            <>
              <div
                className={`flex ${
                  batalhaScreen == true ? "flex-col" : "flex-col"
                } ${
                  batalhaScreen == true ? "" : ""
                }w-full h-full justify-start items-start bg-slate-200`}
              >
                {batalhaScreen && (
                  <>
                    <div className="w-full h-2/4 bg-white">
                      <div className="flex w-full h-full justify-center items-start bg-slate-200">
                        <div className="w-full h-full bg-white border-[1px] border-slate-400 rounded-md">
                          <table className="tabela">
                            <thead>
                              <tr>
                                <th className="w-[10px] h-[30px] border-[1px] border-slate-400 bg-slate-300 text-center"></th>
                                {Array.from({ length: numColunas }).map(
                                  (_, colIndex) => (
                                    <th
                                      className="w-[35px] h-[35px] border-[1px] border-slate-400 bg-slate-300 text-center"
                                      key={colIndex + 1}
                                    >
                                      {colIndex + 1}
                                    </th>
                                  )
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from({ length: 7 }).map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                  <td
                                    className={`w-[35px] h-[39px] border-[1px] border-slate-400 bg-slate-300 text-center font-bold`}
                                  >
                                    {letras[rowIndex]}
                                  </td>
                                  {batalha
                                    .slice(rowIndex * 58, (rowIndex + 1) * 58)
                                    .map((item, itemIndex) => (
                                      <td
                                        className={`w-[10px] h-[55px] border-[1px] border-slate-400 text-center ${
                                          item.status == null ? "bg-white" : ""
                                        }${
                                          item.status == false
                                            ? "bg-green-300"
                                            : ""
                                        }${
                                          item.status == true
                                            ? "bg-red-300"
                                            : ""
                                        }`}
                                        key={item.co}
                                      ></td>
                                    ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-[94vw] h-2/4 bg-white">
                      <div className="flex w-full h-full justify-start items-center border-[1px] border-slate-400 rounded-md overflow-x-auto whitespace-nowrap">
                        {/* {images.map((i, index) => (
                          <>
                            <div
                              className={`flex min-w-[230px] h-full flex-col text-center ${
                                batalha[bataIndex[index]].status == false
                                  ? "hidden"
                                  : "flex"
                              } ${
                                index % 2 === 0
                                  ? "bg-slate-200"
                                  : "bg-slate-300"
                              } `}
                            >
                              <span className="flex justify-center mt-10">
                                {laco[index]}
                              </span>
                              <span className="flex justify-center">
                                Modulo {coord[index]}
                              </span>
                              <Image
                                src={`/${i}`}
                                width={1000}
                                height={500}
                                alt="Picture of the author"
                              />
                            </div>
                            
                          </>
                          
                        ))} */}
<button
                              className="bg-slate-200"
                              onClick={() => {
                                concluirBatalha();
                              }}
                            >
                              Concluir batalha
                            </button>
                        {/* <button
                          className="bg-slate-200"
                          onClick={() => {
                            carregarBatalha();
                          }}
                        >
                          Carregar batalha
                        </button> */}
                      </div>
                      {/* <div className="flex w-1/2 h-full justify-center items-center border-[1px] border-slate-400 rounded-md">
                        <h1>Imagem do conector</h1>
                        <button
                          className="bg-slate-200"
                          onClick={() => {
                            concluirBatalha();
                          }}
                        >
                          Concluir batalha
                        </button>
                      </div> */}
                    </div>
                  </>
                )}
                {testeScreen && (
                  <>
                    <div className="flex flex-row w-full h-2/4 mr-10 gap-5 bg-white">
                      <div className="flex flex-col w-full h-full bg-slate-400 gap-2 p-2 rounded-2xl ">
                        <div className="flex flex-col w-full h-auto gap-4 mb-2">
                          <h1 className="text-4xl font-bold bg-slate-300 rounded-lg p-2">
                            Teste: {teste[0].product_code}
                            <span className="text-2xl">
                              Dia: {formatCurrentDate(time)}{" "}
                            </span>
                            <span className="text-2xl">
                              Horário: {time.toLocaleTimeString()}
                            </span>
                          </h1>
                        </div>
                        <div className="progress-container">
                          <div
                            className="progress"
                            style={{ width: `${progress}%` }}
                          >
                            {progress === 0 && "Aguardando Teste"}
                            {progress === 100 && "Teste Concluído" && Aprovar()}
                            {progress !== 0 &&
                              progress !== 100 &&
                              `${progress.toFixed(2)}%`}
                          </div>
                        </div>
                        {carregado === true && (
                          <div className="flex w-full overflow-y-auto max-h-full">
                            {teste[0].product_code === search ? (
                              teste.map((t, testIndex) => (
                                <div
                                  className="flex flex-col w-full"
                                  key={testIndex}
                                >
                                  <h3>CP: {t.product_code}</h3>
                                  <div className="flex flex-col w-full">
                                    <div className="grid grid-cols-6">
                                      <div className="col-span-2">Saídas: </div>
                                      <div className="col-span-2">
                                        Entradas:
                                      </div>
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

                                        <div className="col-span-2 ml-2 text-red-400">
                                          {d.error}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <>
                                <p>Aguarde o carregamento dos dados...</p>
                                <button
                                  onClick={() => console.log(teste)}
                                  className="w-[150px] h-[80px] rounded-md text-2xl bg-red-400 hover:bg-white hover:text-red-400 text-white font-bold border-[2px] border-red-400"
                                >
                                  Testar
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col w-1/5">
                        <div className="flex w-full h-[60px] bg-green-400 items-center p-3 gap-2 rounded-lg ">
                          <label className="text-3xl font-semibold md:text-lg">
                            Chicotes Aprovados:
                          </label>
                          <label className="w-[90px] h-[40px] text-3xl text-center bg-slate-100 rounded-lg pt-2 md:w-[50px] md:text-lg">
                            {aprovados}
                          </label>
                        </div>
                        <div className="flex w-full h-[60px] bg-red-400 items-center p-3 gap-2 rounded-lg mt-2">
                          <label className="text-3xl font-semibold md:text-lg">
                            Chicotes Reprovados:
                          </label>
                          <label className="w-[90px] h-[40px] text-3xl text-center bg-slate-100 rounded-lg pt-2 md:w-[50px] md:text-lg">
                            {reprovados}
                          </label>
                        </div>
                        <div className="flex flex-col py-2 mt-auto gap-2 items-center bg-slate-400 rounded-xl">
                          <button
                            onClick={() => {
                              Reprovar();
                            }}
                            className="w-[150px] h-[80px] rounded-md text-2xl bg-red-400 hover:bg-white hover:text-red-400 text-white font-bold border-[2px] border-red-400"
                          >
                            Reprovar chicote
                          </button>
                          <button
                            onClick={() => {
                              startTeste();
                            }}
                            className="w-[150px] h-[80px] rounded-md text-2xl bg-red-400 hover:bg-white hover:text-red-400 text-white font-bold border-[2px] border-red-400"
                          >
                            Testar
                          </button>
                          <button
                            onClick={() => {
                              fetchTesteAtualGIGA();
                            }}
                            className="w-[150px] h-[80px] rounded-md text-2xl bg-green-400 hover:bg-white hover:text-green-400 text-white font-bold border-[2px] border-green-400"
                          >
                            Teste de pontos
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col w-full h-2/4 gap-8">
                      <div className="flex flex-col w-full h-full justify-center items-center bg-slate-200">
                        <div className="flex w-full h-full bg-white">
                          <div className="flex w-1/2 h-full justify-center items-center border-[1px] border-slate-400 rounded-md">
                            <h1>Imagem do conector</h1>
                          </div>
                          <div className="flex w-1/2 h-full justify-center items-center border-[1px] border-slate-400 rounded-md">
                            <h1>Imagem do conector</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                    {aprovado == true && (
                      <div className="flex flex-col items-center justify-center absolute w-full h-full bg-green-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl">
                        <CheckCircle size={300} className="text-white" />
                        <h1 className="text-white text-9xl">Cabo Aprovado</h1>
                      </div>
                    )}
                    {reprovado == true && (
                      <div className="flex flex-col items-center justify-center absolute w-full h-full bg-red-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl">
                        <WarningCircle size={300} className="text-white" />
                        <h1 className="text-white text-9xl">Cabo Reprovado</h1>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {testePontos && (
        <div className="flex absolute bg-slate-500 w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl opacity-50"></div>
      )}
      {testePontos && (
        <div className="flex flex-col absolute bg-white w-4/6 h-4/6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl py-3 px-5">
          <div className="flex w-full h-auto">
            <h1 className="text-5xl font-semibold ">Teste de Pontos</h1>
            <X
              size={50}
              weight="bold"
              className="ml-auto text-black bg-slate-300 rounded-md hover:bg-slate-600 hover:text-white"
              onClick={() => {
                setTestePontos(false);
              }}
            />
          </div>

          <div className="flex flex-co py-5">
            <div className="progress-container1">
              <div className="progress" style={{ width: `${progress1}%` }}>
                {progress1 === 0 && "Aguardando Teste"}
                {progress1 === 100 && "Teste Concluído"}
                {progress1 !== 0 && progress1 !== 100}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
