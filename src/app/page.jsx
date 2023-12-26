"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [maxItens, setMaxItems] = useState([4]);
  const [teste, setTeste] = useState([
    {
      outputs: [12, 12],
    },
  ]);

  const progress =
    teste.length === 0
      ? 100
      : ((maxItens - teste[0].outputs.length) / maxItens) * 100; // Defina MAX_ITEMS como o tamanho máximo do array
  return (
    <div className="flex w-full h-full">
      <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
        <div className="flex static w-[97vw] h-[94vh] gap-10 bg-white rounded-xl drop-shadow-lg p-7">
          <div className="flex flex-col w-full h-full items-center">
            <Image
              src="/1529355861725-removebg-preview.png" // Caminho para a imagem na pasta "public"
              alt="Minha Imagem" // Texto alternativo para acessibilidade
              width={300} // Largura da imagem (ajuste conforme necessário)
              height={300} // Altura da imagem (ajuste conforme necessário)
            />
            <h1 className="text-5xl font-inter font-semibold m-4">
              Bem vindo a GIGA!
            </h1>
            <div className="flex flex-col w-[80vw] justify-center text-lg font-semibold m-4 gap-5">
              <div className="flex flex-col w-full items-center">
                {progress === 0 &&
                  "Aguarde alguns minutos estamos checando os pontos"}
                {progress === 100 && "Checagem concluído" && Aprovar()}
                {progress !== 0 &&
                  progress !== 100 &&
                  `Aguarde alguns minutos estamos checando os pontos`}
                <div>
                  {progress !== 0 &&
                    progress !== 100 &&
                    ` ${progress.toFixed(2)}%`}
                  {progress === 0 && ` ${progress.toFixed(2)}%`}
                </div>
              </div>
              <div className="flex progress-container">
                <div
                  className="progress"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <span className="mt-auto">Made in Brascabos, Brasil, 2023</span>
          </div>
        </div>
      </div>
    </div>
  );
}
