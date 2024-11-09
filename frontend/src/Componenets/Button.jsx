export function Button({ label , onClick}){
    return(
        <button onClick={onClick} className="bg-gray-800 w-full rounded-lg px-20 py-1 text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-sm px-5 py-2.5 me-2 mb-2">{label}</button>
    )
}