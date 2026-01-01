const generateOrderNumber = async (Model, prefix = 'PO') => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    let counter = 1;
    let orderNumber;
    let exists = true;

    while (exists) {
        orderNumber = `${prefix}-${dateStr}-${String(counter).padStart(4, '0')}`;
        const existing = await Model.findOne({
            [prefix === 'PO' ? 'orderNumber' : 'returnNumber']: orderNumber
        });
        if (!existing) {
            exists = false;
        } else {
            counter++;
        }
    }

    return orderNumber;
};

module.exports = generateOrderNumber;
