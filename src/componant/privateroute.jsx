import React from 'react'
import { Outlet, Navigate} from 'react-router';
import {useAuthstatus} from '../hooks/useAuthstatus';
import Spiner from './spiner';

function Privateroute() {

  const {loggedin, loading} = useAuthstatus();
  if(loading){
    return <Spiner/>
  }
  return loggedin ? <Outlet/> : <Navigate to='/sign-in'/>
}

export default Privateroute
