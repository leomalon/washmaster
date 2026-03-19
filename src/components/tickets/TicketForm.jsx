import { User, Shirt, Plus, Trash2, Calendar } from "lucide-react";

export default function TicketForm({
    client,
    setClient,
    items,
    addItem,
    removeItem,
    updateItem,
    deliveryDays,
    setDeliveryDays,
    customDate,
    setCustomDate,
    handleEmitir,
    total
  }) { 

    return (
            <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans text-slate-900">
              <div className="max-w-4xl mx-auto flex flex-col items-center mb-10">
                <div className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl mb-3 shadow-lg">
                  W
                </div>
                <h1 className="text-sm font-black tracking-[0.3em] uppercase text-slate-500">WASHMASTER EXPRESS</h1>
                <h2 className="text-4xl font-bold mt-2">Nueva Boleta</h2>
              </div>
      
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Cliente */}
                <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <User size={16} /> <span>Datos del Cliente</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="NOMBRE DEL CLIENTE"
                      className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all text-lg font-bold"
                      value={client.nombre}
                      onChange={(e) => setClient({...client, nombre: e.target.value.toUpperCase()})}
                    />
                    <input 
                      type="tel" 
                      placeholder="WHATSAPP (Opcional)"
                      className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all text-lg font-bold"
                      value={client.whatsapp}
                      onChange={(e) => setClient({...client, whatsapp: e.target.value})}
                    />
                  </div>
                </div>
      
                {/* Prendas */}
                <div className="bg-white border-2 border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                      <Shirt size={16} /> <span>Prendas</span>
                    </div>
                    <button 
                      onClick={addItem}
                      className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800"
                    >
                      <Plus size={20} /> AGREGAR
                    </button>
                  </div>
      
                  <table className="w-full">
                    <tbody className="divide-y divide-slate-50">
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 w-20 text-center">
                            <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500">
                              <Trash2 size={20} />
                            </button>
                          </td>
                          <td className="px-2 py-4">
                            <input 
                              type="text"
                              value={item.descripcion}
                              onChange={(e) => updateItem(item.id, 'descripcion', e.target.value.toUpperCase())}
                              placeholder="Descripción de la prenda..."
                              className="w-full bg-transparent outline-none py-1 text-lg font-semibold"
                            />
                          </td>
                          <td className="px-6 py-4 w-40">
                            <input 
                              type="number"
                              value={item.precio || ''}
                              onChange={(e) => updateItem(item.id, 'precio', parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              className="w-full text-right bg-slate-50 p-3 rounded-xl font-bold text-lg outline-none focus:bg-blue-50 focus:text-blue-600"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
      
                {/* Entrega */}
                <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm">
                  <h4 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">¿Cuándo se entrega?</h4>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[1, 3, 7].map(d => (
                      <button 
                        key={d}
                        onClick={() => {setDeliveryDays(d); setCustomDate('')}}
                        className={`py-5 rounded-2xl font-black transition-all text-sm ${deliveryDays === d && !customDate ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                      >
                        {d === 1 ? 'MAÑANA' : `${d} DÍAS`}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus-within:border-blue-200">
                    <Calendar size={20} className="text-slate-400" />
                    <input 
                      type="date" 
                      className="bg-transparent outline-none text-lg font-bold w-full cursor-pointer"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                    />
                  </div>
                </div>
      
                {/* Botón Principal */}
                <div className="pt-4 pb-10">
                  <button 
                    onClick={handleEmitir}
                    className="w-full bg-[var(--main-blue)] text-white py-3 rounded-[2.5rem] font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    EMITIR BOLETA <span className="opacity-50">|</span> S/ {total.toFixed(2)}
                  </button>
                </div>
                
              </div>
            </div>
      
    );
  }