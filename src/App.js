import './App.css';
import Header from './components/Header';
import Main from './pages/Main';
import { Route, Routes } from 'react-router-dom';
import SubNexonGames from './pages/SubNexonGames';
import SubNews from './pages/SubNewsaaa';
import Footer from './components/Footer';


function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/subnexongames' element={<SubNexonGames/>}/>
        <Route path='/subnews' element={<SubNews/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;