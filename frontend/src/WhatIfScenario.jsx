import React, { useState } from "react";

function WhatIfScenario() {
  const [inputs, setInputs] = useState({
    discount: 20,
    duration: 30,
    target_size: 5000,
    budget: 50000,
  });
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/what_if", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      setScenarios(data.scenarios || []);
    } catch (err) {
      setScenarios([]);
    }
    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: "64px auto 0 auto",
      background: "#222855",
      borderRadius: "16px",
      padding: "32px 24px",
      boxShadow: "0 8px 32px 0 #18193A",
      border: "2px solid #23247A"
    }}>
      <h2 style={{
        color: "#A0A7FF",
        fontWeight: 700,
        letterSpacing: 1,
        marginBottom: 16,
        textAlign: "center"
      }}>
        <span role="img" aria-label="scenario">🧮</span> What-If Scenario Generator
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Discount (%)</label>
          <input className="input-modern" name="discount" type="number" min="5" max="50" value={inputs.discount} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Campaign Duration (days)</label>
          <input className="input-modern" name="duration" type="number" min="7" max="180" value={inputs.duration} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Target Group Size</label>
          <input className="input-modern" name="target_size" type="number" min="1000" max="100000" value={inputs.target_size} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Budget ($)</label>
          <input className="input-modern" name="budget" type="number" min="10000" max="500000" value={inputs.budget} onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading}
          style={{
            background: "linear-gradient(90deg, #7b69ff 15%, #47d7ff 90%)",
            color: "white",
            borderRadius: 8,
            padding: "10px 22px",
            letterSpacing: 1,
            fontWeight: 600,
            border: "none",
            marginTop: 6,
            boxShadow: "0 1px 6px #23247a44",
            width: "100%",
            fontSize: "1rem"
          }}>
          {loading ? "Calculating..." : "Generate Scenarios"}
        </button>
      </form>
      <hr style={{margin:"24px 0px", borderColor:"#444"}}/>
      <h3 style={{ color: "#A0A7FF", marginBottom: "6px" }}>Scenarios:</h3>
      {!scenarios.length && <div style={{color:"#fff2", marginBottom:"10px"}}>No scenario yet. Fill values above and press Generate.</div>}
      {scenarios.map((sc, idx) => (
        <div key={idx} className="scenario-card" style={{
          borderLeft: `8px solid ${
            idx === 0 ? "#45e6b6" :
            idx === 1 ? "#a069ff" :
            "#f87171"
          }`,
          background: "rgba(33, 38, 66, .97)",
          borderRadius: "16px",
          marginBottom: 20,
          padding: "18px 32px 14px 24px",
          boxShadow: "0 2px 18px 0 #080c1b66",
          transition: "transform 0.13s",
          transform: "scale(1)",
          fontSize: "1.18rem",
          fontFamily: "inherit"
        }}>
          <b style={{
            fontWeight: 700,
            letterSpacing: 1,
            fontSize: "1.22em"
          }}>{sc.name}:</b>{" "}
          <span style={{fontWeight:500}}>
            Discount <span style={{color:"#60f1ff", fontWeight: 600}}>{sc.discount}%</span>,
            ROI <span style={{color:"#dbfaff", fontWeight: 600}}>{sc.roi}%</span>,
            Probability <span style={{color:"#99ffcc", fontWeight: 600}}>{sc.probability}</span>,
            Conversion Rate <span style={{color:"#ffaeae", fontWeight: 600}}>{sc.conversion_rate}%</span>,
            Risk: <span style={{color:"#ffd59e", fontWeight: 700}}>{sc.risk_level}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default WhatIfScenario;
