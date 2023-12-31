/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    user: {
      email: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      roles: string[];
    } | null
    isLoggedIn: boolean;
    isAdmin: boolean;
  }
}