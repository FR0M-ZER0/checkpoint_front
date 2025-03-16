import { useState, useEffect } from "react";

const Ferias = () => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [ferias, setFerias] = useState([]);
  const [erro, setErro] = useState("");
  const colaboradorId = 1; // Ajustar conforme necessário

  useEffect(() => {
    fetch(`http://localhost:8080/ferias/${colaboradorId}`)
      .then((res) => res.json())
      .then((data) => setFerias(data))
      .catch((err) => console.error("Erro ao buscar férias:", err));
  }, []);

  const handleSolicitarFerias = async () => {
    if (ferias.length >= 3) {
      setErro("Você já atingiu o limite de 3 períodos de férias no ano.");
      return;
    }

    const response = await fetch("http://localhost:8080/ferias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ colaboradorId, dataInicio, dataFim }),
    });

    if (response.ok) {
      alert("Férias solicitadas com sucesso!");
      setFerias([...ferias, { dataInicio, dataFim }]);
    } else {
      setErro("Erro ao solicitar férias.");
    }
  };

  return (
    <div>
      <h1>Solicitação de Férias</h1>
      <input
        type="date"
        value={dataInicio}
        onChange={(e) => setDataInicio(e.target.value)}
      />
      <input
        type="date"
        value={dataFim}
        onChange={(e) => setDataFim(e.target.value)}
      />
      <button onClick={handleSolicitarFerias}>Solicitar</button>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      
      <h2>Férias cadastradas:</h2>
      <ul>
        {ferias.map((feria, index) => (
          <li key={index}>
            {feria.dataInicio} - {feria.dataFim}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ferias;
