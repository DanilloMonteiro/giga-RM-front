"use client";

import { useEffect, useState } from "react";
import TestServices from "../../../services/test";
import GigaServices from "../../../services/giga";
import Link from "next/link";
import { X } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [testes, setTestes] = useState([]);

  const [GIGAS, setGIGAS] = useState([]);

  async function fetchTestes() {
    const response = await TestServices.index();
    setTestes(response.data);

    const response2 = await GigaServices.index();
    setGIGAS(response2.data);
  }

  useEffect(() => {
    fetchTestes();
  }, []);

  return (
    <div className="flex w-full h-full">
      <div className="flex w-full h-full">
        <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
          <div className="flex flex-col static w-[95vw] h-[95vh] bg-white rounded-xl drop-shadow-lg px-7 py-3">
            <header>
              <div className="flex p-3">
                <h1 className="text-4xl font-semibold">Configurações</h1>
                <X
                  size={36}
                  weight="bold"
                  onClick={() => {
                    router.push("/test");
                  }}
                  className="ml-auto text-red-500 bg-white rounded-md hover:bg-slate-red hover:text-white hover:bg-red-500"
                />
              </div>
            </header>

            <div className="flex flex-row w-full h-full p-3 gap-5 ">
              <div className="flex flex-col h-full bg-slate-200 w-1/2 p-3  rounded-md">
                <h1 className="text-xl font-semibold">Testes:</h1>
                <div className="flex flex-col w-full gap-3 mt-2 h-[70vh] overflow-y-auto">
                  {testes.map((t, index) => (
                    <>
                      <div
                        key={index}
                        className="flex w-full h-[40px] items-center text-lg px-2 bg-slate-100 justify-between "
                      >
                        <h1>{t.product_code}</h1>
                        <Link href={`/ChangeCodeGIGA/test/${t._id}`}>
                          <button className="bg-blue-400 text-white font-semibold w-[100px] h-[30px] border-[2px] border-blue-400 rounded-sm hover:text-blue-400 hover:bg-white">
                            Abrir
                          </button>
                        </Link>
                      </div>
                    </>
                  ))}
                </div>
              </div>
              <div className="flex flex-col bg-slate-200 w-1/2 h-full gap-3 p-2 rounded-md overflow-auto overscroll-x-contain overscroll-y-contain">
                <h1 className="text-xl font-semibold">GIGA:</h1>
                {GIGAS.map((t, index) => (
                  <>
                    <div
                      key={index}
                      className="flex w-full h-[40px] items-center text-lg px-2 bg-slate-100 justify-between"
                    >
                      <h1>{t.name}</h1>
                      <Link href={`/ChangeCodeGIGA/battle`}>
                        <button className="bg-blue-400 text-white font-semibold w-[100px] h-[30px] border-[2px] border-blue-400 rounded-sm hover:text-blue-400 hover:bg-white">
                          Abrir
                        </button>
                      </Link>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
