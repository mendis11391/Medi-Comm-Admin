export interface KYC {
    id:number,
    kyc_id:number,
    customer_id:number,
    customer_type:string,
    comments:string,
    kyc_status:string,
    created_at:Date,
    modified_at:Date,
    status:boolean,
    alternate_mobile:string,
    social_link:string,
    aadhar_no:string,
    address_type:number,
    ref1_name:string,
    ref1_relation:string,
    ref1_ph:string,
    ref2_name:string,
    ref2_relation:string,
    ref2_ph:string,
    type_of_org:string,
    company_name:string,
    gst_no:string,
    website:string,
    phone:string,
    firstName:string,
    lastName:string,
    designation:string,
    mobile:string,
    email:string,
    ref1_designation:string,
    ref1_mobile:string,
    ref1_officialMailId:string,
    ref2_designation:string,
    ref2_mobile:string,
    ref2_officialMailId:string,
    editable:boolean,
    expiry_date:Date,
    approved_date:Date,
    company:string,
    occupation:string
}