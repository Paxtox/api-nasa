import React, { useEffect, useState } from 'react';
import './App.css';

export default function () {
  const [photos, setPhotos] = useState([]);
  const [carga, setCarga] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtroCamara, setFiltroCamara] = useState(null);

  useEffect(()=>{
    async function fetchSoli(){
      const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=xIO5YgYlE6QP1jJAxCGmYsUOfm7GJzvlvKtEEHSw`);
      const data = await response.json();
      setPhotos(data.photos);
      setCarga(true);
    }
    fetchSoli();
  },[])

  const numPaginas = Math.ceil(photos.length / 25);
  let fotosFiltradas = photos;
  if (filtroCamara) {
    fotosFiltradas = photos.filter(
      (foto) => foto.camera.name === filtroCamara
    );
  }
  const fotosPorPagina = fotosFiltradas.slice(
    (paginaActual - 1) * 25,
    paginaActual * 25
  );

  const opcionesCamara = [...new Set(photos.map((foto) => foto.camera.name))];

  return (
    <div className="container">
      {carga ? (
        <>
          <div className="filter">
            <select
              className="filter-select"
              value={filtroCamara || ""}
              onChange={(e) => setFiltroCamara(e.target.value || null)}
            >
              <option value="">Todas las cámaras</option>
              {opcionesCamara.map((camara) => (
                <option key={camara} value={camara}>
                  {camara}
                </option>
              ))}
            </select>
          </div>
          {fotosPorPagina.length !== 0 ? (
            <div className="image-grid">
              {fotosPorPagina.map((o) => {
                return (
                  <div key={o.id}>
                    <img className='photo' src={o.img_src} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div>No hay resultados</div>
          )}
          {fotosPorPagina.length > 0 && (
            <div className="pagination">
              <button
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
              >
                Anterior
              </button>
              <button
                disabled={paginaActual === numPaginas}
                onClick={() => setPaginaActual(paginaActual + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      ) : (
        <div>Cargando datos</div>
      )}
    </div>
  );
}