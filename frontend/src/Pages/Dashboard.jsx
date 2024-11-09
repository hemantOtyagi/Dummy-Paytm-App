import { Appbar } from "../Componenets/Appbar";
import { Balance } from "../Componenets/Balance";
import { Users } from "../Componenets/Users";

export const Dashboard = () => {
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={"10,000"} />
            <Users />
        </div>
    </div>
}