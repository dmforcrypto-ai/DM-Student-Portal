import {GraduationCap, CircleUser, Search} from 'lucide-react'
const Header = () => {
return ( 
        <>
        <div className='bg-gradient-to-r from-[#001138] to-[#001e66] text-white p-5'>
            <nav className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <GraduationCap size={32} strokeWidth={1}/>
                    <p className='text-1xl'>Denmark University</p>

                </div>
                

                <div className='flex justify-between items-center gap-50'>
                    <div className='relative'>
                        <input type='search' size={40} className='bg-white rounded-sm'/>
                        <button type='button' className='cursor-pointer'><Search size={18} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500' strokeWidth={2}/></button>
                        
                        </div>
                    <div>
                        <CircleUser size={38} strokeWidth={1} />
                        </div>
                    
                </div>
            </nav>
        </div>
        </>

)

}

export default Header;