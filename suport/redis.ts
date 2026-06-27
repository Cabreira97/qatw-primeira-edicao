import { Queue } from 'bullmq';

const connection = {
    host: 'paybank-redis',
    port: 6379
}

const queueName = 'twoFactorQueue'

//estou instanciando essa classe Queue do BullMQ, passando o nome da fila e as configurações de conexão com o Redis. Isso me permite interagir com a fila de mensagens para enviar ou receber mensagens relacionadas à autenticação de dois fatores, como os códigos de autenticação que são gerados e enviados para os usuários durante o processo de login.
const queue = new Queue(queueName, { connection })

export const getJob = async () => {
    const jobs = await queue.getJobs() //busca todos os jobs da fila, ou seja, todas as mensagens que estão na fila de autenticação de dois fatores. Isso me permite acessar os dados dos jobs, como os códigos de autenticação gerados, para usá-los nos testes de login.
    console.log(jobs[0].data.code) //imprime no console o código de autenticação do primeiro job da fila, ou seja, o código mais recente gerado para um usuário. Isso é útil para verificar se estou obtendo o código correto durante os testes de login.
    return jobs[0].data.code  //retonra só um job, que é o mais recente, ou seja, o código de autenticação mais recente gerado para um usuário. Isso é útil para garantir que estou usando o código correto durante os testes de login.

}

export const cleanJobs = async () => {
    await queue.obliterate({force:true}) //limpa todos os jobs da fila, ou seja, remove todas as mensagens relacionadas à autenticação de dois fatores da fila. Isso é útil para garantir que os testes comecem com uma fila limpa, sem mensagens antigas que possam interferir nos resultados dos testes.
}   