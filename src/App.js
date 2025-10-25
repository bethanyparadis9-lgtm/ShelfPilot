import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './components/Login';
import PreShowInventory from './components/PreShowInventory';
import LiveShow from './components/LiveShow';
import Buyers from './components/Buyers';

export default function App(){
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState('inventory');

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, u=> setUser(u || null));
    return unsub;
  },[]);

  if(!user) return <Login onLogin={setUser} />;

  return (
    <div>
      <header>
        <h1>ShelfPilot</h1>
        <nav>
          <button className={tab==='inventory'?'active':''} onClick={()=>setTab('inventory')}>Pre‑Show</button>
          <button className={tab==='live'?'active':''} onClick={()=>setTab('live')}>Live Show</button>
          <button className={tab==='buyers'?'active':''} onClick={()=>setTab('buyers')}>Buyers</button>
          <button onClick={()=>signOut(auth)}>Sign Out</button>
        </nav>
      </header>
      {tab==='inventory' && <PreShowInventory />}
      {tab==='live' && <LiveShow />}
      {tab==='buyers' && <div className="container"><Buyers /></div>}
    </div>
  );
}
