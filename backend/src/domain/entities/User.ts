import { Publication } from "./Publication";
import { Role } from "./Role";

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  role?:Role;
}

export class User {
  private readonly id: string;
  private name: string;
  private email: string;
  private password: string;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private publications: Publication[];
  private role: Role;

  constructor(props: UserProps) {
    this.id = props.id || this.generateId();
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.publications = [];
    this.role = props.role || Role.USER;
  }

  public changeToAdmin(){
    this.role = Role.ADMIN
  }

  public changeToUser(){
    this.role = Role.USER
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Setters
  public setName(name: string): void {
    this.name = name;
    this.updateTimestamp();
  }

  public setEmail(email: string): void {
    this.email = email;
    this.updateTimestamp();
  }

  public setPassword(password: string): void {
    this.password = password;
    this.updateTimestamp();
  }

  // Helper methods
  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  public isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }
  // To plain object for data transfer
  public toJSON(): Omit<UserProps, 'password'> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public addPublication(publication: Publication): void {
    this.publications.push(publication);
  }

  // Check if password matches
  public isPasswordValid(plainPassword: string, compareFunction: (plain: string, hashed: string) => Promise<boolean>): Promise<boolean> {
    return compareFunction(plainPassword, this.password);
  }
} 