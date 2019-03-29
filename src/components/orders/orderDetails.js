import React from "react";

const orderDetails = async (obj) => {
    let name = obj.storeName
    if (name) {
        let order = obj.orderSummary
        let additionalInstructions = order.additionalInstructions
        let items = order.products.reduce((prev, product) => {
            let name = product.productName
            let color = (product.color === "") ? 'not available' : product.color
            let photo = (product.photo === 'url') ? 'not available' : 'we have url'
            let quantity = product.quantity
            let size = (product.size === "") ? 'not available' : product.size
            let text = `\nProduct: ${name}\nColor: ${color}\nSize: ${size}\nQuantity: ${quantity}\nPhoto: ${photo}\n__________________`
            return prev + text
        }, "")
        return { total: order.products.length, name: name, orderDetails: items, additionalInstructions: additionalInstructions }
    }
    else {
        return { name: 'Final Destination !', orderDetails: 'Make Sure You Do not Hit this button again until you deliver the item to customer' }
    }
}



export default orderDetails