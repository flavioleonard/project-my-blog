//useLocation para obter informações da URL atual como pathname, search, hash(parte da url com # que normalmente é usada para indicar uma selçao específica em uma nova página web )
//useMemo serve pra ootimizar o desempenho de componentes ao memorizar o resultado de calculo caro para que nao precise ser recalculado sempre que o componente for renderizado a menos que suas dependencias tenham mudado 


import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export function useQuery () {
    const {search} = useLocation(); //recebe os valores do search 

    return useMemo(() => new URLSearchParams(search), [search]); 
}