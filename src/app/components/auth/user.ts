export enum Role {
    superAdmin='superAdmin',
    user = 'user',
    admin = 'admin',
    sales = 'sales',
    delivery = 'delivery'
}

export class UserData {
    user_id: string;
    uname: string;
    email: string;    
    usertype: string;
    data:any;
    token?: string;
}

export class User {
    // user_id: string;
    // uname: string;
    // email: string;    
    // usertype: string;
    // data:any;
    role: Role;
    // token?: string;
}