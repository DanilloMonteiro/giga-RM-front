"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Api from "../../../../../../services/api";
import GigaServices from "../../../../../../services/giga";
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
    const response = await GigaServices.findById("658dd6f47564a75d552f7cf3");

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
                <div className="flex flex-col gap-3 w-full h-[83vh] bg-slate-200 rounded-md px-3 py-2"></div>
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
