import { type ReactNode} from 'react'
const MainContent = ({children} : {children: ReactNode}) => {
    return (
        <div className="flex-1 overflow-y-auto pl-5 pt-5">

           {children}

        </div>
    )
}

export default MainContent;