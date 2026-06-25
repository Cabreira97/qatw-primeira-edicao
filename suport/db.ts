import pgPromise from 'pg-promise';

const pgp = pgPromise();


const db = pgp('postgresql://dba:dba@paybank-db:5432/UserDB');

export async function getCode2FA(cpf: string): Promise<string> {

    const query = `
    SELECT t.code 
	from public."TwoFactorCode" t
	JOIN public."User" u ON u."id" = t."userId"
	WHERE u.cpf = '${cpf}'
	ORDER By t.id desc
	limit 1;
    `

    const result = await db.oneOrNone(query)
    return result.code
}

