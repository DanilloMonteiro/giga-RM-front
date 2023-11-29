"use client"

import { useEffect, useState } from "react";
import TesteServices from "../../../services/teste";

export default function Home() {
    const [pontos1, setPontos1] = useState([])

    function Carregar() {
        let pontos = [];

        for (let i = 4417; i <= 5056; i++) {
            pontos.push({num: i, status: false});
        }

        setPontos1(pontos)
    }

    
    async function Mudar1(index) {

        await TesteServices.on(pontos1[index].num)

        setPontos1((prev) => {
            let new1 = [...prev];
            new1[index].status = true
            console.log(new1, new1[index].status)
            return new1;
        });
    }   

     
    async function Mudar2(index) {

        await TesteServices.off(pontos1[index].num)

        setPontos1((prev) => {
            let new1 = [...prev];
            new1[index].status = false
            console.log(new1, new1[index].status)
            return new1;
        });
    }   
    
    

    useEffect(() => {
        Carregar()
      }, []);

    return (
        <div className="flex w-full h-full">
            <div className="flex w-full h-full">
                <div className="flex w-screen h-screen bg-blue-400 justify-center items-center">
                    <div className="flex flex-col static w-[95vw] h-[95vh] bg-white rounded-xl drop-shadow-lg px-7 py-3"> 
                        <div className="flex flex-wrap overflow-x-auto">
                        {pontos1.map((p, index) => (
                            <>
                                <div key={index} className={`flex flex-col flex-shrink-0 px-2 py-2 border-[1px] border-slate-400 hover:bg-slate-200`}>
                                    {p.num}
                                    <button onClick={() => {Mudar1(index)}} className={`hover:bg-green-300 ${p.status == true ? "bg-green-500" : ""}`}>ON</button>
                                    <button onClick={() => {Mudar2(index)}} className={`hover:bg-red-300 ${p.status == false ? "bg-red-500" : ""}`}>OFF</button>
                                </div>
                                <div>
                                    
                                </div>
                            </>
                            
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}