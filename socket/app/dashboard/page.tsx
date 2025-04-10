'use client'
import React, { useEffect, useState } from 'react'
import { IUser } from '../page'
import { useRouter } from 'next/navigation'

const Page = () => {
    const [user, setCurrentUser] = useState<IUser | null>(null)
    const router = useRouter()
    useEffect(() => {
      async function getUser() {
        try {
          const response = await fetch('http://localhost:5000/dashboard')          
          const res: IUser = await response.json();
          setCurrentUser(res);
          console.log(res)
          if(res == null){
            router.push('/')
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      getUser();
    }, []);
    
    async function signOut(){
      try{
        const res = await fetch('http://localhost:5000/sign-out', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        localStorage.removeItem("token")
        if(res.ok){
          router.push('/')
        }
      }catch(error){
        console.log(error)
      }
    }
    async function deleteAccount(email: string){
      try{
        const response = await fetch('http://localhost:5000/delete-account', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({email})
        })
        if(response.ok) router.push('/')
      }catch(error){
        console.log(error)
      }
    }
  return <>
    <div>{user?.name}</div>
    <button onClick={signOut}>sign out</button>
    <button onClick={() => user?.email && deleteAccount(user?.email)}>delete account</button>
  </>
}

export default Page