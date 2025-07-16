import React from "react";
import '../../styles/SignUp.css'
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";

const SignUp = () =>{
    return(
      <div className='card'>
        <Heading text = 'Sign Up'/>
        <Input type='text' hold='Name'/> <br />
        <Input type='text' hold='Surname'/> <br />
        <Input type='date' hold='Date Of Birth'/> <br />
        <Input type='text' hold='Username'/> <br />
        <Input type='email' hold='Email'/> <br />
        <Input type='password' hold='Password'/> <br />
        <Input type='password' hold='Confirm Password'/> <br />
        <Button name= 'Sign Up'/>
      </div>
    )
}

export default SignUp;