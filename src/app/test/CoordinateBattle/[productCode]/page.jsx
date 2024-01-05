"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import TestServices from "../../../../../services/test";
import FunctionServices from "../../../../../services/function";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GigaServices from "../../../../../services/giga";

const socket = io("http://localhost:3003");

export default function Home({ params }) {
  const router = useRouter();
  const numLinhas = 7;

  const [teste, setTeste] = useState([]);
  const [giga, setGiga] = useState([]);

  const letras = ["A", "B", "C", "D", "E", "F", "G"];
  const numColunas = 116;

  const [batalha, setBatalha] = useState([]);

  async function fetchTest(testeCode, re, update) {
    try {
      const responseGiga = await GigaServices.findById(
        "658dd6f47564a75d552f7cf3"
      );
      const responseTest = await TestServices.find(
        params.productCode,
        re,
        update,
        1
      );

      if (
        responseTest.statusText === "OK" &&
        responseGiga.statusText === "OK"
      ) {
        let giga = [responseGiga.data];
        let teste = [responseTest.data.teste];

        setTeste(...teste);

        let connectors = [];

        for (let i = 0; i < teste[0].outputs.length; i++) {
          if (
            teste[0].outputs_c[i].c_name !== "" &&
            teste[0].outputs_c[i].c_name !== "empty"
          ) {
            if (connectors.includes(teste[0].outputs_c[i].c_name)) {
            } else {
              connectors.push(teste[0].outputs_c[i].c_name);
            }
          }
        }

        for (let i = 0; i < teste[0].inputs.length; i++) {
          if (
            teste[0].inputs_c[i].c_name !== "" &&
            teste[0].inputs_c[i].c_name !== "empty"
          ) {
            if (connectors.includes(teste[0].inputs_c[i].c_name)) {
            } else {
              connectors.push(teste[0].inputs_c[i].c_name);
            }
          }
        }

        console.log("aquii", connectors);

        for (let i = 0; i < giga[0].holder.length; i++) {
          if (connectors.includes(giga[0].holder[i].name)) {
            console.log("deu certo");

            giga[0].holder[i].status = "out";
          }
        }

        setGiga(...giga);
        console.log(giga);
      }
    } catch (error) {}
  }

  async function concluirBatalha() {
    await FunctionServices.switch();
    setTimeout(function () {
      router.push(`/test/GIGAtest/${teste.product_code}`);
    }, 1000);
  }

  function TesteFunction(data) {
    console.log(data);
    if (giga != [] && teste != []) {
      if (data[0] == 4) {
        for (let i = 0; i < giga.holder.length; i++) {
          if (giga.holder[i].name == data[2]) {
            console.log("in");
            setGiga((prevTeste) => {
              const newTeste = { ...prevTeste };

              console.log(newTeste);

              newTeste.holder[i].status = "in";

              console.log(newTeste.holder[i]);

              return newTeste;
            });
          }
        }
      } else if (data[0] == 5) {
        for (let i = 0; i < giga.holder.length; i++) {
          for (let j = 2; j < data.length; j++) {
            if (giga.holder[i].name == data[j]) {
              console.log("out");
              setGiga((prevTeste) => {
                const newTeste = { ...prevTeste };

                newTeste.holder[i].status = "in";

                return newTeste;
              });
            }
          }
        }
      } else if (data[0] == 6) {
        setENCLAVE((prevTeste) => {
          let newTeste = prevTeste;

          newTeste = data[1];

          return newTeste;
        });

        setLED((prevTeste) => {
          let newTeste = prevTeste;

          newTeste = data[2];

          return newTeste;
        });
      }
    }
  }

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
    fetchTest();
  }, []);

  return (
    <div className="flex w-full h-full">
      <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
        <div className="flex static w-[97vw] h-[94vh] gap-10 bg-white rounded-xl drop-shadow-lg p-2">
          <div className="flex flex-col w-full h-full justify-start items-start bg-slate-200">
            <div className="flex w-full h-2/4 bg-white">
              <table className="flex-col w-full h-full border-collapse ">
                <thead className="flex w-full h-full">
                  <tr className="flex w-full h-full ">
                    <th className="flex w-[30px] h-[35x] border-[1px] border-slate-400 bg-slate-300 text-center"></th>
                    {Array.from({ length: numColunas }).map((_, colIndex) => (
                      <th
                        className="flex flex-col w-auto h-[35px] border-[1px] border-slate-400 bg-slate-300 text-center sm:text-[5px]"
                        key={colIndex + 1}
                        style={{
                          flex: "1",
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                          transform: "rotate(180deg)",
                        }}
                      >
                        {colIndex + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="flex-col w-full h-full">
                  {Array.from({ length: 7 }).map((_, rowIndex) => (
                    <tr className="flex w-auto h-auto " key={rowIndex}>
                      <td
                        className={`flex w-[30px] h-[36px]  border-[1px] border-slate-400 bg-slate-300 justify-center items-center font-bold`}
                      >
                        {letras[rowIndex]}
                      </td>
                      {giga?.holder
                        ?.slice(rowIndex * 116, (rowIndex + 1) * 116)
                        .map((item, itemIndex) => (
                          <td
                            key={itemIndex}
                            style={{ flexGrow: 1, flexShrink: 1 }}
                            className={`flex w-auto h-auto flex-1 border-[1px] border-slate-400 justify-center items-center ${
                              item?.status == "" ? "bg-white" : ""
                            }${item?.status == "in" ? "bg-green-300" : ""}${
                              item?.status == "out" ? "bg-red-300" : ""
                            }`}
                          ></td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex w-full h-2/4 bg-white">
              <div className="flex w-full h-full justify-start items-center border-[1px] border-slate-400 rounded-md overflow-x-auto whitespace-nowrap">
                {giga?.holder?.map((i, index) => (
                  <>
                    <div
                      className={`flex min-w-[230px] h-full flex-col text-center ${
                        i.status == "in" || i.status == "" ? "hidden" : "flex"
                      } bg-slate-200 border-[2px] rounded-lg border-slate-600`}
                    >
                      <span className="flex justify-center my-4">
                        Modulo {i.name}
                      </span>
                      <Image
                        src={`/default/${i.battle_src}`}
                        width={1000}
                        height={500}
                        alt="Picture of the author"
                      />
                    </div>
                  </>
                ))}
                <button
                  className="bg-slate-200"
                  onClick={() => {
                    concluirBatalha();
                  }}
                >
                  Concluir batalha
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
