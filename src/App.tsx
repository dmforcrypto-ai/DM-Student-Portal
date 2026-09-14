import  Sidebar  from './layout/Sidebar'
import Header from './layout/Header'
import MainContent from './layout/MainContent'
import AppRoutes from './routes/AppRoutes'

function App() {

  return (
    <>
    <Header />
    <div className='w-full flex flex-row-reverse'>
    
    <MainContent>
    <AppRoutes />
    </MainContent>
    <Sidebar />

      </div>
      </>
  )
}

export default App
