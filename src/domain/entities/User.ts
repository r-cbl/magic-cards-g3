import { Card } from "./Card";
import { Publication } from "./Publication";

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private readonly id: string;
  private name: string;
  private email: string;
  private password: string;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private publications: Publication[];
  private cards: Card[];

  constructor(props: UserProps) {
    this.id = props.id || this.generateId();
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.publications = [];
    this.cards = [];
  }

  public doIHaveThisCard(card: Card): boolean {
    return this.cards.some(c => c.isSameCard(card)); //TODO: despues hay que cambiarlo para que use el repositorio.
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

  public addCard(card: Card): void {
    this.cards.push(card);
  }

  // Check if password matches
  public isPasswordValid(plainPassword: string, compareFunction: (plain: string, hashed: string) => Promise<boolean>): Promise<boolean> {
    return compareFunction(plainPassword, this.password);
  }
} 