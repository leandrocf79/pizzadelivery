import styles from "../styles/Cart.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import axios from "axios";
import { useRouter } from "next/router";
import { reset } from "../redux/cartSlice";
import OrderDetail from "../components/OrderDetail";
import React, { forwardRef } from 'react';



const Cart = () => {
  

  const [homePg, setHomePg] = useState(false);

  const cart = useSelector((state) => state.cart);
  const [open, setOpen] = useState(false);
  const [cash, setCash] = useState(false);
  const amount = cart.total;
  const currency = "USD";
  const style = { layout: "vertical" };
  const dispatch = useDispatch();
  const router = useRouter();



  


  const createOrder = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/api/orders", data);
      if (res.status === 201) {
        dispatch(reset());
        router.push(`/orders/${res.data._id}`);
        
        // localStorage
        // Salvar no localStorage após o pedido ser criado com sucesso
        saveToLocalStorage(data);
      }
    } catch (err) {
      console.error(err);
    }
  };


  // Para garantir a exibição das opçoes de pagamento
  const [isPayPalButtonLoaded, setIsPayPalButtonLoaded] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      // Simule o carregamento das opções do PayPal
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 3 segundos
      setIsPayPalButtonLoaded(true);
    };

    fetchData();
  }, []);




  // Defina as opções do PayPalScriptProvider apenas uma vez fora do componente ButtonWrapper
  //'EH_u-GGUmBEvfrW09XAeBT83t2-M9AlnmvLwemA06KnKuEdd-ZXkOL3gnDTK0vby2blU4gkU9cbpd9UE',
  const paypalOptions = {
    
    components: "buttons",
    currency: "USD",
    "disable-funding": "card",
  };


  if (!paypalOptions["client-id"]) {
    console.error("Erro: A variável de ambiente PAYPAL_CLIENT_ID não está definida ou está configurada incorretamente.");
    // Você também pode lançar um erro para parar a execução do programa, se preferir.
    // throw new Error("A variável de ambiente PAYPAL_CLIENT_ID não está definida ou está configurada incorretamente.");
  }

  // Custom component to wrap the PayPalButtons and handle currency changes
  const ButtonWrapper = ({ currency, showSpinner }) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {

      const updatedOptions = {
        ...options,
        currency: currency,
      };
      // Defina as opções do PayPalScriptProvider apenas uma vez
      // Verifique se as opções foram alteradas antes de chamar o dispatch
      if (updatedOptions.currency !== options.currency) {
        dispatch({
          type: "resetOptions",
          value: updatedOptions,
        });
      }
      // DEIXAR ESSE COMETÁRIO ABAIXO PARA EVITAR LOOP EM CASO DE ERRO:
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, options]);

    

    return (
      <>
        {showSpinner && isPending && <div className="spinner" />}
        <PayPalButtons
          style={style}
          disabled={false}
          forceReRender={[amount, currency, style]}
          fundingSource={undefined}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount,
                    },
                  },
                ],
              })
              .then((orderId) => {
                // Seu código aqui após criar o pedido
                return orderId;
              });
          }}
          onApprove={function (data, actions) {
            return actions.order.capture().then(function (details) {
              const shipping = details.purchase_units[0].shipping;
              createOrder({
                customer: shipping.name.full_name,
                address: shipping.address.address_line_1,
                total: cart.total,
                method: 1,
              });
            });
          }}
        />
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Produto</th>
              <th>Nome</th>
              <th>Extras</th>
              <th>Preço</th>
              <th>Qtd</th>
              <th>Total</th>
            </tr>
          </tbody>
          <tbody>
            {cart.products.map((product) => (
              <tr className={styles.tr} key={product._id}>
                <td>
                  <div className={styles.imgContainer}>
                    <Image
                      src={product.img}
                      layout="fill"
                      objectFit="cover"
                      alt=""
                    />
                  </div>
                </td>
                <td>
                  <span className={styles.name}>{product.title}</span>
                </td>
                <td>
                  <span className={styles.extras}>
                    {product.extras.map((extra) => (
                      <span key={extra._id}>{extra.text}, </span>
                    ))}
                  </span>
                </td>
                <td>
                  <span className={styles.price}>${product.price}</span>
                </td>
                <td>
                  <span className={styles.quantity}>{product.quantity}</span>
                </td>
                <td>
                  <span className={styles.total}>
                    ${product.price * product.quantity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>Finalizar pedido</h2>
          
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b>R${cart.total}
          </div>
          
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Taxa de entrega:</b>R$5,00
          </div>
          <div className={styles.totalText}>
            <span>
              <b className={styles.totalTextTitle} style={{ fontWeight: 'bold', color: 'black' }}>Desconto:</b>
              <span style={{ color: 'red' }}>- R$5,00</span>
            </span>
          </div>
                    
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b>R${cart.total}
          </div>
          
          
          
          
          {open && amount>0 ? (
            <>
              {isPayPalButtonLoaded ? (
                
                <PayPalScriptProvider  options={paypalOptions}  > 
                    <ButtonWrapper currency={currency} showSpinner={true} />
                  </PayPalScriptProvider>
                ) : (
                  <>
                  
                  <p>Carregando <Image src="/img/loading-gif.gif" alt="Carregando" width={30} height={30} /></p>


                  <PayPalScriptProvider  options={paypalOptions}  > 
                    <ButtonWrapper currency={currency} showSpinner={true} />
                  </PayPalScriptProvider>
                  </>
                )}                      
               
              
            <div className={styles.paymentMethods}>
              
              <button                
                className={styles.payButton}
                onClick={() => setCash(true)}
              >
                Pagar na entrega
              </button>
              
            
            </div>
            
            </>
          ) : ( 
            <>          
            <button  onClick={() => setOpen(true)} className={styles.button} >
              Finalizar pedido
            </button>
            <button  onClick={() => { 
              // Redirecionar para a página home
              router.push('/'); }}   className={styles.buttonAddItens}>
            Adicionar mais itens
          </button>
          </> 
          )}
          
        </div>
      </div>
      {cash && <OrderDetail total={cart.total} createOrder={createOrder} />}
    </div>
  );
};

export default Cart;


