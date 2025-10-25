import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

export default function Buyers(){
  const [buyers,setBuyers]=useState([]);
  const [username,setUsername]=useState('');

  useEffect(()=>{
    const unsub = onSnapshot(collection(db,'buyers'), snap=>{
      setBuyers(snap.docs.map(d=>({id:d.id, ...d.data()})));
    });
    return unsub;
  },[]);

  const addBuyer = async ()=>{
    if(!username) return;
    await addDoc(collection(db,'buyers'), { username });
    setUsername('');
  };

  return (
    <div className="card">
      <h3>Buyers</h3>
      <div>
        <input placeholder="@BuyerName" value={username} onChange={e=>setUsername(e.target.value)} />
        <button className="primary" onClick={addBuyer}>Add Buyer</button>
      </div>
      <ul>
        {buyers.map(b=>(<li key={b.id}>{b.username}</li>))}
      </ul>
    </div>
  );
}
