import { Page } from "@playwright/test";

export class DashPage{
    page:Page
    constructor(page:Page){
        this.page = page
    }
    async obterSldo() {
        return this.page.locator('#account-balance')
    }
}