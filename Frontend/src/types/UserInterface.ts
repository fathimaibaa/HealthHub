export type UserInterface = {
    _id: string;
    name: string;
    phoneNumber?:number;
    email: string;
    profilePicture?: string;
    role: "user";
    age?:number,
    gender:string,
    isVerified: boolean;
    isBlocked: boolean;
    bookmarks?: string[];
    createdAt: Date;
  };