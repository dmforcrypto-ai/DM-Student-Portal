import {type LucideIcon} from 'lucide-react'
import {LayoutDashboard, BookText} from 'lucide-react'
import {Link} from 'react-router'
type SidebarMenu = {
    id: number,
    name: string,
    img: LucideIcon,
    path: string
}
const sidebarMenu : SidebarMenu[] = [
    {id: 1,
    name: "Dashboard",
    img: LayoutDashboard,
    path: "/dashboard"},
    {id: 2,
    name: "Courses",
    img: BookText,
    path: "/courses"},
] 

const Sidebar = () => {

    return (
      
        <div className="w-60 h-screen bg-gray-300 px-5 pt-10">

        <ul>
            {sidebarMenu.map((menu) => {
                const Icon = menu.img;
            return (
                <li key={menu.id} className='bg-gradient-to-r from-[#001138] to-[#001e66] mb-3 rounded-md text-white'>
                    <Link to={menu.path} className='flex items-center gap-3 py-2 ml-5'>
                    <Icon size={18} />
                    <p>{menu.name}</p> 
                    </Link> 
                </li>
            )
            })
        }
        </ul>


        </div>
     
    )
}

export default Sidebar;