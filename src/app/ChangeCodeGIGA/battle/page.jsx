"use client";

import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GigaServices from "../../../../services/giga";
import { SyncLoader } from "react-spinners";

export default function Page({ params }) {
  const router = useRouter();

  const [looding, setLooding] = useState(true);
  const [fields, setFields] = useState([
    ["LED", 1, 1232],
    ["ENCLAVE", 1, 0],
    ["CIRCUITO", 1, 0],
  ]);
  const [addFieldScreen, setAddFieldScreen] = useState(false);
  const [pointType, setPointType] = useState("");
  const [giga, setGiga] = useState([]);
  const [hoveredItem, setHoveredItem] = useState([]);

  const letras = ["A", "B", "C", "D", "E", "F", "G"];
  const numColunas = 116;
  const numLinhas = 7;

  const valores = Array.from(
    { length: numLinhas * numColunas },
    (_, index) => index + 1
  );

  async function fetchGIGA() {
    const response = await GigaServices.findById("658d7f2c90206835142834dd");

    if (response.statusText === "OK") {
      const giga = [response.data];
      console.log(...giga);
      setGiga(...giga);
      setLooding(false);
    }
  }

  function openAddFieldScreen() {
    setAddFieldScreen(!addFieldScreen);
  }

  const handlePointTypeChange = (event) => {
    setPointType(event.target.value);
  };

  function removeField(index) {
    setFields((prevFields) => {
      const newFields = [...prevFields];

      newFields.splice(index);

      return newFields;
    });
  }

  function HoveredItem(name, points, battle, connector) {
    setHoveredItem([name, points, battle, connector]);
    console.log(name, points, battle, connector);
  }

  function AddField(pointType) {
    if (pointType == "") {
      return;
    }
    setFields((prevFields) => {
      const newFields = [...prevFields];

      const filteredFields = newFields.filter(
        (field) => field[0] === pointType
      );

      if (filteredFields.length == 0) {
        newFields.push([pointType, 1, 0]);
      } else {
        newFields.push([
          pointType,
          filteredFields[filteredFields.length - 1][1] + 1,
          0,
        ]);
      }

      return newFields;
    });
    openAddFieldScreen();
  }

  useEffect(() => {
    fetchGIGA();
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col w-screen h-screen bg-blue-400 justify-center items-center">
          <div className="flex flex-col static w-[98vw] h-[95vh] bg-white rounded-xl drop-shadow-lg px-5 py-3">
            <div className="flex flex-col w-full gap-4 h-full">
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
                <tbody className="flex-col h-full">
                  {Array.from({ length: 7 }).map((_, rowIndex) => (
                    <tr className="flex h-auto" key={rowIndex}>
                      <td
                        className={`flex w-[30px] h-[37px] border-[1px] border-slate-400 bg-slate-300 justify-center items-center font-bold`}
                      >
                        {letras[rowIndex]}
                      </td>
                      {giga?.holder
                        ?.slice(rowIndex * 116, (rowIndex + 1) * 116)
                        .map((item, itemIndex) => (
                          <td
                            key={itemIndex}
                            onClick={() => {
                              router.push(
                                `/ChangeCodeGIGA/battle/${item.name}`
                              );
                            }}
                            onMouseEnter={() =>
                              HoveredItem(
                                item.name,
                                item.points,
                                item.battle_src,
                                item.connector_src
                              )
                            }
                            className={`flex w-auto h-auto flex-1 border-[1px] hover:bg-slate-300 border-slate-400 justify-center items-center ${
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
            <div className="flex w-full h-full bg-blue-300 rounded-b-lg">
              <div className="flex flex-col w-2/3 h-full p-3 gap-3">
                <div className="flex w-full h-auto gap-5">
                  <div className="flex flex-col w-1/2 h-auto gap-2">
                    <div className="flex w-auto h-auto justify-between ">
                      <label className="w-1/2 flex-1 text-xl bg-slate-300  px-2 font-semibold">
                        Holder:
                      </label>
                      <input
                        className="w-1/2 px-2"
                        value={hoveredItem[0]}
                      ></input>
                    </div>
                    <div className="flex w-auto h-auto justify-between">
                      <label className="w-1/2 text-xl bg-slate-300  px-2 font-semibold">
                        Codigo:
                      </label>
                      <input className="w-1/2 px-2" value={""}></input>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex w-auto h-auto justify-between">
                      <label className="w-1/2 text-xl bg-slate-300  px-2 font-semibold">
                        Quant/ de pontos:
                      </label>
                      <input className="w-1/2 px-2" value={""}></input>
                    </div>
                    <div className="flex w-auto h-auto justify-between">
                      <label className="w-1/2 text-xl bg-slate-300  px-2 font-semibold">
                        Contagem:
                      </label>
                      <input className="w-1/2 px-2" value={""}></input>
                    </div>
                  </div>
                </div>

                <div className="flex w-full h-full gap-5">
                  <div className="flex w-full h-auto bg-orange-300 justify-center">
                    <Image
                      src={`/default/${hoveredItem[2]}`}
                      width={100}
                      height={100}
                      className="flex w-auto"
                      alt="Sem imagem"
                    ></Image>
                  </div>
                  <div className="flex w-full h-auto bg-orange-300 justify-center">
                    <Image
                      src={`/default/${hoveredItem[3]}`}
                      width={100}
                      height={100}
                      className="flex w-auto"
                      alt="Sem imagem"
                    ></Image>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-1/3 h-full p-3">
                <div className="flex flex-col w-full h-full bg-white">
                  <div className="flex w-full h-auto px-2 bg-slate-300 text-xl font-semibold">
                    <p>Pontos</p>
                  </div>
                  {hoveredItem[1]?.map((h, hindex) => (
                    <div key={hindex} className="flex flex-col w-full h-[10%]">
                      <div
                        className={`flex w-full h-auto px-2 ${
                          hindex % 2 == 0 ? "bg-white" : "bg-slate-200"
                        }`}
                      >
                        <div className="flex w-1/2 h-auto">
                          <p>
                            {h.type} {h.type_number}
                          </p>
                        </div>
                        <div className="flex w-1/2 h-auto">
                          <p>{h.number}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    router.push(`/ChangeCodeGIGA`);
                  }}
                  className="bg-red-400 text-white font-semibold w-1/4 h-[50px] border-[2px] ml-auto mt-3 border-red-400 rounded-sm hover:text-red-400 hover:bg-white"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {looding && (
        <>
          <div className="flex absolute bg-slate-500 w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
          <div className="flex flex-col gap-10 absolute w-[35%] h-[35%] justify-center items-center bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl">
            <h1 className="text-blue-500 text-4xl">Carregando...</h1>
            <SyncLoader color="#3b82f6" loading={true} size={30} />
          </div>
        </>
      )}
    </div>
  );
}
