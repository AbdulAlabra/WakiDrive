import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from "react-native"


class Loading extends Component {
    state = {

    }
    render() {
        return (
            <View style={{
                flex: 1,
                height: "100%",
                width: "100%",
                // position: "absolute",
                justifyContent: "center",
                opacity: 1
            }}>
                <ActivityIndicator
                    size="large"
                    color="#ffffff"
                />
            </View>

        );
    }
}
const styles = StyleSheet.create({
    container: {

    }
});


export default Loading;