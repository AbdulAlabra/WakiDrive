

const orderDetails = async (obj) => {
    let name = obj.name
    if (name) {
        let order = obj
        //console.log(order)
        let additionalInstructions = order.additionalInstructions === undefined ? "not available" : order.additionalInstructions
        let items = order.items.reduce((prev, product) => {
            let name = product.item
            let price = product.price === undefined ? "not available" : product.price
            let color = (product.color === "") ? 'not available' : product.color
            let photo = (product.photo === 'url') ? 'not available' : 'we have url'
            let quantity = product.quantity === undefined ? 'not available' : product.quantity
            let size = (product.size === "") ? 'not available' : product.size
            let text = `\nProduct: ${name}\nPrice: ${price}\nColor: ${color}\nSize: ${size}\nQuantity: ${quantity}\nPhoto: ${photo}\n__________________`
            return prev + text
        }, "")
        return { total: order.items.length, name: name, orderDetails: items, additionalInstructions: additionalInstructions }
    }
    else {
        return { name: 'Final Destination !', orderDetails: 'Make Sure You Do not Hit this button again until you deliver the item to customer' }
    }
}



export default orderDetails