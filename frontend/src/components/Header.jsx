import { NavLink } from "react-router"


function Header() {
  return (
    <nav className="flex justify-between px-10 items-center bg-blue-200 py-5">
        <img className="rounded-full" width="80px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ9yuiOaAXmjefDb0uELBko_7J1iku5Ywf7Q&s" alt="" />
        <ul className="flex gap-6 text-2xl">
            <li><NavLink to="/" className={({isActive})=>isActive?"bg-blue-400 text-lime-50 rounded-xl p-2":""} >Home </NavLink></li>
            <li><NavLink to="add-user" className={({isActive})=>isActive?"bg-blue-400 text-lime-50 rounded-xl p-2":""} >AddUser </NavLink></li>
            <li><NavLink to="users-list" className={({isActive})=>isActive?"bg-blue-400 text-lime-50 rounded-xl p-2":""} >UsersList </NavLink></li>
            <li><NavLink to="user" className={({isActive})=>isActive?"bg-blue-400 text-lime-50 rounded-xl p-2":""} >User </NavLink></li>
        </ul>
        
    </nav>
  )
}

export default Header