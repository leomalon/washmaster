"use client";

import { useState,useMemo } from "react";

import ClientForm from "./ClientForm";
import TicketView from "./TicketView";
import CustomerView from "./CustomerView";


export default function WashmasterApp() {

    // --- NAVIGATION STATE ---
    const [view, setView] = useState("form");

    // --- CLIENT DEFAULT DATA ---
    const [client, setClient] = useState({
      nombre: "",
      whatsapp: ""
    });
  
    const [items, setItems] = useState([
      { id: "1", descripcion: "CAMISA RAYADA", precio: 30 }
    ]);
  
    const [deliveryDays, setDeliveryDays] = useState(7);
    const [customDate, setCustomDate] = useState("");
    const [lastBoleta, setLastBoleta] = useState(null);


    // --- LÓGICA DE FECHAS ---
    const today = new Date().toLocaleDateString('es-PE', { 
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const formattedDeliveryDate = useMemo(() => {
      if (customDate) return customDate;
      const date = new Date();
      date.setDate(date.getDate() + deliveryDays);
      return date.toISOString().split('T')[0];
    }, [deliveryDays, customDate]);

  
    const total = useMemo(() => {
      return items.reduce((acc, item) => acc + (Number(item.precio) || 0), 0);
    }, [items]);
    

    // --- ACTIONS ---
    const addItem = () => {
      setItems([...items, { id: Date.now().toString(), descripcion: "", precio: 0 }]);
    };
  
    const removeItem = (id) => {
      setItems(items.filter(item => item.id !== id));
    };
  
    const updateItem = (id, field, value) => {
      setItems(items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ));
    };
  
    const handleEmitir = () => {
      const serie = "B001-" + Math.floor(100000 + Math.random() * 900000);
      const idControl = serie.slice(-4);
  
      const nuevaBoleta = {
        serie,
        idControl,
        cliente: client.nombre,
        prendas: items,
        total
      };
  
      setLastBoleta(nuevaBoleta);
      setView("ticket");
    };

    const sendWhatsApp = () => {
      if (!lastBoleta) return;
      
      const mensaje = `¡Hola ${lastBoleta.cliente}! 👋 Tu pedido en Washmaster Express ha sido registrado.%0A%0A` +
        `📌 *ID de Control:* ${lastBoleta.idControl}%0A` +
        `💰 *Total:* S/ ${lastBoleta.total.toFixed(2)}%0A` +
        `🗓️ *Fecha de Entrega:* ${lastBoleta.entrega}%0A%0A` +
        `Puedes ver tu boleta digital aquí:%0A${lastBoleta.trackingUrl}`;
  
      const phone = lastBoleta.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${phone.startsWith('51') ? phone : '51' + phone}?text=${mensaje}`, '_blank');
    };
  
    const resetForm = () => {
      setClient({ nombre: '', whatsapp: '' });
      setItems([{ id: '1', descripcion: '', precio: 0 }]);
      setView('form');
    };
  
  
    if (view === "form") {
      return (
        <>
          <ClientForm
            client={client}
            setClient={setClient}
            items={items}
            addItem={addItem}
            removeItem={removeItem}
            updateItem={updateItem}
            deliveryDays={deliveryDays}
            setDeliveryDays={setDeliveryDays}
            customDate={customDate}
            setCustomDate={setCustomDate}
            handleEmitir={handleEmitir}
            total={total}
          />
  
        </>
      );
    }
  
    if (view === "ticket") {
      return (
        <TicketView
        boleta={lastBoleta}
        setView={setView}
        sendWhatsApp={sendWhatsApp}
        resetForm={resetForm}
      />
      );
    }
  
    if (view === "customer") {
      return (
        <CustomerView
          boleta={lastBoleta}
        />
      );
    }
  }