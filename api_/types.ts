export interface User {
   id: string;
   email: string;
   name: string;
   auth_id: string;
   created_at: Date;
   updated_at: Date;
   avatar: string;
}

export interface Design {
   id: string;
   user_id: string;
   width: number;
   height: number;
   category?: number;
   description: string;
   name: string;
   created_at: Date;
   updated_at: Date;
}
