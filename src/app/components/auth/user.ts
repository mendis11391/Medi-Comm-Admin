export enum Role {
    user = 'user',
    admin = 'admin',
    sales = 'sales'
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