"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import TesteServices from "../../../services/teste";
import Image from "next/image";

const socket = io("http://localhost:3001");

export default function Home() {
  const [search, setSearch] = useState("");
  const [teste, setTeste] = useState([]);
  const [maxItens, setMaxItens] = useState(7);
  const [carregado, setCarregado] = useState(false);
  const [time, setTime] = useState(new Date());

  let teste1 = [];
  let teste2 = [];

  const handleChangeTeste = (teste) => {
    setSearch(teste);
  };

  const formatCurrentDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  async function fetchTesteAtual(testeCode) {
    try {
      const response = await TesteServices.find(testeCode);
      if (response.data.status === "ok") {
        teste1 = [response.data.teste];
        setTeste(...[teste1]);

        setCarregado(true); // Define carregado como true para exibir os dados
      } else {
        setCarregado(false); // Define carregado como false em caso de erro
      }
    } catch (error) {
      console.error("Erro ao buscar dados do teste:", error);
      setCarregado(false); // Define carregado como false em caso de erro
    }
    console.log(teste1, teste2);
  }
  const progress =
    teste.length === 0
      ? 100
      : ((maxItens - teste[0].outputs.length) / maxItens) * 100; // Defina MAX_ITEMS como o tamanho máximo do array

  function TesteFunction(data) {
    console.log(data);
    if (data[0] == 1) {
      let datatama = data.length;
      setTeste((prevTeste) => {
        const newTeste = { ...prevTeste[0] }; // Clone o objeto teste[0]
        const objetoEncontrado = newTeste.outputs.indexOf(data[datatama - 2]);
        if (objetoEncontrado != -1) {
          console.log(objetoEncontrado, newTeste, data);
          newTeste.outputs_desc[objetoEncontrado].error = data[datatama - 1];
          return [newTeste];
        } else {
          return [newTeste];
        }
      });
    } else if (data[0] == 0) {
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
    } else if (data[0] == 2) {
      let datatama = data.length;
      setTeste((prevTeste) => {
        const newTeste = { ...prevTeste[0] }; // Clone o objeto teste[0]
        const objetoEncontrado = newTeste.outputs.indexOf(data[1]);
        console.log(objetoEncontrado, newTeste, data);

        if (objetoEncontrado != -1) {
          newTeste.outputs_desc[objetoEncontrado].error = "";
          return [newTeste];
        } else {
          return [newTeste];
        }
      });
    } else if (data[0] == 4) {
      console.log("data0 e 4");
      let datatama = data.length;
      setTeste((prevTeste) => {
        const newTeste = { ...prevTeste[0] }; // Clone o objeto teste[0]
        const objetoEncontrado = newTeste.inputs.indexOf(data[datatama - 2]);
        console.log("objeto encontrado index", objetoEncontrado);
        if (objetoEncontrado != -1) {
          console.log(objetoEncontrado, newTeste, data);
          newTeste.outputs_desc[objetoEncontrado].error = data[datatama - 1];
          return [newTeste];
        } else {
          return [newTeste];
        }
      });
    } else if (data[0] == 3) {
      let datatama = data.length;
      setTeste((prevTeste) => {
        const newTeste = { ...prevTeste[0] }; // Clone o objeto teste[0]
        const objetoEncontrado = newTeste.inputs.indexOf(data[2]);
        console.log(objetoEncontrado, newTeste, data);
        if (objetoEncontrado != -1) {
          console.log(objetoEncontrado, newTeste, data);
          newTeste.outputs_desc[objetoEncontrado].error = "";
          return [newTeste];
        } else {
          return [newTeste];
        }
      });
    }
  }

  // const fetchDados = async () => {
  //   const response = await TesteServices.find(testes);
  //   if (response.data.status == "ok") {
  //     teste1 = response.data.teste;
  //     console.log(teste1, "auqi test1");
  //     setTestes([teste1]);
  //   } else {
  //     setTestes([]);
  //     console.log("aqui dados2");
  //   }
  // };

  useEffect(() => {
    socket.on("modificacao", (data) => {
      console.log(".");
      TesteFunction(data);
    });

    return () => {
      socket.off("modificacao");
    };
  }, [teste]);

  useEffect(() => {
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
        <div className="flex w-[90vw] h-[90vh] gap-10 bg-white rounded-xl drop-shadow-lg p-7">
          {carregado === false && (
            <>
              <div className="flex flex-col w-full  h-full bg-white items-center rounded-md">
                <Image
                  src="/1529355861725-removebg-preview.png" // Caminho para a imagem na pasta "public"
                  alt="Minha Imagem" // Texto alternativo para acessibilidade
                  width={300} // Largura da imagem (ajuste conforme necessário)
                  height={300} // Altura da imagem (ajuste conforme necessário)
                />
                <div className="flex flex-col w-[600px] gap-10 bg-slate-300 px-20 pb-20">
                  <div className="flex items-center mt-10 justify-between">
                    <label className="flex bg-slate-400 text-white font-semibold w-[200px] h-[40px] border-[2px] justify-center items-center  border-slate-400 rounded-sm">
                      RE:
                    </label>
                    <input
                      className="border-[1px] rounded-sm p-2"
                      placeholder="Digite o RE"
                      onChange={(e) => handleChangeTeste(e.target.value)}
                    ></input>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => fetchTesteAtual(search)}
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

                  <div className="flexjustify-start">
                    <button className="bg-blue-400 text-white font-semibold w-[200px] h-[70px] rounded-sm border-[2px] border-blue-400 hover:text-blue-400 hover:bg-white">
                      Continuar com teste anterior
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {carregado == true && (
            <>
              <div className="flex flex-col w-4/6 h-full">
                <div className="flex flex-col w-full h-full bg-slate-400 gap-2 pt-10 p-2 rounded-2xl">
                  <div className="flex flex-col w-full h-auto gap-4 mb-4">
                    <h1 className="text-5xl font-bold bg-slate-300 rounded-lg p-2">
                      Teste: GIGA
                    </h1>
                    <div className="flex ml-auto w-full h-full bg-slate-300 rounded-lg items-center justify-around p-1">
                      <span className="text-2xl">
                        Dia: {formatCurrentDate(time)}{" "}
                      </span>
                      <span className="text-2xl">
                        Horário: {time.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="progress-container">
                    <div className="progress" style={{ width: `${progress}%` }}>
                      {progress === 0 && "Aguardando Teste"}
                      {progress === 100 && "Teste Concluído"}
                      {progress !== 0 &&
                        progress !== 100 &&
                        `${progress.toFixed(2)}%`}
                    </div>
                  </div>
                  {carregado === true && (
                    <div className="flex w-full overflow-y-auto max-h-full">
                      {teste[0].product_code === search ? (
                        teste.map((t, testIndex) => (
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
                      {}
                    </div>
                  )}
                  <div className="flex mt-auto gap-10">
                    <button
                      onClick={() => {
                        TesteFunction([0, 1, 1, 25]);
                      }}
                      className="w-[150px] h-[80px] rounded-md text-2xl bg-red-400 hover:bg-white hover:text-red-400 text-white font-bold border-[2px] border-red-400"
                    >
                      Reprovar chicote
                    </button>
                    <button className="w-[150px] h-[80px] rounded-md text-2xl bg-red-400 hover:bg-white hover:text-red-400 text-white font-bold border-[2px] border-red-400">
                      Testar
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-2/6 h-full gap-8">
                <div className="flex w-full h-[120px] bg-green-400 items-center p-3 gap-2 rounded-lg">
                  <label className="text-3xl font-semibold md:text-lg">
                    Chicotes Aprovados:
                  </label>
                  <input
                    className="w-[90px] h-[60px] text-3xl text-center rounded-lg p-5 md:w-[50px] md:text-lg"
                    placeholder="0"
                  ></input>
                </div>
                <div className="flex w-full h-[120px] bg-red-400 items-center p-3 gap-2 rounded-lg">
                  <label className="text-3xl font-semibold md:text-lg">
                    Chicotes Reprovados:
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
