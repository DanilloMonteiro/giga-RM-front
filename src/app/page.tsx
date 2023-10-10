import Image from "next/image";

export default function Home() {
  return (
    <div className="flex w-full h-full">
      <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
        <div className="flex flex-col w-[800px] h-[800px] bg-white items-center rounded-md drop-shadow-lg">
          <Image
            src="/1529355861725-removebg-preview.png" // Caminho para a imagem na pasta "public"
            alt="Minha Imagem" // Texto alternativo para acessibilidade
            width={300} // Largura da imagem (ajuste conforme necessário)
            height={300} // Altura da imagem (ajuste conforme necessário)
          />
          <div className="flex flex-col w-[470px]">
            <div className="flex items-center justify-between">
              <button className="bg-blue-400 text-white font-semibold w-[200px] h-[40px] border-[2px] border-blue-400 rounded-sm hover:text-blue-400 hover:bg-white">
                Iniciar Teste
              </button>
              <input
                className="border-[1px] rounded-sm p-2"
                placeholder="Digite o código do teste"
              ></input>
            </div>
            <div className="flex mt-10 justify-start">
              <button className="bg-blue-400 text-white font-semibold w-[200px] h-[70px] rounded-sm border-[2px] border-blue-400 hover:text-blue-400 hover:bg-white">
                Continuar com teste anterior
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
