"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import TestServices from "../../../../../services/test";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GigaServices from "../../../../../services/giga";

const socket = io("http://localhost:3001");

export default function Home({ params }) {
  const router = useRouter();
  const numLinhas = 7;

  const tabela = [];

  const letras = ["A", "B", "C", "D", "E", "F", "G"];
  const numColunas = 116;

  const [teste, setTeste] = useState([]);
  const [testeCopia, setTesteCopia] = useState([]);
  const [maxItens, setMaxItens] = useState(0);
  const [carregado, setCarregado] = useState(false);
  const [time, setTime] = useState(new Date());

  const [batalhaScreen, setBatalhaScreen] = useState(false);
  const [testeScreen, setTesteScreen] = useState(false);

  const [LED, setLED] = useState("");
  const [ENCLAVE, setENCLAVE] = useState("");

  const [testeGIGA, setTesteGIGA] = useState([]);
  const [testeGIGACopia, setTesteGIGACopia] = useState([]);
  const [maxItensGIGA, setMaxItensGIGA] = useState(256);

  const [GIGA3, setGIGA3] = useState([]);

  const [batalha, setBatalha] = useState([]);

  const [coordenadas, setCoordenadas] = useState([]);
  const [images, setImages] = useState([]);
  const [images1, setImages1] = useState([]);
  const [laco, setLaco] = useState([]);
  const [coord, setCoord] = useState([]);
  const [bataIndex, setBataIndex] = useState([]);

  let teste1 = [];
  let giga1 = [];

  async function fetchTesteAtual(testeCode, re, update) {
    try {
      const response1 = await GigaServices.findById("656722d4d2ae53265fbfeef4");
      const response = await TestServices.find(params.productCode, re, update);

      if (response.statusText === "OK") {
        giga1 = [response1.data.giga];
        teste1 = [response.data.teste];
        setTeste(...[teste1]);

        let coor = [];

        for (let i = 0; i < teste1[0].outputs_c.length; i++) {
          coor.push(teste1[0].outputs_c[i].c_name);
          coor.push(teste1[0].inputs_c[i].c_name);
        }

        setCoordenadas(coor);

        for (let i = 0, n = 0; i < letras.length; i++, n + 116) {
          const letra = letras[i];

          for (let j = 1; j <= numColunas; j++) {
            const coordenada = `${letra}${j}`;
            tabela.push({
              co: coordenada,
              x: letra,
              y: j.toString(),
              status: null,
              c_src: giga1[0]?.c_src[n + j - 1],
            });
          }
        }

        carregarBatalha(tabela, coor, giga1);

        let images = [];
        let laco = [];
        let coord = [];
        let index11 = [];

        for (let i = 0; i < teste1[0].outputs_c.length; i++) {
          laco.push(`Saída ${teste1[0].outputs[i]}`);
          coord.push(teste1[0].outputs_c[i].c_name);
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

        setBataIndex(index11);
        setCoord(coord);
        setLaco(laco);
        setImages(images);

        setBatalha(tabela);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do teste:", error);
    }
  }

  async function concluirBatalha() {
    router.push(`/test/GIGAtest/${teste[0].product_code}`);
  }

  function TesteFunction(data) {
    console.log(data);
    if (teste != []) {
      if (data[0] == 4) {
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
      } else if (data[0] == 6) {
        setENCLAVE((prevTeste) => {
          let newTeste = prevTeste; // Clone o objeto teste[0]

          newTeste = data[1];

          return newTeste;
        });

        setLED((prevTeste) => {
          let newTeste = prevTeste; // Clone o objeto teste[0]

          newTeste = data[2];

          return newTeste;
        });
      }
    }
  }

  const carregarBatalha = async (table, coor, giga) => {
    for (let i = 0; i < table.length; i++) {
      for (const item of coor) {
        if (table[i].co == item) {
          console.log("deu certo", table);
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
    fetchTesteAtual();
  }, []);

  return (
    <div className="flex w-full h-full">
      <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
        <div className="flex static w-[97vw] h-[94vh] gap-10 bg-white rounded-xl drop-shadow-lg p-7">
          <div className="flex flex-col w-full h-full justify-start items-start bg-slate-200">
            <div className="w-full h-2/4 bg-white">
              <div className="flex w-full h-full justify-center items-start bg-slate-200">
                <div className="w-full h-full bg-white border-[1px] border-slate-400 rounded-md">
                  <table className="tabela w-full h-full border-collapse">
                    <thead className="flex w-full">
                      <tr className="flex w-full">
                        <th className="flex w-[30px] h-[35x] border-[1px] border-slate-400 bg-slate-300 text-center"></th>
                        {Array.from({ length: numColunas }).map(
                          (_, colIndex) => (
                            <th
                              className="flex flex-col w-auto h-[35px] border-[1px] border-slate-400 bg-slate-300 text-center sm:text-[4px]"
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
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="flex-col h-full">
                      {Array.from({ length: 7 }).map((_, rowIndex) => (
                        <tr className="flex h-auto" key={rowIndex}>
                          <td
                            className={`flex w-[30px] h-[33px] border-[1px] border-slate-400 bg-slate-300 justify-center items-center font-bold`}
                          >
                            {letras[rowIndex]}
                          </td>
                          {batalha
                            .slice(rowIndex * 116, (rowIndex + 1) * 116)
                            .map((item, itemIndex) => (
                              <td
                                className={`flex w-[30px] h-auto border-[1px] border-slate-400 justify-center items-center ${
                                  item.status == null ? "bg-white" : ""
                                }${item.status == false ? "bg-green-300" : ""}${
                                  item.status == true ? "bg-red-300" : ""
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
                {batalha.map((i, index) => (
                  <>
                    <div
                      className={`flex min-w-[230px] h-full flex-col text-center ${
                        i.status == false || i.status == null
                          ? "hidden"
                          : "flex"
                      } bg-slate-200 border-[2px] rounded-lg border-slate-600`}
                    >
                      <span className="flex justify-center my-4">
                        Modulo {i.co} {`${i.status}`}
                      </span>
                      <Image
                        src={`/${i.c_src}`}
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
