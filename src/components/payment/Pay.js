import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { NetworkInfo } from 'react-native-network-info';
import paytabs from 'paytabs_api';





class PayPage extends Component {
    state = {
        html: null,
       
    }

    render() {
        return (
            <WebView
                source={{ uri: this.state.PayPage }}
                style={{ marginTop: 20 }}
            />
        );
    }
};
export default PayPage
