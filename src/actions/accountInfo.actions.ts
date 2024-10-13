'use server';

import { IAccountInfo } from '@/interfaces/auth.interface';
import prismadb from '@/lib/prismaDb';
import { hash } from 'bcrypt';
import { revalidatePath } from 'next/cache';
import axios from 'axios'

export const accountInfoAction = async ({
    id,
	name,
	email,
	password,
	old_email,
}: IAccountInfo) => {
	try {
		if(email!==old_email){
			const emailAlreadyExists = await prismadb.user.findFirst({
				where: {
					email,
				},
			});
	
			if (emailAlreadyExists) {
				return {
					data: null,
					message: 'Email already exists',
				};
			}
		}

        const user = await prismadb.user.update({
            where: {
                id: id,
            },
            data: {
                name,
				email,
              password: await hash(password, 10),
            },
          });

		return {
			data: user,
			id: user.id,
			message: 'Account updated successfully',
		};
	} catch (error) {
		console.info('[ERROR_AUTH_REGISTER]', error);

		return {
			data: null,
			message: 'Something went wrong',
		};
	} finally {
		
	}
};
