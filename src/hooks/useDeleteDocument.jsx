import { useState, useEffect, useReducer } from "react"
import {db} from "../firebase/config"


import { doc, deleteDoc  } from "firebase/firestore"
/*
No firebase cada lugar que voce salva algo e chamado de colection
addDoc para inserir o documento no banco 
Timestamp para marcar o horario em que o post foi criado
*/

const initialState = {
    loading: null,
    error: null
}

const deleteReducer = (state, action) => {
    //state e o estado atual que nesse caso é initialState
    //action foi passado por checkCancelBeforeDispatch e como é um objeto é acessado como action.type pra achar o valor dentro do objeto

    switch(action.type) {
        case "LOADING":
            return{loading: true, error: null}
        case "DELETED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            return state;
    }
}
export const useDeleteDocument = (docCollection /*isso vai receber qual colecao o usuario vai mexer */) => {
    const [response, dispatch] = useReducer(deleteReducer, initialState);

    //limpando a memoria para nao ter vazamento 
    const [cancelled, setCancelled] = useState(false);
    const checkCancelBeforeDispatch = (action) => {
        if (!cancelled) {
            dispatch(action);
            /*essa função vai passar pra dispatch(que depois vai passar pro insertReducer) o valor action que até agora nao foi definido mas logo abaixo na chamada checkCancelBeforeDispatch ({
            type: "LOADING", //tipo da ação}) ele é definido. Ou seja: primeiramente action vira {type:"LOADING"} e e passado assim pro codigo insertReducer logo acima */

        }
    }

    const deleteDocument = async(id) => {
        checkCancelBeforeDispatch ({
            type: "LOADING", //tipo da ação
            
        })
        try {
            const deletedDocument = await deleteDoc(doc(db, docCollection, id));
            checkCancelBeforeDispatch ({
                type: "DELETED_DOC", //tipo da ação
                payload: deletedDocument,
                
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

    return {deleteDocument, response};

}

export default useDeleteDocument