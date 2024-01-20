import { useState, useEffect, useReducer } from "react"
import {db} from "../firebase/config"


import { collection, addDoc, Timestamp  } from "firebase/firestore"
/*
No firebase cada lugar que voce salva algo e chamado de colection
addDoc para inserir o documento no banco 
Timestamp para marcar o horario em que o post foi criado
*/

const initialState = {
    loading: null,
    error: null
}

const insertReducer = (state, action) => {
    //state e o estado atual que nesse caso é initialState
    //action foi passado por checkCancelBeforeDispatch e como é um objeto é acessado como action.type pra achar o valor dentro do objeto

    switch(action.type) {
        case "LOADING":
            return{loading: true, error: null}
        case "INSERTED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            return state;
    }
}
export const useInsertDocument = (docCollection /*isso vai receber qual colecao o usuario vai mexer */) => {
    const [response, dispatch] = useReducer(insertReducer, initialState);

    //limpando a memoria para nao ter vazamento 
    const [cancelled, setCancelled] = useState(false);
    const checkCancelBeforeDispatch = (action) => {
        if (!cancelled) {
            dispatch(action);
            /*essa função vai passar pra dispatch(que depois vai passar pro insertReducer) o valor action que até agora nao foi definido mas logo abaixo na chamada checkCancelBeforeDispatch ({
            type: "LOADING", //tipo da ação}) ele é definido. Ou seja: primeiramente action vira {type:"LOADING"} e e passado assim pro codigo insertReducer logo acima */

        }
    }

    const insertDocument = async(document/*recebe um document que eu quero inserir */) => {
        checkCancelBeforeDispatch ({
            type: "LOADING", //tipo da ação
            
        })
        try {

            const newDocument = {...document, createdAt: Timestamp.now()}; //adiciono um objeto com o documento que eu quero adicionar e com a hora em que ele foi postado 

            const insertedDocument = await addDoc(collection(db, docCollection), newDocument) /*eu inicio uma função que vai esperar a conclusao da função addDoc que serve pra adicionar o objeto no banco de dados. Essa função recebe a collection que vai ser adicionada e a collection recebe o banco de dados e o docCollection que vai procurar na coleção e o newDocument que é o documento que eu quero adicionar*/

            checkCancelBeforeDispatch ({
                type: "INSERTED_DOC", //tipo da ação
                payload: insertedDocument, //passo pro insertReducer que consequentemente passa pro response que é a resposta final que eu preciso com os dados do documento
            })
            
        } catch (error) {
            checkCancelBeforeDispatch ({
                type: "ERROR", //tipo da ação
                payload: error.message,
            })
            
        }

    };

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    console.log(response);

    return {insertDocument, response};

}

export default useInsertDocument