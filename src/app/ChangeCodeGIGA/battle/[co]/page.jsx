"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Api from "../../../../../services/api";
import GigaServices from "../../../../../services/giga";
import { X } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SyncLoader } from "react-spinners";

export default function Page({ params }) {
  const router = useRouter();

  const [fields, setFields] = useState([
    ["LED", 1, 1232],
    ["ENCLAVE", 1, 0],
    ["CIRCUITO", 1, 0],
  ]);
  const [addFieldScreen, setAddFieldScreen] = useState(false);
  const [pointType, setPointType] = useState("");
  const [giga, setGiga] = useState([]);
  const [index, setIndex] = useState();
  const [points, setPoints] = useState([]);
  const [looding, setLooding] = useState(true);

  async function fetchGIGA() {
    const response = await GigaServices.findById("658d7f2c90206835142834dd");

    if (response.statusText === "OK") {
      const giga = [response.data];
      console.log(giga[0]);
      setGiga(giga[0]);

      const index = giga[0].holder.findIndex(
        (objeto) => objeto.name === params.co
      );

      console.log(index);
      setIndex(index);
      setPoints([giga[0].holder[index].points]);
      setLooding(false);
    }
  }

  function Back() {
    router.push(`/ChangeCodeGIGA/battle`);
  }

  const handleUpload = async (event, type, idConector) => {
    const file = event.target.files[0];
    console.log("File in handleUpload:", file);

    if (file) {
      try {
        const data = new FormData();

        data.append("file", file);
        data.append("idConector", idConector);
        data.append("type", type);

        await Api.post("/uploads/giga", data).then(
          setTimeout(function () {
            fetchGIGA();
          }, 1000)
        );
      } catch (error) {
        console.error("Erro de rede:", error);
      }
    }
  };

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
          <div className="flex flex-col static w-[97vw] h-[95vh] bg-white rounded-xl drop-shadow-lg px-5 py-3">
            <div className="flex flex-col w-full gap-4 h-full">
              <div className="flex w-full h-auto">
                {giga && index >= 0 && (
                  <h1 className="text-3xl font-semibold">
                    {`Holder: ${giga?.holder[index].name}`}
                  </h1>
                )}
                <button className="bg-green-400 ml-[26%] text-white font-semibold w-auto px-5 h-auto border-[2px] border-green-400 rounded-sm hover:text-green-400 hover:bg-white">
                  Testar holder
                </button>
                <X
                  size={36}
                  weight="bold"
                  onClick={() => {
                    Back();
                  }}
                  className="ml-auto  text-red-500 bg-white rounded-md hover:bg-slate-red hover:text-white hover:bg-red-500"
                />
              </div>
              <div className="flex w-full h-full gap-2">
                <div className="flex flex-col gap-3 w-1/2 h-[83vh] bg-slate-200 rounded-md px-3 py-2">
                  <h2 className="text-2xl font-semibold">Pontos</h2>
                  <div className="flex flex-col w-full h-full gap-3 px-2 text-xl overflow-y-auto">
                    {points[0]?.map((p, gindex) => (
                      <div key={gindex} className="flex w-full h-auto">
                        {p.type_number == 0 && (
                          <label className="bg-slate-300 w-auto flex-1 px-3">{`${p.type}:`}</label>
                        )}
                        {p.type_number !== 0 && (
                          <label className="bg-slate-300 w-auto flex-1 px-3">{`${p.type} ${p.type_number}:`}</label>
                        )}
                        <input
                          className="w-[10vw] ml-auto px-3"
                          value={p.number}
                        ></input>
                        <button className="ml-2 bg-yellow-400 text-white font-semibold w-1/12 h-auto border-[2px] border-yellow-400 rounded-sm hover:text-yellow-400 hover:bg-white">
                          R
                        </button>
                        <button
                          onClick={() => {
                            removeField(gindex);
                          }}
                          className="ml-2 bg-red-400 text-white font-semibold w-1/12 h-auto border-[2px] border-red-400 rounded-sm hover:text-red-400 hover:bg-white"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      openAddFieldScreen();
                    }}
                    className="bg-blue-400 text-white font-semibold w-full h-[30px] border-[2px] border-blue-400 rounded-sm hover:text-blue-400 hover:bg-white"
                  >
                    Adicionar
                  </button>
                </div>
                <div className="flex flex-col gap-3 w-1/2 h-[83vh] bg-slate-200 rounded-md px-3 py-2">
                  <h2 className="text-2xl font-semibold">Fotos</h2>
                  <div className="flex flex-col overflow-y-auto gap-3">
                    <div className="flex flex-col w-full h-full gap-3 px-2 text-xl">
                      <label>Foto batalha:</label>
                      <div className="flex flex-col w-full h-auto p-3 bg-slate-300 justify-center items-center">
                        <input
                          type="file"
                          onChange={(e) => handleUpload(e, "battle", index)}
                        ></input>
                        {giga && index >= 0 && (
                          <Image
                            src={`/default/${giga.holder[index].battle_src}`}
                            width={300}
                            height={300}
                            alt="Sem imagem"
                          ></Image>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col w-full h-full gap-3 px-2 text-xl">
                      <label>Foto conector:</label>
                      <div className="flex flex-col w-full h-auto p-3 bg-slate-300 justify-center items-center">
                        <input
                          type="file"
                          onChange={(e) => handleUpload(e, "connector", index)}
                        ></input>
                        {giga && index >= 0 && (
                          <Image
                            src={`/default/${giga.holder[index].connector_src}`}
                            width={300}
                            height={300}
                            alt="Sem imagem"
                          ></Image>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {addFieldScreen && (
        <div className="flex absolute bg-slate-500 w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl opacity-50"></div>
      )}
      {addFieldScreen && (
        <div className="flex flex-col absolute bg-white w-4/6 h-4/6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl py-3 px-5">
          <div className="flex w-full h-auto">
            <h1 className="text-3xl font-semibold ">Adicionar ponto</h1>
            <X
              size={36}
              weight="bold"
              onClick={() => {
                openAddFieldScreen();
              }}
              className="ml-auto text-red-500 bg-white rounded-md hover:bg-slate-red hover:text-white hover:bg-red-500"
            />
          </div>
          <div className="flex flex-col w-full h-full p-3">
            <div className="flex w-full h-auto  gap-5 bg-slate-100">
              <label className="flex bg-slate-200 w-auto h-auto px-3">
                Tipo do ponto:
              </label>
              <div className="flex gap-1">
                <label>LED</label>
                <input
                  type="radio"
                  className="w-auto px-3"
                  value="LED"
                  checked={pointType === "LED"}
                  onChange={(e) => handlePointTypeChange(e)}
                ></input>
              </div>
              <div className="flex gap-1">
                <label>ENCLAVE</label>
                <input
                  type="radio"
                  className="w-auto px-3"
                  value="ENCLAVE"
                  checked={pointType === "ENCLAVE"}
                  onChange={(e) => handlePointTypeChange(e)}
                ></input>
              </div>
              <div className="flex gap-1">
                <label>CIRCUITO</label>
                <input
                  type="radio"
                  className="w-auto px-3"
                  value="CIRCUITO"
                  checked={pointType === "CIRCUITO"}
                  onChange={(e) => handlePointTypeChange(e)}
                ></input>
              </div>
              <div className="flex gap-1">
                <label>ESTANQUEIDADE</label>
                <input
                  type="radio"
                  className="w-auto px-3"
                  value="ESTANQUEIDADE"
                  checked={pointType === "ESTANQUEIDADE"}
                  onChange={(e) => handlePointTypeChange(e)}
                ></input>
              </div>
              <div className="flex gap-1">
                <label>TRAVA</label>
                <input
                  type="radio"
                  className="w-auto px-3"
                  value="TRAVA"
                  checked={pointType === "TRAVA"}
                  onChange={(e) => handlePointTypeChange(e)}
                ></input>
              </div>
              <div className="flex gap-1">
                <label>GENERICO</label>
                <input
                  type="radio"
                  className="w-auto px-3"
                  value="GENERICO"
                  checked={pointType === "GENERICO"}
                  onChange={(e) => handlePointTypeChange(e)}
                ></input>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => {
                openAddFieldScreen();
              }}
              className="bg-red-400 text-white font-semibold w-1/5 h-[30px] border-[2px] border-red-400 rounded-sm hover:text-red-400 hover:bg-white"
            >
              Cancelar
            </button>
            <button
              onClick={() => AddField(pointType)}
              className="bg-blue-400 text-white font-semibold w-1/5 h-[30px] border-[2px] border-blue-400 rounded-sm hover:text-blue-400 hover:bg-white"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}
      {addFieldScreen && (
        <div className="flex absolute bg-slate-500 w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl opacity-50"></div>
      )}
      {addFieldScreen && (
        <div className="flex flex-col absolute bg-white w-4/6 h-4/6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl py-3 px-5">
          <div className="flex w-full h-auto">
            <h1 className="text-3xl font-semibold ">Adicionar ponto</h1>
            <X
              size={36}
              weight="bold"
              onClick={() => {
                openAddFieldScreen();
              }}
              className="ml-auto text-red-500 bg-white rounded-md hover:bg-slate-red hover:text-white hover:bg-red-500"
            />
          </div>
          <div className="flex flex-col w-full h-full p-3">
            <div className="flex w-full h-auto gap-5 bg-slate-100">
              <label className="flex bg-slate-300 w-auto h-auto px-3">
                Tipo do ponto:
              </label>
              <div className="flex gap-1 bg-orange-200">
                <label>LED</label>
                <input
                  type="radio"
                  className="w-auto px-3"
                  value="LED"
                  checked={pointType === "LED"}
                  onChange={(e) => handlePointTypeChange(e)}
                ></input>
              </div>
              <div className="flex gap-1 bg-orange-200">
                <label>ENCLAVE</label>
                <input
                  type="radio"
                  className="w-auto px-3"
                  value="ENCLAVE"
                  checked={pointType === "ENCLAVE"}
                  onChange={(e) => handlePointTypeChange(e)}
                ></input>
              </div>

              <div className="flex gap-1 bg-yellow-200">
                <label>ESTANQUEIDADE</label>
                <input
                  type="radio"
                  className="w-auto px-3"
                  value="ESTANQUEIDADE"
                  checked={pointType === "ESTANQUEIDADE"}
                  onChange={(e) => handlePointTypeChange(e)}
                ></input>
              </div>
              <div className="flex gap-1 bg-yellow-200">
                <label>TRAVA</label>
                <input
                  type="radio"
                  className="w-auto px-3"
                  value="TRAVA"
                  checked={pointType === "TRAVA"}
                  onChange={(e) => handlePointTypeChange(e)}
                ></input>
              </div>
              <div className="flex gap-1 bg-yellow-200">
                <label>GENERICO</label>
                <input
                  type="radio"
                  className="w-auto px-3"
                  value="GENERICO"
                  checked={pointType === "GENERICO"}
                  onChange={(e) => handlePointTypeChange(e)}
                ></input>
              </div>
              <div className="flex gap-1 bg-green-200">
                <label>CIRCUITO</label>
                <input
                  type="radio"
                  className="w-auto px-3"
                  value="CIRCUITO"
                  checked={pointType === "CIRCUITO"}
                  onChange={(e) => handlePointTypeChange(e)}
                ></input>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => {
                openAddFieldScreen();
              }}
              className="bg-red-400 text-white font-semibold w-1/5 h-[30px] border-[2px] border-red-400 rounded-sm hover:text-red-400 hover:bg-white"
            >
              Cancelar
            </button>
            <button
              onClick={() => AddField(pointType)}
              className="bg-blue-400 text-white font-semibold w-1/5 h-[30px] border-[2px] border-blue-400 rounded-sm hover:text-blue-400 hover:bg-white"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}
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
