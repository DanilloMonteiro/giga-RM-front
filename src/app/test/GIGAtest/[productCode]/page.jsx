'use client'

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import TestServices from "../../../../../services/test";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FunctionServices from "../../../../../services/function";

const socket = io("http://localhost:3003");

export default function Home({ params }) {
  const router = useRouter();

  const [isTestOk, setTestOk] = useState("Testando");
  const [board, setboard] = useState("");
  const [cooldownButton, setCooldownButton] = useState(false);

  const [reprove, setReprove] = useState(0);
  const [aprove, setAprove] = useState(0);
  const [test, setTest] = useState([]);
  const [maxItens, setMaxItens] = useState(0);
  const [time, setTime] = useState(new Date());
  const [primeiro, setPrimeiro] = useState(false);

  //screen
  const [dialogTestPoints, setDialogTestPoints] = useState(false);
  const [screenReprove, setScreenReprove] = useState(false);
  const [screenAprove, setScreenAprove] = useState(false);

  const [testeCopia, setTestCopia] = useState([])

  let test1 = [];

  const formatCurrentDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  async function stopTest() {
    try {
      await TestServices.stop();
    } catch (error) {
      console.error("Erro ao iniciar teste:", error);
    }
  }

  async function fetchTest(testCode, re, update) {
    try {
      const response = await TestServices.find(
        params.productCode,
        re,
        2
      );

      console.log(response.data.status);

      if (response.data.status === "ok" || response.data.status === "find") {
        test1 = [response.data.teste];

        setTestCopia(...[test1])
        setTest(...[test1]);

        setMaxItens(test1[0].outputs.length);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do teste:", error);
    }
  }

  const incrementReprovados = () => {
    setReprove(reprove + 1);
  };

  const incrementAprovados = () => {
    setAprove(aprove + 1);
  };

  async function Reprovar() {
    try {
      incrementReprovados();

      await FunctionServices.reprove(test[0]._id);

      setScreenReprove(true);
    } catch (error) {
      console.error("Erro ao iniciar teste:", error);
      // Define carregado como false em caso de erro
    }
  }

  async function Aprovar() {
    try {
      // incrementAprovados();

      setTest(...[testeCopia]);

      const rerer = await FunctionServices.aprove(test[0]._id);

      setScreenAprove(true);

       setTimeout(() => {
        setScreenAprove(false);
        Reiniciar();
       }, 3000);
    } catch (error) {
      console.error("Erro ao iniciar teste:", error);
      // Define carregado como false em caso de erro
    }
  }

  async function Reiniciar() {
    await FunctionServices.stop();
    router.push(`/test`);
    setCooldownButton(true);
    setTimeout(function () {
      setCooldownButton(false);
    }, 3000);
  }

  const proximoLaco = () => {
    setTest((prevTeste) => {
      const newTeste = { ...prevTeste[0] }; // Clone o objeto teste[0]

      // Use o método filter para criar novos arrays que excluem o elemento específico
      newTeste.outputs = newTeste.outputs.filter((element, i) => i !== 0);
      newTeste.outputs_desc = newTeste.outputs_desc.filter(
        (element, i) => i !== 0
      );
      newTeste.outputs_c = newTeste.outputs_c.filter((element, i) => i !== 0);
      newTeste.inputs = newTeste.inputs.filter((element, i) => i !== 0);
      newTeste.inputs_desc = newTeste.inputs_desc.filter(
        (element, i) => i !== 0
      );
      newTeste.inputs_c = newTeste.inputs_c.filter((element, i) => i !== 0);
      return [newTeste];
    });
  };

  const progress =
    test.length === 0
      ? 100
      : ((maxItens - test[0].outputs.length) / maxItens) * 100; // Defina MAX_ITEMS como o tamanho máximo do array

  function TestFunction(data) {
    //console.log(data);
    if (test != []) {
      if (data[0] == 0) {
        // for (let i = 1; i < data.length; i++) {
        const indexTira = test[0].inputs.indexOf(parseInt(data[1]));
        const indexTira1 = test[0].outputs.indexOf(parseInt(data[2]));
        console.log(indexTira, indexTira1);
        if (indexTira != -1) {
          setTest((prevTest) => {
            const newTest = { ...prevTest[0] }; // Clone o objeto teste[0]

            // Use o método filter para criar novos arrays que excluem o elemento específico
            newTest.outputs = newTest.outputs.filter(
              (element, i) => i !== indexTira1
            );
            newTest.outputs_desc = newTest.outputs_desc.filter(
              (element, i) => i !== indexTira1
            );
            newTest.outputs_c = newTest.outputs_c.filter(
              (element, i) => i !== indexTira1
            );
            newTest.inputs = newTest.inputs.filter(
              (element, i) => i !== indexTira
            );
            newTest.inputs_desc = newTest.inputs_desc.filter(
              (element, i) => i !== indexTira
            );
            newTest.inputs_c = newTest.inputs_c.filter(
              (element, i) => i !== indexTira
            );

            console.log(newTest);
            return [newTest];
          });
        } else {
          // Atualize o estado do 'teste' usando setTest
          return;
        }
        // }
      } else if (data[0] == 1) {
        let datatama = data.length;
        setTest((prevTeste) => {
          const newTest = { ...prevTeste[0] }; // Clone o objeto teste[0]
          const objetoEncontrado = newTest.inputs.indexOf(data[datatama - 2]);
          if (objetoEncontrado != -1) {
            newTest.outputs_desc[objetoEncontrado].error = data[datatama - 1];

            return [newTest];
          } else {
            return [newTest];
          }
        });
      } else if (data[0] == 2) {
        // limpa a tela cabo desconectado
        let datatama = data.length;
        setTest((prevTeste) => {
          const newTest = { ...prevTeste[0] }; // Clone o objeto teste[0]
          const objetoEncontrado = newTest.inputs.indexOf(data[1]);

          if (objetoEncontrado != -1) {
            newTest.outputs_desc[objetoEncontrado].error = "";
            return [newTest];
          } else {
            return [newTest];
          }
        });
      } else if (data[0] == 3) {
        // testeGIGA
        let datatama = data.length;
        setTest((prevTeste) => {
          const newTest = { ...prevTeste[0] }; // Clone o objeto teste[0]
          const objetoEncontrado = newTest.inputs.indexOf(data[2]);

          if (objetoEncontrado != -1) {
            newTest.outputs_desc[objetoEncontrado].error = "";
            return [newTest];
          } else {
            return [newTest];
          }
        });
      } else if (data[0] == 7) {
        setboard((prevTeste) => {
          let newTest = prevTeste; // Clone o objeto teste[0]

          newTest = data[1];

          return newTest;
        });

        // setLED((prevTeste) => {
        //   let newTest = prevTeste; // Clone o objeto teste[0]

        //   newTest = data[2];

        //   return newTest;
        // });
      } else if (data[0] == 9) {
        console.log(data);
        setPrimeiro((prevTeste) => {
          let newTeste = prevTeste; // Clone o objeto teste[0]

          newTeste = true;

          return newTeste;
        });
      } else if (data[0] == 10) {
        Reiniciar();
        setScreenReprove(false);
      }
    } else {
    }
  }

  useEffect(() => {
    socket.on("modificacao", (data) => {
      TestFunction(data);
    });

    return () => {
      socket.off("modificacao");
    };
  }, [test]);

  useEffect(() => {
    stopTest();
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000); // Atualizar a cada segundo (1000 ms)

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    fetchTest();
  }, []);

  return (
    <div className="flex w-full h-full">
      <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
        <div className="flex static w-[97vw] h-[94vh] gap-10 bg-white rounded-xl drop-shadow-lg p-7">
          {test.map((t, testIndex) => (
            <div
              key={testIndex}
              className="flex flex-col w-full h-full justify-start items-start bg-slate-200"
            >
              <div className="flex flex-row w-full h-2/4 mr-10 gap-5 bg-white">
                <div className="flex flex-col w-full h-full bg-slate-400 gap-2 p-2 rounded-2xl ">
                  <div className="flex flex-col w-full h-auto gap-4 mb-2">
                    <div className="flex flex-row text-2xl font-bold bg-slate-300 rounded-lg p-2 gap-16 items-center">
                      <span>Teste: {t.product_code}</span>
                      <span>Dia: {formatCurrentDate(time)}</span>
                      <span>Horário: {time.toLocaleTimeString()}</span>
                      <div className="flex ml-auto gap-3 mr-2">
                        <span className="text-xl ">
                          Status: {isTestOk} {board}
                        </span>
                        <div
                          className={`w-[30px] h-[30px] rounded-full border-[1px] border-slate-700 ${
                            isTestOk == "Testando" ? "piscar bg-green-400" : ""
                          } ${
                            isTestOk == "Parado" ? "piscar1 bg-red-400" : ""
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex w-full justify-center text-lg font-semibold">
                      {progress === 0 && "Aguardando Teste"}
                      {progress === 100 && "Teste Concluído" && Aprovar()}
                      {progress !== 0 &&
                        progress !== 100 &&
                        `${progress.toFixed(2)}%`}
                    </div>
                    <div className="flex progress-container">
                      <div
                        className="progress"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {
                    <div className="flex w-full overflow-y-auto max-h-full">
                      <div className="flex flex-col w-full" key={testIndex}>
                        <h3>CP: {t.product_code}</h3>
                        <div className="flex flex-col w-full">
                          <div className="grid grid-cols-6">
                            <div className="col-span-2">Saídas: </div>
                            <div className="col-span-2">Entradas:</div>
                            <div className="col-span-2">Error: </div>
                          </div>
                          {t.outputs_desc.map((d, innerDescIndex) => (
                            <div
                              key={innerDescIndex}
                              className={`grid grid-cols-6 ${
                                innerDescIndex % 2 === 0
                                  ? "bg-slate-2 00"
                                  : "bg-slate-300"
                              } ${
                                primeiro == true && innerDescIndex == 0
                                  ? "bg-orange-300 text-2xl font-bold"
                                  : " "
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
                    </div>
                  }
                </div>
                <div className="flex flex-col w-1/5">
                  <div className="flex w-full h-[60px] bg-green-400 items-center p-3 gap-2 rounded-lg ">
                    <label className="text-3xl font-semibold md:text-lg">
                      Chicotes aprovado:
                    </label>
                    <label className="w-[90px] h-[40px] text-3xl text-center bg-slate-100 rounded-lg pt-2 md:w-[50px] md:text-lg">
                      {aprove}
                    </label>
                  </div>
                  <div className="flex w-full h-[60px] bg-red-400 items-center p-3 gap-2 rounded-lg mt-2">
                    <label className="text-3xl font-semibold md:text-lg">
                      Chicotes reprovado:
                    </label>
                    <label className="w-[90px] h-[40px] text-3xl text-center bg-slate-100 rounded-lg pt-2 md:w-[50px] md:text-lg">
                      {reprove}
                    </label>
                  </div>
                  <div className="flex flex-col py-2 mt-auto gap-2 items-center bg-slate-400 rounded-xl">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          Reprovar();
                        }}
                        className="w-[150px] h-[80px] sm:w-[80px] sm:text-sm rounded-md text-2xl bg-red-400 hover:bg-white hover:text-red-400 text-white font-bold border-[2px] border-red-400"
                      >
                        Reprovar chicote
                      </button>

                      <button
                        onClick={() => {
                          Reiniciar();
                        }}
                        className={`w-[150px] h-[80px] sm:w-[80px] sm:text-sm rounded-md text-2xl  font-bold border-[2px] ${
                          cooldownButton == true
                            ? "bg-slate-500 border-slate-500 text-white"
                            : " bg-blue-400 hover:bg-white hover:text-blue-400 text-white border-blue-400 "
                        }`}
                        disabled={cooldownButton}
                      >
                        Setup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full h-2/4 gap-8">
                <div className="flex flex-col w-full h-full justify-center items-center bg-slate-200">
                  <div className="flex w-full h-full bg-white">
                    <div className="flex w-1/2 h-full justify-center items-center border-[1px] border-slate-400 rounded-md">
                      {test[0].outputs_c[0]?.c_src && primeiro == true && (
                        <>
                          <div className="h-full bg-orange-300 px-2 pb-1">
                            <div className="flex w-full h-auto justify-center text-center text-3xl font-bold">
                              {`${test[0].outputs_c[0].c_name}`}
                            </div>
                            <Image
                              src={`/default/${test[0].outputs_c[0].c_src}`}
                              width={290}
                              height={290}
                              alt="Picture of the author"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex w-1/2 h-full justify-center items-center border-[1px] border-slate-400 rounded-md">
                      {test[0].inputs_c[0]?.c_src && primeiro == true && (
                        <div className="h-full bg-orange-300 px-2 pb-1">
                          <div className="flex w-full h-auto justify-center text-center text-3xl font-bold">
                            {`${test[0].inputs_c[0].c_name}`}
                          </div>
                          <Image
                            src={`/default/${test[0].inputs_c[0].c_src}`}
                            width={290}
                            height={290}
                            alt="Picture of the author"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {screenAprove == true && (
                <div className="flex flex-col items-center justify-center z-20 absolute w-full h-full bg-green-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl">
                  <CheckCircle size={300} className="text-white" />
                  <h1 className="text-white text-9xl">Chicote Aprovado</h1>
                </div>
              )}
              {screenReprove == true && (
                <div className="flex flex-col items-center justify-center z-20 absolute w-full h-full bg-red-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl">
                  <WarningCircle size={300} className="text-white" />
                  <h1 className="text-white text-9xl">Chicote Reprovado</h1>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {dialogTestPoints && (
        <div className="flex absolute bg-slate-500 w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl opacity-50"></div>
      )}
      {dialogTestPoints && (
        <div className="flex flex-col absolute bg-white w-4/6 h-4/6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl py-3 px-5">
          <div className="flex w-full h-auto">
            <h1 className="text-5xl font-semibold ">Teste de Pontos</h1>
            <X
              size={50}
              weight="bold"
              className="ml-auto text-black bg-slate-300 rounded-md hover:bg-slate-600 hover:text-white"
              onClick={() => {
                setDialogTestPoints(false);
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
