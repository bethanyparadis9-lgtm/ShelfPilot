import React from 'react';
import jsPDF from 'jspdf';

export default function PackingSheet({ shelves, buyers, items }){
  const download = ()=>{
    const doc = new jsPDF();
    let y = 14;
    doc.setFontSize(16);
    doc.text('ShelfPilot Packing Sheet', 10, y);
    y += 8;
    doc.setFontSize(11);
    buyers.forEach(b=>{
      const shelf = shelves.find(s=>s.buyerId===b.id);
      if(!shelf) return;
      doc.text(`${b.username} — Shelf ${shelf.name}`, 10, y); y+=6;
      shelf.items?.forEach(itemId=>{
        const it = items.find(i=>i.id===itemId) || {};
        doc.text(`• ${(it.name||'(no name)')}  [${it.qrCode||itemId}]`, 14, y); y+=6;
        if(y>280){ doc.addPage(); y=14; }
      });
      y+=6;
    });
    doc.save('packing-sheet.pdf');
  };

  return <button className="primary" onClick={download}>Export Packing Sheet (PDF)</button>;
}
