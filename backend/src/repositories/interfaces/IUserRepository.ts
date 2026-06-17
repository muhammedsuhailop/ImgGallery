import { User } from "../../domain/entities/User";
import { RegisterDto } from "../../modules/auth/dto/RegisterDto";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  findByPhoneNumber(phoneNumber: string): Promise<User | null>;

  create(data: RegisterDto): Promise<User>;
}
