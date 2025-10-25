import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import QrReader from 'react-qr-reader';
import PackingSheet from './PackingSheet';

export default function LiveShow(){
  const [buyers,setBuyers]=useState([]);
  const [shelves,setShelves]=useState([]);
  const [items,setItems]=useState([]);
  const [currentItem,setCurrentItem]=useState(null);
  const [selectedBuyer,setSelectedBuyer]=useState('');
  const [newShelfName,setNewShelfName]=useState('');
  const [shelfChoice,setShelfChoice]=useState('dropdown'); // 'dropdown' or 'new'

  useEffect(()=>{
    const ub = onSnapshot(collection(db,'buyers'), snap=> setBuyers(snap.docs.map(d=>({id:d.id, ...d.data()}))));
    const us = onSnapshot(collection(db,'shelves'), snap=> setShelves(snap.docs.map(d=>({id:d.id, ...d.data()}))));
    const ui = onSnapshot(collection(db,'items'), snap=> setItems(snap.docs.map(d=>({id:d.id, ...d.data()}))));
    return ()=>{ ub(); us(); ui(); };
  },[]);

  const onScan = async (data)=>{
    if(!data) return;
    // find item by qrCode
    const q = query(collection(db,'items'), where('qrCode','==',data));
    const sn = await getDocs(q);
    if(!sn.empty){
      const d = sn.docs[0];
      setCurrentItem({id:d.id, ...d.data()});
    }else{
      setCurrentItem(null);
      alert('QR not found in items. Add it in Pre‑Show first.');
    }
  };

  const ensureShelfExists = async (name)=>{
    // if shelf with this name exists, return it; else create
    let existing = shelves.find(s=>s.name===name);
    if(existing) return existing;
    const ref = await addDoc(collection(db,'shelves'), { name, buyerId:'', items:[] });
    return { id: ref.id, name, buyerId:'', items:[] };
  };

  const assignToBuyer = async ()=>{
    if(!currentItem || !selectedBuyer) return;
    // Does buyer already have a shelf?
    let shelf = shelves.find(s=>s.buyerId===selectedBuyer);
    if(!shelf){
      // No shelf yet → choose from dropdown or create new
      if(shelfChoice==='new'){
        if(!newShelfName){ alert('Enter shelf name'); return; }
        shelf = await ensureShelfExists(newShelfName);
      }else{
        // dropdown path: use selected dropdown shelf name or default A1 if none exist
        const list = shelves.map(s=>s.name);
        const chosen = list[0] || 'A1';
        shelf = await ensureShelfExists(chosen);
      }
      // claim shelf for buyer
      await updateDoc(doc(db,'shelves', shelf.id), { buyerId: selectedBuyer, items: shelf.items||[] });
      shelf = { ...shelf, buyerId: selectedBuyer };
    }
    const newItems = Array.from(new Set([...(shelf.items||[]), currentItem.id]));
    await updateDoc(doc(db,'shelves', shelf.id), { items: newItems });
    await updateDoc(doc(db,'items', currentItem.id), { status:'sold', buyerId: selectedBuyer });
    setCurrentItem(null);
    setSelectedBuyer('');
    setNewShelfName('');
  };

  const buyerHasShelf = (buyerId)=> shelves.some(s=>s.buyerId===buyerId);

  return (
    <div className="container">
      <div className="card">
        <h2>Live Show</h2>
        <p className="small">Scan item QR right before auction. After winner is known, choose buyer. If they already have a shelf, assignment is automatic.</p>
        <div style={{maxWidth:340}}>
          <QrReader onScan={onScan} onError={(e)=>console.warn(e)} style={{ width: '100%' }} />
        </div>
        {currentItem ? (
          <div className="card">
            <strong>Active Item:</strong> {currentItem.name || '(no name)'} <span className="badge">{currentItem.qrCode}</span>
            <div style={{marginTop:8}}>
              <select value={selectedBuyer} onChange={e=>setSelectedBuyer(e.target.value)}>
                <option value="">Select Buyer</option>
                {buyers.map(b=>(<option key={b.id} value={b.id}>{b.username}</option>))}
              </select>
              {selectedBuyer && !buyerHasShelf(selectedBuyer) && (
                <div style={{marginTop:8}}>
                  <div className="small">First purchase for this buyer — choose existing shelf or create new.</div>
                  <div style={{marginTop:6}}>
                    <label><input type="radio" name="shelfChoice" checked={shelfChoice==='dropdown'} onChange={()=>setShelfChoice('dropdown')} /> Use existing list</label>
                    <label style={{marginLeft:12}}><input type="radio" name="shelfChoice" checked={shelfChoice==='new'} onChange={()=>setShelfChoice('new')} /> Create new shelf</label>
                  </div>
                  {shelfChoice==='dropdown' ? (
                    <select style={{marginTop:6}} onChange={e=>setNewShelfName(e.target.value)} value={newShelfName}>
                      <option value="">{shelves.length? 'Choose shelf name' : 'No shelves yet (A1 will be created)'}</option>
                      {shelves.map(s=>(<option key={s.id} value={s.name}>{s.name}</option>))}
                    </select>
                  ) : (
                    <input style={{marginTop:6}} placeholder="New shelf name (e.g., A1)" value={newShelfName} onChange={e=>setNewShelfName(e.target.value)} />
                  )}
                </div>
              )}
              <div style={{marginTop:8}}>
                <button className="primary" onClick={assignToBuyer}>Assign Buyer & Shelf</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="small">Waiting for scan…</div>
        )}
      </div>

      <div className="grid">
        <div className="card">
          <h3>Shelves</h3>
          <ul>
            {shelves.map(s=>(<li key={s.id}><strong>{s.name}</strong>: {s.buyerId ? (buyers.find(b=>b.id===s.buyerId)?.username || s.buyerId) : '(empty)'} — Items: {s.items?.length||0}</li>))}
          </ul>
        </div>
        <div className="card">
          <h3>Items</h3>
          <ul>
            {items.map(i=>(<li key={i.id}>{i.name || '(no name)'} — {i.qrCode} <span className="badge">{i.status}</span></li>))}
          </ul>
        </div>
        <div className="card">
          <h3>Packing</h3>
          <PackingSheet shelves={shelves} buyers={buyers} items={items} />
        </div>
      </div>
    </div>
  );
}
