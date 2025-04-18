export interface User {
   id: string;
   email: string;
   name: string;
   auth_id: string;
   created_at: Date;
   updated_at: Date;
   avatar: string;
}

export interface Shapes {
   id: string;
   design_id: string;
   props: string;
   created_at: Date;
   updated_at: Date;
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

export interface UserImage {
   id: string;
   user_id: string;
   design_id: number;
   image_url: string;
   size: number;
   created_at: Date;
   updated_at: Date;
   image_id: string;
}
