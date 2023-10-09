import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/OrderDetail.module.css";

const OrderDetail = ({ total, createOrder }) => {
  const [customer, setCustomer] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (cep.length === 9) {
      // Remove o hífen antes de fazer a consulta à API
      const cepWithoutHyphen = cep.replace('-', '');

      // Faz a consulta de CEP quando o campo CEP tiver 8 caracteres (sem hífen)
      axios
        .get(`https://viacep.com.br/ws/${cepWithoutHyphen}/json/`)
        .then((response) => {
          const data = response.data;
          if (!data.erro) {
            setStreet(data.logradouro);
            setNeighborhood(data.bairro);
            setCity(data.localidade);
          }
        })
        .catch((error) => {
          console.error("Erro ao consultar CEP:", error);
          alert("Erro ao consultar CEP");
        });
    }
  }, [cep]);

  const formatCEP = (input) => {
    // Remove todos os caracteres não numéricos e hífens
    const numericInput = input.replace(/[^\d]/g, "");
  
    // Adiciona hífen no lugar correto
    let formattedCEP = "";
    if (numericInput.length >= 5) {
      formattedCEP = `${numericInput.slice(0, 5)}-${numericInput.slice(5, 8)}`;
    } else {
      formattedCEP = numericInput;
    }
  
    setCep(formattedCEP); // Atualiza o estado com o CEP formatado
  };

  const handleCEPChange = (e) => {
    formatCEP(e.target.value); // Formata o CEP e atualiza o estado
  };

  const formatPhoneNumber = (input) => {
    // Remove todos os caracteres não numéricos
    const numericInput = input.replace(/\D/g, "");

    // Aplica a formatação desejada: (XX) X-XXXX-XXXX
    let formattedNumber = "";
    if (numericInput.length > 0) {
      formattedNumber = `(${numericInput.slice(0, 2)}) `;
    }
    if (numericInput.length > 2) {
      formattedNumber += `${numericInput.slice(2, 3)}-`;
    }
    if (numericInput.length > 3) {
      formattedNumber += `${numericInput.slice(3, 7)}-`;
    }
    if (numericInput.length > 7) {
      formattedNumber += numericInput.slice(7, 11);
    }
    
    setPhoneNumber(formattedNumber); // Atualiza o estado com o número formatado
  };

  const handlePhoneNumberChange = (e) => {
    formatPhoneNumber(e.target.value); // Formata o número e atualiza o estado
  };


  const handleClick = () => {
    // Verifica se todos os campos estão preenchidos corretamente
    if (
      customer.trim() === "" ||
      cep.trim() === "" ||
      street.trim() === "" ||
      number.trim() === "" ||
      //neighborhood.trim() === "" ||
      //city.trim() === "" ||
      phoneNumber.replace(/\D/g, "").length !== 11 // Verifique o comprimento aqui
    ) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    // Cria o endereço completo
    const address = `${street}, ${number}, ${complement}, ${neighborhood}, ${city}`;

    // Cria o pedido
    createOrder({ customer, address, total, method: 0, phoneNumber });
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Verifique seu endereço</h1>
        <div className={styles.item}>
          <label className={styles.label}>Nome e sobrenomes</label>
          <input
            placeholder="Nome e sobrenomes"
            type="text"
            className={`${styles.input} ${customer.trim() === "" ? styles.emptyHighlight : ''}`}
            onChange={(e) => setCustomer(e.target.value)}
            value={customer}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>CEP</label>
          <input
            placeholder="CEP (Preenchimento automático)"
            type="text"
            className={`${styles.input} ${cep.trim() === "" ? styles.emptyHighlight : ''}`}
            onChange={handleCEPChange}
            value={cep}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Rua/Av</label>
          <input
            placeholder="Rua ou Avenida"
            type="text"
            className={styles.input}
            onChange={(e) => setStreet(e.target.value)}
            value={street}
          />
        </div>
       
        <div className={styles.item}>
          <label className={styles.label}>Número</label>
          <input
            placeholder="Número"
            type="text"
            className={`${styles.input} ${number.trim() === "" ? styles.emptyHighlight : ''}`}
            onChange={(e) => setNumber(e.target.value)}
            value={number}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Complemento</label>
          <input
            placeholder="Complemento"
            type="text"
            className={`${styles.input} ${complement.trim() === "" ? styles.emptyHighlight : ''}`}
            onChange={(e) => setComplement(e.target.value)}
            value={complement}
          />
        </div>

        <div className={styles.item}>
          <label className={styles.label}>Bairro</label>
          <input
            placeholder="Bairro"
            type="text"
            className={styles.input}
            onChange={(e) => setNeighborhood(e.target.value)}
            value={neighborhood}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Cidade</label>
          <input            
            placeholder="Cidade"
            type="text"
            className={styles.input}
            onChange={(e) => setCity(e.target.value)}
            value={city}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>WhatsApp</label>
          <input
            type="text"
            placeholder="(19) 9-2345-6789"
            className={`${styles.input} ${phoneNumber.trim() === "" ? styles.emptyHighlight : ''}`}
            onChange={handlePhoneNumberChange}
            value={phoneNumber}
          />
        </div>
        <button className={styles.button} onClick={handleClick}>
          Confirmar endereço
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
