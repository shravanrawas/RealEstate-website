import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { app } from '../firebase'
 
export function useAuthstatus() {

  const [loggedin, setloggedin] = useState(false)  
  const [loading, setloading] = useState(true)

  useEffect(()=>{
     const auth = getAuth(app) 
     onAuthStateChanged(auth, (user) => {
        if(user){
            setloggedin(true)
        }
        setloading(false)
     })
  },[]) 
 
  return {loggedin, loading}
}

