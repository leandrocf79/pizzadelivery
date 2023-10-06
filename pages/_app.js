import Layout from "../components/Layout";
import "../styles/globals.css";
import store from "../redux/store";
import { Provider } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function MyApp({ Component, pageProps }) {
  return (
    <PayPalScriptProvider paypalOptions={{"client-id" : process.env.PAYPAL_CLIENT_ID  }}>
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
    </PayPalScriptProvider>
  );
}

export default MyApp;
