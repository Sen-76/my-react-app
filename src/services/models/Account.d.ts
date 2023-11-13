declare namespace Account {
  export interface IAccountModel {
    id: string;
    userName: string;
    userEmail: string;
    fullName: string;
    userPhone: string;
    dob: Date;
    gender: number;
    userRole?: string | null;
    userStar: number;
    userDepartment?: string | null;
    teamId: string | null;
    createdDate: DateTime;
    updateDate: DateTime;
    deactiveDate: DateTime | null;
    status: number;
    jobTitle: string;
    password: string;
    previousPassword: string;
  }
  export interface IAccountCreateModel {
    userEmail: string;
    userName: string;
    fullName: string;
    userPhone: string;
    dob: Date;
    gender: number;
    jobTitle: string;
    userDepartment?: string;
    teamId?: string;
    userRole?: string;
  }
  export interface IAccountUpdateModel {
    id: string;
    userName: string;
    fullName: string;
    userPhone: string;
    dob: Date;
    gender: 0;
    userRole: string;
    userStar: 0;
    userDepartment: string;
    teamId: string;
    status: 0;
    jobTitle: string;
  }
  export interface IAccountDeleteModel {
    isHardDelete: boolean;
    id: string[];
  }
  export interface IChangePasswordModel {
    userId?: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword?: string;
  }
}
