'use client';

import { useState, useMemo } from 'react'
import { TrendingUp, ShoppingBag, Eye, X, Phone, Search, XCircle, PackageX } from 'lucide-react'

const ESTADO_BADGE = {
  cancelado_al_recoger: 'bg-orange-100 text-orange-700',
  cancelado: 'bg-red-100 text-red-700',
}

const ESTADO_RECOJO_BADGE = {
  recogido: 'bg-green-100 text-green-700',
  no_recogido: 'bg-gray-100 text-gray-700',
}

const ESTADO_LABELS = {
  cancelado_al_recoger: 'Cancela al recoger',
  cancelado: 'Cancelado',
}

const ESTADO_RECOJO_LABELS = {
  recogido: 'Recogido',
  no_recogido: 'No recogido',
}

export default function DashboardView({ boletas, onUpdateEstado, onUpdateEstadoRecojo }) {
  const [selectedBoleta, setSelectedBoleta] = useState(null)
  const [search, setSearch] = useState('')

  const today = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const boletasHoy = boletas.filter((b) => b.fechaEmision.startsWith(today))
  const totalHoy = boletasHoy.reduce((acc, b) => acc + b.total, 0)
  const totalGeneral = boletas.reduce((acc, b) => acc + b.total, 0)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return [...boletas].reverse()
    return [...boletas].reverse().filter((b) =>
      b.cliente.toLowerCase().includes(q) ||
      b.fechaEmision.includes(q) ||
      b.entrega.includes(q)
    )
  }, [boletas, search])

  const handleCancelar = (boleta) => {
    if (boleta.estado === 'cancelado') return
    onUpdateEstado(boleta.serie, 'cancelado')
    if (selectedBoleta?.serie === boleta.serie) {
      setSelectedBoleta({ ...selectedBoleta, estado: 'cancelado' })
    }
  }

  const handleMarcarRecogido = (boleta) => {
    if (boleta.estadoRecojo === 'recogido') return
    onUpdateEstadoRecojo(boleta.serie, 'recogido')
    if (selectedBoleta?.serie === boleta.serie) {
      setSelectedBoleta({ ...selectedBoleta, estadoRecojo: 'recogido' })
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-4xl font-bold">Dashboard</h2>
        <p className="text-slate-400 text-sm mt-1">Resumen de pedidos e ingresos</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pedidos hoy', value: boletasHoy.length, suffix: '', icon: true, color: '' },
            { label: 'Ingresos hoy', value: totalHoy.toFixed(2), suffix: 'S/', icon: false, color: 'text-blue-600' },
            { label: 'Total pedidos', value: boletas.length, suffix: '', icon: true, color: '' },
            { label: 'Ingresos total', value: totalGeneral.toFixed(2), suffix: 'S/', icon: false, color: 'text-green-600' },
          ].map((m) => (
            <div key={m.label} className="bg-white border-2 border-slate-100 rounded-3xl p-5 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">{m.label}</p>
              <div className="flex items-end gap-1">
                {m.suffix && <span className="text-lg font-bold text-slate-400 mb-0.5">{m.suffix}</span>}
                <span className={`text-4xl font-black ${m.color}`}>{m.value}</span>
                {m.icon && <ShoppingBag size={20} className="text-slate-300 mb-1 ml-1" />}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border-2 border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-slate-400">
              <TrendingUp size={16} />
              <h3 className="text-xs font-black uppercase tracking-widest">Todos los pedidos</h3>
            </div>
            <div className="sm:ml-auto flex items-center gap-2 bg-slate-50 border-2 border-transparent focus-within:border-blue-300 rounded-2xl px-4 py-2.5 transition-all">
              <Search size={15} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Buscar por nombre"
                className="bg-transparent outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400 w-full sm:w-56"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
              )}
            </div>
          </div>

          {boletas.length === 0 ? (
            <div className="p-16 text-center text-slate-300">
              <ShoppingBag size={40} className="mx-auto mb-3" />
              <p className="font-bold">Sin pedidos aún</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center text-slate-300">
              <Search size={40} className="mx-auto mb-3" />
              <p className="font-bold">Sin resultados para "{search}"</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map((boleta) => {
                const puedeCancel = boleta.estado === 'cancelado_al_recoger'
                const puedeMarcarRecogido = boleta.estadoRecojo === 'no_recogido'
                return (
                  <div key={boleta.serie} className="flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="shrink-0 w-16">
                      <p className="font-black text-slate-900 text-sm">{boleta.idControl}</p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-black text-slate-900 truncate">{boleta.cliente}</p>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${ESTADO_BADGE[boleta.estado]}`}>
                          {ESTADO_LABELS[boleta.estado]}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        {boleta.whatsapp && (
                          <span className="text-xs text-slate-400 flex items-center gap-1"><Phone size={11} />{boleta.whatsapp}</span>
                        )}
                        <span className="text-xs text-slate-300">{boleta.fechaEmision}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 w-20">
                      <p className="font-black text-lg">S/ {boleta.total.toFixed(2)}</p>
                      <p className="text-xs text-slate-400">{boleta.prendas.length} prenda{boleta.prendas.length !== 1 ? 's' : ''}</p>
                    </div>

                    <div className="shrink-0 w-24 text-center">
                      {puedeMarcarRecogido ? (
                        <button
                          onClick={() => handleMarcarRecogido(boleta)}
                          title="Marcar como recogido"
                          className="bg-green-50 hover:bg-green-100 text-green-600 px-3 py-1 rounded-xl text-xs font-bold transition-colors"
                        >
                          Marcar Recogido
                        </button>
                      ) : (
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wide ${ESTADO_RECOJO_BADGE[boleta.estadoRecojo]}`}>
                          {ESTADO_RECOJO_LABELS[boleta.estadoRecojo]}
                        </span>
                      )}
                    </div>

                    {puedeCancel ? (
                      <button
                        onClick={() => handleCancelar(boleta)}
                        title="Marcar como cancelado"
                        className="shrink-0 bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-xl transition-colors"
                      >
                        <XCircle size={16} />
                      </button>
                    ) : (
                      <div className="shrink-0 w-10" />
                    )}

                    <button
                      onClick={() => setSelectedBoleta(boleta)}
                      className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-xl transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {selectedBoleta && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <p className="font-black text-lg">{selectedBoleta.cliente}</p>
                <p className="text-xs text-slate-400">{selectedBoleta.serie}</p>
              </div>
              <button onClick={() => setSelectedBoleta(null)} className="text-slate-300 hover:text-slate-600"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold">Estado</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 ${ESTADO_BADGE[selectedBoleta.estado]}`}>
                    {selectedBoleta.estado === 'cancelado_al_recoger' ? <PackageX size={11} /> : <XCircle size={11} />}
                    {ESTADO_LABELS[selectedBoleta.estado]}
                  </span>
                  {selectedBoleta.estado === 'cancelado_al_recoger' && (
                    <button
                      onClick={() => handleCancelar(selectedBoleta)}
                      className="text-xs font-black text-red-500 hover:text-red-700 underline"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold">Estado Recojo</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-xs px-3 py-1 rounded-full ${ESTADO_RECOJO_BADGE[selectedBoleta.estadoRecojo]}`}>
                    {ESTADO_RECOJO_LABELS[selectedBoleta.estadoRecojo]}
                  </span>
                  {selectedBoleta.estadoRecojo === 'no_recogido' && (
                    <button
                      onClick={() => handleMarcarRecogido(selectedBoleta)}
                      className="text-xs font-black text-green-600 hover:text-green-700 underline"
                    >
                      Marcar Recogido
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-between"><span className="text-slate-400 font-bold">WhatsApp</span><span className="font-bold">{selectedBoleta.whatsapp || '---'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-bold">Emisión</span><span className="font-bold">{selectedBoleta.fechaEmision}</span></div>
              <div className="flex justify-between text-blue-600"><span className="font-bold">Entrega estimada</span><span className="font-bold">{selectedBoleta.entrega}</span></div>
            </div>
            <div className="px-6 pb-2">
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3">Prendas</p>
              <div className="space-y-2">
                {selectedBoleta.prendas.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-600 uppercase">{item.descripcion || 'PRENDA'}</span>
                    <span className="font-bold">S/ {Number(item.precio).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center p-6 border-t border-slate-100 mt-4">
              <span className="font-black text-lg">TOTAL</span>
              <span className="font-black text-2xl text-blue-600">S/ {selectedBoleta.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}