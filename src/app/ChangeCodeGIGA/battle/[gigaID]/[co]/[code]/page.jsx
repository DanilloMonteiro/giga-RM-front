"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { io } from "socket.io-client";
import Api from "../../../../../../../services/api";
import GigaServices from "../../../../../../../services/giga";
import FunctionServices from "../../../../../../../services/function";
import { X } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SyncLoader } from "react-spinners";

const socket = io("http://localhost:3003");

export default function Page({ params }) {
  const router = useRouter();

  const [addFieldScreen, setAddFieldScreen] = useState(false);
  const [pointType, setPointType] = useState("");
  const [giga, setGiga] = useState([]);
  const [index, setIndex] = useState();
  const [points, setPoints] = useState([]);
  const [looding, setLooding] = useState(true);

  async function fetchGIGA() {
    const response = await GigaServices.findById(params.gigaID);
    await FunctionServices.holderTest(params.code, params.gigaID);

    if (response.statusText === "OK") {
      const giga = [response.data];
      console.log(giga[0]);
      setGiga(giga[0]);

      const index = giga[0].holder.findIndex(
        (objeto) => objeto.name === params.co
      );

      console.log(giga[0].holder[330].points);
      setIndex(index);
      setPoints(giga[0].holder[330].points);
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

  const Presence = (text) => {
    if (
      text.startsWith("TRAVA") ||
      text.startsWith("ESTANQUEIDADE") ||
      text.startsWith("GENERICO")
    ) {
      return true;
    }

    return false;
  };

  function TesteFunction(data) {
    console.log(data);
    if (points != []) {
      if (data[0] == 1) {
        setPoints((prevTeste) => {
          let newTeste = { ...prevTeste };

          newTeste[data[1]].status = "in";

          return newTeste;
        });
      } else if (data[0] == 2) {
        setPoints((prevTeste) => {
          let newTeste = { ...prevTeste };

          newTeste[data[1]].status = "out";

          return newTeste;
        });
      }
    }
  }

  useEffect(() => {
    socket.on("modificacao", (data) => {
      TesteFunction(data);
    });

    return () => {
      socket.off("modificacao");
    };
  }, []);

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
                <h1 className="text-3xl font-semibold">{`Teste de holder`}</h1>
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
                <div className="flex flex-col w-full h-[83vh] bg-slate-200 rounded-md px-3 py-2">
                  {points?.map((p, pindex) => (
                    <>
                      <div
                        className={`flex w-1/2 justify-between ${
                          pindex % 2 ? "bg-slate-300" : "bg-white"
                        }`}
                      >
                        <div className="flex flex-row gap-1">
                          <p>{p.type}</p>
                          <p>{p.type_number}</p>
                        </div>

                        <div
                          className={`flex flex-row w-[20%] px-3 justify-between ${
                            p.status == "" || undefined ? "bg-red-300" : ""
                          }`}
                        >
                          {Presence(p.type) === true && (
                            <>
                              <p>{p.number[1]}</p>
                            </>
                          )}
                          {Presence(p.type) === false && (
                            <>
                              <p>{0}</p>
                            </>
                          )}
                          <p>{p.number[0]}</p>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
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
