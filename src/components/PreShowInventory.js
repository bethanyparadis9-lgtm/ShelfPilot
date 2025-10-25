import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import QRCode from 'qrcode.react';

export default function PreShowInventory(){
  const [itemName,setItemName]=useState('');
  const [items,setItems]=useState([]);

  useEffect(()=>{
    const unsub = onSnapshot(collection(db,'items'), snap=>{
      setItems(snap.docs.map(d=>({id:d.id, ...d.data()})));
    });
    return unsub;
  },[]);

  const addItem = async ()=>{
    const qrCode = 'QR-' + Math.random().toString(36).slice(2,8).toUpperCase();
    await addDoc(collection(db,'items'), { qrCode, name: itemName || '', status:'pre-show', buyerId: '' });
    setItemName('');
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Pre‑Show Inventory</h2>
        <div style={{marginBottom:8}}>
          <input placeholder="Optional item name" value={itemName} onChange={e=>setItemName(e.target.value)} />
          <button className="primary" onClick={addItem}>Add Item</button>
        </div>
        <div className="grid">
          {items.map(i=>(
            <div key={i.id} className="card">
              <strong>{i.name || '(no name)'}</strong>
              <div className="small">QR: {i.qrCode} <span className="badge">{i.status}</span></div>
              <div style={{marginTop:8}}><QRCode value={i.qrCode} size={96} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
