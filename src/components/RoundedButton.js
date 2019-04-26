import React from 'react';
import { Button } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome"




const RoundedButton = ({ backgroundColor, iconColor, icon, iconSize, onPress, position }) => {
    styles.Circle.backgroundColor = backgroundColor
    styles.Circle.right = (position === "left") ? null : 0.05; 

    return (
        <Button style={styles.Circle} onPress={onPress}>
            <Icon color={iconColor || "white"} name={icon || "location-arrow"} size={iconSize || 13} />
        </Button>

    )
}

const styles = {
    Circle: {
        justifyContent: "center",
        position: "absolute",
        borderRadius: 60 / 2,
        height: 60,
        width: 60,
        backgroundColor: "black",
        alignSelf: "flex-start",
        margin: 30,
        right: 0.5,
        bottom: 0.5,
        opacity: 0.9
    },
}

export default RoundedButton