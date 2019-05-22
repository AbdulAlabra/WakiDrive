import React from 'react';
import { Button } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome"




const RoundedButton = ({ backgroundColor, iconColor, circleSize, icon, iconSize, onPress, position, positionTop }) => {
    if (position === "center") {
        styles.Circle.right = null
        styles.Circle.alignSelf = "center"
    }
    if (position === "right") {
        styles.Circle.right = 0.5
    }
    if (position === "left") {
        styles.Circle.right = null
    }
    styles.Circle.backgroundColor = backgroundColor
    styles.Circle.top = (positionTop !== undefined) ? positionTop : null;
    styles.Circle.width = (circleSize !== undefined) ? circleSize : 60;
    styles.Circle.height = (circleSize !== undefined) ? circleSize : 60;
    styles.Circle.borderRadius = (circleSize !== undefined) ? circleSize / 2 : 60 / 2;

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
        alignSelf: null,
        bottom: 0.5,
        opacity: 0.9,

    },
}

export default RoundedButton