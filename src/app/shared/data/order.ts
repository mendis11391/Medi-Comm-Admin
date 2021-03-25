export interface Orders {
    id?: number,
    userId?: string,
    ordid?:string;
    txnid: string,
    orderdate: [],
    amount: number,
    securitydeposit: number,
    checkoutItemData: [],
    pinfo: [],
    fname: string,
    lname: string,
    mobile: number,
    email: string,
    address: string,
    city: string,
    state: string,
    pincode: number,
    selfpickup: number,
    coupon: string,
    status: string,
    delivery_status: string,
    refund_status: string
}