import { test, expect } from '@playwright/test';
import { getCode2FA } from '../suport/db';
import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';
import { LoginActions } from '../actions/LoginPage';
import { cleanJobs, getJob } from '../suport/redis'

type Usuario = {
  cpf: string;
  senha: string;
};

test('Nao deve logar quando o codigo de autenticacao for invalido', async ({ page }) => {
  const usuario: Usuario = {
    cpf: '00000014141',
    senha: '147258',
  }
  const loginPage = new LoginPage(page);//instanciando a classe LoginPage, passando o objeto page como argumento para o construtor da classe. Isso permite que a classe LoginPage tenha acesso ao objeto page e possa interagir com a página da web durante os testes.
  await loginPage.acessaPagina(); //chamando o método acessaPage da classe LoginPage para acessar a página de login do aplicativo. Isso é feito para garantir que o teste comece na página correta antes de realizar as ações de login.
  await loginPage.informaCpf(usuario.cpf); //chamando o método informaCpf da classe LoginPage para preencher o campo de CPF com o valor do CPF do usuário definido no objeto usuario. Isso é feito para simular a ação de um usuário digitando seu CPF na página de login.
  await loginPage.informaSenha(usuario.senha); //chamando o método informaSenha da classe LoginPage para preencher o campo de senha com o valor da senha do usuário definido no objeto usuario. Isso é feito para simular a ação de um usuário digitando sua senha na página de login.

  await loginPage.informaCodigo2FA('123456'); //chamando o método informaCodigo2FA da classe LoginPage para preencher o campo de código de autenticação de dois fatores com o valor do código obtido da função getCode2FA. Isso é feito para simular a ação de um usuário digitando o código de autenticação de dois fatores na página de login.

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});


test('Deve acessar a conta do usuário', async ({ page }) => {

  const loginPage = new LoginPage(page);//instanciando a classe LoginPage, passando o objeto page como argumento para o construtor da classe. Isso permite que a classe LoginPage tenha acesso ao objeto page e possa interagir com a página da web durante os testes.
  const dashPage = new DashPage(page);//instanciando a classe DashPage, passando o objeto page como argumento para o construtor da classe. Isso permite que a classe DashPage tenha acesso ao objeto page e possa interagir com a página da web durante os testes.
  const usuario: Usuario = {
    cpf: '00000014141',
    senha: '147258',
  }
  await cleanJobs() //chamando a função cleanJobs para limpar todos os jobs da fila de autenticação de dois fatores antes de iniciar o teste. Isso garante que o teste comece com uma fila limpa, sem mensagens antigas que possam interferir nos resultados dos testes.
  await loginPage.acessaPagina(); //chamando o método acessaPage da classe LoginPage para acessar a página de login do aplicativo. Isso é feito para garantir que o teste comece na página correta antes de realizar as ações de login.
  await loginPage.informaCpf(usuario.cpf); //chamando o método informaCpf da classe LoginPage para preencher o campo de CPF com o valor do CPF do usuário definido no objeto usuario. Isso é feito para simular a ação de um usuário digitando seu CPF na página de login.
  await loginPage.informaSenha(usuario.senha); //chamando o método informaSenha da classe LoginPage para preencher o campo de senha com o valor da senha do usuário definido no objeto usuario. Isso é feito para simular a ação de um usuário digitando sua senha na página de login.

  await page.getByRole('heading', { name: 'Verificação em duas etapas' }).waitFor({ timeout: 3000 })


  const codigo = await getJob()
  // const code = await getCode2FA(usuario.cpf);

  await loginPage.informaCodigo2FA(codigo); //chamando o método informaCodigo2FA da classe LoginPage para preencher o campo de código de autenticação de dois fatores com o valor do código obtido da função getCode2FA. Isso é feito para simular a ação de um usuário digitando o código de autenticação de dois fatores na página de login.

  await page.waitForTimeout(2000); // Espera para garantir que a navegação ocorreu, de dois segundos, mas pode ser ajustado conforme necessário

  expect(await dashPage.obterSldo()).toHaveText('R$ 5.000,00');
  // Verifica se o elemento de saldo da conta está visível, indicando que o login foi bem-sucedido
  //page.locator('#account-balance')//page locator não precisa de await, pois o expect já espera o elemento aparecer
  //o expect serve para verificar se o elemento de saldo da conta está visível, indicando que o login foi bem-sucedido, e também para garantir que o teste falhe caso o elemento não esteja presente ou não tenha o texto esperado.

});

test.skip('Deve acessar a conta do usuário(v2) - Usando Actions', async ({ page }) => {

  const loginPage = new LoginActions(page);//instanciando a classe LoginActions, passando o objeto page como argumento para o construtor da classe. Isso permite que a classe LoginActions tenha acesso ao objeto page e possa interagir com a página da web durante os testes.
  const usuario: Usuario = {
    cpf: '00000014141',
    senha: '147258',
  }
  await loginPage.acessaPagina(); //chamando o método acessaPage da classe LoginActions para acessar a página de login do aplicativo. Isso é feito para garantir que o teste comece na página correta antes de realizar as ações de login.
  await loginPage.informaCpf(usuario.cpf); //chamando o método informaCpf da classe LoginActions para preencher o campo de CPF com o valor do CPF do usuário definido no objeto usuario. Isso é feito para simular a ação de um usuário digitando seu CPF na página de login.
  await loginPage.informaSenha(usuario.senha); //chamando o método informaSenha da classe LoginActions para preencher o campo de senha com o valor da senha do usuário definido no objeto usuario. Isso é feito para simular a ação de um usuário digitando sua senha na página de login.
  //checkpoint para verificar se a navegação ocorreu, verificando se o elemento de verificação em duas etapas está visível
  await page.getByRole('heading', { name: 'Verificação em duas etapas' }).waitFor({ timeout: 3000 })
  // await page.waitForTimeout(3000); // Espera para garantir que a navegação ocorreu, de dois segundos, mas pode ser ajustado conforme necessário

  const code = await getCode2FA(usuario.cpf);

  await loginPage.informaCodigo2FA(code); //chamando o método informaCodigo2FA da classe LoginPage para preencher o campo de código de autenticação de dois fatores com o valor do código obtido da função getCode2FA. Isso é feito para simular a ação de um usuário digitando o código de autenticação de dois fatores na página de login.

  // await page.waitForTimeout(2000); // Espera para garantir que a navegação ocorreu, de dois segundos, mas pode ser ajustado conforme necessário
  //por padrão tem um timeout de 5 segundos, então adiciona await para esperar o elemento aparecer, e caso o elemento não apareça dentro do timeout, o teste irá falhar, garantindo que o teste seja mais robusto e confiável.
  await expect(await loginPage.obterSldo()).toHaveText('R$ 5.000,00');
  // Verifica se o elemento de saldo da conta está visível, indicando que o login foi bem-sucedido
  //page.locator('#account-balance')//page locator não precisa de await, pois o expect já espera o elemento aparecer
  //o expect serve para verificar se o elemento de saldo da conta está visível, indicando que o login foi bem-sucedido, e também para garantir que o teste falhe caso o elemento não esteja presente ou não tenha o texto esperado.

});

// --headed serve para ver o teste rodando no navegador, caso queira ver o teste rodando no navegador, basta executar o comando: npx playwright test --headed
// --debug serve para debugar o teste, caso queira debugar o teste, basta executar o comando: npx playwright test --debug
// --ui serve para abrir a interface do Playwright, caso queira abrir a interface do Playwright, basta executar o comando: npx playwright test --ui 
// --codegen serve para gerar o código do teste, caso queira gerar o código do teste, basta executar o comando: npx playwright codegen
