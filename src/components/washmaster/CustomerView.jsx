export default function CustomerView({ boleta }) {

    if (!boleta) return null;
  
    return (
      <div>
  
        <h1>Estado del Pedido</h1>
  
        <p>ID: {boleta.idControl}</p>
        <p>Cliente: {boleta.cliente}</p>
        <p>Total: {boleta.total}</p>
  
      </div>
    );
  }