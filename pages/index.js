import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Add from "../components/Add";
import AddButton from "../components/AddButton";
import Featured from "../components/Featured";
import PizzaList from "../components/PizzaList";
import styles from "../styles/Home.module.css";

export default function Home({ pizzaList, admin }) {
  const [close, setClose] = useState(true);
  
  return (
    <div className={styles.container}>
      <Head>
        <html lang="pt-br" />
        <meta httpEquiv="content-language" content="pt-BR" />
        <meta charSet="UTF-8" />
        <title>Pizza Restaurant</title>
        <meta name="description" content="Best pizza shop in town" />
        <link rel="icon" href="/favicon.ico" />
        {/* Configurações de segurança */}
        {/* Define uma política de segurança de transporte estrita, forçando a comunicação com a aplicação a ser feita apenas via HTTPS, incluindo todos os subdomínios e pré-carregando a política no navegador. */}
        <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains; preload" />

        {/* Define uma política de segurança de conteúdo, especificando quais fontes de conteúdo são permitidas na página, restringindo a execução de scripts apenas ao domínio local e ao localhost:3000. */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' localhost:3000;" />

        {/* Instrui o navegador a não adivinhar o tipo MIME do conteúdo e, em vez disso, usar o tipo MIME especificado. */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />

        {/* Impede que a página seja incorporada em um <iframe> ou <frame> de qualquer origem externa (valor DENY). */}
        <meta httpEquiv="X-Frame-Options" content="DENY" />

        {/* Define como as informações de referência (URL de origem) são compartilhadas quando o usuário navega para outras páginas, permitindo apenas compartilhamento restrito de referência cruzada. */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* Instrui o navegador a não adivinhar o tipo MIME do conteúdo e, em vez disso, usar o tipo MIME especificado. */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />

        {/* Impede que a página seja incorporada em um <iframe> ou <frame> de qualquer origem externa (valor DENY). */}
        <meta httpEquiv="X-Frame-Options" content="DENY" />

        {/* Define as permissões para recursos da web, como câmera, microfone e geolocalização, controlando quais recursos podem ser acessados pela página. */}
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />

        {/* Controla o acesso a APIs e recursos específicos, como geolocalização e notificações push, permitindo apenas acesso a partir do domínio atual. */}
        <meta httpEquiv="Feature-Policy" content="geolocation 'self'; push 'self'" />

        {/* Configura a aplicação para cumprir a política de Certificado de Transparência (CT), forçando a verificação da existência de um certificado CT válido e especificando onde os relatórios de CT devem ser enviados. */}
        <meta httpEquiv="Expect-CT" content="enforce, max-age=30, report-uri='https://example.com/report'" />

        {/* Define a política de incorporação de origem cruzada, restringindo a capacidade de incorporação em outras origens e exigindo que seja do mesmo domínio. */}
        <meta httpEquiv="Cross-Origin-Embedder-Policy" content="require-corp" />

        {/* Controla como as janelas e trabalhadores compartilham a mesma origem, permitindo apenas a mesma origem para janelas e trabalhadores. */}
        <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin" />


      </Head>
      <Featured />
      {admin === true ? <AddButton setClose={setClose} /> : null}
      <PizzaList pizzaList={pizzaList} />
      {!close && <Add setClose={setClose} />}
    </div>
  );
}








export const getServerSideProps = async (ctx) => {
  const myCookie = ctx.req?.cookies || "";
  let admin = false;

  if (myCookie.token === process.env.TOKEN) {
    admin = true;
  }

  const res = await axios.get("http://localhost:3000/api/products");
  return {
    props: {
      pizzaList: res.data,
      admin,
    },
  };
};
