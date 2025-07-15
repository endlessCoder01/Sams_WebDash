import React from "react";
import '../../styles/Login.css'
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";

const Login = () =>{
    return(
      <div className='card'>
        <Heading text = 'Login'/>
        <Input type='text' hold='Username'/> <br />
        <Input type='password' hold='Password'/> <br />
        <Button name= 'Login'/>
      </div>
    )
}

export default Login;