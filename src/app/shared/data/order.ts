export interface Orders {
    primary_id?:string,
    order_id?:string,
    customer_id?:number,
    subTotal?:number,
    damageProtection?:number,
    totalSecurityDeposit?:number,
    discount?:number,
    grandTotal?:number,
    promo?:string,
    firstName?:string,
    lastName?:string,
    billingAddress?:number,
    shippingAddress?:number,
    orderType_id?:number,
    order_type?:string,
    orderStatus?:string,
    paymentStatus?:string,
    deliveryStatus?:string,
    refundStatus?:string,
    createdBy?:number,
    modifiedBy?:number,
    createdAt?:Date,
    modifiedAt?:Date,
    orderItem?:[],
    address?:[]

    total?:number
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
    // address: string,
    city: string,
    state: string,
    pincode: number,
    selfpickup: number,
    coupon: string,
    status: string,
    delivery_status: string,
    refund_status: string,
    order_item_id?:number,
    cr?:any,
    request_status?:any,
    request_id?:any
}

export interface OrderItems {
    order_item_id:number,
    order_id:number,
    customer_id:number,
    renewals_timline:string,
    orderType_id:number,
    startDate:Date,
    endDate:Date,
    delivery_status:number,
    status:boolean
}

export interface Assets {
    asset_id?: number,
    asset_no?: string,
    asset_type?:string,
    warranty_expiry?:Date,
    procument_date?:Date,
    availability?:boolean,
    startDate?:Date,
    EndDate?:Date,
    nextStartDate?:Date
}

