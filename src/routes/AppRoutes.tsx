import {Routes, Route} from 'react-router'
import Dashboard from '../pages/Dashboard'
const AppRoutes = () => {
    return (

        <Routes>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/courses' element={<div>Courses</div>} />
        </Routes>
    )

}

export default AppRoutes