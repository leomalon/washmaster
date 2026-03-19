'use client';

import { useState, useMemo, useEffect } from 'react';
import TicketApp  from '@/components/tickets/TicketApp';
import DashboardView from '@/components/dashboard/Dashboard';
import Sidebar from '@/components/ui/Sidebar';

const STORAGE_KEY = 'washmaster_boletas'

export default function DashboardPage() {
  const [view, setView] = useState('dashboard');
  const [cliente, setCliente] = useState({ nombre: '', whatsapp: '' });
  const [items, setItems] = useState([
    { id: "1", descripcion: "", precio: 0 }
  ]);
  const [diasDelivery, setDeliveryDays] = useState(1);
  const [fechaEntregaPersonalizada, setCustomDate] = useState("");
  const [ultimaBoleta, setUltimaBoleta] = useState(null);
  const [estadoInicialPago, setEstadoInicial] = useState('cancelado_al_recoger');
  const [historial, setHistorial] = useState([]);
  const [errors, setErrores] = useState({});

  const hoy = new Date().toLocaleDateString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})

  const costoTotal = useMemo(() => items.reduce((acc, item) => acc + (Number(item.precio) || 0), 0), [items])


  //Update current state and local Storage of receipts
  useEffect(() => {
    try {
      const boletasGuardadas = localStorage.getItem(STORAGE_KEY)
  
      if (!boletasGuardadas) return

      const objetosBoletas = JSON.parse(boletasGuardadas)
      // Migrate receipts if do not have estadoRecojo
      const boletasMigradas = objetosBoletas.map((boleta) => ({
        ...boleta,
        estadoRecojo: boleta.estadoRecojo || 'no_recogido'
      }))

      setHistorial(boletasMigradas)
      // Save migrated version if changed
      if (boletasMigradas.some((b, i) => b.estadoRecojo !== objetosBoletas[i].estadoRecojo)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(boletasMigradas))

      }
    } catch { setHistorial([]) }
  }, []) //Runs only once when mounts

  const guardarBoleta = (boleta) => {
    const nuevo = [...historial, boleta]
    setHistorial(nuevo)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevo))
  }

  // Solo permite cambiar a 'cancelado' desde 'cancelado_al_recoger'
  const actualizarEstadoBoleta = (serie, estado) => {
    const nuevo = historial.map((b) => {
      if (b.serie !== serie) return b
      if (b.estado === 'cancelado') return b           // ya cancelado → no cambia
      if (estado !== 'cancelado') return b             // solo se puede ir a cancelado
      return { ...b,  estado: estado }
    })
    setHistorial(nuevo)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevo))
  }

  // Solo permite cambiar a 'recogido' desde 'no_recogido'
  const actualizarEstadoRecojo = (serie, estadoRecojo) => {
    const nuevo = historial.map((b) => {
      if (b.serie !== serie) return b
      if (b.estadoRecojo === 'recogido') return b      // ya recogido → no cambia
      if (estadoRecojo !== 'recogido') return b         // solo se puede ir a recogido
      return { ...b, estadoRecojo:estadoRecojo }
    })
    setHistorial(nuevo)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevo))
  }

  const fechaDeliveryFormateada = useMemo(() => {
    if (fechaEntregaPersonalizada) return fechaEntregaPersonalizada
    const date = new Date()
    date.setDate(date.getDate() + diasDelivery) //Handles month overflow
    return date.toISOString().split('T')[0] //Required by <input type="date">
  }, [diasDelivery, fechaEntregaPersonalizada])


  const agregarItem = () => setItems([...items, { id: String(items.length+1), descripcion: '', precio: 0 }])

  const removerItem = (id) => {
    if (items.length > 1) setItems(items.filter((i) => i.id !== id))
    else setItems([{ id: '1', descripcion: '', precio: 0 }])
  }

  const actualizarItem = (id, field, value) => setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)))

  const validarInfoCliente = () => {
    const erroresIngresoCliente = {}
    if (!cliente.nombre.trim()) erroresIngresoCliente.nombre = 'El nombre es obligatorio'
    if (cliente.whatsapp && cliente.whatsapp.replace(/\D/g, '').length !== 9) //Replace any character that is NOT a digit
      erroresIngresoCliente.whatsapp = 'El número debe tener 9 dígitos'
    setErrores(erroresIngresoCliente)

    //If no errors returns [] ([].length =0)
    return Object.keys(erroresIngresoCliente).length === 0
  }

  const emisionBoleta = () => {
    if (!validarInfoCliente()) return
    const serieBoleta = 'B001-' + Math.floor(100000 + Math.random() * 900000)
    const idControl = serieBoleta.slice(-4)
    const nuevaBoleta={
      serie: serieBoleta, 
      idcontrol:idControl,
      cliente: cliente.nombre,
      whatsapp: cliente.whatsapp,
      prendas: items, 
      total: costoTotal,
      entrega: fechaDeliveryFormateada,
      fechaEmision: hoy,
      estado: estadoInicialPago,
      estadoRecojo: 'no_recogido',
    }
    guardarBoleta(nuevaBoleta)
    setUltimaBoleta(nuevaBoleta)
    setView('ticket')
  }

  const reiniciarForm = () => {
    setCliente({ nombre: '', whatsapp: '' })
    setItems([{ id: '1', descripcion: '', precio: 0 }])
    setEstadoInicial('cancelado_al_recoger')
    setErrores({})
    setView('form')
  }

  const determinarNavegacion = (dest) => {
    if (dest === 'form') reiniciarForm()
    else setView('dashboard')
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar view={view} onNavigate={determinarNavegacion} />
      <main className="flex-1 md:ml-56 pt-14 md:pt-0">
        {view === 'dashboard' && <DashboardView boletas={historial} onUpdateEstado={actualizarEstadoBoleta} onUpdateEstadoRecojo={actualizarEstadoRecojo} />}
        {view === 'ticket' && ultimaBoleta && (
          <TicketView boleta={ultimaBoleta} onReset={reiniciarForm} />
        )}
        {view === 'form' && (
          <FormView
            client={cliente} setClient={setCliente}
            items={items} addItem={agregarItem} removeItem={removerItem} updateItem={actualizarItem}
            deliveryDays={diasDelivery} setDeliveryDays={setDeliveryDays}
            customDate={fechaEntregaPersonalizada} setCustomDate={setCustomDate}
            estadoInicial={estadoInicialPago} setEstadoInicial={setEstadoInicial}
            onEmitir={emisionBoleta} errors={errors} setErrors={setErrores}
          />
        )}
      </main>
    </div>
  )
}