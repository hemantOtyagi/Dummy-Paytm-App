import { BottomWarning } from "../Componenets/BottomWarning"
import { Button } from "../Componenets/Button"
import { Heading } from "../Componenets/Heading"
import { InputBox } from "../Componenets/InputBox"
import { Subheading } from "../Componenets/Subheading"

export  const  Signin = () => {
  return <div className="bg-slate-300 h-screen flex justify-center">
  <div className="flex flex-col justify-center">
    <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
      <Heading label={"Sign In"} />
      <Subheading label={"Enter your credentials to access your account"} />
      <InputBox placeholder="harkirat@gmail.com" label={"Email"} />
      <InputBox placeholder="123456" label={"Password"} />
      <div className="pt-4">
        <Button label={"Sign In"} />
      </div>
      <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
    </div>
  </div>
</div>
}

