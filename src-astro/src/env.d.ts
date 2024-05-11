/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Property 'authorized' does not exist on type 'Locals'.
declare namespace App {
    interface Locals {
        authorized: boolean;
        user: string;
    }
}