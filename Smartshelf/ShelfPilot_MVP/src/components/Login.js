import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export default function Login({ onLogin }){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [mode,setMode]=useState('login');
  const [error,setError]=useState('');

  const go = async ()=>{
    try{
      if(mode==='login'){
        const { user } = await signInWithEmailAndPassword(auth,email,password);
        onLogin(user);
      }else{
        const { user } = await createUserWithEmailAndPassword(auth,email,password);
        onLogin(user);
      }
    }catch(e){ setError(e.message); }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>ShelfPilot</h2>
        <p className="small">Sign in with email & password. New here? Switch to Create Account.</p>
        <div>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="primary" onClick={go}>{mode==='login'?'Log In':'Create Account'}</button>
        </div>
        <div style={{marginTop:8}}>
          <button onClick={()=>setMode(mode==='login'?'create':'login')}>
            {mode==='login'?'Create Account':'Back to Login'}
          </button>
          <button style={{marginLeft:8}} onClick={()=>signOut(auth)}>Sign Out</button>
        </div>
        {error && <p className="small" style={{color:'#b91c1c'}}>{error}</p>}
      </div>
    </div>
  );
}
