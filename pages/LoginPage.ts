import { Page } from "@playwright/test";

export class LoginPage { // class é uma estrutura que define um objeto, e o construtor é um método especial usado para criar e inicializar objetos criados a partir da classe. Ele é chamado automaticamente quando uma nova instância da classe é criada.
    page: Page;
    constructor(page: Page) { //constructor é um método especial usado para criar e inicializar objetos criados a partir da classe. Ele é chamado automaticamente quando uma nova instância da classe é criada.
        this.page = page
    }

    async acessaPagina() {
        await this.page.goto('http://paybank-mf-auth:3000/');//estou usando this para acessar a propriedade page da classe LoginPage, que foi inicializada no construtor. Isso permite que o método acessaPage utilize o objeto page para navegar até a URL especificada.
    }
    async informaCpf(cpf: string) {
        await this.page.getByRole('textbox', { name: 'Digite seu CPF' }).fill(cpf);
        await this.page.getByRole('button', { name: 'Continuar' }).click();
    }
    async informaSenha(senha: string) {
        for (const digito of senha) {
            await this.page.getByRole('button', { name: digito }).click();

        }
        await this.page.getByRole('button', { name: 'Continuar' }).click();


    }
    async informaCodigo2FA(code: string) {
        await this.page.getByRole('textbox', { name: '000000' }).fill(code);
        await this.page.getByRole('button', { name: 'Verificar' }).click();
    }
    
}
