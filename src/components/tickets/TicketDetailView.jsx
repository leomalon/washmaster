import { ArrowLeft, MessageCircle, Printer } from "lucide-react";

export default function TicketDetailView({ boleta, setView, sendWhatsApp, resetForm }) {

    if (!boleta) return null;
  
    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-10 flex flex-col items-center font-mono">
  
        {/* ACTION BUTTONS */}
        <div className="w-full max-w-[400px] flex flex-col gap-3 mb-6 print:hidden">
  
          <button
            onClick={() => setView("form")}
            className="w-full bg-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-slate-600 shadow-sm border border-slate-200"
          >
            <ArrowLeft size={20} /> CORREGIR DATOS
          </button>
  
          <div className="flex gap-3">
  
            <button
              onClick={sendWhatsApp}
              className="flex-[2] bg-green-600 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg hover:bg-green-700 active:scale-95 transition-all"
            >
              <MessageCircle size={22} /> ENVIAR POR WHATSAPP
            </button>
  
            <button
              onClick={() => window.print()}
              className="flex-1 bg-slate-900 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <Printer size={20} />
            </button>
  
          </div>
        </div>
  
        {/* TICKET */}
        <div className="bg-white w-full max-w-[400px] p-8 shadow-2xl rounded-sm text-slate-900 border-t-8 border-slate-900 ticket-container">
  
          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-6 space-y-1">
            <div className="font-black text-2xl tracking-tighter border-2 border-slate-900 px-3 py-1 mb-2">
              WASHMASTER
            </div>
  
            <p className="text-[10px] font-bold">LAVANDERÍAS DEL PERÚ S.A.C.</p>
            <p className="text-[10px]">RUC: 20123456789</p>
            <p className="text-[10px]">AV. LAS FLORES 456, SAN BORJA</p>
          </div>
  
          <div className="border-t-2 border-slate-900 my-4"></div>
  
          {/* BOLETA INFO */}
          <div className="text-center mb-6">
            <p className="text-[10px] font-bold">BOLETA DE VENTA ELECTRÓNICA</p>
            <p className="text-lg font-bold">{boleta.serie}</p>
          </div>
  
          <div className="space-y-1 text-[11px] mb-6">
  
            <div className="flex justify-between">
              <span>FECHA:</span>
              <span>{boleta.fechaEmision}</span>
            </div>
  
            <div className="flex justify-between font-bold">
              <span>CLIENTE:</span>
              <span className="text-right">{boleta.cliente}</span>
            </div>
  
            <div className="flex justify-between">
              <span>TEL:</span>
              <span>{boleta.whatsapp || "---"}</span>
            </div>
  
            <div className="flex justify-between text-blue-700 font-bold border-y border-slate-100 py-2 my-2">
              <span>ENTREGA ESTIMADA:</span>
              <span>{boleta.entrega}</span>
            </div>
  
          </div>
  
          {/* ITEMS */}
          <div className="space-y-3 mb-6">
  
            {boleta.prendas.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs items-start">
  
                <span className="max-w-[70%] leading-tight uppercase">
                  {item.descripcion || "PRENDA"}
                </span>
  
                <span className="font-bold">
                  S/ {Number(item.precio).toFixed(2)}
                </span>
  
              </div>
            ))}
  
          </div>
  
          {/* TOTAL */}
          <div className="flex justify-between items-center border-t-2 border-slate-900 pt-4 mb-8">
  
            <span className="font-bold text-lg">TOTAL:</span>
  
            <span className="font-bold text-2xl">
              S/ {boleta.total.toFixed(2)}
            </span>
  
          </div>
  
          {/* CONTROL ID */}
          <div className="bg-slate-50 border-2 border-slate-900 p-4 text-center rounded-xl">
  
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
              ID DE CONTROL
            </p>
  
            <p className="text-5xl font-black tracking-widest text-slate-900">
              {boleta.idControl}
            </p>
  
          </div>
  
          {/* TRACKING */}
          <div className="mt-8 pt-4 border-t border-dashed border-slate-200 text-center">
  
            <p className="text-[9px] text-slate-400 mb-2 tracking-tight">
              ESCANEA O VISITA: {boleta.trackingUrl}
            </p>
  
            <div className="bg-slate-100 w-16 h-16 mx-auto rounded flex items-center justify-center">
  
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-slate-400 rounded-sm"></div>
                ))}
              </div>
  
            </div>
  
          </div>
  
        </div>
  
        {/* NEW TICKET BUTTON */}
        <button
          onClick={resetForm}
          className="mt-8 text-slate-500 font-bold text-sm underline print:hidden"
        >
          INICIAR NUEVA BOLETA
        </button>
  
        {/* PRINT STYLE */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @media print {
            body { background: white !important; padding: 0 !important; }
            .print\\:hidden { display: none !important; }
            .ticket-container { 
              box-shadow: none !important; 
              border-top: none !important; 
              max-width: 100% !important; 
            }
          }
          `
        }} />
  
      </div>
    );
  }