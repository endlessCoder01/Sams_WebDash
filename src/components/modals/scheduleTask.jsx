import React from "react";
import '../../styles/SignUp.css'
import Input from "../input/Input";
import Heading from "../headings/Heading";
import Button from "../buttons/Button";

const ScheduleTask = () =>{
    return(
      <div className='card'>
        <Heading text = 'Sign Up'/>
        <Input type='text' hold='Name'/> <br />
        <Input type='text' hold='Surname'/> <br />
        <Input type='password' hold='Password'/> <br />
        <Input type='text' hold='Username'/> <br />
        <Input type='date' hold='Date Of Birth'/> <br />
        <Button name= 'Sign Up'/>
      </div>
    )
}

export default ScheduleTask;