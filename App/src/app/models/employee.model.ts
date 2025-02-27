
export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: Date;
    gender: string;
    email: string;
    phoneNumber: string;
    address: string;
    username: string;
    position: string;
    department: string;
    role: string
    active?: boolean;
    jmbg: string;
  }

export interface Message {
    message: string;
}
