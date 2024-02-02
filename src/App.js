import './App.css';

import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';//função que mapeia se a autenticação do usuario foi feita com sucesso

//hooks

import { useState, useEffect } from 'react';
import { useAuthentication } from './hooks/useAuthenticantion';//essa função recebe o parametro user que sera chamada sempre que o estado de autenticação desse user mudar e um objeto adicional que pode conter informações adicionais

//context 

import { AuthProvider } from './context/AuthContext';

//pages
import Home from "../src/pages/Home/Home";
import About from "../src/pages/About/About";
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import CreatePost from './pages/CreatePost/CreatePost';
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Search from './pages/Search/Search.jsx';
import Post from './pages/Post/Post.jsx';


function App() {

  const [user, setUser] = useState(undefined);
  const {auth} = useAuthentication();

  const loadingUser = user === undefined //atribuo o valor do user com o valor de undefined. Então, se for undefined quer dizer que está carregando de alguma maneira
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    })
  },[auth]);
  /*
  auth - é o objeto que voce obtem ao iniciar o firebase authentication e vem do useAuthentication();
  user - o user representa o usuario autenticado ou null se nenhum usuario estiver autenticado
  além disso a funcao onAuthStateChanged retorna uma função de desinscrição que é usada para limpar o observador quando o componente é desmontado para evitar vazamento de memóoria 


  
  */

  if (loadingUser) {
    return <p>Carregando...</p>
  }

  

  return (
    <div className="App">
      
      <AuthProvider value={{user}}>
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/about" element={<About />}/>
              <Route path="/search" element={<Search />}/>
              <Route path="/posts/:id" element={<Post/>}/>
              <Route path="/login" element={!user ? <Login/> : <Navigate to="/" />}/>
              <Route path="/register" element={!user ? <Register/> : <Navigate to="/" />}/>
              <Route path="/posts/create" element={user ? <CreatePost/> : <Navigate to="/register" />} />
              <Route path="/dashboard" element={user ? <Dashboard/> : <Navigate to="/register" />} />
              

            </Routes>
          </div>
          <Footer />
        
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
