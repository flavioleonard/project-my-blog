import { db } from '../firebase/config';

import {
    getAuth, //verifica se o usuario esta no sistema 
    createUserWithEmailAndPassword, //cria o usuario no sistema 
    signInWithEmailAndPassword, //permite o usuario entrar no sistema 
    updateProfile, //permite atualização do usuario 
    signOut //permite logout do usuario 
} from 'firebase/auth'

import { useState, useEffect } from 'react'


export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    //cleanup 
    //deal with memory leak (para parar as funções )

    const [cancelled, setCancelled] = useState(false); //quando as coisas derem certo vira true pra poder cancelar as demais coisas 

    const auth = getAuth();

    function checkIfIsCancelled () {
        if (cancelled) {
            return; //para evitar vazamento de memoria
        }
        /*
        Quando a função checkIfIsCancelled é chamada, ela verifica se a variável cancelled é verdadeira. Se for verdadeira, a função retorna imediatamente, interrompendo a execução de qualquer código subsequente na função que a chamou. Isso é útil em situações onde uma operação assíncrona (como uma solicitação de rede) foi iniciada, mas o componente React que iniciou a operação foi desmontado antes que a operação pudesse ser concluída.

        Se a operação assíncrona tentasse atualizar o estado de um componente que foi desmontado, isso resultaria em um erro, pois o componente não existe mais. Ao retornar imediatamente da função, evita-se que o código tente atualizar o estado de um componente desmontado, prevenindo assim possíveis vazamentos de memória
        
        */

    }


    //REGISTER ABAIXO:
    /*o parametro data abaixo recebe as informações do user depois do handleSubmit acontecer no componente register.jsx na linha const res = await createUser(user); Ou seja, é como se renomeasse o objeto user que recebe o displayName, password e email para "data"  */
    const createUser = async(data) => {
        checkIfIsCancelled();//if cancelled true ela para o codigo subsequente 

        setLoading(true);
        setError(null);

        try {
            
            const {user} = await createUserWithEmailAndPassword(
                auth, //resposta da autenticação
                data.email, //armazenammento do email constando no data 
                data.password //recebe o password armmazenado em data 
            )

            await updateProfile(user, {displayName: data.displayName}); //alterando o display name do usuario updateProfile(nome do objeto, nome do que vai ser mudado no objeto)

            setLoading(false);

            return user; //retorna o objeto 



        } catch (error) {
            console.log(error.message);
            console.log(typeof error.message);

            let systemErrorMessage

            if (error.message.includes("Password")) {
                systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres. "
            }
            else if(error.message.includes("email-already")) {
                systemErrorMessage = "E-mail já cadastrado."

            }
            else {
                systemErrorMessage = "Ocorreu um erro. Por favor, tente mais tarde."
            }

            setLoading(false);

            setError(systemErrorMessage)
        }

        
    }

    //LOGOUT - SIGN OUT

    const logout = () => {
        checkIfIsCancelled();

        signOut(auth);

    }

    //login -  sign in

    const login = async(data) => {
        checkIfIsCancelled();
        setLoading(true);
        setError(false);

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);

        } catch (error) {
            console.log("Full error message: ", error.message);
            console.log(typeof error.message);
            console.log(error.message.includes("user-not"));
            let systemErrorMessage ;

            if (error.message.includes("user-not-found")) {
                systemErrorMessage = "Usuario nao encontrado"
            }

            else if (error.message.includes("wrong-password")) {
                systemErrorMessage = "Senha incorreta"

            }
            else {
                systemErrorMessage = "Ocorreu um erro, por favor, tente mais tarde"
            }
            setError(systemErrorMessage);

            
        }
        setLoading(false)
    }
    
    useEffect(() => {
        return () => setCancelled(true);
    }, []); //cancela o processo porque ja finalizou tudo 

    return {
        auth, 
        createUser,
        error,
        loading,
        logout,
        login,
    }

}